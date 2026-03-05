"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { HeroExposure } from "./HeroExposure";
import { FacilityCards } from "./FacilityCards";
import { FacilityDetail } from "./FacilityDetail";
import type { NormalizedOverview, NormalizedFacilityDetail } from "@/domain/types";
import { getStaleTimeUntilMidnightUTC } from "@/lib/query-utils";

async function fetchOverview(): Promise<NormalizedOverview> {
  const res = await fetch("/api/overview");
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

async function fetchFacilityDetail(facilityId: string): Promise<NormalizedFacilityDetail> {
  const res = await fetch(`/api/facilities/${facilityId}/detail`);
  if (!res.ok) throw new Error(`Failed to fetch facility detail: ${facilityId}`);
  return res.json();
}

export function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const overviewQuery = useQuery({
    queryKey: ["overview"],
    queryFn: fetchOverview,
    staleTime: getStaleTimeUntilMidnightUTC(),
  });

  const overview = overviewQuery.data;
  const selectedFromUrl = searchParams.get("facility");
  const selectedFacilityId =
    selectedFromUrl ?? overview?.facilities[0]?.facilityId ?? null;

  const detailQuery = useQuery({
    queryKey: ["facility-detail", selectedFacilityId ?? ""],
    queryFn: () => fetchFacilityDetail(selectedFacilityId!),
    enabled: !!selectedFacilityId,
    staleTime: getStaleTimeUntilMidnightUTC(),
  });

  const detailToShow =
    selectedFacilityId && detailQuery.data?.facilityId === selectedFacilityId ? detailQuery.data : null;
  const detailLoading = !!selectedFacilityId && detailQuery.isLoading;
  const detailError = !!selectedFacilityId && detailQuery.isError;

  const handleSelectFacility = (facilityId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("facility", facilityId);
    router.replace("?" + params.toString());
  };

  if (overviewQuery.isLoading || !overview) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography color="text.secondary">Loading overview…</Typography>
      </Container>
    );
  }

  if (overviewQuery.isError) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography color="error">Failed to load overview. Please try again.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Box
        component="img"
        src="/fence_logo_light_theme.svg"
        alt="Fence"
        sx={{ display: "block", height: 36, width: "auto", mb: 3 }}
      />
      <Typography
        component="h1"
        sx={{
          mb: 3,
          fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          fontWeight: 500,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "text.primary",
        }}
      >
        Facility Monitoring
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1, fontSize: "0.875rem" }}>
          TOTAL EXPOSURE & OVERVIEW
        </Typography>
        <HeroExposure overview={overview} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1, fontSize: "0.875rem" }}>
          FACILITIES
        </Typography>
        <FacilityCards
          facilities={overview.facilities}
          selectedFacilityId={selectedFacilityId}
          onSelect={handleSelectFacility}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1, fontSize: "0.875rem" }}>
          FACILITY DETAIL
        </Typography>
        {detailError ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error" sx={{ mb: 2 }}>
              Failed to load facility details. Please try again.
            </Typography>
            <Button variant="contained" size="small" onClick={() => detailQuery.refetch()}>
              Retry
            </Button>
          </Paper>
        ) : (
          <FacilityDetail detail={detailToShow} isLoading={detailLoading} />
        )}
      </Box>
    </Container>
  );
}
