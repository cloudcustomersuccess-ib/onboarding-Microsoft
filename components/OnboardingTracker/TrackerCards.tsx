"use client";

import React, { useEffect, useRef, useState } from "react";
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
  DeleteOutlined,
} from "@ant-design/icons";
import type { TrackerTranslations } from "@/lib/i18n/trackerTranslations";

const { Text, Title } = Typography;

const cardBaseStyle: React.CSSProperties = {
  borderRadius: 14,
  border: "1px solid var(--tracker-card-border)",
  boxShadow: "var(--tracker-card-shadow)",
  background: "var(--tracker-card-bg)",
};

const cardHeaderStyles = {
  header: {
    borderBottom: "1px solid var(--tracker-card-border)",
    paddingTop: 14,
    paddingBottom: 12,
  },
};

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

export interface SubstepUI {
  key: string;
  title: string;
  disabled: boolean;
  done: boolean;
}

// ============================================================
// 2) COMBINED CARD (MAIN STEPS + SUBSTEPS + INSTRUCTIONS)
// ============================================================

interface CombinedTrackerCardProps {
  currentStepIndex: number;
  stepsUI: MainStepUI[];
  onSelectStep: (index: number) => void;
  currentSubIndex: number;
  substeps: SubstepUI[];
  onChangeSubstep: (idx: number) => void;
  title: string;
  description: React.ReactNode;
  loading: boolean;
  noteContextKey: string;
  onSaveNote: (body: string) => Promise<void>;
  onMarkComplete: () => void;
  onSupport: () => void;
  canComplete: boolean;
  t: TrackerTranslations;
}

