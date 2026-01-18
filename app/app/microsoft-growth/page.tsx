"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Space, Alert, Row, Col, Statistic, Spin } from "antd";
import { ReloadOutlined, RiseOutlined, FallOutlined, MinusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/session";
import {
  getIonKpiActiveCustomers,
  getIonKpiActiveSubscriptions,
  getIonKpiCurrentMonthConsumption,
  getIonKpiGrowthVsPreviousMonth,
  IonKpiActiveCustomersResponse,
  IonKpiActiveSubscriptionsResponse,
  IonKpiCurrentMonthConsumptionResponse,
  IonKpiGrowthResponse,
} from "@/lib/api";

const { Title, Text } = Typography;

type DashboardState = {
  loading: boolean;
  error: string | null;
  activeCustomers: IonKpiActiveCustomersResponse | null;
  activeSubscriptions: IonKpiActiveSubscriptionsResponse | null;
  currentMonthConsumption: IonKpiCurrentMonthConsumptionResponse | null;
  growth: IonKpiGrowthResponse | null;
};

function formatCurrency(value: number, currency?: string) {
  if (!Number.isFinite(value)) return "-";
  if (currency) {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      // Fallback si la moneda no es válida
    }
  }
  return new Intl.NumberFormat("en-US", { 
    style: "decimal",
    maximumFractionDigits: 2 
  }).format(value);
}

function formatPercentage(value: number) {
  if (!Number.isFinite(value)) return "-";
  const formatted = value.toFixed(2);
  return `${formatted}%`;
}

function getGrowthIcon(percentage: number) {
  if (percentage > 0) return <RiseOutlined style={{ color: "#52c41a" }} />;
  if (percentage < 0) return <FallOutlined style={{ color: "#ff4d4f" }} />;
  return <MinusOutlined style={{ color: "#8c8c8c" }} />;
}

function getGrowthColor(percentage: number) {
  if (percentage > 0) return "#52c41a"; // Verde
  if (percentage < 0) return "#ff4d4f"; // Rojo
  return "#8c8c8c"; // Gris
}

