"use client";

import { Card, Typography, Space, Button, Descriptions } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

export default function SoportePage() {
  return (
    <div>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div style={{ textAlign: "center" }}>
              <QuestionCircleOutlined
                style={{ fontSize: "64px", color: "#1890ff" }}
              />
              <Title level={2}>Support Center</Title>
              <Paragraph type="secondary">
                We're here to help you with your onboarding process
              </Paragraph>
            </div>

            <Descriptions
              bordered
              column={1}
              style={{ marginTop: "30px" }}
            >
              <Descriptions.Item label="Email Support">
                <Space>
                  <MailOutlined />
                  <a href="mailto:support@tdsynnex.com">
                    support@tdsynnex.com
                  </a>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Phone Support">
                <Space>
                  <PhoneOutlined />
                  <Text>+1 (800) 123-4567</Text>
                </Space>
              </Descriptions.Item>

              <Descriptions.Item label="Business Hours">
                Monday - Friday, 9:00 AM - 6:00 PM (EST)
              </Descriptions.Item>
            </Descriptions>

            <Card
              type="inner"
              title="Frequently Asked Questions"
              style={{ marginTop: "20px" }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text strong>How do I update my onboarding checklist?</Text>
                  <Paragraph type="secondary">
                    Navigate to the Onboarding Tracker, select your client, and
                    use the toggle switches to update each step.
                  </Paragraph>
                </div>

                <div>
                  <Text strong>Who can I contact for technical issues?</Text>
                  <Paragraph type="secondary">
                    Email our technical support team at support@tdsynnex.com or
                    call our support hotline.
                  </Paragraph>
                </div>

                <div>
                  <Text strong>How long does the onboarding process take?</Text>
                  <Paragraph type="secondary">
                    The typical onboarding process takes 2-4 weeks, depending on
                    the manufacturer and completeness of documentation.
                  </Paragraph>
                </div>
              </Space>
            </Card>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
