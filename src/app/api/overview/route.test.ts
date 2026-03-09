import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

vi.mock("@/server/facility-service.server", () => ({
  getFacilityServiceInstance: vi.fn(),
}));

const { getFacilityServiceInstance } = await import("@/server/facility-service.server");

describe("GET /api/overview", () => {
  beforeEach(() => {
    vi.mocked(getFacilityServiceInstance).mockReset();
  });

  it("returns 200 and overview when service succeeds", async () => {
    const mockOverview = {
      computedAt: "2025-01-15T00:00:00Z",
      totalExposureByCurrency: { USD: 1000 },
      totalExposure: 1000,
      facilities: [],
    };
    vi.mocked(getFacilityServiceInstance).mockReturnValue({
      getOverview: vi.fn().mockResolvedValue(mockOverview),
    } as unknown as ReturnType<typeof getFacilityServiceInstance>);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOverview);
  });

  it("returns 500 and error message when service throws", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(getFacilityServiceInstance).mockReturnValue({
      getOverview: vi.fn().mockRejectedValue(new Error("Covenant API error")),
    } as unknown as ReturnType<typeof getFacilityServiceInstance>);

    const response = await GET();
    consoleSpy.mockRestore();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Failed to load overview" });
  });
});
