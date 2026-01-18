"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Alert,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "@/lib/api";
import { saveSession } from "@/lib/session";
import { Playfair_Display } from "next/font/google";
import styles from "./login.module.css";

const { Title, Text } = Typography;
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"] });

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
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.tdLogo}>
          <Image
            src="/images/TD SYNNEX_Logo_Standard.png"
            alt="TD SYNNEX"
            width={160}
            height={36}
            priority
          />
        </div>

        <Card className={styles.formCard} bordered={false}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div className={styles.formHeader}>
              <div className={styles.growthBadge}>
                <Image
                  src="/images/Growth_Lab_Light_Mode.png"
                  alt="Growth Lab"
                  width={28}
                  height={28}
                />
              </div>
              <div>
                <Title level={3} className={styles.formTitle}>
                  Get Started
                </Title>
                <Text type="secondary">
                  Welcome to Growth Lab. Sign in with your OTP code.
                </Text>
              </div>
            </div>

            <Divider className={styles.divider} />

            {error && (
              <Alert message="Error" description={error} type="error" showIcon />
            )}

            {currentStep === 0 && (
              <Form
                form={emailForm}
                layout="vertical"
                onFinish={handleRequestOtp}
                className={styles.form}
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
                    placeholder="name@company.com"
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
                    className={styles.primaryButton}
                  >
                    Send Verification Code
                  </Button>
                </Form.Item>
              </Form>
            )}

            {currentStep === 1 && (
              <Form
                form={otpForm}
                layout="vertical"
                onFinish={handleVerifyOtp}
                className={styles.form}
              >
                <Alert
                  message={`Verification code sent to ${email}`}
                  type="info"
                  showIcon
                />

                <Form.Item
                  label="Verification Code"
                  name="otp"
                  rules={[
                    { required: true, message: "Please enter the code" },
                    { len: 6, message: "Code must be 6 digits" },
                  ]}
                >
                  <Input.OTP
                    length={6}
                    size="large"
                    autoFocus
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className={styles.otpInput}
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
                      className={styles.primaryButton}
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

      <div className={styles.rightPanel}>
        <div className={styles.rightContent}>
          <div>
            <Text className={styles.brandLabel}>Filiannta</Text>
            <Title level={1} className={`${styles.heroTitle} ${playfair.className}`}>
              Enter the Future
              <br />
              of Payments,
              <br />
              today
            </Title>
          </div>

          <div className={styles.cardsRow}>
            <div className={styles.miniCard}>
              <div className={styles.miniBadge} />
              <div className={styles.miniDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLogo}>
                <Image
                  src="/images/Growth_Lab_Light_Mode.png"
                  alt="Growth Lab"
                  width={20}
                  height={20}
                />
              </div>
              <Text className={styles.statValue}>12,347.23 $</Text>
              <Text type="secondary" className={styles.statLabel}>
                Combined balance
              </Text>
              <Divider className={styles.cardDivider} />
              <div className={styles.cardRow}>
                <Text className={styles.cardTitle}>Primary Card</Text>
                <Text className={styles.cardAmount}>2,546.64$</Text>
              </div>
              <Text className={styles.cardMeta}>3495 **** **** 6917</Text>
            </div>
          </div>
        </div>

        <div className={styles.rightLogo}>
          <Image
            src="/images/Growth_Lab_Light_Mode.png"
            alt="Growth Lab"
            width={42}
            height={42}
          />
        </div>
      </div>
    </div>
  );
}
