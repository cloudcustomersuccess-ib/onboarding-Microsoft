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
  isSubstepCompleted,
  type MainStepDefinition,
  type SubstepDefinition,
} from "@/lib/onboardingSteps";
import { normalizeManufacturer, isValidManufacturer, type ManufacturerKey } from "@/lib/manufacturer";
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
import { UserInfoCard } from "@/components/UserInfoCard/UserInfoCard";

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
  const fetchDetail = React.useCallback(async () => {
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
  }, [clienteId, router, t.ui.loadingError]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // Get effective steps based on manufacturer
  const effectiveSteps: MainStepDefinition[] = useMemo(() => {
    return getEffectiveSteps(onboarding?.Manufacturer);
  }, [onboarding]);

  const allSubsteps: SubstepDefinition[] = useMemo(() => {
    return getAllSubsteps(onboarding?.Manufacturer);
  }, [onboarding]);

  // Calculate step completion
  const getStepCompletion = React.useCallback((step: MainStepDefinition): number => {
    if (!mirror) return 0;
    const totalSubs = step.substeps.length;
    if (totalSubs === 0) return 100;

    const completedSubs = step.substeps.filter((sub) =>
      isSubstepCompleted(sub, mirror)
    ).length;

    return Math.round((completedSubs / totalSubs) * 100);
  }, [mirror]);

  const getStepStatus = React.useCallback((percent: number): string => {
    if (percent === 0) return t.status.notStarted;
    if (percent === 100) return t.status.completed;
    return t.status.pending;
  }, [t.status]);

  // Check if Step 3 is locked
  const isStep3Locked = useMemo(() => {
    if (effectiveSteps.length < 3) return false;
    const step1Percent = getStepCompletion(effectiveSteps[0]);
    const step2Percent = getStepCompletion(effectiveSteps[1]);
    return step1Percent < 100 || step2Percent < 100;
  }, [effectiveSteps, getStepCompletion]);

  // Get manufacturer key for dynamic Step 2 title
  const manufacturerKey: ManufacturerKey = useMemo(() => {
    return normalizeManufacturer(onboarding?.Manufacturer);
  }, [onboarding]);

  // Build main steps UI
  const mainStepsUI: MainStepUI[] = useMemo(() => {
    return effectiveSteps.map((step, idx) => {
      const percent = getStepCompletion(step);
      const statusText = getStepStatus(percent);
      const locked = idx === 2 && isStep3Locked;

      // Use manufacturer-specific title for Step 2
      let title = getTranslation(lang, step.labelKey);
      if (idx === 1 && step.key.startsWith("step2_")) {
        const manufacturerTitleKey = manufacturerKey.toLowerCase();
        if (manufacturerTitleKey === "microsoft") {
          title = t.steps.step2.microsoft;
        } else if (manufacturerTitleKey === "aws") {
          title = t.steps.step2.aws;
        } else if (manufacturerTitleKey === "google") {
          title = t.steps.step2.google;
        }
      }

      return {
        key: step.key,
        title,
        statusText,
        percent,
        locked,
      };
    });
  }, [effectiveSteps, isStep3Locked, lang, t, manufacturerKey, getStepCompletion, getStepStatus]);

  // Get current main step
  const currentMainStep = effectiveSteps[currentMainStepIndex];

  // Build substeps UI for current main step
  const substepsUI: SubstepUI[] = useMemo(() => {
    if (!currentMainStep || !mirror) return [];

    return currentMainStep.substeps.map((sub, idx) => {
      const done = isSubstepCompleted(sub, mirror);

      // Gating: disable if previous substep is not done
      let disabled = false;
      if (idx > 0) {
        const prevSub = currentMainStep.substeps[idx - 1];
        const prevDone = isSubstepCompleted(prevSub, mirror);
        disabled = !prevDone;
      }

      // Get completed date if available
      // For GROUP substeps, use the first field's CompletedAt
      let completedAtKey: string;
      if (sub.type === "GROUP" && sub.fields && sub.fields.length > 0) {
        completedAtKey = `${sub.fields[0].fieldKey}__CompletedAt`;
      } else {
        completedAtKey = `${sub.fieldKey || sub.key}__CompletedAt`;
      }
      const completedAt = mirror[completedAtKey] ? String(mirror[completedAtKey]) : undefined;

      return {
        key: sub.key,
        title: getTranslation(lang, sub.labelKey),
        disabled,
        done,
        completedAt,
      };
    });
  }, [currentMainStep, mirror, lang]);

  // Auto-select first incomplete substep when main step changes
  useEffect(() => {
    if (substepsUI.length === 0) return;
    const firstIncomplete = substepsUI.findIndex((s) => !s.done);
    setCurrentSubstepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMainStepIndex]);

  // Current substep
  const currentSubstep: SubstepDefinition | undefined =
    currentMainStep?.substeps[currentSubstepIndex];

  const currentSubstepCompleted = useMemo(() => {
    if (!currentSubstep || !mirror) return false;
    return isSubstepCompleted(currentSubstep, mirror);
  }, [currentSubstep, mirror]);

  // Overall progress
  const overallProgress = useMemo(() => {
    const total = allSubsteps.length;
    if (total === 0) return { percent: 100, done: 0, total: 0 };

    const done = allSubsteps.filter((sub) =>
      mirror ? isSubstepCompleted(sub, mirror) : false
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

    // GROUP substeps handle their own saving logic
    if (currentSubstep.type === "GROUP") {
      message.info("Este subpaso se guarda mediante el formulario interno");
      return;
    }

    const fieldKey = currentSubstep.fieldKey || currentSubstep.key;
    setUpdatingField(fieldKey);

    try {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      const value = currentSubstep.type === "BOOLEAN" ? true : "COMPLETED";
      await updateField(token, clienteId, fieldKey, value);
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

    const substepKey = currentSubstep.fieldKey || currentSubstep.key;
    await addNote(token, clienteId, {
      scopeType: "SUBSTEP",
      substepKey: substepKey,
      visibility: "PUBLIC",
      body,
    });

    await fetchDetail();
  };

  const handleSupport = () => {
    window.open("mailto:customersuccess.es@tdsynnex.com", "_self");
  };

  // Show warning if manufacturer is invalid/unknown (must be before early returns)
  const showManufacturerWarning = useMemo(() => {
    return onboarding?.Manufacturer && !isValidManufacturer(onboarding.Manufacturer);
  }, [onboarding]);

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
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {showManufacturerWarning && (
        <Alert
          message="Manufacturer desconocido"
          description={`El fabricante "${onboarding?.Manufacturer}" no es reconocido. Se está usando Microsoft por defecto.`}
          type="warning"
          showIcon
          closable
          style={{ marginBottom: 16 }}
        />
      )}
      <Row gutter={[16, 16]}>
        {/* Left Column: Combined tracker card */}
        <Col xs={24} xl={16}>
          {currentSubstep && (
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
              noteContextKey={currentSubstep.fieldKey || currentSubstep.key}
              onSaveNote={handleAddSubstepNote}
              onMarkComplete={handleMarkComplete}
              onSupport={handleSupport}
              canComplete={!currentSubstepCompleted && currentSubstep.type !== "GROUP"}
              t={t}
              substepKey={currentSubstep.key}
              manufacturer={onboarding?.Manufacturer}
              completedAt={substepsUI[currentSubstepIndex]?.completedAt}
              clienteId={clienteId}
              token={getToken() || undefined}
              organizationName={onboarding?.PartnerName}
              onFieldUpdated={fetchDetail}
              mirror={mirror || undefined}
              currentSubstep={currentSubstep}
            />
          )}
        </Col>

        {/* Right Column: Progress/User Info + Notes */}
        <Col xs={24} xl={8}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <OverallProgressCard
                  percent={overallProgress.percent}
                  done={overallProgress.done}
                  total={overallProgress.total}
                  t={t}
                />
              </Col>
              <Col xs={24} lg={12}>
                <UserInfoCard
                  name="Laura Gómez"
                  jobTitle="Customer Success Manager"
                  email="customersuccess.es@tdsynnex.com"
                  phone="+34 900 123 456"
                  secondaryEmail="support@tdsynnex.com"
                />
              </Col>
            </Row>
            <div>
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
