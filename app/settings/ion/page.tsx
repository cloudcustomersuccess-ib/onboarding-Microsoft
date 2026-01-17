"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, Form, Input, Button, Alert, Typography, Space, Divider } from "antd";
import { useRouter } from "next/navigation";
import { connectIon, pingIon } from "@/lib/api";
import { getToken } from "@/lib/session";

const { Title, Text } = Typography;

const DEFAULT_ION_HOSTNAME = "ion.tdsynnex.com";

type IonStatusState = {
  status: string;
  accessExpiresAt: string;
};

type IonErrorState = {
  message: string;
  hint: string;
};

export default function IonSettingsPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [connecting, setConnecting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [statusState, setStatusState] = useState<IonStatusState>({
    status: "",
    accessExpiresAt: "",
  });
  const [errorState, setErrorState] = useState<IonErrorState>({
    message: "",
    hint: "",
  });

  const isConnected = statusState.status === "connected";

  const resetMessages = () => {
    setSuccessMessage("");
    setErrorState({ message: "", hint: "" });
  };

  const formatError = (message: string): IonErrorState => {
    const base = message || "ION request failed.";
    let hint = "";

    if (base.includes("HTTP 401") || base.includes("oauth/token failed")) {
      hint =
        "ION refresh token expired or invalid. Please reconnect ION with a new token from the ION portal.";
    } else if (base.includes("needs_reauth") || base.includes("conexi") || base.includes("status=")) {
      hint = "ION connection not configured or needs re-authentication.";
    }

    return { message: base, hint };
  };

  const fetchStatus = async () => {
    const sessionToken = getToken();
    if (!sessionToken) {
      router.push("/login");
      return;
    }

    setChecking(true);
    resetMessages();

    try {
      const response = await pingIon(sessionToken);
      if (response && response.ok) {
        setStatusState({
          status: String(response.status || ""),
          accessExpiresAt: String(response.accessExpiresAt || ""),
        });
      } else {
        setStatusState({
          status: String(response?.status || "needs_reauth"),
          accessExpiresAt: "",
        });
        if (response?.error) {
          setErrorState(formatError(String(response.error)));
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatusState({ status: "needs_reauth", accessExpiresAt: "" });
      setErrorState(formatError(message));
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const statusAlert = useMemo(() => {
    if (checking) {
      return (
        <Alert
          message="Checking ION connection..."
          type="info"
          showIcon
        />
      );
    }

    if (isConnected) {
      return (
        <Alert
          message="Connected"
          description={
            <Space direction="vertical" size={2}>
              <Text>Status: {statusState.status}</Text>
              {statusState.accessExpiresAt && (
                <Text>Access expires at: {statusState.accessExpiresAt}</Text>
              )}
            </Space>
          }
          type="success"
          showIcon
        />
      );
    }

    return (
      <Alert
        message="Not connected / Needs reauth"
        description={
          <Text>
            Status: {statusState.status || "needs_reauth"}
          </Text>
        }
        type="warning"
        showIcon
      />
    );
  }, [checking, isConnected, statusState]);

  const handleSubmit = async (values: {
    ionHostname?: string;
    ionAccountId: string;
    ionToken: string;
  }) => {
    const sessionToken = getToken();
    if (!sessionToken) {
      router.push("/login");
      return;
    }

    resetMessages();
    setConnecting(true);

    try {
      const payload = {
        ionHostname: String(values.ionHostname || DEFAULT_ION_HOSTNAME).trim(),
        ionAccountId: String(values.ionAccountId || "").trim(),
        ionToken: String(values.ionToken || "").trim(),
      };

      const response = await connectIon(sessionToken, payload);

      if (response && response.ok) {
        setSuccessMessage("ION conectado");
        setStatusState({
          status: String(response.status || ""),
          accessExpiresAt: String(response.accessExpiresAt || ""),
        });
        form.resetFields(["ionToken"]);
      } else {
        const message = String(response?.error || "ION connection failed.");
        setErrorState(formatError(message));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorState(formatError(message));
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={3} style={{ marginBottom: 0 }}>
            ION Settings
          </Title>
          <Text type="secondary">
            Connect or reconnect your StreamOne ION account.
          </Text>

          {statusAlert}

          {errorState.message && (
            <Alert
              message="Error"
              description={
                <Space direction="vertical" size={2}>
                  <Text>{errorState.message}</Text>
                  {errorState.hint && <Text type="secondary">{errorState.hint}</Text>}
                </Space>
              }
              type="error"
              showIcon
            />
          )}

          {successMessage && (
            <Alert
              message={successMessage}
              description={
                <Space direction="vertical" size={2}>
                  {statusState.status && <Text>Status: {statusState.status}</Text>}
                  {statusState.accessExpiresAt && (
                    <Text>Access expires at: {statusState.accessExpiresAt}</Text>
                  )}
                </Space>
              }
              type="success"
              showIcon
            />
          )}

          <Divider style={{ margin: "8px 0" }} />

          <Form
            form={form}
            layout="vertical"
            initialValues={{ ionHostname: DEFAULT_ION_HOSTNAME }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="ION Hostname"
              name="ionHostname"
              tooltip="Optional. Default is ion.tdsynnex.com"
            >
              <Input placeholder={DEFAULT_ION_HOSTNAME} />
            </Form.Item>

            <Form.Item
              label="ION Account ID"
              name="ionAccountId"
              rules={[{ required: true, message: "ION Account ID is required." }]}
            >
              <Input placeholder="Account ID" />
            </Form.Item>

            <Form.Item
              label="ION Refresh Token"
              name="ionToken"
              rules={[{ required: true, message: "ION Refresh Token is required." }]}
              extra="Paste here the refresh token generated from the ION portal."
            >
              <Input.Password placeholder="Refresh token" autoComplete="new-password" />
            </Form.Item>

            <Space>
              <Button type="primary" htmlType="submit" loading={connecting}>
                Save & Connect
              </Button>
              <Button onClick={fetchStatus} disabled={checking}>
                Refresh Status
              </Button>
            </Space>
          </Form>
        </Space>
      </Card>
    </div>
  );
}
