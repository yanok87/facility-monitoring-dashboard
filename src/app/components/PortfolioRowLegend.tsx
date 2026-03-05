"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { colors } from "@/theme/colors";

const LEGEND_ITEMS = [
  { name: "white", bg: colors.table.legend.active, border: colors.table.legend.activeBorder, label: "active / current" },
  { name: "grey", bg: colors.table.legend.excluded, border: colors.table.legend.excludedBorder, label: "excluded" },
  { name: "red", bg: colors.table.legend.pastDue, border: colors.table.legend.pastDueBorder, label: "excluded & past due / delinquent / defaulted / written off" },
] as const;

export function PortfolioRowLegend() {
  return (
    <Typography
      component="span"
      variant="caption"
      color="text.secondary"
      sx={{ display: "inline-flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}
    >
      {LEGEND_ITEMS.map(({ name, bg, border, label }) => (
        <Box key={name} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5}}>
          <Box
            component="span"
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              bgcolor: bg,
              border: "1px solid",
              borderColor: border,
            }}
          />
          {name} = {label}
        </Box>
      ))}
    </Typography>
  );
}