export default function MicrosoftGrowthPage() {
  const router = useRouter();
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    activeCustomers: null,
    activeSubscriptions: null,
    currentMonthConsumption: null,
    growth: null,
  });

  const load = async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      // Llamadas paralelas a los 4 KPIs
      const [customers, subscriptions, consumption, growth] = await Promise.all([
        getIonKpiActiveCustomers(token),
        getIonKpiActiveSubscriptions(token),
        getIonKpiCurrentMonthConsumption(token),
        getIonKpiGrowthVsPreviousMonth(token),
      ]);

      // ✅ FIX: Recopilar TODOS los errores
      const errors: string[] = [];
      if (customers?.error) errors.push(`Active Customers: ${customers.error}`);
      if (subscriptions?.error) errors.push(`Active Subscriptions: ${subscriptions.error}`);
      if (consumption?.error) errors.push(`Consumption: ${consumption.error}`);
      if (growth?.error) errors.push(`Growth: ${growth.error}`);

      // ✅ FIX: SIEMPRE guardar los datos que SÍ funcionaron
      setState({
        loading: false,
        error: errors.length > 0 ? errors.join("\n\n") : null,
        // Guardar datos SOLO si ok=true, independientemente de los errores
        activeCustomers: customers?.ok ? customers : null,
        activeSubscriptions: subscriptions?.ok ? subscriptions : null,
        currentMonthConsumption: consumption?.ok ? consumption : null,
        growth: growth?.ok ? growth : null,
      });

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard KPIs";
      setState((s) => ({ 
        ...s, 
        loading: false, 
        error: msg,
        // Mantener datos previos si los había
      }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ FIX: Valores por defecto más robustos
  const activeCustomersCount = state.activeCustomers?.activeCustomersCount ?? 0;
  const totalActiveSubscriptions = state.activeSubscriptions?.totalActiveSubscriptions ?? 0;
  const currentMonthTotal = state.currentMonthConsumption?.totalConsumption ?? 0;
  const currency = state.currentMonthConsumption?.currency || state.growth?.currency || "USD";
  
  const growthAbsolute = state.growth?.growth?.absolute ?? 0;
  const growthPercentage = state.growth?.growth?.percentage ?? 0;
  const currentPeriod = state.growth?.currentMonth?.period || "-";
  const previousPeriod = state.growth?.previousMonth?.period || "-";
  const currentTotal = state.growth?.currentMonth?.total ?? 0;
  const previousTotal = state.growth?.previousMonth?.total ?? 0;

  return (
    <div>
      <Card
        title={
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap", 
            gap: 16 
          }}>
            <Title level={3} style={{ margin: 0 }}>
              Microsoft Growth Dashboard
            </Title>
            <Space wrap>
              <Button 
                icon={<ReloadOutlined />} 
                onClick={load} 
                loading={state.loading}
              >
                Refresh
              </Button>
            </Space>
          </div>
        }
      >
        {state.error && (
          <Alert
            message="Some KPIs could not be loaded"
            description={
              <div style={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                {state.error}
              </div>
            }
            type="warning"
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />
        )}

        {state.loading && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spin size="large" tip="Loading KPIs..." />
          </div>
        )}

        {!state.loading && (
          <>
            {/* Fila 1: KPIs principales */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} lg={6}>
                <Card 
                  size="small" 
                  style={{ 
                    background: state.activeCustomers?.ok ? "#f0f5ff" : "#f5f5f5",
                    opacity: state.activeCustomers?.ok ? 1 : 0.6
                  }}
                >
                  <Statistic
                    title="Active Customers"
                    value={activeCustomersCount}
                    prefix="👥"
                    valueStyle={{ color: state.activeCustomers?.ok ? "#1890ff" : "#8c8c8c" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {state.activeCustomers?.ok 
                      ? "Customers with active subscriptions" 
                      : "⚠️ Data unavailable"}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card 
                  size="small" 
                  style={{ 
                    background: state.activeSubscriptions?.ok ? "#f6ffed" : "#f5f5f5",
                    opacity: state.activeSubscriptions?.ok ? 1 : 0.6
                  }}
                >
                  <Statistic
                    title="Active Subscriptions"
                    value={totalActiveSubscriptions}
                    prefix="📋"
                    valueStyle={{ color: state.activeSubscriptions?.ok ? "#52c41a" : "#8c8c8c" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {state.activeSubscriptions?.ok 
                      ? "Total subscriptions in ACTIVE status" 
                      : "⚠️ Data unavailable"}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card 
                  size="small" 
                  style={{ 
                    background: state.currentMonthConsumption?.ok ? "#fff7e6" : "#f5f5f5",
                    opacity: state.currentMonthConsumption?.ok ? 1 : 0.6
                  }}
                >
                  <Statistic
                    title="Current Month Consumption"
                    value={currentMonthTotal}
                    formatter={(v) => formatCurrency(Number(v), currency)}
                    prefix="💰"
                    valueStyle={{ color: state.currentMonthConsumption?.ok ? "#fa8c16" : "#8c8c8c" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {state.currentMonthConsumption?.ok 
                      ? (state.currentMonthConsumption?.currentMonth || "This month")
                      : "⚠️ Data unavailable"}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card 
                  size="small" 
                  style={{ 
                    background: state.growth?.ok 
                      ? (growthPercentage >= 0 ? "#f6ffed" : "#fff1f0")
                      : "#f5f5f5",
                    opacity: state.growth?.ok ? 1 : 0.6
                  }}
                >
                  <Statistic
                    title="Growth vs Previous Month"
                    value={growthPercentage}
                    formatter={(v) => formatPercentage(Number(v))}
                    prefix={state.growth?.ok ? getGrowthIcon(growthPercentage) : "⚠️"}
                    valueStyle={{ 
                      color: state.growth?.ok ? getGrowthColor(growthPercentage) : "#8c8c8c" 
                    }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {state.growth?.ok 
                      ? `${formatCurrency(Math.abs(growthAbsolute), currency)} ${growthPercentage >= 0 ? "increase" : "decrease"}`
                      : "⚠️ Data unavailable"}
                  </Text>
                </Card>
              </Col>
            </Row>

            {/* Fila 2: Detalles del crecimiento */}
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card 
                  title="Month-over-Month Comparison" 
                  size="small"
                  style={{ height: "100%" }}
                >
                  {state.growth?.ok ? (
                    <>
                      <Row gutter={[16, 16]}>
                        <Col span={12}>
                          <Statistic
                            title={`Current Month (${currentPeriod})`}
                            value={currentTotal}
                            formatter={(v) => formatCurrency(Number(v), currency)}
                            valueStyle={{ fontSize: 18 }}
                          />
                        </Col>
                        <Col span={12}>
                          <Statistic
                            title={`Previous Month (${previousPeriod})`}
                            value={previousTotal}
                            formatter={(v) => formatCurrency(Number(v), currency)}
                            valueStyle={{ fontSize: 18 }}
                          />
                        </Col>
                      </Row>
                      <div style={{ marginTop: 16, padding: 12, background: "#fafafa", borderRadius: 4 }}>
                        <Text strong>Absolute Change: </Text>
                        <Text 
                          style={{ 
                            color: getGrowthColor(growthPercentage),
                            fontSize: 16,
                            fontWeight: 600
                          }}
                        >
                          {growthAbsolute >= 0 ? "+" : ""}
                          {formatCurrency(growthAbsolute, currency)}
                        </Text>
                      </div>
                    </>
                  ) : (
                    <Alert
                      message="Growth data unavailable"
                      description="Could not retrieve month-over-month comparison data"
                      type="warning"
                      showIcon
                    />
                  )}
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card 
                  title="Summary" 
                  size="small"
                  style={{ height: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }} size="middle">
                    <div>
                      <Text type="secondary">Report Used:</Text>
                      <br />
                      <Text strong>
                        {state.currentMonthConsumption?.reportName || "Customer Subscriptions Report"}
                        {" "}(ID: {state.currentMonthConsumption?.reportId || "20105"})
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">Currency:</Text>
                      <br />
                      <Text strong>{currency}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Last Updated:</Text>
                      <br />
                      <Text>
                        {state.growth?.timestamp 
                          ? new Date(state.growth.timestamp).toLocaleString() 
                          : state.activeSubscriptions?.timestamp
                          ? new Date(state.activeSubscriptions.timestamp).toLocaleString()
                          : "-"}
                      </Text>
                    </div>
                    <div>
                      <Text type="secondary">Status:</Text>
                      <br />
                      <Space size="small" wrap>
                        {state.activeCustomers?.ok && <Text style={{ color: "#52c41a" }}>✓ Customers</Text>}
                        {state.activeSubscriptions?.ok && <Text style={{ color: "#52c41a" }}>✓ Subscriptions</Text>}
                        {state.currentMonthConsumption?.ok && <Text style={{ color: "#52c41a" }}>✓ Consumption</Text>}
                        {state.growth?.ok && <Text style={{ color: "#52c41a" }}>✓ Growth</Text>}
                        
                        {!state.activeCustomers?.ok && <Text type="danger">✗ Customers</Text>}
                        {!state.activeSubscriptions?.ok && <Text type="danger">✗ Subscriptions</Text>}
                        {!state.currentMonthConsumption?.ok && <Text type="danger">✗ Consumption</Text>}
                        {!state.growth?.ok && <Text type="danger">✗ Growth</Text>}
                      </Space>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>

            {/* Nota explicativa */}
            <Alert
              message="About these metrics"
              description={
                <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                  <li><strong>Active Customers:</strong> Unique customers with at least one ACTIVE subscription</li>
                  <li><strong>Active Subscriptions:</strong> Total count of subscriptions in ACTIVE status (excludes CANCELLED, EXPIRED, etc.)</li>
                  <li><strong>Current Month Consumption:</strong> Total consumption from Customer Subscriptions Report (ID: 20105) for the current month</li>
                  <li><strong>Growth vs Previous Month:</strong> Comparison between current month and previous month consumption</li>
                </ul>
              }
              type="info"
              showIcon
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </Card>
    </div>
  );
}