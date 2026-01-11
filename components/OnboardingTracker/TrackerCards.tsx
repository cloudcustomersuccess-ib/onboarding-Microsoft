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

const { Text, Title } = Typography;

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
      styles={{ body: { paddingTop: 8 } }}
      style={{ height: "100%", overflow: "hidden" }}
    >
      <Steps
        current={currentStepIndex}
        direction="vertical"
        onChange={(idx) => {
          const step = stepsUI[idx];
          if (step?.locked) return;
          onSelectStep(idx);
        }}
        items={stepsUI.map((s) => ({
          title: s.title,
          description: (
            <Text
              type={
                s.percent === 100 ? "success" : s.percent === 0 ? "secondary" : undefined
              }
            >
              {s.statusText}
            </Text>
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
    <Card title={t.ui.substeps} style={{ overflow: "hidden" }}>
      <Steps
        current={currentSubIndex}
        onChange={(idx) => {
          if (substeps[idx]?.disabled) return;
          onChange(idx);
        }}
        direction={orientation}
        items={substeps.map((s) => ({
          title: s.title,
          disabled: s.disabled,
          status: s.done ? "finish" : undefined,
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
      extra={<Tag icon={<FileTextOutlined />}>{t.ui.instructions}</Tag>}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
      styles={{
        body: { flex: 1, overflow: "auto" },
      }}
    >
      {loading ? <Skeleton active /> : <div>{description}</div>}

      <Divider />

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
      parent.scrollTop = Math.max(0, child.offsetTop - 24);
    }, 100);
  }, [currentKey]);

  return (
    <Card
      title={t.ui.timeline}
      style={{ height: "100%", overflow: "hidden" }}
      styles={{ body: { height: "100%", overflow: "auto" } }}
    >
      <div ref={containerRef} style={{ height: "100%", overflow: "auto" }}>
        <Timeline
          items={items.map((it) => {
            const isCurrent = it.key === currentKey;
            const dot =
              it.state === "done" ? (
                <CheckCircleFilled />
              ) : it.state === "current" ? (
                <Spin size="small" />
              ) : (
                <ClockCircleOutlined />
              );

            const content = (
              <div ref={isCurrent ? currentRef : undefined}>
                <Text
                  style={{
                    opacity: it.state === "future" ? 0.45 : 1,
                    display: "block",
                  }}
                >
                  {it.title}
                </Text>
                {it.state === "done" && it.completedAt ? (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {t.ui.completedOn} {it.completedAt}
                  </Text>
                ) : null}
              </div>
            );

            return { dot, color: it.state === "done" ? "green" : undefined, children: content };
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
    <Card title={t.ui.overallProgress}>
      <Flex align="center" justify="space-between" gap={16} wrap="wrap">
        <Progress type="dashboard" percent={percent} size={100} />
        <div>
          <Title level={5} style={{ margin: 0 }}>
            {done} {t.ui.of} {total}
          </Title>
          <Text type="secondary">{t.ui.substepsCompleted}</Text>
        </div>
      </Flex>
    </Card>
  );
}
