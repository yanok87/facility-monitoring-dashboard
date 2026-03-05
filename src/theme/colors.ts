/**
 * Central color scheme for the app (Fence-inspired).
 * Use these tokens in the MUI theme and components for consistency.
 */
export const colors = {
  // Primary — blue accent (CTAs, links, selected state)
  primary: {
    main: "#0066FF",
    light: "#3385FF",
    dark: "#0052CC",
    contrastText: "#FFFFFF",
  },

  // Secondary — optional accent (e.g. secondary buttons)
  secondary: {
    main: "#64748B",
    light: "#94A3B8",
    dark: "#475569",
    contrastText: "#FFFFFF",
  },

  // Backgrounds
  background: {
    default: "#F8FAFC",
    paper: "#FFFFFF",
    subtle: "#F1F5F9",
  },

  // Text
  text: {
    primary: "#1A1A1A",
    secondary: "#4A5568",
    disabled: "#94A3B8",
    hint: "#718096",
  },

  // Status
  success: {
    main: "#059669",
    light: "#34D399",
    dark: "#047857",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#DC2626",
    light: "#F87171",
    dark: "#B91C1C",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#D97706",
    light: "#FBBF24",
    dark: "#B45309",
    contrastText: "#FFFFFF",
  },
  info: {
    main: "#0EA5E9",
    light: "#38BDF8",
    dark: "#0284C7",
    contrastText: "#FFFFFF",
  },

  // UI
  divider: "#E2E8F0",
  border: "#E2E8F0",
  borderLight: "#F1F5F9",

  // Cards (Fence deployment style)
  card: {
    /** Default card background (pastel blue) */
    pastel: "#E0F2FF",
    /** Hover background when card is not selected */
    pastelHover: "#BAE6FD",
    /** Highlighted / selected card (vibrant blue) */
    highlight: "#007BFF",
    /** Icon container outline */
    iconOutline: "#E2E8F0",
    /** Colors when card is selected (on highlight background) */
    selected: {
      text: "#FFFFFF",
      textSecondary: "rgba(255,255,255,0.9)",
      textMuted: "rgba(255,255,255,0.85)",
      chipBg: "rgba(255,255,255,0.25)",
      chipLabel: "#FFFFFF",
    },
  },

  // Tables (Fence comparison style)
  table: {
    /** Header row background */
    headerBg: "#F8F9FA",
    /** Zebra-stripe alternating row / excluded (other status) */
    rowAlt: "#F1F3F5",
    /** Horizontal row border (subtle) */
    rowBorder: "#E9ECEF",
    /** Negative / excluded indicator (red x) */
    negative: "#DC3545",
    /** Positive / included (blue checkmark) */
    positive: "#007BFF",
    /** Legend swatches: active, excluded, past due */
    legend: {
      active: "#FFFFFF",
      activeBorder: "#4A5568",
      excluded: "#94A3B8",
      excludedBorder: "#475569",
      pastDue: "#E8B4B8",
      pastDueBorder: "#9B6B6E",
    },
  },

  // Excluded row (portfolio table)
  excludedRow: "rgba(220, 38, 38, 0.08)",

  // Shadows (single source of truth for box-shadow values)
  shadow: {
    /** Default card/panel shadow */
    sm: "0 1px 3px rgba(0,0,0,0.06)",
    /** Card hover / elevated shadow */
    cardHover: "0 2px 8px rgba(0,0,0,0.06)",
  },
} as const;

export type ColorScheme = typeof colors;
