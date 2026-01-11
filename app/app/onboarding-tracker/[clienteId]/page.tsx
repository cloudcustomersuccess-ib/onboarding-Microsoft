"use client";

import { use } from "react";
import OnboardingTrackerContent from "@/components/OnboardingTracker/OnboardingTrackerContent";

export default function OnboardingDetailPage({
  params,
}: {
  params: Promise<{ clienteId: string }>;
}) {
  const resolvedParams = use(params);
  const clienteId = resolvedParams.clienteId;

  return <OnboardingTrackerContent clienteId={clienteId} />;
}
