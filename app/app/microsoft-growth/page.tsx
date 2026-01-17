"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Space, Alert, Row, Col, Statistic } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import {
  listIonSubscriptions,
  listIonCustomers,
  listIonReports,
  getIonReport,
  getIonReportData,
} from "@/lib/api";
import { getToken } from "@/lib/session";
import type { IonReport, IonReportColumn, IonReportRow, IonReportValue } from "@/types";

const { Title } = Typography;

const CUSTOMER_COST_COLUMN_HINT = "customer_cost";
const DEFAULT_CUSTOMERS_PAGE_SIZE = 200;

type MetricsState = {
  customers: number;
  activeSubscriptions: number;
  customerCostCurrent: number;
  customerCostPrevious: number;
  currencyCode: string;
};

export default function MicrosoftGrowthPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<MetricsState>({
    customers: 0,
    activeSubscriptions: 0,
    customerCostCurrent: 0,
    customerCostPrevious: 0,
    currencyCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatIonError = (message: string) => {
    if (!message) return "Failed to load growth metrics";
    if (message.includes("HTTP 401") || message.includes("oauth/token failed")) {
      return "ION refresh token expired or invalid. Please reconnect ION with a new token from the ION portal.";
    }
    if (message.includes("conexi") || message.includes("needs_reauth")) {
      return "ION connection not configured or needs re-authentication. Please reconnect ION.";
    }
    if (message.includes("status=")) {
      return "ION connection is not active. Please reconnect ION.";
    }
    return message;
  };

  const formatCurrency = (value: number, currencyCode?: string) => {
    if (!Number.isFinite(value)) return "-";
    if (currencyCode) {
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          maximumFractionDigits: 2,
        }).format(value);
      } catch {
        return new Intl.NumberFormat("en-US", {
          maximumFractionDigits: 2,
        }).format(value);
      }
    }
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value);
  };

  const extractColumns = (report?: IonReport): IonReportColumn[] => {
    const specs = report?.specs || {};
    const columns =
      specs.selectedColumns ||
      specs.selected_columns ||
      specs.columns ||
      specs.allColumns ||
      specs.all_columns ||
      [];
    return Array.isArray(columns) ? (columns as IonReportColumn[]) : [];
  };

  const findCustomerCostColumnIndex = (columns: IonReportColumn[]) => {
    return columns.findIndex((column) => {
      const templateId =
        (column && (column.columnTemplateId || column.column_template_id)) ||
        "";
      return String(templateId).toLowerCase().includes(CUSTOMER_COST_COLUMN_HINT);
    });
  };

  const extractNumericValue = (value?: IonReportValue) => {
    if (!value) return null;
    if (value.moneyValue && typeof value.moneyValue.value === "number") {
      return value.moneyValue.value;
    }
    if (typeof value.floatValue === "number") {
      return value.floatValue;
    }
    if (typeof value.intValue === "number") {
      return value.intValue;
    }
    if (typeof value.stringValue === "string") {
      const parsed = Number(value.stringValue);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  };

  const sumCustomerCost = (rows: IonReportRow[], columnIndex: number) => {
    if (columnIndex < 0) return 0;
    let total = 0;
    rows.forEach((row) => {
      const values = row?.values || [];
      if (columnIndex >= values.length) return;
      const numericValue = extractNumericValue(values[columnIndex]);
      if (typeof numericValue === "number" && Number.isFinite(numericValue)) {
        total += numericValue;
      }
    });
    return total;
  };

  const detectCurrencyCode = (report: IonReport | undefined, rows: IonReportRow[]) => {
    const fromSpecs =
      report?.specs?.currencyOption?.selected_currency?.code ||
      report?.specs?.currencyOption?.selectedCurrency?.code;
    if (fromSpecs) return String(fromSpecs);
    for (const row of rows || []) {
      for (const value of row?.values || []) {
        if (value?.moneyValue?.currency) {
          return String(value.moneyValue.currency);
        }
      }
    }
    return "";
  };

  const buildReportPayload = (report: IonReport, relativeDateRange: string) => {
    const payload = JSON.parse(JSON.stringify(report || {}));
    payload.specs = payload.specs || {};
    payload.specs.dateRangeOption = payload.specs.dateRangeOption || {};
    payload.specs.dateRangeOption.selectedRange = { relativeDateRange };
    return payload;
  };

  const fetchCustomersCount = async (token: string) => {
    let nextPageToken: string | undefined;
    let total = 0;

    do {
      const response = await listIonCustomers(token, {
        pageSize: DEFAULT_CUSTOMERS_PAGE_SIZE,
        pageToken: nextPageToken,
      });

      if (!response.ok || !response.data) {
        throw new Error(response.error || "Failed to load customers");
      }

      total += (response.data.customers || []).length;
      nextPageToken = response.data.nextPageToken || undefined;
    } while (nextPageToken);

    return total;
  };

  const fetchActiveSubscriptionsCount = async (token: string) => {
    const response = await listIonSubscriptions(token, {
      subscriptionStatus: "ACTIVE",
      limit: 1,
      offset: 0,
    });

    if (!response.ok || !response.data) {
      throw new Error(response.error || "Failed to load subscriptions");
    }

    return response.data.pagination?.total ?? response.data.items?.length ?? 0;
  };

  const findCustomerCostReport = async (token: string) => {
    const reportsResponse = await listIonReports(token);
    if (!reportsResponse.ok || !reportsResponse.data) {
      throw new Error(reportsResponse.error || "Failed to load reports");
    }

    const reports = reportsResponse.data.reports || [];
    for (const report of reports) {
      const reportId = report.reportId;
      if (!reportId) continue;

      const reportResponse = await getIonReport(token, String(reportId), true);
      if (!reportResponse.ok || !reportResponse.report) {
        continue;
      }

      const columns = extractColumns(reportResponse.report);
      const costIndex = findCustomerCostColumnIndex(columns);
      if (costIndex !== -1) {
        return { report: reportResponse.report, costIndex };
      }
    }

    throw new Error("No report with customer cost data found");
  };

  const fetchCustomerCostForRange = async (
    token: string,
    report: IonReport,
    costIndex: number,
    relativeDateRange: string
  ) => {
    if (!report.reportId) {
      throw new Error("Report ID missing");
    }

    const payload = buildReportPayload(report, relativeDateRange);
    const response = await getIonReportData(token, String(report.reportId), payload);

    if (!response.ok || !response.data) {
      throw new Error(response.error || "Failed to load report data");
    }

    const reportData = response.data;
    const responseReport = reportData.report || report;
    const rows =
      reportData.data?.rows ||
      reportData.rows ||
      [];

    const columns = extractColumns(responseReport);
    const resolvedIndex = columns.length ? findCustomerCostColumnIndex(columns) : costIndex;
    const columnIndex = resolvedIndex !== -1 ? resolvedIndex : costIndex;

    return {
      total: sumCustomerCost(rows, columnIndex),
      currencyCode: detectCurrencyCode(responseReport, rows),
    };
  };

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const [customers, activeSubscriptions] = await Promise.all([
        fetchCustomersCount(token),
        fetchActiveSubscriptionsCount(token),
      ]);

      const { report, costIndex } = await findCustomerCostReport(token);

      const [currentResult, previousResult] = await Promise.all([
        fetchCustomerCostForRange(token, report, costIndex, "MONTH_TO_DATE"),
        fetchCustomerCostForRange(token, report, costIndex, "LAST_MONTH"),
      ]);

      setMetrics({
        customers,
        activeSubscriptions,
        customerCostCurrent: currentResult.total,
        customerCostPrevious: previousResult.total,
        currencyCode: currentResult.currencyCode || previousResult.currencyCode || "",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load growth metrics";
      setError(formatIonError(message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const growthValue = metrics.customerCostCurrent - metrics.customerCostPrevious;
  const growthColor = growthValue >= 0 ? "#3f8600" : "#cf1322";
  const growthLabel = `${growthValue >= 0 ? "+" : "-"}${formatCurrency(Math.abs(growthValue), metrics.currencyCode)}`;

  return (
    <div>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Microsoft Growth
            </Title>
            <Space wrap>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchMetrics}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>
        }
        loading={loading}
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: "20px" }}
          />
        )}

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="Customers" value={metrics.customers} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic title="Active subscriptions" value={metrics.activeSubscriptions} />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Customer cost (month to date)"
              value={metrics.customerCostCurrent}
              formatter={(value) =>
                formatCurrency(Number(value), metrics.currencyCode)
              }
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Statistic
              title="Customer cost growth (MoM)"
              value={growthValue}
              valueStyle={{ color: growthColor }}
              formatter={() => growthLabel}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}