export function CombinedTrackerCard({
  currentStepIndex,
  stepsUI,
  onSelectStep,
  currentSubIndex,
  substeps,
  onChangeSubstep,
  title,
  description,
  loading,
  noteContextKey,
  onSaveNote,
  onMarkComplete,
  onSupport,
  canComplete,
  t,
}: CombinedTrackerCardProps) {
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  useEffect(() => {
    setNoteOpen(false);
    setNoteValue("");
  }, [noteContextKey]);

  const handleSaveNote = async () => {
    const body = noteValue.trim();
    if (!body) return;
    try {
      setNoteSaving(true);
      await onSaveNote(body);
      setNoteValue("");
      setNoteOpen(false);
      message.success(t.ui.noteSaved);
    } catch (e) {
      message.error(t.ui.noteError);
    } finally {
      setNoteSaving(false);
    }
  };

  return (
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ri-road-map-line" style={{ fontSize: 18 }} />
          {t.ui.generalSteps}
        </span>
      }
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...cardBaseStyle,
      }}
      styles={{
        body: {
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          paddingBottom: 12,
        },
        ...cardHeaderStyles,
      }}
    >
      <div style={{ padding: "4px 0" }}>
        <Steps
          current={currentStepIndex}
          style={{ width: "100%" }}
          onChange={(idx) => {
            const step = stepsUI[idx];
            if (step?.locked) return;
            onSelectStep(idx);
          }}
          items={stepsUI.map((s) => ({
            title: (
              <Text strong style={{ fontSize: 14, display: "block", textAlign: "left" }}>
                {s.title}
              </Text>
            ),
            description: (
              <Text
                type={s.percent === 100 ? "success" : s.percent === 0 ? "secondary" : undefined}
                style={{ fontSize: 12, display: "block", textAlign: "left" }}
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
      </div>

      <Divider style={{ margin: "8px 0", borderColor: "var(--tracker-card-border)" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.8fr)",
          gap: 16,
          flex: 1,
          minHeight: 0,
          alignItems: "start",
        }}
      >
        <div style={{ overflow: "auto" }}>
          <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 12 }}>
            {t.ui.substeps}
          </Text>
          <Steps
            type="dot"
            current={currentSubIndex}
            direction="vertical"
            onChange={(idx) => {
              if (substeps[idx]?.disabled) return;
              onChangeSubstep(idx);
            }}
            items={substeps.map((s, idx) => ({
              title: s.title,
              description: s.done ? "Completado" : undefined,
              disabled: s.disabled,
              status: s.done ? "finish" : idx === currentSubIndex ? "process" : "wait",
            }))}
            style={{ flex: "auto" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <Title level={5} style={{ margin: 0, marginTop: "-2px" }}>
              {title}
            </Title>
            <Tag icon={<FileTextOutlined />} color="blue">
              {t.ui.instructions}
            </Tag>
          </div>

          <div style={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Skeleton active />
            ) : (
              <Typography.Paragraph style={{ fontSize: 14, lineHeight: 1.6 }}>
                {description}
              </Typography.Paragraph>
            )}
          </div>

          {noteOpen && (
            <div
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid var(--tracker-card-border)",
                background: "var(--tracker-card-bg)",
              }}
            >
              <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                {t.ui.writeNote}
              </Text>
              <Input.TextArea
                value={noteValue}
                onChange={(e) => setNoteValue(e.target.value)}
                placeholder={t.ui.writeNote}
                autoSize={{ minRows: 3, maxRows: 8 }}
              />
              <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
                <Button
                  onClick={() => {
                    setNoteOpen(false);
                    setNoteValue("");
                  }}
                >
                  {t.ui.cancel}
                </Button>
                <Button type="primary" onClick={handleSaveNote} loading={noteSaving}>
                  {t.ui.save}
                </Button>
              </Flex>
            </div>
          )}

          <div
            style={{
              marginTop: 8,
              paddingTop: 10,
              borderTop: "1px solid var(--tracker-card-border)",
            }}
          >
            <Flex align="center" justify="flex-start" wrap="wrap" gap={8}>
              <Space
                split={
                  <span
                    style={{
                      width: 1,
                      height: 16,
                      background: "var(--tracker-card-border)",
                      display: "inline-block",
                    }}
                  />
                }
              >
                <Tooltip title={t.ui.addNote}>
                  <Button
                    type="text"
                    icon={<MessageOutlined />}
                    aria-label={t.ui.addNote}
                    onClick={() => setNoteOpen(true)}
                  />
                </Tooltip>
                <Tooltip title={t.ui.support}>
                  <Button
                    type="text"
                    icon={<CustomerServiceOutlined />}
                    aria-label={t.ui.support}
                    onClick={onSupport}
                  />
                </Tooltip>
                <Tooltip title={t.ui.markComplete}>
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    aria-label={t.ui.markComplete}
                    onClick={onMarkComplete}
                    disabled={!canComplete}
                    style={{ color: canComplete ? "#1677ff" : undefined }}
                  />
                </Tooltip>
              </Space>
            </Flex>
          </div>
        </div>
      </div>
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
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ri-time-line" style={{ fontSize: 18 }} />
          {t.ui.timeline}
        </span>
      }
      style={{
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...cardBaseStyle,
      }}
      styles={{
        ...cardHeaderStyles,
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
  currentUserId: string;
  onCreate: (body: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  t: TrackerTranslations;
}

export function NotesCard({ notes, currentUserId, onCreate, onDelete, t }: NotesCardProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showEmptyState = notes.length === 0 && !open;

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

  const handleDelete = async (noteId: string) => {
    try {
      setDeletingId(noteId);
      await onDelete(noteId);
    } catch (e) {
      message.error(t.ui.noteError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ri-sticky-note-line" style={{ fontSize: 18 }} />
          {t.ui.generalNotes}
        </span>
      }
      extra={
        <Button type="primary" onClick={() => setOpen(true)} size="small">
          {t.ui.addNote}
        </Button>
      }
      style={{ height: "100%", display: "flex", flexDirection: "column", ...cardBaseStyle }}
      styles={{ ...cardHeaderStyles, body: { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, padding: "16px" } }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ flex: 1, overflow: "auto", paddingRight: 4, minHeight: 0 }}>
          {showEmptyState ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                textAlign: "center",
                padding: "12px 0",
              }}
            >
              <img
                src="/images/ChatGPT%20Image%20Jan%2011%2C%202026%2C%2002_45_23%20PM.png"
                alt="Empty notes"
                style={{ maxWidth: "80%", height: "auto", borderRadius: 12 }}
              />
              <Button type="primary" onClick={() => setOpen(true)}>
                Añadir nota
              </Button>
            </div>
          ) : notes.length > 0 ? (
            <List
              dataSource={notes}
              renderItem={(n) => (
                <List.Item
                  className="tracker-note-item"
                  actions={
                    n.id && n.author === currentUserId
                      ? [
                          <Button
                            key="delete"
                            type="text"
                            danger
                            className="tracker-note-delete"
                            icon={<DeleteOutlined />}
                            aria-label={t.ui.deleteNote}
                            loading={deletingId === n.id}
                            onClick={() => handleDelete(n.id)}
                          />,
                        ]
                      : []
                  }
                >
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
          ) : open ? (
            <div style={{ padding: "12px 0" }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t.ui.writeNote}
              </Text>
            </div>
          ) : (
            <div />
          )}
        </div>

        {open && (
          <div
            style={{
              marginTop: notes.length > 0 || !showEmptyState ? 12 : 0,
              paddingTop: 12,
              borderTop: notes.length > 0 ? "1px solid var(--tracker-card-border)" : "none",
              flexShrink: 0,
            }}
          >
            <Input.TextArea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t.ui.writeNote}
              autoSize={{ minRows: 3, maxRows: 8 }}
              autoFocus
            />
            <Flex justify="flex-end" gap={8} style={{ marginTop: 8 }}>
              <Button
                onClick={() => {
                  setOpen(false);
                  setValue("");
                }}
              >
                {t.ui.cancel}
              </Button>
              <Button type="primary" onClick={handleCreate} loading={saving}>
                {t.ui.save}
              </Button>
            </Flex>
          </div>
        )}
      </div>
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
      title={
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="ri-pie-chart-line" style={{ fontSize: 18 }} />
          {t.ui.overallProgress}
        </span>
      }
      style={{
        height: "100%",
        ...cardBaseStyle,
        aspectRatio: "1 / 1",
        maxHeight: "300px"
      }}
      styles={{
        ...cardHeaderStyles,
        body: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          height: "100%"
        },
      }}
    >
      <Flex vertical align="center" justify="center" gap={16} style={{ width: "100%" }}>
        <Progress
          type="circle"
          percent={percent}
          size={100}
          strokeWidth={8}
          strokeColor={{
            "0%": "var(--tracker-accent)",
            "100%": "var(--tracker-accent-strong)",
          }}
          trailColor="var(--tracker-card-border)"
          format={(percent) => (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "var(--tracker-accent-strong)",
                  lineHeight: 1
                }}
              >
                {percent}%
              </div>
            </div>
          )}
        />
        <div style={{ textAlign: "center" }}>
          <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: 14 }}>
            {done} {t.ui.of} {total}
          </Title>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {t.ui.substepsCompleted}
          </Text>
        </div>
      </Flex>
    </Card>
  );
}
