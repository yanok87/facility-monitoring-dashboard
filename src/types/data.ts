/**
 * Portfolio asset types — one per facility/originator schema.
 * Raw data from originators; field names and shapes differ by facility.
 */

/** Facility A — Educa Capital I (ISA / Education Loans) */
export interface EducaCapitalAsset {
  external_id: string;
  effective_date: string;
  reporting_date: string;
  status: string;
  is_eligible: boolean;
  student_id: string;
  school_id: string;
  loan_status: string;
  disbursement_amount: number;
  outstanding_amount: number;
  repaid_amount: number;
  interest_rate_percentage: number | null;
  days_past_due: number;
  country: string;
  amount: number;
}

/** Facility B — PayEarly US (Earned Wage Access) */
export interface PayEarlyEwaAsset {
  external_id: string;
  created_at: string;
  due_date: string;
  last_updated: string;
  status: string;
  is_eligible: boolean;
  employer_id: string;
  employer_name: string;
  employee_id: string;
  user_state: string;
  total_principal_amount: number;
  outstanding_principal_amount: number;
  repaid_principal_amount: number;
  total_fee_amount: number;
  outstanding_fee_amount: number;
  receivable_currency: string;
  days_past_due: number;
  amount: number;
}

/** Facility C — Nomina Express I (Salary Advance) */
export interface NominaSalaryAdvanceAsset {
  external_id: string;
  origination_date: string;
  cutoff_date: string;
  status: string;
  is_eligible: boolean;
  employer_name: string;
  employer_tax_id: string;
  net_monthly_salary: number;
  advance_amount: number;
  outstanding_amount: number;
  repaid_amount: number;
  fee_percentage: number;
  fee_amount: number;
  days_past_due: number;
  maturity_date: string;
  amount: number;
}

/** Union of all facility-specific portfolio asset types */
export type PortfolioAsset =
  | EducaCapitalAsset
  | PayEarlyEwaAsset
  | NominaSalaryAdvanceAsset;

/** Facility identifiers used in covenant results and data keys */
export type FacilityId = "facility_a" | "facility_b" | "facility_c";

/** Portfolio file type per facility (array of facility-specific assets) */
export type EducaCapitalPortfolio = EducaCapitalAsset[];
export type PayEarlyEwaPortfolio = PayEarlyEwaAsset[];
export type NominaSalaryAdvancePortfolio = NominaSalaryAdvanceAsset[];

/**
 * Maps each FacilityId to its asset type. Use when you have a facility id
 * and need the correct asset/portfolio type (e.g. in the service layer).
 */
export interface FacilityAssetMap {
  facility_a: EducaCapitalAsset;
  facility_b: PayEarlyEwaAsset;
  facility_c: NominaSalaryAdvanceAsset;
}

/** Maps each FacilityId to its portfolio type (array of assets). */
export interface FacilityPortfolioMap {
  facility_a: EducaCapitalPortfolio;
  facility_b: PayEarlyEwaPortfolio;
  facility_c: NominaSalaryAdvancePortfolio;
}

/** Get the asset type for a facility. e.g. AssetForFacility<"facility_a"> => EducaCapitalAsset */
export type AssetForFacility<F extends FacilityId> = FacilityAssetMap[F];

/** Get the portfolio type for a facility. e.g. PortfolioForFacility<"facility_a"> => EducaCapitalAsset[] */
export type PortfolioForFacility<F extends FacilityId> = FacilityPortfolioMap[F];

// ---------------------------------------------------------------------------
// Covenant results (pre-computed by backend)
// ---------------------------------------------------------------------------

export type CovenantStatus = "COMPLIANT" | "BREACH";
export type CovenantOperator = "below" | "above" | "equals";

export interface Covenant {
  metric: string;
  computed_rate: number;
  threshold: number;
  operator: CovenantOperator;
  status: CovenantStatus;
  breach_consequence: string;
}

export interface CovenantSummary {
  total_assets: number;
  included: number;
  excluded: number;
}

export interface ExcludedAssetWithReasons {
  id: string;
  reasons: string[];
}

export interface FacilityCovenantResult {
  /** Facility identifier; can be any string when there are N facilities (not limited to 3). */
  facility_id: string;
  name: string;
  asset_class: string;
  currency: string;
  covenant: Covenant;
  summary: CovenantSummary;
  included_assets: string[];
  excluded_assets: ExcludedAssetWithReasons[];
}

export interface CovenantResults {
  computed_at: string;
  facilities: FacilityCovenantResult[];
}
