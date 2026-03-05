"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import type { NormalizedFacilitySummary } from "@/domain/types";
import { COVENANT_STATUS } from "@/domain/types";
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
  const columnCount =
    facilities.length <= 1 ? 3 : facilities.length === 2 ? 2 : facilities.length <= 4 ? facilities.length : 4;
  const gridColumns = `repeat(${columnCount}, 1fr)`;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: gridColumns },
        justifyItems: { xs: "center", md: "stretch" },
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
              width: { xs: "100%", md: "auto" },
              maxWidth: { xs: 360, md: "none" },
              cursor: "pointer",
              border: "none",
              borderRadius: 2,
              bgcolor: selected ? colors.card.highlight : colors.card.pastel,
              color: selected ? colors.card.selected.text : colors.text.primary,
              transition: "background-color 0.2s, box-shadow 0.2s",
              "&:hover": {
                bgcolor: selected ? colors.card.highlight : colors.card.pastelHover,
                boxShadow: colors.shadow.cardHover,
              },
            }}
          >
            <CardContent sx={{ "&:last-child": { pb: 2 } }}>
              <Typography variant="cardTitle" sx={{ mb: 1, color: "inherit" }}>
                {f.name}
              </Typography>
              <Typography variant="body2" sx={{ color: selected ? colors.card.selected.textSecondary : "text.secondary", mb: 1 }}>
                {f.assetClass}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  label={f.covenantStatus}
                  color={f.covenantStatus === COVENANT_STATUS.COMPLIANT ? "success" : "error"}
                  sx={{
                    ...(selected && {
                      bgcolor: colors.card.selected.chipBg,
                      color: colors.card.selected.chipLabel,
                      "& .MuiChip-label": { color: colors.card.selected.chipLabel },
                    }),
                  }}
                />
                <Typography variant="subtitle2" component="span" sx={{ color: selected ? colors.card.selected.textMuted : undefined }}>
                  {formatExposure(f.currency, f.exposure)}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: selected ? colors.card.selected.textMuted : colors.text.hint }}>
                {f.covenantMetric}: {f.covenantRate} / {f.covenantThreshold} {f.currency}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
