/**
 * Onboarding Steps Catalog
 *
 * SINGLE SOURCE OF TRUTH for all onboarding steps configuration.
 * This catalog defines:
 * - Step 1 substeps (common for all manufacturers)
 * - Step 2 substeps (manufacturer-specific: MICROSOFT, AWS, GOOGLE)
 * - Step 3 substeps (common for all manufacturers)
 *
 * Field keys MUST match exactly with Google Sheets column names and Mirror field names.
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

/**
 * Manufacturer keys (canonical, normalized)
 */
export type ManufacturerKey = "MICROSOFT" | "AWS" | "GOOGLE";

/**
 * Field types for substeps
 * - BOOLEAN: completed if value === true
 * - TEXT: completed if value is non-empty string
 */
export type SubstepType = "BOOLEAN" | "TEXT";

/**
 * Substep definition
 */
export interface Substep {
  /** Exact field key from Google Sheets / Mirror (case-sensitive, may contain spaces) */
  key: string;

  /** Field type: determines completion logic */
  type: SubstepType;

  /** i18n translation key for title (e.g., "substeps.alta_pac_mft.label") */
  titleKey: string;

  /** Optional i18n translation key for description/instructions */
  descriptionKey?: string;
}

// ============================================================
// STEP 1: INITIAL SETUP (COMMON)
// ============================================================

export const step1: Substep[] = [
  {
    key: "Alta_Hola_TDSynnex_",
    type: "BOOLEAN",
    titleKey: "substeps.alta_hola_tdsynnex.label",
    descriptionKey: "substeps.alta_hola_tdsynnex.instructions",
  },
  {
    key: "SEPA_B2B_Completado",
    type: "BOOLEAN",
    titleKey: "substeps.sepa_b2b_completado.label",
    descriptionKey: "substeps.sepa_b2b_completado.instructions",
  },
];

// ============================================================
// STEP 2: MANUFACTURER-SPECIFIC SETUP
// ============================================================

/**
 * Step 2 substeps by manufacturer
 *
 * IMPORTANT: Field keys MUST match Google Sheets exactly:
 * - Microsoft: "Alta_PAC_MFT", "Alta_MF_Cloud_AI", "TD_handshake_MFT"
 * - AWS: "AWS Partner Account" (with space!), "AWS_Partner_Engagement", "AWS Form", "AWS_DSA", "AWS_Marketplace"
 * - Google: "GC_ID", "Google_Cloud_Domain"
 */
export const step2ByManufacturer: Record<ManufacturerKey, Substep[]> = {
  MICROSOFT: [
    {
      key: "Alta_PAC_MFT",
      type: "BOOLEAN",
      titleKey: "substeps.alta_pac_mft.label",
      descriptionKey: "substeps.alta_pac_mft.instructions",
    },
    {
      key: "Alta_MF_Cloud_AI",
      type: "BOOLEAN",
      titleKey: "substeps.alta_mf_cloud_ai.label",
      descriptionKey: "substeps.alta_mf_cloud_ai.instructions",
    },
    {
      key: "TD_handshake_MFT",
      type: "BOOLEAN",
      titleKey: "substeps.td_handshake_mft.label",
      descriptionKey: "substeps.td_handshake_mft.instructions",
    },
  ],

  AWS: [
    {
      key: "AWS Partner Account", // NOTE: Contains space
      type: "BOOLEAN",
      titleKey: "substeps.aws_partner_account.label",
      descriptionKey: "substeps.aws_partner_account.instructions",
    },
    {
      key: "AWS_Partner_Engagement",
      type: "BOOLEAN",
      titleKey: "substeps.aws_partner_engagement.label",
      descriptionKey: "substeps.aws_partner_engagement.instructions",
    },
    {
      key: "AWS Form", // NOTE: Contains space
      type: "BOOLEAN",
      titleKey: "substeps.aws_form.label",
      descriptionKey: "substeps.aws_form.instructions",
    },
    {
      key: "AWS_DSA",
      type: "BOOLEAN",
      titleKey: "substeps.aws_dsa.label",
      descriptionKey: "substeps.aws_dsa.instructions",
    },
    {
      key: "AWS_Marketplace",
      type: "BOOLEAN",
      titleKey: "substeps.aws_marketplace.label",
      descriptionKey: "substeps.aws_marketplace.instructions",
    },
  ],

  GOOGLE: [
    {
      key: "GC_ID",
      type: "TEXT", // TEXT field: completed if non-empty
      titleKey: "substeps.gc_id.label",
      descriptionKey: "substeps.gc_id.instructions",
    },
    {
      key: "Google_Cloud_Domain",
      type: "TEXT", // TEXT field: completed if non-empty
      titleKey: "substeps.google_cloud_domain.label",
      descriptionKey: "substeps.google_cloud_domain.instructions",
    },
  ],
};

// ============================================================
// STEP 3: FINALIZATION (COMMON)
// ============================================================

export const step3: Substep[] = [
  {
    key: "ION_T&C_aceptados",
    type: "BOOLEAN",
    titleKey: "substeps.ion_tc_aceptados.label",
    descriptionKey: "substeps.ion_tc_aceptados.instructions",
  },
  {
    key: "Program_Request",
    type: "BOOLEAN",
    titleKey: "substeps.program_request.label",
    descriptionKey: "substeps.program_request.instructions",
  },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get Step 2 substeps for a given manufacturer key
 */
export function getStep2Substeps(manufacturerKey: ManufacturerKey): Substep[] {
  return step2ByManufacturer[manufacturerKey] || step2ByManufacturer.MICROSOFT;
}

/**
 * Get all substeps for a given manufacturer (Step 1 + Step 2 + Step 3)
 */
export function getAllSubsteps(manufacturerKey: ManufacturerKey): Substep[] {
  return [...step1, ...getStep2Substeps(manufacturerKey), ...step3];
}

/**
 * Check if a field is completed based on its type and value
 *
 * Completion logic:
 * - BOOLEAN: value === true (or truthy normalized: "true", 1, etc.)
 * - TEXT: non-empty string after trim
 */
export function isSubstepCompleted(substep: Substep, value: unknown): boolean {
  if (substep.type === "BOOLEAN") {
    // Normalize boolean values
    if (value === true || value === "true" || value === 1 || value === "1") {
      return true;
    }
    return false;
  }

  if (substep.type === "TEXT") {
    // Check if non-empty string
    if (typeof value === "string" && value.trim().length > 0) {
      return true;
    }
    return false;
  }

  return false;
}

/**
 * Get completion date for a substep
 * Tries: {fieldKey}__CompletedAt, then {fieldKey}__UpdatedAt, then null
 */
export function getSubstepCompletionDate(
  substep: Substep,
  mirror: Record<string, any>
): string | null {
  const completedAtKey = `${substep.key}__CompletedAt`;
  const updatedAtKey = `${substep.key}__UpdatedAt`;

  if (mirror[completedAtKey]) {
    return String(mirror[completedAtKey]);
  }

  if (mirror[updatedAtKey]) {
    return String(mirror[updatedAtKey]);
  }

  return null;
}
