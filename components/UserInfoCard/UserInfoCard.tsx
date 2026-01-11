"use client";

import React from "react";
import { Card, Typography, Space, Button, Tooltip, Divider } from "antd";
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
      <Space direction="vertical" size={4} style={{ textAlign: "center", width: "100%" }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
          {name}
        </Title>
        <Text type="secondary" style={{ fontSize: 13 }}>
          {jobTitle}
        </Text>
      </Space>

      <Divider style={{ margin: "16px 0", borderColor: "var(--tracker-card-border)" }} />

      <Space size={8} style={{ width: "100%", justifyContent: "center" }}>
        {phone && (
          <Tooltip title={phone} placement="bottom">
            <Button
              type="default"
              icon={<PhoneOutlined />}
              shape="circle"
              size="large"
              className="user-info-icon-button"
              onClick={() => window.open(`tel:${phone}`, "_self")}
            />
          </Tooltip>
        )}
        <Tooltip title={email} placement="bottom">
          <Button
            type="default"
            icon={<MailOutlined />}
            shape="circle"
            size="large"
            className="user-info-icon-button"
            onClick={() => window.open(`mailto:${email}`, "_self")}
          />
        </Tooltip>
        {secondaryEmail && (
          <Tooltip title={secondaryEmail} placement="bottom">
            <Button
              type="default"
              icon={<MailOutlined />}
              shape="circle"
              size="large"
              className="user-info-icon-button"
              onClick={() => window.open(`mailto:${secondaryEmail}`, "_self")}
            />
          </Tooltip>
        )}
      </Space>
    </Card>
  );
}
