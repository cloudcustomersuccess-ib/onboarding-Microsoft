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

      // Verificar si alguna respuesta tiene error
      const firstError =
        customers?.error || subscriptions?.error || consumption?.error || growth?.error || null;

      if (firstError) {
        setState((s) => ({ 
          ...s, 
          loading: false, 
          error: firstError,
          // Mantener datos aunque haya error para mostrar lo que sí funcionó
          activeCustomers: customers.ok ? customers : null,
          activeSubscriptions: subscriptions.ok ? subscriptions : null,
          currentMonthConsumption: consumption.ok ? consumption : null,
          growth: growth.ok ? growth : null,
        }));
        return;
      }

      setState({
        loading: false,
        error: null,
        activeCustomers: customers,
        activeSubscriptions: subscriptions,
        currentMonthConsumption: consumption,
        growth: growth,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard KPIs";
      setState((s) => ({ 
        ...s, 
        loading: false, 
        error: msg,
        // Mantener datos previos
      }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Valores por defecto para evitar errores
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
            message="Error loading some KPIs"
            description={state.error}
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
                <Card size="small" style={{ background: "#f0f5ff" }}>
                  <Statistic
                    title="Active Customers"
                    value={activeCustomersCount}
                    prefix="👥"
                    valueStyle={{ color: "#1890ff" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Customers with active subscriptions
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ background: "#f6ffed" }}>
                  <Statistic
                    title="Active Subscriptions"
                    value={totalActiveSubscriptions}
                    prefix="📋"
                    valueStyle={{ color: "#52c41a" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Total subscriptions in ACTIVE status
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card size="small" style={{ background: "#fff7e6" }}>
                  <Statistic
                    title="Current Month Consumption"
                    value={currentMonthTotal}
                    formatter={(v) => formatCurrency(Number(v), currency)}
                    prefix="💰"
                    valueStyle={{ color: "#fa8c16" }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {state.currentMonthConsumption?.currentMonth || "This month"}
                  </Text>
                </Card>
              </Col>

              <Col xs={24} sm={12} lg={6}>
                <Card 
                  size="small" 
                  style={{ 
                    background: growthPercentage >= 0 ? "#f6ffed" : "#fff1f0" 
                  }}
                >
                  <Statistic
                    title="Growth vs Previous Month"
                    value={growthPercentage}
                    formatter={(v) => formatPercentage(Number(v))}
                    prefix={getGrowthIcon(growthPercentage)}
                    valueStyle={{ color: getGrowthColor(growthPercentage) }}
                  />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {formatCurrency(Math.abs(growthAbsolute), currency)} 
                    {growthPercentage >= 0 ? " increase" : " decrease"}
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
                          : "-"}
                      </Text>
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