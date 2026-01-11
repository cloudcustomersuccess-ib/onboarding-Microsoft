"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Steps,
  Progress,
  Card,
  Timeline,
  Typography,
  Button,
  Space,
  Flex,
  Tag,
  Tooltip,
  Modal,
  Input,
  List,
  Divider,
  Spin,
  Skeleton,
  message,
} from "antd";
import {
  LockOutlined,
  CheckCircleFilled,
  ClockCircleOutlined,
  FileTextOutlined,
  MessageOutlined,
  CustomerServiceOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import type { TrackerTranslations } from "@/lib/i18n/trackerTranslations";

const { Text, Title, Paragraph } = Typography;

// ============================================================
// 1) MAIN STEPS CARD
// ============================================================

export interface MainStepUI {
  key: string;
  title: string;
  statusText: string;
  percent: number;
  locked?: boolean;
}

interface MainStepsCardProps {
  currentStepIndex: number;
  stepsUI: MainStepUI[];
  onSelectStep: (index: number) => void;
  t: TrackerTranslations;
}

export function MainStepsCard({
  currentStepIndex,
  stepsUI,
  onSelectStep,
  t,
}: MainStepsCardProps) {
  return (
    <Card
      title={t.ui.generalSteps}
      styles={{ body: { paddingTop: 16 } }}
      style={{ height: "100%", overflow: "hidden" }}
    >
      <Steps
        current={currentStepIndex}
        direction="vertical"
        titlePlacement="vertical"
        onChange={(idx) => {
          const step = stepsUI[idx];
          if (step?.locked) return;
          onSelectStep(idx);
        }}
        items={stepsUI.map((s) => ({
          title: (
            <div style={{ marginTop: 8 }}>
              <Text strong style={{ fontSize: 14 }}>
                {s.title}
              </Text>
            </div>
          ),
          description: (
            <div style={{ marginTop: 4 }}>
              <Text
                type={
                  s.percent === 100 ? "success" : s.percent === 0 ? "secondary" : undefined
                }
                style={{ fontSize: 12 }}
              >
                {s.statusText}
              </Text>
            </div>
          ),
          percent: s.percent,
          disabled: !!s.locked,
          icon: s.locked ? (
            <Tooltip title={t.ui.lockedTooltip}>
              <LockOutlined />
            </Tooltip>
          ) : undefined,
        }))}
      />
    </Card>
  );
}

// ============================================================
// 2) SUBSTEPS STEPPER
// ============================================================

export interface SubstepUI {
  key: string;
  title: string;
  disabled: boolean;
  done: boolean;
}

interface SubstepsStepperProps {
  currentSubIndex: number;
  orientation: "horizontal" | "vertical";
  substeps: SubstepUI[];
  onChange: (idx: number) => void;
  t: TrackerTranslations;
}

export function SubstepsStepper({
  currentSubIndex,
  orientation,
  substeps,
  onChange,
  t,
}: SubstepsStepperProps) {
  return (
    <Card
      title={t.ui.substeps}
      style={{ overflow: "hidden" }}
      styles={{ body: { paddingTop: 16 } }}
    >
      <Steps
        current={currentSubIndex}
        onChange={(idx) => {
          if (substeps[idx]?.disabled) return;
          onChange(idx);
        }}
        direction={orientation}
        items={substeps.map((s, idx) => ({
          title: s.title,
          disabled: s.disabled,
          status: s.done ? "finish" : idx === currentSubIndex ? "process" : "wait",
          icon: s.done ? <CheckCircleFilled /> : undefined,
        }))}
      />
    </Card>
  );
}

// ============================================================
// 3) SUBSTEP INSTRUCTION CARD
// ============================================================

interface SubstepInstructionCardProps {
  title: string;
  description: React.ReactNode;
  loading: boolean;
  onAddNote: () => void;
  onMarkComplete: () => void;
  onSupport: () => void;
  canComplete: boolean;
  t: TrackerTranslations;
}

export function SubstepInstructionCard({
  title,
  description,
  loading,
  onAddNote,
  onMarkComplete,
  onSupport,
  canComplete,
  t,
}: SubstepInstructionCardProps) {
  return (
    <Card
      title={title}
      extra={<Tag icon={<FileTextOutlined />} color="blue">{t.ui.instructions}</Tag>}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        borderRadius: 8,
      }}
      styles={{
        body: {
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        },
        header: {
          borderBottom: "1px solid #f0f0f0",
        },
      }}
    >
      <div style={{ flex: 1, overflow: "auto", marginBottom: 16 }}>
        {loading ? (
          <Skeleton active />
        ) : (
          <Typography.Paragraph style={{ fontSize: 14, lineHeight: 1.6 }}>
            {description}
          </Typography.Paragraph>
        )}
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <Flex justify="space-between" align="center" wrap="wrap" gap={12}>
        <Space wrap>
          <Button icon={<MessageOutlined />} onClick={onAddNote}>
            {t.ui.addNote}
          </Button>
          <Button icon={<CustomerServiceOutlined />} onClick={onSupport}>
            {t.ui.support}
          </Button>
        </Space>

        <Button
          type="primary"
          size="large"
          icon={<CheckOutlined />}
          onClick={onMarkComplete}
          disabled={!canComplete}
        >
          {t.ui.markComplete}
        </Button>
      </Flex>
    </Card>
  );
}

