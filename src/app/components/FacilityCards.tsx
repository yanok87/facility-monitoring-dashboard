"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { NormalizedFacilitySummary } from "@/domain/types";
import { colors } from "@/theme/colors";

interface FacilityCardsProps {
  facilities: NormalizedFacilitySummary[];
  selectedFacilityId: string | null;
  onSelect: (facilityId: string) => void;
}

function formatExposure(currency: string, value: number): string {
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(1)}k`;
  return `${currency} ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function FacilityCards({
  facilities,
  selectedFacilityId,
  onSelect,
}: FacilityCardsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        justifyContent: "flex-start",
      }}
    >
      {facilities.map((f) => {
        const selected = f.facilityId === selectedFacilityId;
        return (
          <Card
            key={f.facilityId}
            onClick={() => onSelect(f.facilityId)}
            data-selected={selected}
            elevation={0}
            sx={{
              flex: "1 1 200px",
              minWidth: 200,
              maxWidth: 360,
              cursor: "pointer",
              border: "none",
              borderRadius: 2,
              bgcolor: selected ? colors.card.highlight : colors.card.pastel,
              color: selected ? "#FFFFFF" : colors.text.primary,
              transition: "background-color 0.2s, box-shadow 0.2s",
              "&:hover": {
                bgcolor: selected ? colors.card.highlight : "#BAE6FD",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              },
            }}
          >
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Typography variant="h3" sx={{ fontSize: "1.125rem", fontWeight: 700, mb: 1, color: "inherit" }}>
                {f.name}
              </Typography>
              <Typography variant="body2" sx={{ color: selected ? "rgba(255,255,255,0.9)" : colors.text.secondary, mb: 1 }}>
                {f.assetClass}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={f.covenantStatus}
                  color={f.covenantStatus === "COMPLIANT" ? "success" : "error"}
                  sx={{
                    ...(selected && {
                      bgcolor: "rgba(255,255,255,0.25)",
                      color: "#FFFFFF",
                      "& .MuiChip-label": { color: "#FFFFFF" },
                    }),
                  }}
                />
                <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                  {formatExposure(f.currency, f.exposure)}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: selected ? "rgba(255,255,255,0.85)" : colors.text.hint }}>
                {f.covenantMetric}: {f.covenantRate} / {f.covenantThreshold} {f.currency}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
