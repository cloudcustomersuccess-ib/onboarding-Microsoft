/**
 * Onboarding Steps Catalog
 * Defines the structure of all main steps and substeps with their field keys and types
 */

import { normalizeManufacturer, type ManufacturerKey } from "./manufacturer";

export type FieldType = "BOOLEAN" | "TEXT";
export type SubstepType = "BOOLEAN" | "TEXT" | "GROUP";
export type Manufacturer = "Microsoft" | "AWS" | "Google";

export interface FieldDefinition {
  fieldKey: string;
  type: FieldType;
  labelKey: string;
  placeholderKey?: string;
  required?: boolean;
}

export interface SubstepDefinition {
  key: string; // UI key (used for group substeps or same as fieldKey for simple substeps)
  fieldKey?: string; // For BOOLEAN/TEXT: the actual field in Mirror (optional for GROUP)
  labelKey: string; // i18n key
  type: SubstepType;
  instructionsKey: string; // i18n key for instructions
  fields?: FieldDefinition[]; // For GROUP: array of field definitions
  completedBy?: "USER" | "TD_SYNNEX"; // Who completes this substep (default: USER)
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
        key: "Alta_Hola_TDSynnex_",
        fieldKey: "Alta_Hola_TDSynnex_",
        labelKey: "substeps.alta_hola_tdsynnex.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_hola_tdsynnex.instructions",
        completedBy: "USER", // 1.1 - User marks as completed
      },
      {
        key: "Ecommerce_GK_",
        fieldKey: "Ecommerce_GK_",
        labelKey: "substeps.ecommerce_gk.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.ecommerce_gk.instructions",
        completedBy: "TD_SYNNEX", // 1.2 - TD SYNNEX marks as completed from backend
      },
      {
        key: "SEPA_B2B_Completado",
        fieldKey: "SEPA_B2B_Completado",
        labelKey: "substeps.sepa_b2b_completado.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.sepa_b2b_completado.instructions",
        completedBy: "USER", // 1.3 - User marks as completed
      },
      {
        key: "RMT_CT_Completado",
        fieldKey: "RMT_CT_Completado",
        labelKey: "substeps.rmt_ct_completado.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.rmt_ct_completado.instructions",
        completedBy: "TD_SYNNEX", // 1.4 - TD SYNNEX marks as completed from backend
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
        key: "Alta_PAC_MFT",
        fieldKey: "Alta_PAC_MFT",
        labelKey: "substeps.alta_pac_mft.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_pac_mft.instructions",
      },
      {
        key: "Alta_MF_Cloud_AI",
        fieldKey: "Alta_MF_Cloud_AI",
        labelKey: "substeps.alta_mf_cloud_ai.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.alta_mf_cloud_ai.instructions",
      },
      {
        key: "TD_handshake_MFT",
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
        key: "AWS Partner Account",
        fieldKey: "AWS Partner Account",
        labelKey: "substeps.aws_partner_account.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_partner_account.instructions",
      },
      {
        key: "AWS_Partner_Engagement",
        fieldKey: "AWS_Partner_Engagement",
        labelKey: "substeps.aws_partner_engagement.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_partner_engagement.instructions",
      },
      {
        key: "AWS Form",
        fieldKey: "AWS Form",
        labelKey: "substeps.aws_form.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_form.instructions",
      },
      {
        key: "AWS_DSA",
        fieldKey: "AWS_DSA",
        labelKey: "substeps.aws_dsa.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.aws_dsa.instructions",
      },
      {
        key: "AWS_Marketplace",
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
        key: "GOOGLE_CLOUD_ID",
        type: "GROUP",
        labelKey: "substeps.google_cloud_id_group.label",
        instructionsKey: "substeps.google_cloud_id_group.instructions",
        fields: [
          {
            fieldKey: "GC_ID",
            type: "TEXT",
            labelKey: "substeps.google_cloud_id_group.gc_id_label",
            placeholderKey: "substeps.google_cloud_id_group.gc_id_placeholder",
            required: true,
          },
          {
            fieldKey: "Google_Cloud_Domain",
            type: "TEXT",
            labelKey: "substeps.google_cloud_id_group.domain_label",
            placeholderKey: "substeps.google_cloud_id_group.domain_placeholder",
            required: true,
          },
        ],
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
        key: "ION_T&C_aceptados",
        fieldKey: "ION_T&C_aceptados",
        labelKey: "substeps.ion_tc_aceptados.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.ion_tc_aceptados.instructions",
        completedBy: "USER", // 3.1 - Condiciones de StreamOne® ION
      },
      {
        key: "Access_ION",
        fieldKey: "Access_ION",
        labelKey: "substeps.access_ion.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.access_ion.instructions",
        completedBy: "TD_SYNNEX", // 3.2 - Credenciales de acceso
      },
      {
        key: "Program_Request",
        fieldKey: "Program_Request",
        labelKey: "substeps.program_request.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.program_request.instructions",
        completedBy: "USER", // 3.3 - Solicitud de programas
      },
      {
        key: "Onboarding_Complete",
        fieldKey: "Onboarding_Complete",
        labelKey: "substeps.onboarding_complete.label",
        type: "BOOLEAN",
        instructionsKey: "substeps.onboarding_complete.instructions",
        completedBy: "TD_SYNNEX", // 3.4 - Autorización de programas
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
 * Check if a substep is completed based on its definition and mirror data
 */
export function isSubstepCompleted(
  substep: SubstepDefinition,
  mirror: Record<string, any>
): boolean {
  if (substep.type === "GROUP") {
    // For GROUP substeps, check if all fields are completed
    if (!substep.fields || substep.fields.length === 0) return false;
    return substep.fields.every((field) => {
      const value = mirror[field.fieldKey];
      if (field.type === "BOOLEAN") {
        return value === true || value === "true";
      } else if (field.type === "TEXT") {
        return typeof value === "string" && value.trim() !== "";
      }
      return false;
    });
  } else {
    // For BOOLEAN/TEXT substeps, check the single field
    const fieldKey = substep.fieldKey || substep.key;
    const value = mirror[fieldKey];
    if (substep.type === "BOOLEAN") {
      return value === true || value === "true";
    } else if (substep.type === "TEXT") {
      return typeof value === "string" && value.trim() !== "";
    }
  }
  return false;
}

/**
 * Check if a field is completed based on its type and value
 * @deprecated Use isSubstepCompleted instead for substep-level checks
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
