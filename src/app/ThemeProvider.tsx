"use client";

import { useState, useEffect } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "@/theme/theme";
import { colors } from "@/theme/colors";

/**
 * Renders a static placeholder until mount, then the MUI tree. This keeps
 * server and client HTML identical (no Emotion/MUI on server), avoiding
 * hydration mismatches (e.g. with Turbopack).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: colors.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ color: colors.text.secondary, fontSize: "1rem" }}>Loading…</span>
      </div>
    );
  }

  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
