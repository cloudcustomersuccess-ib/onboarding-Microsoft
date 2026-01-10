"use client";

import { useState, useEffect } from "react";
import { Card, Table, Typography, Alert, Button, Tag } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { listOnboardings } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { Onboarding } from "@/types";

const { Title } = Typography;

export default function OnboardingTrackerPage() {
  const router = useRouter();
  const [onboardings, setOnboardings] = useState<Onboarding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnboardings = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await listOnboardings(token);
      setOnboardings(response.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load onboardings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOnboardings();
  }, []);

  const getStatusColor = (status?: string) => {
    if (!status) return "default";
    const s = status.toLowerCase();
    if (s.includes("completed") || s.includes("done")) return "success";
    if (s.includes("in progress") || s.includes("active")) return "processing";
    if (s.includes("pending") || s.includes("new")) return "warning";
    return "default";
  };

  const columns = [
    {
      title: "Cliente ID",
      dataIndex: "ClienteID",
      key: "ClienteID",
      render: (text: string) => (
        <a
          onClick={() => router.push(`/app/onboarding-tracker/${text}`)}
          style={{ color: "#1890ff", cursor: "pointer" }}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Partner Name",
      dataIndex: "PartnerName",
      key: "PartnerName",
      render: (text: string) => text || "—",
    },
    {
      title: "Manufacturer",
      dataIndex: "Manufacturer",
      key: "Manufacturer",
      render: (text: string) => text || "—",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      render: (status: string) =>
        status ? <Tag color={getStatusColor(status)}>{status}</Tag> : "—",
    },
    {
      title: "Language",
      dataIndex: "Language",
      key: "Language",
      render: (text: string) => text || "—",
    },
    {
      title: "Updated At",
      dataIndex: "UpdatedAt",
      key: "UpdatedAt",
      render: (text: string) => text || "—",
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
            }}
          >
            <Title level={3} style={{ margin: 0 }}>
              Onboarding Tracker
            </Title>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchOnboardings}
              loading={loading}
            >
              Refresh
            </Button>
          </div>
        }
      >
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        <Table
          dataSource={onboardings}
          columns={columns}
          rowKey="ClienteID"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          locale={{
            emptyText: "No onboarding records found",
          }}
        />
      </Card>
    </div>
  );
}
