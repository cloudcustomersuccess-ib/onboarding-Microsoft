"use client";

import { useState, useEffect, useMemo } from "react";
import { Dropdown, Typography } from "antd";
import type { MenuProps } from "antd";
import { GlobalOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Text } = Typography;

export type Language = "es" | "pt" | "en";

interface LanguageOption {
  key: Language;
  flag: string;
  name: string;
  nativeName: string;
}

const languages: LanguageOption[] = [
  { key: "es", flag: "/images/ESP.png", name: "Spanish", nativeName: "Español" },
  { key: "pt", flag: "/images/PT.png", name: "Portuguese", nativeName: "Português" },
  { key: "en", flag: "/images/EN.png", name: "English", nativeName: "English" },
];

const languageNames: Record<Language, Record<Language, string>> = {
  es: { es: "Español", pt: "Portugués", en: "Inglés" },
  pt: { es: "Espanhol", pt: "Português", en: "Inglês" },
  en: { es: "Spanish", pt: "Portuguese", en: "English" },
};

interface LanguageSelectorProps {
  placement?: "topRight" | "bottomRight" | "rightTop" | "right" | "topLeft" | "bottomLeft";
}

export default function LanguageSelector({ placement = "bottomRight" }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("es");
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (["es", "pt", "en"] as Language[]).includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);
    // Dispatch custom event to notify other components about language change
    window.dispatchEvent(new CustomEvent("languageChange", { detail: { language } }));
  };

  const currentLang = useMemo(
    () => languages.find((l) => l.key === selectedLanguage) ?? languages[0],
    [selectedLanguage]
  );

  const menuItems: MenuProps["items"] = useMemo(
    () =>
      languages.map((lang) => ({
        key: lang.key,
        label: (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "4px 6px",
            }}
          >
            <Image
              src={lang.flag}
              alt={lang.name}
              width={22}
              height={22}
              style={{ borderRadius: 4, objectFit: "cover", flex: "0 0 auto" }}
              unoptimized
            />

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <Text style={{ fontSize: 13, lineHeight: "16px", fontWeight: 600 }}>
                {lang.nativeName}
              </Text>
              <Text
                type="secondary"
                style={{ fontSize: 11, lineHeight: "14px", marginTop: 1 }}
              >
                {languageNames[selectedLanguage][lang.key]}
              </Text>
            </div>
          </div>
        ),
        onClick: () => handleLanguageChange(lang.key),
      })),
    [selectedLanguage]
  );

  const active = hovered || open;

  // Check if using sidebar style (right placement)
  const isSidebarStyle = placement === "rightTop" || placement === "right";

  // Map custom placement to Ant Design placement
  const getAntPlacement = () => {
    if (placement === "rightTop" || placement === "right") {
      return "topRight";
    }
    return placement;
  };

  if (isSidebarStyle) {
    return (
      <Dropdown
        menu={{
          items: menuItems,
        }}
        trigger={["click"]}
        placement={getAntPlacement()}
        arrow
        autoAdjustOverflow
        dropdownRender={(menu) => (
          <div className="sidebar-dropdown-content">
            {menu}
          </div>
        )}
        onOpenChange={(nextOpen) => setOpen(nextOpen)}
      >
        <button
          type="button"
          className="sidebar-menu-button sidebar-footer-button"
          data-size="lg"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <span className="sidebar-footer-icon">
            <GlobalOutlined />
          </span>
          <div className="sidebar-footer-info">
            <span className="sidebar-footer-title">
              {currentLang.nativeName}
            </span>
            <span className="sidebar-footer-subtitle">
              Idioma
            </span>
          </div>
          <span className="sidebar-footer-chevron">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </span>
        </button>
      </Dropdown>
    );
  }

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
      placement={getAntPlacement()}
      arrow
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
    >
      <div
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          height: 48,
          padding: "0 12px",
          borderRadius: 8,
          cursor: "pointer",
          userSelect: "none",
          transition: "background 160ms ease, opacity 160ms ease",
          border: "none",
          background: "transparent",
          opacity: active ? 0.7 : 1,
        }}
      >
        <Image
          src={currentLang.flag}
          alt={currentLang.name}
          width={18}
          height={18}
          style={{ borderRadius: 3, objectFit: "cover" }}
          unoptimized
        />

        <Text style={{ fontSize: 15, lineHeight: "22px", fontWeight: 500 }}>
          {currentLang.nativeName}
        </Text>

        <GlobalOutlined style={{ fontSize: 18, opacity: 0.6 }} />
      </div>
    </Dropdown>
  );
}
