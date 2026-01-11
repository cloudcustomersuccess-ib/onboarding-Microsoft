"use client";

import React from "react";
import { Card, Typography, Space, Button } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid var(--tracker-card-border)",
  boxShadow: "var(--tracker-card-shadow)",
  background: "var(--tracker-card-bg)",
  height: "100%",
};

interface UserInfoCardProps {
  name: string;
  jobTitle: string;
  email: string;
  phone?: string;
  secondaryEmail?: string;
}

export function UserInfoCard({
  name,
  jobTitle,
  email,
  phone,
  secondaryEmail,
}: UserInfoCardProps) {
  return (
    <Card
      style={{
        ...cardBaseStyle,
        minHeight: "250px",
      }}
      styles={{
        body: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
          padding: "24px",
        },
      }}
    >
      <Space direction="vertical" size={4} style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          {name}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {jobTitle}
        </Text>
        <Text style={{ fontSize: 13, marginTop: 4 }}>{email}</Text>
      </Space>

      <Space direction="vertical" size={8} style={{ width: "100%" }}>
        {phone && (
          <Button
            type="default"
            icon={<PhoneOutlined />}
            block
            className="user-info-button"
            style={{
              borderColor: "var(--tracker-accent)",
              color: "var(--tracker-accent)",
            }}
            styles={{
              icon: { color: "var(--tracker-accent)" }
            }}
            onClick={() => window.open(`tel:${phone}`, "_self")}
          >
            {phone}
          </Button>
        )}
        <Button
          type="default"
          icon={<MailOutlined />}
          block
          className="user-info-button"
          style={{
            borderColor: "var(--tracker-accent)",
            color: "var(--tracker-accent)",
          }}
          styles={{
            icon: { color: "var(--tracker-accent)" }
          }}
          onClick={() => window.open(`mailto:${email}`, "_self")}
        >
          {email}
        </Button>
        {secondaryEmail && (
          <Button
            type="default"
            icon={<MailOutlined />}
            block
            className="user-info-button"
            style={{
              borderColor: "var(--tracker-accent)",
              color: "var(--tracker-accent)",
            }}
            styles={{
              icon: { color: "var(--tracker-accent)" }
            }}
            onClick={() => window.open(`mailto:${secondaryEmail}`, "_self")}
          >
            {secondaryEmail}
          </Button>
        )}
      </Space>
    </Card>
  );
}
