import { Alert } from "antd";
import type { AlertProps } from "antd";
import styles from "./CompactAlert.module.css";

export function CompactAlert({ className, ...props }: AlertProps) {
  const combinedClassName = className
    ? `${styles.compactAlert} ${className}`
    : styles.compactAlert;

  return <Alert {...props} className={combinedClassName} />;
}