// ============================================================
// 4) TIMELINE CARD
// ============================================================

export interface TimelineItemUI {
  key: string;
  title: string;
  state: "done" | "current" | "future";
  completedAt?: string;
}

interface TimelineCardProps {
  items: TimelineItemUI[];
  currentKey: string;
  t: TrackerTranslations;
}

export function TimelineCard({ items, currentKey, t }: TimelineCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !currentRef.current) return;
    const parent = containerRef.current;
    const child = currentRef.current;
    setTimeout(() => {
      parent.scrollTop = Math.max(0, child.offsetTop - 100);
    }, 200);
  }, [currentKey]);

  return (
    <Card
      title={t.ui.timeline}
      style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}
      styles={{
        body: { flex: 1, overflow: "auto", paddingTop: 16 },
      }}
    >
      <div ref={containerRef} style={{ height: "100%", overflow: "auto", paddingRight: 8 }}>
        <Timeline
          items={items.map((it) => {
            const isCurrent = it.key === currentKey;

            let dot: React.ReactNode;
            let color: string | undefined;

            if (it.state === "done") {
              dot = <CheckCircleFilled style={{ fontSize: 16 }} />;
              color = "green";
            } else if (it.state === "current") {
              dot = <Spin size="small" />;
              color = "blue";
            } else {
              dot = <ClockCircleOutlined style={{ fontSize: 14, opacity: 0.5 }} />;
              color = undefined;
            }

            const content = (
              <div ref={isCurrent ? currentRef : undefined}>
                <Text
                  strong={it.state === "current"}
                  style={{
                    opacity: it.state === "future" ? 0.45 : 1,
                    display: "block",
                    fontSize: it.state === "current" ? 14 : 13,
                  }}
                >
                  {it.title}
                </Text>
                {it.state === "done" && it.completedAt ? (
                  <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                    {t.ui.completedOn} {it.completedAt}
                  </Text>
                ) : it.state === "current" ? (
                  <Text type="secondary" style={{ fontSize: 11, display: "block", marginTop: 4 }}>
                    {t.status.pending}
                  </Text>
                ) : null}
              </div>
            );

            return { dot, color, children: content };
          })}
        />
      </div>
    </Card>
  );
}

// ============================================================
// 5) NOTES CARD
// ============================================================

export interface NoteUI {
  id: string;
  author: string;
  date: string;
  body: string;
}

interface NotesCardProps {
  notes: NoteUI[];
  onCreate: (body: string) => Promise<void>;
  t: TrackerTranslations;
}

export function NotesCard({ notes, onCreate, t }: NotesCardProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    const body = value.trim();
    if (!body) return;
    try {
      setSaving(true);
      await onCreate(body);
      setValue("");
      setOpen(false);
      message.success(t.ui.noteSaved);
    } catch (e) {
      message.error(t.ui.noteError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={t.ui.generalNotes}
      extra={
        <Button type="primary" onClick={() => setOpen(true)} size="small">
          {t.ui.addNote}
        </Button>
      }
      style={{ height: "100%", overflow: "hidden" }}
      styles={{ body: { height: "100%", overflow: "auto" } }}
    >
      <List
        dataSource={notes}
        locale={{ emptyText: t.ui.noNotesYet }}
        renderItem={(n) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Space size={8}>
                  <Text strong>{n.author}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {n.date}
                  </Text>
                </Space>
              }
              description={<Text>{n.body}</Text>}
            />
          </List.Item>
        )}
      />

      <Modal
        title={t.ui.newNote}
        open={open}
        okText={t.ui.save}
        cancelText={t.ui.cancel}
        confirmLoading={saving}
        onOk={handleCreate}
        onCancel={() => setOpen(false)}
      >
        <Input.TextArea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.ui.writeNote}
          autoSize={{ minRows: 4, maxRows: 10 }}
        />
      </Modal>
    </Card>
  );
}

// ============================================================
// 6) OVERALL PROGRESS CARD
// ============================================================

interface OverallProgressCardProps {
  percent: number;
  done: number;
  total: number;
  t: TrackerTranslations;
}

export function OverallProgressCard({
  percent,
  done,
  total,
  t,
}: OverallProgressCardProps) {
  return (
    <Card
      title={t.ui.overallProgress}
      style={{ height: "100%" }}
      styles={{
        body: { display: "flex", alignItems: "center", justifyContent: "center" },
      }}
    >
      <Flex vertical align="center" justify="center" gap={16}>
        <Progress
          type="dashboard"
          percent={percent}
          size={120}
          strokeColor={{
            "0%": "#005657",
            "100%": "#003031",
          }}
          format={(percent) => (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#003031" }}>
                {percent}%
              </div>
            </div>
          )}
        />
        <div style={{ textAlign: "center" }}>
          <Title level={4} style={{ margin: 0, color: "#003031" }}>
            {done} {t.ui.of} {total}
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            {t.ui.substepsCompleted}
          </Text>
        </div>
      </Flex>
    </Card>
  );
}
