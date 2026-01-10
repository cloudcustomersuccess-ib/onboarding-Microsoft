"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Space,
  Avatar,
  Input,
  ConfigProvider,
  theme,
  Badge,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  RocketOutlined,
  UserOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearSession, isAuthenticated } from "@/lib/session";
import type { User } from "@/types";
import Image from "next/image";
import ThemeSwitch from "@/components/ThemeSwitch";
import LanguageSelector from "@/components/LanguageSelector";

const { Header, Sider, Content, Footer } = Layout;
const { Text } = Typography;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userData = getUser();
    setUser(userData);
    setLoading(false);

    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, [router]);

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Mi Perfil",
      onClick: () => {
        // TODO: Navegar a la página de perfil
        console.log("Navegar a perfil");
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configuración",
      onClick: () => {
        // TODO: Navegar a la página de configuración
        console.log("Navegar a configuración");
      },
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Cerrar Sesión",
      danger: true,
      onClick: handleLogout,
    },
  ];

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

  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#005657",
          colorLink: "#005657",
          colorLinkHover: "#003031",
          borderRadius: 8,
        },
        components: {
          Menu: {
            itemSelectedBg: isDarkMode ? "rgba(0, 86, 87, 0.2)" : "rgba(0, 86, 87, 0.1)",
            itemSelectedColor: "#005657",
            itemHoverBg: isDarkMode ? "rgba(0, 86, 87, 0.15)" : "rgba(0, 86, 87, 0.05)",
          },
          Layout: {
            siderBg: isDarkMode ? "#141414" : "#ffffff",
            headerBg: isDarkMode ? "#1f1f1f" : "#ffffff",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          width={250}
          style={{
            boxShadow: "2px 0 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Logo Header */}
          <div
            style={{
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: collapsed ? "16px 8px" : "16px 24px",
              borderBottom: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
            }}
          >
            {!collapsed ? (
              <Image
                src={
                  isDarkMode
                    ? "https://i.imgur.com/QDeVhJp.png"
                    : "https://i.imgur.com/46EQNul.png"
                }
                alt="Growth Lab"
                width={150}
                height={40}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #005657 0%, #003031 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  color: "#fff",
                  fontSize: "16px",
                }}
              >
                GL
              </div>
            )}
          </div>

          <Menu
            theme={isDarkMode ? "dark" : "light"}
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            items={menuItems}
            onClick={({ key }) => router.push(key)}
            style={{
              border: "none",
              marginTop: "8px",
            }}
          />
        </Sider>

        <Layout>
          <Header
            style={{
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              position: "sticky",
              top: 0,
              zIndex: 999,
            }}
          >
            {/* Left: Theme Toggle */}
            <Space size="middle">
              <ThemeSwitch checked={isDarkMode} onChange={handleThemeToggle} />
            </Space>

            {/* Right: Language + Search + User Badge */}
            <Space size="large">
              <LanguageSelector isDarkMode={isDarkMode} />

              <Input
                placeholder="Buscar..."
                prefix={<SearchOutlined />}
                style={{
                  width: "280px",
                  borderRadius: "20px",
                }}
                allowClear
              />

              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <Badge dot status="success">
                  <Space
                    style={{
                      cursor: "pointer",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      transition: "all 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isDarkMode
                        ? "rgba(0, 86, 87, 0.15)"
                        : "rgba(0, 86, 87, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <Avatar
                      src="/Images/notion-avatar-1768072727184.png"
                      style={{
                        border: "2px solid #005657",
                      }}
                    />
                    <Space direction="vertical" size={0}>
                      <Text strong style={{ fontSize: "14px" }}>
                        {user?.FullName ||
                          (user?.Name && user?.Surname
                            ? `${user.Name} ${user.Surname}`
                            : user?.Email?.split("@")[0])}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {user?.Email}
                      </Text>
                    </Space>
                  </Space>
                </Badge>
              </Dropdown>
            </Space>
          </Header>

          <Content
            style={{
              margin: "24px 16px",
              overflow: "initial",
            }}
          >
            {children}
          </Content>

          <Footer style={{ textAlign: "center" }}>
            <Text type="secondary">
              Growth Lab ©{new Date().getFullYear()} - Partner Onboarding Platform
            </Text>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
