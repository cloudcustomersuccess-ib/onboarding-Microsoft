"use client";

import { Card, Typography, List, Space, Tag } from "antd";
import {
  BookOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const trainingResources = [
  {
    title: "Microsoft Partner Onboarding",
    description:
      "Complete guide to becoming a Microsoft partner through TD SYNNEX",
    type: "video",
    duration: "45 min",
    link: "#",
  },
  {
    title: "AWS Partner Setup Guide",
    description: "Step-by-step instructions for AWS partner registration",
    type: "document",
    duration: "15 min read",
    link: "#",
  },
  {
    title: "Google Cloud Partner Program",
    description: "Introduction to Google Cloud partnership requirements",
    type: "video",
    duration: "30 min",
    link: "#",
  },
  {
    title: "Partner Portal Navigation",
    description: "Learn how to use the partner onboarding portal effectively",
    type: "video",
    duration: "20 min",
    link: "#",
  },
];

export default function FormacionPage() {
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <BookOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
              <Title level={2}>Training & Resources</Title>
              <Paragraph type="secondary">
                Educational materials to help you succeed in your onboarding
                journey
              </Paragraph>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={trainingResources}
              style={{ marginTop: "30px" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <a key="view" href={item.link}>
                      View
                    </a>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      item.type === "video" ? (
                        <PlayCircleOutlined
                          style={{ fontSize: "32px", color: "#1890ff" }}
                        />
                      ) : (
                        <FileTextOutlined
                          style={{ fontSize: "32px", color: "#52c41a" }}
                        />
                      )
                    }
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">{item.description}</Text>
                        <Tag color={item.type === "video" ? "blue" : "green"}>
                          {item.duration}
                        </Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Space>
        </Card>

        <Card title="Upcoming Webinars" type="inner">
          <Paragraph type="secondary">
            No upcoming webinars scheduled. Check back soon for new training
            sessions.
          </Paragraph>
        </Card>
      </Space>
    </div>
  );
}
