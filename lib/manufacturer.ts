/**
 * Manufacturer normalization utilities
 *
 * The backend (Apps Script) can return various manufacturer strings including:
 * - Single values: "Microsoft", "AWS", "Google"
 * - Variants: "Microsoft CSP", "MS", "MFT", "Amazon", "Amazon Web Services", "Google Cloud"
 * - Lists: "Microsoft, AWS", "Google, Microsoft"
 *
 * This module normalizes these to canonical keys: "MICROSOFT" | "AWS" | "GOOGLE"
 */

export type ManufacturerKey = "MICROSOFT" | "AWS" | "GOOGLE";

/**
 * Normalize raw manufacturer string from backend to canonical key
 *
 * Rules:
 * 1. Case-insensitive matching
 * 2. Handles comma-separated lists with priority: MICROSOFT > AWS > GOOGLE
 * 3. Matches common variants (CSP, MFT, Amazon Web Services, etc.)
 * 4. Falls back to MICROSOFT if unknown (with console warning)
 */
export function normalizeManufacturer(raw: unknown): ManufacturerKey {
  if (!raw) {
    console.warn("[normalizeManufacturer] No manufacturer provided, defaulting to MICROSOFT");
    return "MICROSOFT";
  }

  const rawStr = String(raw).trim();

  if (!rawStr) {
    console.warn("[normalizeManufacturer] Empty manufacturer string, defaulting to MICROSOFT");
    return "MICROSOFT";
  }

  // Handle comma-separated lists: apply priority MICROSOFT > AWS > GOOGLE
  if (rawStr.includes(",")) {
    const parts = rawStr.split(",").map(s => s.trim().toLowerCase());

    // Check for Microsoft variants first (highest priority)
    if (parts.some(p =>
      p.includes("microsoft") ||
      p.includes("ms") ||
      p.includes("mft") ||
      p.includes("csp")
    )) {
      return "MICROSOFT";
    }

    // Check for AWS variants (second priority)
    if (parts.some(p =>
      p.includes("aws") ||
      p.includes("amazon")
    )) {
      return "AWS";
    }

    // Check for Google variants (third priority)
    if (parts.some(p =>
      p.includes("google") ||
      p.includes("gcp") ||
      p.includes("gc")
    )) {
      return "GOOGLE";
    }

    console.warn(`[normalizeManufacturer] Could not parse list "${rawStr}", defaulting to MICROSOFT`);
    return "MICROSOFT";
  }

  // Single value: normalize to canonical key
  const lower = rawStr.toLowerCase();

  // Microsoft variants
  if (
    lower.includes("microsoft") ||
    lower === "ms" ||
    lower === "mft" ||
    lower.includes("csp")
  ) {
    return "MICROSOFT";
  }

  // AWS variants
  if (
    lower.includes("aws") ||
    lower.includes("amazon")
  ) {
    return "AWS";
  }

  // Google variants
  if (
    lower.includes("google") ||
    lower === "gcp" ||
    lower === "gc"
  ) {
    return "GOOGLE";
  }

  // Unknown: fallback to MICROSOFT with warning
  console.warn(
    `[normalizeManufacturer] Unknown manufacturer "${rawStr}", defaulting to MICROSOFT. ` +
    `Please update normalization logic if this is a valid manufacturer.`
  );
  return "MICROSOFT";
}

/**
 * Get display name for manufacturer key
 * Used for debugging and logging
 */
export function getManufacturerDisplayName(key: ManufacturerKey): string {
  const displayNames: Record<ManufacturerKey, string> = {
    MICROSOFT: "Microsoft",
    AWS: "AWS",
    GOOGLE: "Google",
  };
  return displayNames[key];
}

/**
 * Check if a raw manufacturer string is valid
 * Returns true if it can be normalized without falling back to default
 */
export function isValidManufacturer(raw: unknown): boolean {
  if (!raw) return false;

  const rawStr = String(raw).trim().toLowerCase();
  if (!rawStr) return false;

  // Check if matches any known variant
  const knownPatterns = [
    "microsoft", "ms", "mft", "csp",
    "aws", "amazon",
    "google", "gcp", "gc"
  ];

  return knownPatterns.some(pattern => rawStr.includes(pattern));
}
