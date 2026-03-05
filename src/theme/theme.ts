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
    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: "-0.02em",
      color: colors.text.primary,
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
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
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
