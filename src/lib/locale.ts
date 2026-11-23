import en from "@/locales/en.json";

/**
 * RTL-ready rule: all user-facing copy lives in /locales/en.json, never
 * hard-coded in components. Swap this module for a locale-aware loader
 * when Arabic content lands in V1.
 */
export const t = en;
