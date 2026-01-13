import React from "react";
import { Steps, theme } from "antd";
import styles from "./InstructionSteps.module.css";

export interface InstructionStepItem {
  title: string;
  description?: React.ReactNode;
}

interface InstructionStepsProps {
  items: InstructionStepItem[];
  className?: string;
}

export function InstructionSteps({ items, className }: InstructionStepsProps) {
  const { token } = theme.useToken();
  const combinedClassName = className
    ? `${styles.instructionSteps} ${className}`
    : styles.instructionSteps;

  return (
    <Steps
      direction="vertical"
      size="small"
      current={-1}
      className={combinedClassName}
      items={items.map((item) => ({
        title: (
          <span className={styles.stepTitle} style={{ color: token.colorText }}>
            {item.title}
          </span>
        ),
        description: item.description ? (
          <span className={styles.stepDescription} style={{ color: token.colorTextSecondary }}>
            {item.description}
          </span>
        ) : undefined,
      }))}
    />
  );
}
