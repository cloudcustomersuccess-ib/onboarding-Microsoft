"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Steps,
  Alert,
  Typography,
  Space,
  message,
} from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/lib/api";
import { saveSession } from "@/lib/session";

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [emailForm] = Form.useForm();
  const [otpForm] = Form.useForm();

  const handleRequestOtp = async (values: { email: string }) => {
    setLoading(true);
    setError(null);

    try {
      console.log("[Login] Requesting OTP for:", values.email);
      await requestOtp(values.email);
      setEmail(values.email);
      setCurrentStep(1);
      message.success("OTP code sent to your email");
    } catch (err) {
      console.error("[Login] Request OTP failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await verifyOtp(email, values.otp);

      console.log("Login successful:", response);

      // Save session
      saveSession({
        token: response.token,
        user: response.user,
      });

      message.success("Login successful!");

      // Redirect to app
      router.push("/app");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setCurrentStep(0);
    setError(null);
    otpForm.resetFields();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2}>Partner Login</Title>
            <Text type="secondary">Access your onboarding dashboard</Text>
          </div>

          <Steps
            current={currentStep}
            items={[
              { title: "Email", icon: <MailOutlined /> },
              { title: "Verify", icon: <LockOutlined /> },
            ]}
          />

          {error && (
            <Alert message="Error" description={error} type="error" showIcon />
          )}

          {currentStep === 0 && (
            <Form
              form={emailForm}
              layout="vertical"
              onFinish={handleRequestOtp}
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="your@email.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                >
                  Send Verification Code
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <Form form={otpForm} layout="vertical" onFinish={handleVerifyOtp}>
              <Alert
                message={`Verification code sent to ${email}`}
                type="info"
                showIcon
                style={{ marginBottom: "20px" }}
              />

              <Form.Item
                label="Verification Code"
                name="otp"
                rules={[
                  { required: true, message: "Please enter the code" },
                  { len: 6, message: "Code must be 6 digits" },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder="000000"
                  maxLength={6}
                  size="large"
                  style={{ letterSpacing: "0.5em", fontSize: "18px" }}
                />
              </Form.Item>

              <Form.Item>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={loading}
                  >
                    Verify & Login
                  </Button>

                  <Button
                    type="link"
                    block
                    onClick={handleBackToEmail}
                    disabled={loading}
                  >
                    Use different email
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Space>
      </Card>
    </div>
  );
}
