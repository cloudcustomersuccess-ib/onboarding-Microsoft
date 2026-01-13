"use client";
import React from "react";
import { Avatar, Badge, Typography } from "antd";
import styles from "./email-push-notification.module.css";

const { Text } = Typography;

export interface EmailPushNotificationProps {
  initials: string;        // "TS" o "CB"
  subject: string;
  from: string;
  timestampLabel?: string; // opcional: "ahora", "hoy", etc.
}

export function EmailPushNotification(props: EmailPushNotificationProps) {
  const { initials, subject, from, timestampLabel = "ahora" } = props;

  return (
    <div className={styles.wrap} role="note" aria-label="Notificación de email">
      <div className={styles.left}>
        <Badge count={1} color="#ff4d4f" offset={[-2, 2]}>
          <Avatar className={styles.avatar}>{initials}</Avatar>
        </Badge>
      </div>

      <div className={styles.body}>
        <div className={styles.topRow}>
          <Text className={styles.subject} strong ellipsis>
            {subject}
          </Text>
          <Text className={styles.time} type="secondary">
            {timestampLabel}
          </Text>
        </div>

        <Text className={styles.from} type="secondary" ellipsis>
          {from}
        </Text>
      </div>
    </div>
  );
}
