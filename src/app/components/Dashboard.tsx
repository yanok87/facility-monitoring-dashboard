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

/** Turn any thrown value into a readable message (network, JSON, 4xx/5xx, etc.). */
function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message;
  }
  return fallback;
}

async function fetchOverview(): Promise<NormalizedOverview> {
  try {
    const res = await fetch("/api/overview");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = (body as { error?: string })?.error ?? `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(toErrorMessage(err, "Failed to load overview"));
  }
}

async function fetchFacilityDetail(facilityId: string): Promise<NormalizedFacilityDetail> {
  try {
    const res = await fetch(`/api/facilities/${facilityId}/detail`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = (body as { error?: string })?.error ?? `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error(toErrorMessage(err, "Failed to load facility detail"));
  }
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
  const overviewForSelection = overview ?? { facilities: [] as { facilityId: string }[] };
  const selectedFromUrl = searchParams.get("facility");
  const selectedFacilityId =
    selectedFromUrl ?? overviewForSelection.facilities[0]?.facilityId ?? null;

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

  // Check error first so we don't show "Loading…" when the request failed (e.g. 500)
  if (overviewQuery.isError) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Box
          component="img"
          src="/fence_logo_light_theme.svg"
          alt="Fence"
          sx={{ display: "block", height: 36, width: "auto", mb: 3 }}
        />
        <Paper sx={{ p: 3, textAlign: "center", maxWidth: 480 }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Couldn’t load dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {toErrorMessage(overviewQuery.error, "Something went wrong. Please try again.")}
          </Typography>
          <Button variant="contained" onClick={() => overviewQuery.refetch()}>
            Retry
          </Button>
        </Paper>
      </Container>
    );
  }

  // Only show loading when the request is in flight (not when we simply have no data)
  if (overviewQuery.isLoading) {
    return (
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Box
          component="img"
          src="/fence_logo_light_theme.svg"
          alt="Fence"
          sx={{ display: "block", height: 36, width: "auto", mb: 3 }}
        />
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Loading overview…
        </Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Box sx={{ width: 280, height: 120, borderRadius: 2, bgcolor: "action.hover" }} />
          <Box sx={{ width: 280, height: 120, borderRadius: 2, bgcolor: "action.hover" }} />
          <Box sx={{ width: 280, height: 120, borderRadius: 2, bgcolor: "action.hover" }} />
        </Box>
      </Container>
    );
  }

  // No error, not loading: use data or safe empty overview (e.g. API returned null)
  const overviewToShow = overview ?? {
    computedAt: "",
    totalExposureByCurrency: {},
    totalExposure: 0,
    facilities: [],
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Box
        component="img"
        src="/fence_logo_light_theme.svg"
        alt="Fence"
        sx={{ display: "block", height: 36, width: "auto", mb: 3 }}
      />
      <Typography component="h1" variant="h1" sx={{ mb: 3 }}>
        Facility Monitoring
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ display: "block", mb: 1 }}>
          TOTAL EXPOSURE & OVERVIEW
        </Typography>
        <HeroExposure overview={overviewToShow} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="overline" sx={{ display: "block", mb: 1 }}>
          FACILITIES
        </Typography>
        <FacilityCards
          facilities={overviewToShow.facilities}
          selectedFacilityId={selectedFacilityId}
          onSelect={handleSelectFacility}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="overline" sx={{ display: "block", mb: 1 }}>
          FACILITY DETAIL
        </Typography>
        {detailError ? (
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {toErrorMessage(detailQuery.error, "Failed to load facility details. Please try again.")}
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
