"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { NormalizedOverview } from "@/domain/types";

function formatMoney(currency: string, value: number): string {
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(1)}k`;
  return `${currency} ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

interface HeroExposureProps {
  overview: NormalizedOverview;
}

export function HeroExposure({ overview }: HeroExposureProps) {
  const currencies = Object.entries(overview.totalExposureByCurrency).filter(
    ([_, v]) => v > 0
  );
  const compliant = overview.facilities.filter((f) => f.covenantStatus === "COMPLIANT").length;
  const inBreach = overview.facilities.filter((f) => f.covenantStatus === "BREACH").length;

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 3,
        justifyContent: "center",
        alignItems: "flex-start",
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      {currencies.map(([currency, value]) => (
        <Box key={currency} sx={{ textAlign: "center", minWidth: 140 }}>
          <Typography
            component="div"
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {formatMoney(currency, value)}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            TOTAL {currency}
          </Typography>
        </Box>
      ))}
      <Box sx={{ textAlign: "center", minWidth: 140 }}>
        <Typography
          component="div"
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {overview.facilities.length}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
          FACILITIES
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", minWidth: 140 }}>
        <Typography
          component="div"
          sx={{
            fontSize: "2rem",
            fontWeight: 700,
            color: compliant > 0 ? "success.main" : "text.primary",
            lineHeight: 1.2,
          }}
        >
          {compliant} / {overview.facilities.length}
        </Typography>
        <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
          COMPLIANT
        </Typography>
      </Box>
      {inBreach > 0 && (
        <Box sx={{ textAlign: "center", minWidth: 140 }}>
          <Typography
            component="div"
            sx={{
              fontSize: "2rem",
              fontWeight: 700,
              color: "error.main",
              lineHeight: 1.2,
            }}
          >
            {inBreach}
          </Typography>
          <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
            IN BREACH
          </Typography>
        </Box>
      )}
    </Box>
  );
}
