import "./theme-augmentation";
import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

/**
 * MUI theme using the central color scheme.
 * Fence-inspired: light background, blue accent, dark grey text.
 */
export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
      dark: colors.success.dark,
      contrastText: colors.success.contrastText,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
      contrastText: colors.error.contrastText,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
      dark: colors.warning.dark,
      contrastText: colors.warning.contrastText,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
      contrastText: colors.info.contrastText,
    },
    divider: colors.divider,
  },
  typography: {
    fontFamily: '"Geist", "Inter", system-ui, sans-serif',
    // Page title (responsive)
    h1: {
      fontSize: "2rem",
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: colors.text.primary,
      "@media (min-width:600px)": { fontSize: "2.5rem" },
      "@media (min-width:900px)": { fontSize: "3rem" },
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    h3: {
      fontSize: "1.25rem",
      fontWeight: 600,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
      color: colors.text.secondary,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
      color: colors.text.hint,
    },
    // Section labels (e.g. "TOTAL EXPOSURE & OVERVIEW")
    overline: {
      fontSize: "0.875rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "uppercase" as const,
      color: colors.text.hint,
    },
    // Hero / stat numbers (2rem)
    heroValue: {
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
      color: colors.text.primary,
    },
    // Facility card title
    cardTitle: {
      fontSize: "1.125rem",
      fontWeight: 700,
      lineHeight: 1.4,
      color: colors.text.primary,
    },
    // Covenant numbers (computed rate, threshold)
    valueLarge: {
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      color: colors.text.primary,
    },
    // Bold body2 (rate %, exposure, etc.)
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 600,
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: colors.shadow.sm,
          "&.Mui-selected": {
            boxShadow: `0 0 0 2px ${colors.primary.main}`,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
  },
});
