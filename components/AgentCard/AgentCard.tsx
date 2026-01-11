"use client";

import React from "react";
import styles from "./agent-card.module.css";
import { MailOutlined } from "@ant-design/icons";
import { Button } from "antd";

type AgentCardProps = {
  name?: string;
  role?: string;
  about?: string;
  email?: string;
  avatarUrl?: string;
};

export function AgentCard({
  name = "Laura Gómez",
  role = "Customer Success Manager",
  about = "Tu punto de contacto para completar el alta y resolver bloqueos.",
  email = "customersuccess.es@tdsynnex.com",
  avatarUrl = "https://api.dicebear.com/7.x/thumbs/svg?seed=tdsynnex",
}: AgentCardProps) {
  return (
    <div className={styles.card} style={{ ["--accent" as any]: "#003031" }}>
      <button
        className={styles.mail}
        aria-label="Enviar email"
        onClick={() => window.open(`mailto:${email}`, "_self")}
      >
        <MailOutlined />
      </button>

      <div className={styles.profilePic} aria-hidden="true">
        <img src={avatarUrl} alt="" />
      </div>

      <div className={styles.bottom}>
        <div className={styles.content}>
          <span className={styles.name}>{name}</span>
          <span className={styles.role}>{role}</span>
          <span className={styles.aboutMe}>{about}</span>
        </div>

        <div className={styles.bottomBottom}>
          <div className={styles.socialLinksContainer}>
            {/* Minimal: kept empty for now */}
          </div>

          <Button
            size="small"
            className={styles.ctaButton}
            onClick={() => window.open(`mailto:${email}`, "_self")}
          >
            Contactar
          </Button>
        </div>
      </div>
    </div>
  );
}
