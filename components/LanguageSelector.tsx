"use client";

import React, { useState, useEffect } from "react";
import { Dropdown, Space, Typography } from "antd";
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
  {
    key: "es",
    flag: "/Images/ESP.png",
    name: "Spanish",
    nativeName: "Español",
  },
  {
    key: "pt",
    flag: "/Images/PT.png",
    name: "Portuguese",
    nativeName: "Português",
  },
  {
    key: "en",
    flag: "/Images/EN.png",
    name: "English",
    nativeName: "English",
  },
];

const languageNames: Record<Language, Record<Language, string>> = {
  es: {
    es: "Español",
    pt: "Portugués",
    en: "Inglés",
  },
  pt: {
    es: "Espanhol",
    pt: "Português",
    en: "Inglês",
  },
  en: {
    es: "Spanish",
    pt: "Portuguese",
    en: "English",
  },
};

interface LanguageSelectorProps {
  isDarkMode?: boolean;
}

export default function LanguageSelector({
  isDarkMode = false,
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("es");

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && ["es", "pt", "en"].includes(savedLanguage)) {
      setSelectedLanguage(savedLanguage);
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);
    // TODO: Implementar cambio de idioma en la aplicación
    console.log("Language changed to:", language);
  };

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.key === selectedLanguage);
  };

  const menuItems: MenuProps["items"] = languages.map((lang) => ({
    key: lang.key,
    label: (
      <Space>
        <Image
          src={lang.flag}
          alt={lang.name}
          width={24}
          height={24}
          style={{ borderRadius: "4px", objectFit: "cover" }}
        />
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "14px" }}>
            {lang.nativeName}
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: "12px", lineHeight: "12px" }}
          >
            {languageNames[selectedLanguage][lang.key]}
          </Text>
        </Space>
      </Space>
    ),
    onClick: () => handleLanguageChange(lang.key),
  }));

  const currentLang = getCurrentLanguage();

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight" arrow>
      <Space
        style={{
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "8px",
          transition: "all 0.3s",
          border: isDarkMode ? "1px solid #303030" : "1px solid #d9d9d9",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDarkMode
            ? "rgba(0, 86, 87, 0.15)"
            : "rgba(0, 86, 87, 0.05)";
          e.currentTarget.style.borderColor = "#005657";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.borderColor = isDarkMode ? "#303030" : "#d9d9d9";
        }}
      >
        <Image
          src={currentLang?.flag || "/Images/ESP.png"}
          alt={currentLang?.name || "Spanish"}
          width={24}
          height={24}
          style={{ borderRadius: "4px", objectFit: "cover" }}
        />
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "14px" }}>
            {currentLang?.nativeName}
          </Text>
          <Text
            type="secondary"
            style={{ fontSize: "11px", lineHeight: "11px" }}
          >
            {languageNames[selectedLanguage][selectedLanguage]}
          </Text>
        </Space>
        <GlobalOutlined style={{ fontSize: "16px", opacity: 0.6 }} />
      </Space>
    </Dropdown>
  );
}
