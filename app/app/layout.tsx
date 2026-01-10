"use client";

import { useEffect, useState } from "react";
import { Layout, Menu, Typography, Button, Space, Avatar } from "antd";
import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  RocketOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearSession, isAuthenticated } from "@/lib/session";
import type { User } from "@/types";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userData = getUser();
    setUser(userData);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const menuItems = [
    {
      key: "/app/onboarding-tracker",
      icon: <AppstoreOutlined />,
      label: "Onboarding Tracker",
    },
    {
      key: "/app/soporte",
      icon: <QuestionCircleOutlined />,
      label: "Soporte",
    },
    {
      key: "/app/formacion",
      icon: <BookOutlined />,
      label: "Formación",
    },
    {
      key: "/app/growth-news",
      icon: <RocketOutlined />,
      label: "Growth News",
    },
  ];

  const getSelectedKey = () => {
    const match = menuItems.find((item) => pathname.startsWith(item.key));
    return match ? match.key : "/app/onboarding-tracker";
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        style={{
          background: "#fff",
          boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Text strong style={{ fontSize: "16px" }}>
            Partner Portal
          </Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
          style={{ border: "none", marginTop: "20px" }}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div></div>

          <Space>
            <Avatar icon={<UserOutlined />} />
            <Space direction="vertical" size={0}>
              <Text strong>
                {user?.FullName ||
                  (user?.Name && user?.Surname
                    ? `${user.Name} ${user.Surname}`
                    : user?.Email)}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {user?.Role || "Partner"}
              </Text>
            </Space>
            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              type="text"
            >
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: "24px", background: "#f0f2f5" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
