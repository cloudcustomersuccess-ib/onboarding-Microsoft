"use client";

import { Card, Typography, List, Space, Tag, Avatar } from "antd";
import {
  RocketOutlined,
  TrophyOutlined,
  BulbOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const newsItems = [
  {
    title: "Microsoft Announces New Partner Incentives for Q1 2026",
    summary:
      "Exciting new benefits for Microsoft partners including enhanced margins and co-marketing opportunities.",
    date: "2026-01-08",
    category: "Microsoft",
    icon: <TrophyOutlined style={{ color: "#1890ff" }} />,
  },
  {
    title: "AWS Partner Network Expands Cloud Credit Program",
    summary:
      "AWS increases cloud credits for new partners to support growth and innovation.",
    date: "2026-01-05",
    category: "AWS",
    icon: <FireOutlined style={{ color: "#ff9800" }} />,
  },
  {
    title: "Best Practices: Accelerating Your Partner Onboarding",
    summary:
      "Learn from successful partners who completed onboarding in record time.",
    date: "2026-01-03",
    category: "Tips",
    icon: <BulbOutlined style={{ color: "#52c41a" }} />,
  },
  {
    title: "Google Cloud Partner Advantage: New Features Released",
    summary:
      "Google Cloud introduces enhanced partner portal features and analytics tools.",
    date: "2025-12-28",
    category: "Google Cloud",
    icon: <RocketOutlined style={{ color: "#f50057" }} />,
  },
];

export default function GrowthNewsPage() {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "microsoft":
        return "blue";
      case "aws":
        return "orange";
      case "google cloud":
        return "red";
      case "tips":
        return "green";
      default:
        return "default";
    }
  };

  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <RocketOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
              <Title level={2}>Growth News</Title>
              <Paragraph type="secondary">
                Stay updated with the latest partner program announcements and
                growth opportunities
              </Paragraph>
            </div>

            <List
              itemLayout="vertical"
              dataSource={newsItems}
              style={{ marginTop: "30px" }}
              renderItem={(item) => (
                <List.Item
                  extra={
                    <Tag color={getCategoryColor(item.category)}>
                      {item.category}
                    </Tag>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        size={48}
                        icon={item.icon}
                        style={{ backgroundColor: "#f0f2f5" }}
                      />
                    }
                    title={<Text strong style={{ fontSize: "16px" }}>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{item.summary}</Text>
                        <Text
                          type="secondary"
                          style={{ fontSize: "12px" }}
                        >
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </Card>

        <Card title="Subscribe to Updates" type="inner">
          <Paragraph type="secondary">
            Want to receive growth news directly in your inbox? Contact your
            account manager to subscribe to our newsletter.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
}
