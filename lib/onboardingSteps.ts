/**
 * Onboarding Steps Catalog
 * Defines the structure of all main steps and substeps with their field keys and types
 */

import { normalizeManufacturer, type ManufacturerKey } from "./manufacturer";

export type FieldType = "BOOLEAN" | "TEXT";
export type Manufacturer = "Microsoft" | "AWS" | "Google";

export interface SubstepDefinition {
  fieldKey: string;
  labelKey: string; // i18n key
  type: FieldType;
  instructionsKey: string; // i18n key for instructions
}

export interface MainStepDefinition {
  key: string;
  labelKey: string; // i18n key
  substeps: SubstepDefinition[];
  manufacturer?: Manufacturer; // if step is manufacturer-specific
}

/**
 * All main steps in the onboarding process
 */
export const MAIN_STEPS: MainStepDefinition[] = [
  // ===========================
  // STEP 1: Initial Setup
  // ===========================
  {
    key: "step1",
    labelKey: "steps.step1.title",
    substeps: [
      {
        fieldKey: "Alta_Hola_TDSynnex_",
        labelKey: "substeps.alta_hola_tdsynnex.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_hola_tdsynnex.instructions",
      },
      {
        fieldKey: "SEPA_B2B_Completado",
        labelKey: "substeps.sepa_b2b_completado.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.sepa_b2b_completado.instructions",
      },
    ],
  },

  // ===========================
  // STEP 2: Manufacturer-Specific Setup
  // ===========================
  {
    key: "step2_microsoft",
    labelKey: "steps.step2.title",
    manufacturer: "Microsoft",
    substeps: [
      {
        fieldKey: "Alta_PAC_MFT",
        labelKey: "substeps.alta_pac_mft.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_pac_mft.instructions",
      },
      {
        fieldKey: "Alta_MF_Cloud_AI",
        labelKey: "substeps.alta_mf_cloud_ai.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_mf_cloud_ai.instructions",
      },
      {
        fieldKey: "TD_handshake_MFT",
        labelKey: "substeps.td_handshake_mft.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.td_handshake_mft.instructions",
      },
    ],
  },

  {
    key: "step2_aws",
    labelKey: "steps.step2.title",
    manufacturer: "AWS",
    substeps: [
      {
        fieldKey: "AWS Partner Account",
        labelKey: "substeps.aws_partner_account.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_partner_account.instructions",
      },
      {
        fieldKey: "AWS_Partner_Engagement",
        labelKey: "substeps.aws_partner_engagement.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_partner_engagement.instructions",
      },
      {
        fieldKey: "AWS Form",
        labelKey: "substeps.aws_form.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_form.instructions",
      },
      {
        fieldKey: "AWS_DSA",
        labelKey: "substeps.aws_dsa.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_dsa.instructions",
      },
      {
        fieldKey: "AWS_Marketplace",
        labelKey: "substeps.aws_marketplace.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_marketplace.instructions",
      },
    ],
  },

  {
    key: "step2_google",
    labelKey: "steps.step2.title",
    manufacturer: "Google",
    substeps: [
      {
        fieldKey: "GC_ID",
        labelKey: "substeps.gc_id.label",
        type: "TEXT",
        instructionsKey: "substeps.gc_id.instructions",
      },
      {
        fieldKey: "Google_Cloud_Domain",
        labelKey: "substeps.google_cloud_domain.label",
        type: "TEXT",
        instructionsKey: "substeps.google_cloud_domain.instructions",
      },
    ],
  },

  // ===========================
  // STEP 3: Final Steps (LOCKED until Step 1 & 2 complete)
  // ===========================
  {
    key: "step3",
    labelKey: "steps.step3.title",
    substeps: [
      {
        fieldKey: "ION_T&C_aceptados",
        labelKey: "substeps.ion_tc_aceptados.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.ion_tc_aceptados.instructions",
      },
      {
        fieldKey: "Program_Request",
        labelKey: "substeps.program_request.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.program_request.instructions",
      },
    ],
  },
];

/**
 * Get the appropriate Step 2 based on manufacturer
 * Uses robust normalization to handle various manufacturer string formats
 */
export function getStep2ForManufacturer(
  manufacturer?: string
): MainStepDefinition | null {
  // Normalize raw manufacturer string to canonical key
  const manufacturerKey: ManufacturerKey = normalizeManufacturer(manufacturer);

  // Map canonical key to step definition
  const stepKeyMap: Record<ManufacturerKey, string> = {
    MICROSOFT: "step2_microsoft",
    AWS: "step2_aws",
    GOOGLE: "step2_google",
  };

  const stepKey = stepKeyMap[manufacturerKey];
  return MAIN_STEPS.find((s) => s.key === stepKey) || null;
}

/**
 * Get effective steps for a given manufacturer (Step 1 + appropriate Step 2 + Step 3)
 */
export function getEffectiveSteps(manufacturer?: string): MainStepDefinition[] {
  const step1 = MAIN_STEPS.find((s) => s.key === "step1");
  const step2 = getStep2ForManufacturer(manufacturer);
  const step3 = MAIN_STEPS.find((s) => s.key === "step3");

  const steps: MainStepDefinition[] = [];
  if (step1) steps.push(step1);
  if (step2) steps.push(step2);
  if (step3) steps.push(step3);

  return steps;
}

/**
 * Get all substeps across all effective steps
 */
export function getAllSubsteps(
  manufacturer?: string
): SubstepDefinition[] {
  return getEffectiveSteps(manufacturer).flatMap((step) => step.substeps);
}

/**
 * Check if a field is completed based on its type and value
 */
export function isFieldCompleted(
  fieldKey: string,
  value: any,
  fieldType: FieldType
): boolean {
  if (fieldType === "BOOLEAN") {
    return value === true || value === "true";
  } else if (fieldType === "TEXT") {
    return typeof value === "string" && value.trim() !== "";
  }
  return false;
}
