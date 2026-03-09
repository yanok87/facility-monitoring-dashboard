import { describe, it, expect, vi } from "vitest";
import { FacilityService } from "./facility.service";
import type { ICovenantSource, IPortfolioSource } from "@/ports";

describe("FacilityService", () => {
  const mockCovenantResults = {
    computed_at: "2025-01-15T00:00:00Z",
    facilities: [
      {
        facility_id: "facility_a",
        name: "Facility A",
        asset_class: "Education",
        currency: "USD",
        covenant: {
          metric: "Default Rate",
          computed_rate: 2.5,
          threshold: 5,
          operator: "below" as const,
          status: "COMPLIANT" as const,
          breach_consequence: "Waiver required",
        },
        summary: { total_assets: 100, included: 95, excluded: 5 },
        included_assets: ["a1", "a2"],
        excluded_assets: [{ id: "a3", reasons: ["past_due"] }],
      },
    ],
  };

  const mockPortfolio = [
    {
      external_id: "a1",
      amount: 1000,
      outstanding_amount: 800,
      status: "current",
      is_eligible: true,
      days_past_due: 0,
    },
  ];

  it("getOverview returns normalized overview with exposure and facilities", async () => {
    const covenantSource: ICovenantSource = {
      getCovenantResults: vi.fn().mockResolvedValue(mockCovenantResults),
    };
    const portfolioSource: IPortfolioSource = {
      getPortfolio: vi.fn().mockResolvedValue(mockPortfolio),
    };
    const service = new FacilityService(covenantSource, portfolioSource);

    const overview = await service.getOverview();

    expect(overview.computedAt).toBe("2025-01-15T00:00:00Z");
    expect(overview.facilities).toHaveLength(1);
    expect(overview.facilities[0].facilityId).toBe("facility_a");
    expect(overview.facilities[0].name).toBe("Facility A");
    expect(overview.facilities[0].assetClass).toBe("Education");
    expect(overview.facilities[0].currency).toBe("USD");
    expect(overview.facilities[0].covenantStatus).toBe("COMPLIANT");
    expect(overview.facilities[0].covenantMetric).toBe("Default Rate");
    expect(overview.facilities[0].covenantRate).toBe(2.5);
    expect(overview.facilities[0].covenantThreshold).toBe(5);
    expect(overview.facilities[0].exposure).toBe(800);
    expect(overview.totalExposureByCurrency.USD).toBe(800);
    expect(overview.totalExposure).toBe(800);
    expect(portfolioSource.getPortfolio).toHaveBeenCalledWith("facility_a");
  });

  it("getOverview handles null covenant response with safe empty result", async () => {
    const covenantSource: ICovenantSource = {
      getCovenantResults: vi.fn().mockResolvedValue(null),
    };
    const portfolioSource: IPortfolioSource = {
      getPortfolio: vi.fn().mockResolvedValue([]),
    };
    const service = new FacilityService(covenantSource, portfolioSource);

    const overview = await service.getOverview();

    expect(overview.computedAt).toBe("");
    expect(overview.facilities).toEqual([]);
    expect(overview.totalExposureByCurrency).toEqual({});
    expect(overview.totalExposure).toBe(0);
    expect(portfolioSource.getPortfolio).not.toHaveBeenCalled();
  });

  it("getFacilityDetail returns null when facility not found", async () => {
    const covenantSource: ICovenantSource = {
      getCovenantResults: vi.fn().mockResolvedValue(mockCovenantResults),
    };
    const portfolioSource: IPortfolioSource = {
      getPortfolio: vi.fn().mockResolvedValue([]),
    };
    const service = new FacilityService(covenantSource, portfolioSource);

    const detail = await service.getFacilityDetail("nonexistent");

    expect(detail).toBeNull();
  });

  it("getFacilityDetail returns normalized detail when facility exists", async () => {
    const covenantSource: ICovenantSource = {
      getCovenantResults: vi.fn().mockResolvedValue(mockCovenantResults),
    };
    const portfolioSource: IPortfolioSource = {
      getPortfolio: vi.fn().mockResolvedValue(mockPortfolio),
    };
    const service = new FacilityService(covenantSource, portfolioSource);

    const detail = await service.getFacilityDetail("facility_a");

    expect(detail).not.toBeNull();
    expect(detail!.facilityId).toBe("facility_a");
    expect(detail!.name).toBe("Facility A");
    expect(detail!.covenant.metric).toBe("Default Rate");
    expect(detail!.covenant.computedRate).toBe(2.5);
    expect(detail!.covenant.threshold).toBe(5);
    expect(detail!.summary.totalAssets).toBe(100);
    expect(detail!.summary.included).toBe(95);
    expect(detail!.summary.excluded).toBe(5);
    expect(detail!.portfolio).toHaveLength(1);
    expect(detail!.portfolio[0].id).toBe("a1");
    expect(detail!.exposure).toBe(800);
  });
});
