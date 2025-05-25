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
  exitMultiple: 15
};
