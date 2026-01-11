"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Alert, Button, Spin, message } from "antd";
import { useRouter } from "next/navigation";
import { getOnboardingDetail, updateField, addNote, deleteNote } from "@/lib/api";
import { getToken, getUser } from "@/lib/session";
import type { Onboarding, Mirror, Note } from "@/types";
import {
  getEffectiveSteps,
  getAllSubsteps,
  isFieldCompleted,
  type MainStepDefinition,
  type SubstepDefinition,
} from "@/lib/onboardingSteps";
import { useTrackerTranslations, getTranslation } from "@/lib/i18n/trackerTranslations";
import type { Language } from "@/lib/i18n/trackerTranslations";
import {
  CombinedTrackerCard,
  NotesCard,
  OverallProgressCard,
  type MainStepUI,
  type SubstepUI,
  type NoteUI,
} from "./TrackerCards";
import { AgentCard } from "@/components/AgentCard/AgentCard";

interface OnboardingTrackerContentProps {
  clienteId: string;
}

export default function OnboardingTrackerContent({
  clienteId,
}: OnboardingTrackerContentProps) {
  const router = useRouter();
  // State
  const [onboarding, setOnboarding] = useState<Onboarding | null>(null);
  const [mirror, setMirror] = useState<Mirror | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingField, setUpdatingField] = useState<string | null>(null);

  // Step/substep navigation
  const [currentMainStepIndex, setCurrentMainStepIndex] = useState(0);
  const [currentSubstepIndex, setCurrentSubstepIndex] = useState(0);

  // i18n
  const lang: Language =
    typeof window !== "undefined"
      ? ((localStorage.getItem("language") as Language) || "es")
      : "es";
  const t = useTrackerTranslations(lang);
  const currentUserId = getUser()?.UserId || "";

  // Fetch data
  const fetchDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await getOnboardingDetail(token, clienteId);
      setOnboarding(response.onboarding);
      setMirror(response.mirror);
      setNotes(response.notes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.ui.loadingError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [clienteId]);

  // Get effective steps based on manufacturer
  const effectiveSteps: MainStepDefinition[] = useMemo(() => {
    return getEffectiveSteps(onboarding?.Manufacturer);
  }, [onboarding]);

  const allSubsteps: SubstepDefinition[] = useMemo(() => {
    return getAllSubsteps(onboarding?.Manufacturer);
  }, [onboarding]);

  // Calculate step completion
  const getStepCompletion = (step: MainStepDefinition): number => {
    if (!mirror) return 0;
    const totalSubs = step.substeps.length;
    if (totalSubs === 0) return 100;

    const completedSubs = step.substeps.filter((sub) =>
      isFieldCompleted(sub.fieldKey, mirror[sub.fieldKey], sub.type)
    ).length;

    return Math.round((completedSubs / totalSubs) * 100);
  };

  const getStepStatus = (percent: number): string => {
    if (percent === 0) return t.status.notStarted;
    if (percent === 100) return t.status.completed;
    return t.status.pending;
  };

  // Check if Step 3 is locked
  const isStep3Locked = useMemo(() => {
    if (effectiveSteps.length < 3) return false;
    const step1Percent = getStepCompletion(effectiveSteps[0]);
    const step2Percent = getStepCompletion(effectiveSteps[1]);
    return step1Percent < 100 || step2Percent < 100;
  }, [effectiveSteps, mirror]);

  // Build main steps UI
  const mainStepsUI: MainStepUI[] = useMemo(() => {
    return effectiveSteps.map((step, idx) => {
      const percent = getStepCompletion(step);
      const statusText = getStepStatus(percent);
      const locked = idx === 2 && isStep3Locked;

      return {
        key: step.key,
        title: getTranslation(lang, step.labelKey),
        statusText,
        percent,
        locked,
      };
    });
  }, [effectiveSteps, mirror, isStep3Locked, lang, t]);

  // Get current main step
  const currentMainStep = effectiveSteps[currentMainStepIndex];

  // Build substeps UI for current main step
  const substepsUI: SubstepUI[] = useMemo(() => {
    if (!currentMainStep || !mirror) return [];

    return currentMainStep.substeps.map((sub, idx) => {
      const done = isFieldCompleted(sub.fieldKey, mirror[sub.fieldKey], sub.type);

      // Gating: disable if previous substep is not done
      let disabled = false;
      if (idx > 0) {
        const prevSub = currentMainStep.substeps[idx - 1];
        const prevDone = isFieldCompleted(
          prevSub.fieldKey,
          mirror[prevSub.fieldKey],
          prevSub.type
        );
        disabled = !prevDone;
      }

      return {
        key: sub.fieldKey,
        title: getTranslation(lang, sub.labelKey),
        disabled,
        done,
      };
    });
  }, [currentMainStep, mirror, lang]);

  // Auto-select first incomplete substep when main step changes
  useEffect(() => {
    if (substepsUI.length === 0) return;
    const firstIncomplete = substepsUI.findIndex((s) => !s.done);
    setCurrentSubstepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
  }, [currentMainStepIndex, substepsUI.length]);

  // Current substep
  const currentSubstep: SubstepDefinition | undefined =
    currentMainStep?.substeps[currentSubstepIndex];

  const currentSubstepCompleted = useMemo(() => {
    if (!currentSubstep || !mirror) return false;
    return isFieldCompleted(
      currentSubstep.fieldKey,
      mirror[currentSubstep.fieldKey],
      currentSubstep.type
    );
  }, [currentSubstep, mirror]);

  // Overall progress
  const overallProgress = useMemo(() => {
    const total = allSubsteps.length;
    if (total === 0) return { percent: 100, done: 0, total: 0 };

    const done = allSubsteps.filter((sub) =>
      isFieldCompleted(sub.fieldKey, mirror?.[sub.fieldKey], sub.type)
    ).length;

    const percent = Math.round((done / total) * 100);
    return { percent, done, total };
  }, [allSubsteps, mirror]);

  // Notes UI
  const generalNotes: NoteUI[] = useMemo(() => {
    return notes
      .filter((n) => n.ScopeType === "GENERAL")
      .map((n) => ({
        id: n.NoteId || "",
        author: n.AuthorUserId || "Unknown",
        date: n.CreatedAt || "",
        body: n.Body,
      }));
  }, [notes]);

  // Handlers
  const handleMarkComplete = async () => {
    if (!currentSubstep || currentSubstepCompleted) return;

    setUpdatingField(currentSubstep.fieldKey);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const value = currentSubstep.type === "BOOLEAN" ? true : "COMPLETED";
      await updateField(token, clienteId, currentSubstep.fieldKey, value);
      message.success(t.ui.fieldUpdated);

      await fetchDetail();
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : t.ui.fieldUpdateError
      );
    } finally {
      setUpdatingField(null);
    }
  };

  const handleAddGeneralNote = async (body: string) => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      throw new Error("Missing token");
    }

    await addNote(token, clienteId, {
      scopeType: "GENERAL",
      visibility: "PUBLIC",
      body,
    });

    await fetchDetail();
  };

  const handleDeleteNote = async (noteId: string) => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      throw new Error("Missing token");
    }

    await deleteNote(token, clienteId, noteId);
    await fetchDetail();
  };

  const handleAddSubstepNote = async (body: string) => {
    if (!currentSubstep) return;
    const token = getToken();
    if (!token) {
      router.push("/login");
      throw new Error("Missing token");
    }

    await addNote(token, clienteId, {
      scopeType: "SUBSTEP",
      substepKey: currentSubstep.fieldKey,
      visibility: "PUBLIC",
      body,
    });

    await fetchDetail();
  };

  const handleSupport = () => {
    window.open("mailto:customersuccess.es@tdsynnex.com", "_self");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message={t.ui.loadingError}
        description={error}
        type="error"
        showIcon
        action={
          <Button size="small" onClick={fetchDetail}>
            {t.ui.retry}
          </Button>
        }
      />
    );
  }

  if (!onboarding) {
    return (
      <Alert
        message="Not Found"
        description="Onboarding not found"
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div style={{ height: "calc(100vh - 168px)", overflow: "hidden" }}>
      <Row gutter={[16, 16]} style={{ height: "100%" }}>
        {/* Left Column: Combined tracker card + Progress/Agent */}
        <Col xs={24} xl={16} style={{ height: "100%", overflow: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            {/* Combined tracker card */}
            {currentSubstep && (
              <div style={{ minHeight: 0, flex: 1 }}>
                <CombinedTrackerCard
                  currentStepIndex={currentMainStepIndex}
                  stepsUI={mainStepsUI}
                  onSelectStep={(idx) => {
                    if (!mainStepsUI[idx]?.locked) {
                      setCurrentMainStepIndex(idx);
                    }
                  }}
                  currentSubIndex={currentSubstepIndex}
                  substeps={substepsUI}
                  onChangeSubstep={(idx) => {
                    if (!substepsUI[idx]?.disabled) {
                      setCurrentSubstepIndex(idx);
                    }
                  }}
                  title={getTranslation(lang, currentSubstep.labelKey)}
                  description={getTranslation(lang, currentSubstep.instructionsKey)}
                  loading={!!updatingField}
                  noteContextKey={currentSubstep.fieldKey}
                  onSaveNote={handleAddSubstepNote}
                  onMarkComplete={handleMarkComplete}
                  onSupport={handleSupport}
                  canComplete={!currentSubstepCompleted}
                  t={t}
                />
              </div>
            )}
          </div>
        </Col>

        {/* Right Column: Progress/Agent + Notes */}
        <Col xs={24} xl={8} style={{ height: "100%", overflow: "auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              height: "100%",
            }}
          >
            <Row gutter={[16, 16]} style={{ flexShrink: 0 }}>
              <Col xs={24} lg={12}>
                <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
                  <OverallProgressCard
                    percent={overallProgress.percent}
                    done={overallProgress.done}
                    total={overallProgress.total}
                    t={t}
                  />
                </div>
              </Col>
              <Col xs={24} lg={12}>
                <div style={{ width: "100%", aspectRatio: "1 / 1" }}>
                  <AgentCard
                    name="Laura Gómez"
                    role="Customer Success Manager"
                    about={
                      lang === "es"
                        ? "Tu punto de contacto para completar el alta y resolver bloqueos."
                        : lang === "en"
                        ? "Your contact point to complete onboarding and resolve issues."
                        : "Seu ponto de contacto para concluir a integração e resolver problemas."
                    }
                    email="customersuccess.es@tdsynnex.com"
                  />
                </div>
              </Col>
            </Row>
            <div style={{ minHeight: 0, flex: 1 }}>
              <NotesCard
                notes={generalNotes}
                currentUserId={currentUserId}
                onCreate={handleAddGeneralNote}
                onDelete={handleDeleteNote}
                t={t}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
