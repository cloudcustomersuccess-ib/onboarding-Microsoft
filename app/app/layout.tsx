"use client";

import { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  Input,
  ConfigProvider,
  theme,
  Dropdown,
} from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  QuestionCircleOutlined,
  BookOutlined,
  RocketOutlined,
  SearchOutlined,
  LogoutOutlined,
  SettingOutlined,
  IdcardOutlined,
  SunOutlined,
  MoonOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { getUser, clearSession, isAuthenticated } from "@/lib/session";
import type { User } from "@/types";
import Image from "next/image";
import LanguageSelector from "@/components/LanguageSelector";
import {
  SidebarProvider,
  SidebarInset,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/animate-ui/components/radix/sidebar";
import "./sidebar.css";
const { Text } = Typography;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
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
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, [router]);

  const handleThemeToggle = (dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  };

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "8px 0", pointerEvents: "none", cursor: "default" }}>
          <Text strong style={{ fontSize: "14px", display: "block", marginBottom: "4px" }}>
            {user?.FullName ||
              (user?.Name && user?.Surname
                ? `${user.Name} ${user.Surname}`
                : user?.Email?.split("@")[0])}
          </Text>
          <Text type="secondary" style={{ fontSize: "12px", display: "block" }}>
            {user?.Email}
          </Text>
        </div>
      ),
      disabled: true,
      style: { cursor: "default" },
    },
    {
      type: "divider",
    },
    {
      key: "profile",
      icon: <IdcardOutlined />,
      label: "Mi Perfil",
      onClick: () => {
        console.log("Navegar a perfil");
      },
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Configuración",
      onClick: () => {
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

  const themeMenuItems: MenuProps["items"] = [
    {
      key: "light",
      icon: <SunOutlined />,
      label: "Modo Claro",
      onClick: () => handleThemeToggle(false),
    },
    {
      key: "dark",
      icon: <MoonOutlined />,
      label: "Modo Oscuro",
      onClick: () => handleThemeToggle(true),
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

  const selectedKey = getSelectedKey();
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const controlBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "#f1f3f5";
  const controlBgActive = isDarkMode ? "rgba(255, 255, 255, 0.16)" : "#ffffff";
  const controlOutline = isDarkMode
    ? "0 0 0 2px rgba(0, 86, 87, 0.35)"
    : "0 0 0 2px rgba(0, 86, 87, 0.2)";
  const outlineColor = isDarkMode
    ? "rgba(0, 86, 87, 0.35)"
    : "rgba(0, 86, 87, 0.2)";
  const optionSelectedBg = isDarkMode
    ? "rgba(0, 86, 87, 0.25)"
    : "rgba(0, 86, 87, 0.12)";
  const optionActiveBg = isDarkMode
    ? "rgba(0, 86, 87, 0.2)"
    : "rgba(0, 86, 87, 0.08)";

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: "#005657",
          colorInfo: "#1677ff",
          colorLink: "#005657",
          colorLinkHover: "#003031",
          borderRadius: 10,
          fontFamily:
            "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          fontSize: 15,
          controlHeight: 36,
          controlHeightLG: 44,
          controlHeightSM: 28,
        },
        components: {
          Menu: {
            itemSelectedBg: isDarkMode ? "rgba(0, 86, 87, 0.2)" : "rgba(0, 86, 87, 0.1)",
            itemSelectedColor: "#005657",
            itemHoverBg: isDarkMode ? "rgba(0, 86, 87, 0.15)" : "rgba(0, 86, 87, 0.05)",
          },
          Layout: {
            siderBg: isDarkMode ? "#141414" : "#f7f8fa",
            headerBg: isDarkMode ? "#141414" : "#f7f8fa",
          },
          Input: {
            paddingInline: 12,
            paddingInlineLG: 14,
            paddingBlock: 6,
            paddingBlockLG: 8,
            hoverBorderColor: "#005657",
            activeBorderColor: "#005657",
            activeShadow: controlOutline,
            hoverBg: controlBg,
            activeBg: controlBgActive,
            inputFontSize: 15,
            inputFontSizeLG: 15,
          },
          Select: {
            selectorBg: controlBg,
            hoverBorderColor: "#005657",
            activeBorderColor: "#005657",
            activeOutlineColor: outlineColor,
            optionSelectedBg,
            optionActiveBg,
            optionSelectedColor: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "#003031",
          },
          Form: {
            itemMarginBottom: 16,
            labelColor: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.85)",
            labelFontSize: 13,
          },
        },
      }}
    >
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="sidebar-brand sidebar-brand-centered">
              <Image
                src="/images/Growth_Lab_Dark_Mode.png"
                alt="Growth Lab"
                width={180}
                height={48}
                className="sidebar-logo"
              />
            </div>
            <div className="sidebar-search-wrapper">
              <Input
                placeholder="Buscar..."
                prefix={<SearchOutlined style={{ color: "rgba(255, 255, 255, 0.5)" }} />}
                size="large"
                className="sidebar-search"
                allowClear
              />
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navegación</SidebarGroupLabel>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      isActive={selectedKey === item.key}
                      aria-current={selectedKey === item.key ? "page" : undefined}
                      onClick={() => router.push(item.key)}
                      tooltip={item.label}
                    >
                      <span className="sidebar-icon">{item.icon}</span>
                      <span className="sidebar-label">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu className="sidebar-footer-menu">
              {/* Language Selector */}
              <SidebarMenuItem>
                <LanguageSelector placement="rightTop" />
              </SidebarMenuItem>

              {/* Theme Selector */}
              <SidebarMenuItem>
                <Dropdown
                  menu={{ items: themeMenuItems }}
                  trigger={["click"]}
                  placement="topRight"
                  arrow
                >
                  <SidebarMenuButton
                    size="lg"
                    className="sidebar-footer-button"
                  >
                    <span className="sidebar-footer-icon">
                      {isDarkMode ? <MoonOutlined /> : <SunOutlined />}
                    </span>
                    <div className="sidebar-footer-info">
                      <span className="sidebar-footer-title">
                        {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
                      </span>
                      <span className="sidebar-footer-subtitle">
                        Apariencia
                      </span>
                    </div>
                    <span className="sidebar-footer-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </span>
                  </SidebarMenuButton>
                </Dropdown>
              </SidebarMenuItem>

              {/* User Profile */}
              <SidebarMenuItem>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  trigger={["click"]}
                  placement="topRight"
                  arrow
                >
                  <SidebarMenuButton
                    size="lg"
                    className="sidebar-footer-button sidebar-user-button"
                  >
                    <Avatar
                      src="/images/my-notion-face-portrait.png"
                      size={36}
                      className="sidebar-user-avatar"
                    />
                    <div className="sidebar-footer-info">
                      <span className="sidebar-footer-title">
                        {user?.FullName ||
                          (user?.Name && user?.Surname
                            ? `${user.Name} ${user.Surname}`
                            : user?.Email?.split("@")[0])}
                      </span>
                      <span className="sidebar-footer-subtitle">
                        {user?.Email}
                      </span>
                    </div>
                    <span className="sidebar-footer-chevron">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                      </svg>
                    </span>
                  </SidebarMenuButton>
                </Dropdown>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="app-header">
            <SidebarTrigger />
          </header>
          <main className="app-content">{children}</main>
          <footer className="app-footer">
            <div className="app-footer-inner">
              <Image
                src={
                  isDarkMode
                    ? "/images/TD SYNNEX_Logo_Aqua-White.png"
                    : "/images/TD SYNNEX_Logo_Standard.png"
                }
                alt="TD SYNNEX"
                width={100}
                height={24}
                className="app-footer-logo"
              />
              <Text type="secondary" className="app-footer-text">
                | Growth Lab ©{new Date().getFullYear()} - All rights reserved
              </Text>
            </div>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </ConfigProvider>
  );
}
