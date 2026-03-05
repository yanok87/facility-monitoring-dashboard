"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { HeroExposure } from "./HeroExposure";
import { FacilityCards } from "./FacilityCards";
import { FacilityDetail } from "./FacilityDetail";
import type { NormalizedOverview, NormalizedFacilityDetail } from "@/domain/types";

export function Dashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [overview, setOverview] = useState<NormalizedOverview | null>(null);
  const [detail, setDetail] = useState<NormalizedFacilityDetail | null>(null);
  const [defaultFacilityId, setDefaultFacilityId] = useState<string | null>(null);

  const selectedFromUrl = searchParams.get("facility");
  const selectedFacilityId = selectedFromUrl ?? defaultFacilityId;

  // Fetch overview on mount; set default facility when no URL param (async callback is ok)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/overview")
      .then((res) => res.json())
      .then((data: NormalizedOverview) => {
        if (!cancelled) {
          setOverview(data);
          if (data.facilities.length > 0) {
            setDefaultFacilityId((prev) => prev ?? data.facilities[0].facilityId);
          }
        }
      })
      .catch((err) => console.error("Overview fetch error:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch facility detail when selection changes (setState only in async callbacks)
  useEffect(() => {
    if (!selectedFacilityId) return;
    let cancelled = false;
    fetch(`/api/facilities/${selectedFacilityId}/detail`)
      .then((res) => res.json())
      .then((data: NormalizedFacilityDetail) => {
        if (!cancelled) setDetail(data);
      })
      .catch((err) => console.error("Detail fetch error:", err));
    return () => {
      cancelled = true;
    };
  }, [selectedFacilityId]);

  const detailToShow =
    selectedFacilityId && detail?.facilityId === selectedFacilityId ? detail : null;
  const detailLoading = selectedFacilityId != null && detail?.facilityId !== selectedFacilityId;

  const handleSelectFacility = (facilityId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("facility", facilityId);
    router.replace("?" + params.toString());
  };

  if (!overview) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="text.secondary">Loading overview…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h1" sx={{ mb: 3, fontSize: "1.75rem" }}>
        Facility Monitoring
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          TOTAL EXPOSURE & OVERVIEW
        </Typography>
        <HeroExposure overview={overview} />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          FACILITIES
        </Typography>
        <FacilityCards
          facilities={overview.facilities}
          selectedFacilityId={selectedFacilityId}
          onSelect={handleSelectFacility}
        />
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
          FACILITY DETAIL
        </Typography>
        <FacilityDetail detail={detailToShow} isLoading={detailLoading} />
      </Box>
    </Container>
  );
}
