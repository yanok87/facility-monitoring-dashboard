"use client";

import { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import type { NormalizedFacilityDetail } from "@/domain/types";
import { colors } from "@/theme/colors";
import { PortfolioRowLegend } from "./PortfolioRowLegend";

/** Fence-style table: borderless, zebra striping, subtle row borders */
const tableStyles = {
  container: {
    boxShadow: "none",
    border: `1px solid ${colors.table.rowBorder}`,
    borderRadius: 1,
    overflow: "hidden",
  },
  table: {
    "& .MuiTableCell-root": {
      borderRight: "none",
      borderBottom: `1px solid ${colors.table.rowBorder}`,
    },
    "& .MuiTableHead .MuiTableCell-root": {
      bgcolor: colors.table.headerBg,
      fontWeight: 700,
      textTransform: "uppercase" as const,
      fontSize: "0.75rem",
      letterSpacing: "0.05em",
      color: colors.text.primary,
    },
  },
};

interface FacilityDetailProps {
  detail: NormalizedFacilityDetail | null;
  isLoading?: boolean;
}

function formatAmount(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });
}

/** snake_case → Title Case (e.g. maturity_date → Maturity date) */
function formatDetailLabel(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function FacilityDetail({ detail, isLoading }: FacilityDetailProps) {
  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <LinearProgress sx={{ maxWidth: 320, mx: "auto" }} />
      </Box>
    );
  }
  if (!detail) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">Select a facility to see details.</Typography>
      </Paper>
    );
  }

  const { covenant, summary, portfolio } = detail;
  const ratePct = (covenant.computedRate / covenant.threshold) * 100;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Covenant block */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          COVENANT
        </Typography>
        <Typography variant="h3" sx={{ mb: 1 }}>
          {covenant.metric}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1.5, flexWrap: "wrap", mb: 2.5 }}>
          <Box>
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
              Computed rate
            </Typography>
            <Typography variant="h2" component="span" sx={{ fontSize: "1.5rem" }}>
              {covenant.computedRate} {detail.currency}
            </Typography>
          </Box>
          <Typography variant="h2" component="span" sx={{ fontSize: "1.5rem", pb: 0.25 }}>/</Typography>
          <Box>
            <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
              Threshold
            </Typography>
            <Typography variant="h2" component="span" sx={{ fontSize: "1.5rem" }}>
              {covenant.threshold} {detail.currency}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={covenant.status}
            color={covenant.status === "COMPLIANT" ? "success" : "error"}
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1, mt: 0.5 }}>
          <Box sx={{ flex: 1, maxWidth: 320 }}>
            <LinearProgress
              variant="determinate"
              value={Math.min(ratePct, 100)}
              color={covenant.status === "COMPLIANT" ? "success" : "error"}
              sx={{ height: 8, borderRadius: 1 }}
            />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 48, textAlign: "right" }}>
            {ratePct > 100 ? ">100" : ratePct.toFixed(1)}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          If breached: {covenant.breachConsequence}
        </Typography>
      </Paper>

      {/* Summary + color legend */}
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
        <Chip label={`${summary.included} included`} size="small" variant="outlined" />
        <Chip label={`${summary.excluded} excluded`} size="small" variant="outlined" />
        <Typography variant="body2" color="text.secondary">
          Total assets: {summary.totalAssets}
        </Typography>
        <Box component="span" sx={{ ml: 0.5 }}>
          <PortfolioRowLegend />
        </Box>
      </Box>

      {/* Portfolio table — borderless, header; excluded rows: red if past_due/delinquent/defaulted/written_off, grey otherwise */}
      <TableContainer component={Paper} sx={tableStyles.container}>
        <Table size="small" sx={tableStyles.table}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>ID</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Outstanding</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Eligible</TableCell>
              <TableCell align="right">DPD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.map((row) => (
              <PortfolioRow key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function PortfolioRow({ row }: { row: NormalizedFacilityDetail["portfolio"][0] }) {
  const [open, setOpen] = useState(false);
  const excluded = row.isExcludedFromCovenant;
  const excludedPastDue =
    excluded && (row.status === "past_due" || row.status === "delinquent" || row.status === "defaulted" || row.status === "written_off");
  const excludedOther = excluded && !excludedPastDue;

  const rowBg =
    excludedPastDue
      ? colors.excludedRow
      : excludedOther
        ? colors.table.rowAlt
        : undefined;

  return (
    <>
      <TableRow
        sx={{
          bgcolor: rowBg,
          "& .MuiTableCell-root":
            excluded ? { borderBottomColor: colors.table.rowBorder } : undefined,
        }}
      >
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => setOpen(!open)} aria-label={open ? "collapse" : "expand"}>
            {open ? "▲" : "▼"}
          </IconButton>
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell align="right">{formatAmount(row.amount)}</TableCell>
        <TableCell align="right">{formatAmount(row.outstandingAmount)}</TableCell>
        <TableCell>{row.status}</TableCell>
        <TableCell>
          <Box component="span" sx={{ color: row.isEligible ? colors.table.positive : colors.table.negative, fontWeight: 600 }}>
            {row.isEligible ? "✓ Yes" : "✗ No"}
          </Box>
        </TableCell>
        <TableCell align="right">{row.daysPastDue}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} sx={{ py: 0, borderBottom: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 2, pl: 6 }}>
              {excluded && row.exclusionReasons.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                  Excluded: {row.exclusionReasons.join("; ")}
                </Typography>
              )}
              <Box
                component="dl"
                sx={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: "4px 16px",
                  m: 0,
                  fontSize: "0.875rem",
                }}
              >
                {Object.entries(row.rawDetail).map(([key, value]) => (
                  <Fragment key={key}>
                    <Box component="dt" sx={{ color: "text.secondary" }}>
                      {formatDetailLabel(key)}
                    </Box>
                    <Box component="dd" sx={{ m: 0 }}>
                      {value == null ? "—" : String(value)}
                    </Box>
                  </Fragment>
                ))}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
