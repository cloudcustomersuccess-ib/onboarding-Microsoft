"use client";

import { Button, Typography, Space } from "antd";
import { useRouter } from "next/navigation";
import { RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          textAlign: "center",
          background: "white",
          padding: "60px 40px",
          borderRadius: "12px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <RocketOutlined style={{ fontSize: "64px", color: "#667eea" }} />

          <Title level={1} style={{ marginBottom: 0 }}>
            Partner Onboarding Platform
          </Title>

          <Paragraph style={{ fontSize: "16px", color: "#666" }}>
            Welcome to your centralized onboarding management system. Track
            progress, manage tasks, and collaborate with your team.
          </Paragraph>

          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/login")}
            style={{ marginTop: "20px" }}
          >
            Get Started
          </Button>

          <Paragraph style={{ fontSize: "14px", color: "#999", marginTop: "20px" }}>
            Powered by TD SYNNEX Partner Onboarding
          </Paragraph>
        </Space>
      </div>
    </div>
  );
}
