"use client";

import { useState, useEffect } from "react";
import { Card, Table, Typography, Button, Tag, Select, Space, Alert } from "antd";
import { ReloadOutlined, FilterOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { listIonSubscriptions, IonSubscriptionFilters } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { IonSubscription } from "@/types";

const { Title } = Typography;

export default function MicrosoftGrowthPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<IonSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState<IonSubscriptionFilters>({
    subscriptionStatus: "ACTIVE",
    cloudProviderName: undefined,
  });

  const fetchSubscriptions = async (page = 1, pageSize = 50) => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await listIonSubscriptions(token, {
        ...filters,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      if (response.ok && response.data) {
        setSubscriptions(response.data.items || []);
        setPagination({
          current: page,
          pageSize,
          total: response.data.pagination?.total || 0,
        });
      } else {
        // Provide user-friendly error messages
        let errorMessage = response.error || "Failed to load subscriptions";
        if (errorMessage.includes("HTTP 401") || errorMessage.includes("oauth/token failed")) {
          errorMessage = "ION refresh token expired or invalid. Please reconnect ION with a new token from the ION portal.";
        } else if (errorMessage.includes("conexión no encontrada") || errorMessage.includes("needs_reauth")) {
          errorMessage = "ION connection not configured or needs re-authentication. Please reconnect ION.";
        } else if (errorMessage.includes("status=")) {
          errorMessage = "ION connection is not active. Please reconnect ION.";
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [filters]);

  const handleTableChange = (paginationConfig: any) => {
    fetchSubscriptions(paginationConfig.current, paginationConfig.pageSize);
  };

  const getStatusColor = (status?: string) => {
    if (!status) return "default";
    const s = status.toUpperCase();
    if (s === "ACTIVE") return "success";
    if (s === "PENDING" || s === "PAUSED") return "warning";
    if (s === "CANCELLED" || s === "EXPIRED" || s === "DISABLED") return "error";
    return "default";
  };

  const getBillingCycleColor = (cycle?: string) => {
    if (!cycle) return "default";
    if (cycle.toLowerCase() === "monthly") return "blue";
    if (cycle.toLowerCase() === "annual") return "purple";
    return "default";
  };

  const columns = [
    {
      title: "Subscription ID",
      dataIndex: "subscriptionId",
      key: "subscriptionId",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
      ellipsis: true,
    },
    {
      title: "Product",
      dataIndex: "subscriptionName",
      key: "subscriptionName",
      ellipsis: true,
    },
    {
      title: "Provider",
      dataIndex: "cloudProviderName",
      key: "cloudProviderName",
      width: 100,
    },
    {
      title: "Status",
      dataIndex: "subscriptionStatus",
      key: "subscriptionStatus",
      width: 100,
      render: (status: string) =>
        status ? <Tag color={getStatusColor(status)}>{status}</Tag> : "—",
    },
    {
      title: "Billing",
      dataIndex: "billingCycle",
      key: "billingCycle",
      width: 100,
      render: (cycle: string) =>
        cycle ? <Tag color={getBillingCycleColor(cycle)}>{cycle}</Tag> : "—",
    },
    {
      title: "Licenses",
      dataIndex: "totalLicense",
      key: "totalLicense",
      width: 90,
      align: "center" as const,
      render: (count: number) => count ?? "—",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 110,
      render: (date: string) => (date ? new Date(date).toLocaleDateString() : "—"),
    },
  ];

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
              <Select
                value={filters.subscriptionStatus}
                onChange={(value) =>
                  setFilters({ ...filters, subscriptionStatus: value })
                }
                style={{ width: 130 }}
                options={[
                  { value: "ACTIVE", label: "Active" },
                  { value: "PENDING", label: "Pending" },
                  { value: "CANCELLED", label: "Cancelled" },
                  { value: "EXPIRED", label: "Expired" },
                  { value: "DISABLED", label: "Disabled" },
                  { value: "PAUSED", label: "Paused" },
                ]}
                placeholder="Status"
                allowClear
              />
              <Select
                value={filters.cloudProviderName}
                onChange={(value) =>
                  setFilters({ ...filters, cloudProviderName: value })
                }
                style={{ width: 150 }}
                options={[
                  { value: "Microsoft", label: "Microsoft" },
                  { value: "Amazon", label: "Amazon (AWS)" },
                  { value: "Google", label: "Google" },
                ]}
                placeholder="Provider"
                allowClear
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchSubscriptions(pagination.current, pagination.pageSize)}
                loading={loading}
              >
                Refresh
              </Button>
            </Space>
          </div>
        }
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

        <Table
          dataSource={subscriptions}
          columns={columns}
          rowKey="subscriptionId"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} subscriptions`,
            pageSizeOptions: ["10", "25", "50", "100"],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
          locale={{
            emptyText: "No subscriptions found",
          }}
        />
      </Card>
    </div>
  );
}
