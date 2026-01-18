"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Alert,
  Typography,
  message,
} from "antd";
import { MailOutlined, ThunderboltOutlined } from "@ant-design/icons";
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
      <section className={styles.leftPanel}>
        <div className={styles.gradientOverlay} aria-hidden="true" />
        <div className={styles.leftContent}>
          <div className={styles.tdLogo}>
            <Image
              src="/images/TD SYNNEX_Logo_Standard.png"
              alt="TD SYNNEX"
              width={160}
              height={36}
              priority
            />
          </div>

          <div className={styles.heroContent}>
            <div className={styles.iconBadge}>
              <ThunderboltOutlined />
            </div>
            <Text className={styles.heroLabel}>You can easily</Text>
            <Title level={1} className={`${styles.heroTitle} ${playfair.className}`}>
              Get access your personal hub for clarity and productivity
            </Title>
          </div>
        </div>
      </section>

      <section className={styles.rightPanel}>
        <div className={styles.formWrapper}>
          <div className={styles.growthLabLogo}>
            <Image
              src="/images/Growth_Lab_Light_Mode.png"
              alt="Growth Lab"
              width={52}
              height={52}
              priority
            />
          </div>

          <div className={styles.formContent}>
            <Title level={2} className={styles.formTitle}>
              Sign in to your account
            </Title>
            <Text className={styles.formSubtitle}>
              Access your tasks, notes, and projects anytime, anywhere - and keep
              everything flowing in one place.
            </Text>

            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                className={styles.errorAlert}
              />
            )}

            {currentStep === 0 && (
              <Form
                form={emailForm}
                layout="vertical"
                onFinish={handleRequestOtp}
                className={styles.loginForm}
              >
                <Form.Item
                  label="Email"
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
                    className={styles.input}
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
                    Get Started
                  </Button>
                </Form.Item>
              </Form>
            )}

            {currentStep === 1 && (
              <Form
                form={otpForm}
                layout="vertical"
                onFinish={handleVerifyOtp}
                className={styles.loginForm}
              >
                <div className={styles.emailChip}>
                  <MailOutlined />
                  <Text className={styles.emailChipText}>{email}</Text>
                </div>

                <Form.Item
                  label="Verification code"
                  name="otp"
                  rules={[
                    { required: true, message: "Please enter the code" },
                    { len: 6, message: "Code must be 6 digits" },
                  ]}
                >
                  <Input.OTP
                    length={6}
                    size="large"
                    type="tel"
                    className={styles.otpInput}
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
                    Verify & Continue
                  </Button>
                </Form.Item>

                <Button
                  type="link"
                  block
                  onClick={handleBackToEmail}
                  disabled={loading}
                  className={styles.secondaryLink}
                >
                  Use a different email
                </Button>
              </Form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
