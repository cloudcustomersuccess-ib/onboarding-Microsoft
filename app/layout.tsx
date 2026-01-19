import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { Inter } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Partner Onboarding Platform",
  description: "Onboarding platform for partners",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
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
                colorSuccess: "#52c41a",
                colorWarning: "#faad14",
                colorError: "#ff4d4f",
              },
              components: {
                Input: {
                  paddingInline: 12,
                  paddingInlineLG: 14,
                  paddingBlock: 6,
                  paddingBlockLG: 8,
                  hoverBorderColor: "#005657",
                  activeBorderColor: "#005657",
                  activeShadow: "0 0 0 2px rgba(0, 86, 87, 0.15)",
                  hoverBg: "#eceff2",
                  activeBg: "#ffffff",
                  inputFontSize: 15,
                  inputFontSizeLG: 15,
                },
                Select: {
                  selectorBg: "#f1f3f5",
                  hoverBorderColor: "#005657",
                  activeBorderColor: "#005657",
                  activeOutlineColor: "rgba(0, 86, 87, 0.2)",
                  optionSelectedBg: "rgba(0, 86, 87, 0.12)",
                  optionActiveBg: "rgba(0, 86, 87, 0.08)",
                  optionSelectedColor: "#003031",
                },
                Form: {
                  itemMarginBottom: 16,
                  labelColor: "rgba(0, 0, 0, 0.85)",
                  labelFontSize: 13,
                },
              },
            }}
          >
            <CustomCursor />
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
