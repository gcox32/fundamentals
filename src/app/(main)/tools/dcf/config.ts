import { OperatingModel } from "@/src/components/dashboard/tools/dcf/PresentValueSection/types";

export const dcfConfig = {
  forecastPeriod: 5,
  discountRate: 7.79,
  terminalGrowth: 0.02,
  caseScenario: 'base',
  marketRiskPremium: 0.055,
  riskFreeRate: 0.035,
  operatingModel: 'FCFE' as OperatingModel,
  worstCaseFactor: 0.8,
  bestCaseFactor: 1.2,
  taxRate: 0.21,
  exitMultiple: 15,
  // Defaults for operating models
  fcfeDefaultGrowthRate: 0.10,
  epsDefaultGrowthRate: 0.10,
  // Growth clamp ranges to avoid outlier assumptions
  fcfGrowthClamp: { min: -0.20, max: 0.40 },
  epsGrowthClamp: { min: -0.20, max: 0.50 },
  // Terminal growth slider/display bounds (decimals, not percent)
  terminalGrowthSliderMax: 0.03,
  // EPS model exit multiple slider bounds
  exitMultipleMin: 5,
  exitMultipleMax: 40,
  // CAPM auto-apply: only update discount rate if new CAPM differs this much (in percentage points)
  capmAutoApplyDeviationPct: 0.25,
};
