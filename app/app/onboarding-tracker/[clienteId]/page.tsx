"use client";

import { useState, useEffect, use } from "react";
import {
  Card,
  Descriptions,
  Typography,
  Alert,
  Button,
  Space,
  Switch,
  Form,
  Input,
  List,
  message,
  Divider,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { getOnboardingDetail, updateField, addNote } from "@/lib/api";
import { getToken } from "@/lib/session";
import type { Onboarding, Mirror, Note } from "@/types";

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function OnboardingDetailPage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const resolvedParams = use(params);
  const clienteId = resolvedParams.clienteId;

  const router = useRouter();
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [mirror, setMirror] = useState<Mirror | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  const [noteForm] = Form.useForm();

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await getOnboardingDetail(token, clienteId);
      setOnboarding(response.onboarding);
      setMirror(response.mirror);
      setNotes(response.notes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [clienteId]);

  const handleFieldChange = async (fieldKey: string, value: boolean) => {
    setUpdatingField(fieldKey);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      await updateField(token, clienteId, fieldKey, value);
      message.success(`Field "${humanizeFieldKey(fieldKey)}" updated`);

      // Refresh data
      await fetchDetail();
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Failed to update field"
      );
    } finally {
      setUpdatingField(null);
    }
  };

  const handleAddNote = async (values: { body: string }) => {
    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      await addNote(token, clienteId, {
        scopeType: "GENERAL",
        visibility: "PUBLIC",
        body: values.body,
      });

      message.success("Note added successfully");
      noteForm.resetFields();

      // Refresh data
      await fetchDetail();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to add note");
    }
  };

  const humanizeFieldKey = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/&/g, "and")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const isBooleanField = (value: any): boolean => {
    return typeof value === "boolean" || value === "true" || value === "false";
  };

  const getBooleanValue = (value: any): boolean => {
    return value === true || value === "true";
  };

  const renderChecklistItems = () => {
    if (!mirror) return null;

    const booleanFields: Array<{ key: string; value: any }> = [];

    Object.keys(mirror).forEach((key) => {
      if (
        key === "ClienteID" ||
        key === "LastSyncAt" ||
        key.includes("UpdatedAt") ||
        key.includes("CompletedAt")
      ) {
        return;
      }

      const value = mirror[key];
      if (isBooleanField(value)) {
        booleanFields.push({ key, value });
      }
    });

    if (booleanFields.length === 0) {
      return <Text type="secondary">No checklist items available</Text>;
    }

    return (
      <Space direction="vertical" style={{ width: "100%" }}>
        {booleanFields.map(({ key, value }) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <Space>
              {getBooleanValue(value) && (
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
              )}
              <Text>{humanizeFieldKey(key)}</Text>
            </Space>
            <Switch
              checked={getBooleanValue(value)}
              onChange={(checked) => handleFieldChange(key, checked)}
              loading={updatingField === key}
            />
          </div>
        ))}
      </Space>
    );
  };

  if (loading) {
    return (
      <Card loading={true}>
        <p>Loading...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={fetchDetail}>
              Retry
            </Button>
          }
        />
      </Card>
    );
  }

  if (!onboarding) {
    return (
      <Card>
        <Alert
          message="Not Found"
          description="Onboarding not found"
          type="warning"
          showIcon
        />
      </Card>
    );
  }

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/app/onboarding-tracker")}
          >
            Back to List
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchDetail}>
            Refresh
          </Button>
        </div>

        {/* Onboarding Info */}
        <Card title={<Title level={4}>Onboarding Information</Title>}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Cliente ID">
              {onboarding.ClienteID}
            </Descriptions.Item>
            <Descriptions.Item label="Partner Name">
              {onboarding.PartnerName || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Manufacturer">
              {onboarding.Manufacturer || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {onboarding.Status ? (
                <Tag color="processing">{onboarding.Status}</Tag>
              ) : (
                "—"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              {onboarding.Language || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Organization ID">
              {onboarding.OrganizationId || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Primary Contact">
              {onboarding.PrimaryContactEmail || "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {onboarding.UpdatedAt || "—"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Checklist */}
        <Card title={<Title level={4}>Checklist</Title>}>
          {renderChecklistItems()}
        </Card>

        {/* Notes */}
        <Card title={<Title level={4}>Notes</Title>}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Add Note Form */}
            <Form form={noteForm} onFinish={handleAddNote} layout="vertical">
              <Form.Item
                name="body"
                rules={[{ required: true, message: "Please enter a note" }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Add a note..."
                  maxLength={1000}
                  showCount
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Add Note
                </Button>
              </Form.Item>
            </Form>

            <Divider />

            {/* Notes List */}
            {notes.length === 0 ? (
              <Text type="secondary">No notes yet</Text>
            ) : (
              <List
                dataSource={notes}
                renderItem={(note) => (
                  <List.Item>
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>
                            {note.AuthorUserId || "Unknown User"}
                          </Text>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            {note.CreatedAt || "—"}
                          </Text>
                        </Space>
                      }
                      description={note.Body}
                    />
                  </List.Item>
                )}
              />
            )}
          </Space>
        </Card>
      </Space>
    </div>
  );
}
