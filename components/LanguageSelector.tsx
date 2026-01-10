"use client";

import React, { useState, useEffect, useMemo } from "react";
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

export default function LanguageSelector() {
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
              alignItems: "center", // ✅ centra en Y bandera + bloque de texto
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

            {/* ✅ bloque de texto centrado en Y */}
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

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      trigger={["click"]}
      placement="bottomRight"
      arrow
      overlayStyle={{ minWidth: 190 }}
      onOpenChange={(nextOpen) => setOpen(nextOpen)}
    >
      {/* ✅ Trigger compacto, centrado, sin marco salvo hover/open */}
      <div
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          height: 40, // ✅ mismo tamaño del avatar (40px)
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

        <Text style={{ fontSize: 14, lineHeight: "20px", fontWeight: 500 }}>
          {currentLang.nativeName}
        </Text>

        <GlobalOutlined style={{ fontSize: 16, opacity: 0.6 }} />
      </div>
    </Dropdown>
  );
}
