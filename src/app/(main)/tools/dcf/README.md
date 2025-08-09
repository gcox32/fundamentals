DCF Tool Defaults and Rationale

This document explains the default assumptions used by the DCF tool and why they are reasonable starting points. All defaults live in `config.ts` and are referenced by the tool UI and calculations.

Shared Defaults (dcfConfig)

- forecastPeriod: 5
  - Five-year explicit forecast is a common horizon where visibility is meaningful without hand-waving beyond reasonable certainty.
- discountRate: 7.79 (percent)
  - Initial default for cost of equity; replaced when a company `beta` is available via CAPM (see below). Editable by the user.
- terminalGrowth: 0.02
  - Long-term real growth assumption (2%). Conservative and below typical nominal GDP expectations to avoid overestimation.
- riskFreeRate: 0.035, marketRiskPremium: 0.055
  - CAPM inputs. Combined with `beta` when available to compute cost of equity: r = rf + beta * MRP.
- worstCaseFactor: 0.8, bestCaseFactor: 1.2
  - Scenario multipliers applied to estimated fair values for quick sensitivity.
- taxRate: 0.21
  - Baseline corporate tax rate for cash flow-based models when statement data is incomplete.

Operating Models

FCFE-Based DCF

- fcfeDefaultGrowthRate: 0.10 (10%)
  - Starting growth rate for FCFE when no company-specific trend is available.
- fcfGrowthClamp: [-0.20, 0.40]
  - When inferring growth from historical data, we clamp extremes to avoid outliers from noisy quarters.
- Terminal growth: 2%
  - See shared defaults.
- Discount rate: CAPM (if beta available) or default 7.79%
  - Auto-applied once on load if current discount differs from CAPM by more than capmAutoApplyDeviationPct (0.25pp) and user hasn’t already altered the default.

Why FCFE? It directly models owner cash outputs to equity holders, discounting explicit cash flows and a terminal value via Gordon Growth.

EPS Growth DCF

- epsDefaultGrowthRate: 0.10 (10%)
  - Starting EPS growth rate when company trend isn’t yet known.
- epsGrowthClamp: [-0.20, 0.50]
  - When inferring EPS growth from historical data, clamp extremes to avoid outliers.
- exitMultiple: 15
  - Reasonable long-term market average P/E for terminal valuation. User can adjust to sector norms.
- Discount rate and forecast period follow shared defaults and CAPM logic.

Why EPS model? It’s a simpler, earnings-centric approach that many analysts use when high-quality cash flow data is limited, using an exit multiple to approximate terminal value.

Data-Driven Seeding

On first load for a symbol, we seed inputs as follows:
- FCFE growth: YoY TTM free cash flow growth (fallback: sequential average), clamped to fcfGrowthClamp.
- EPS growth: YoY TTM EPS growth (fallback: net income growth average), clamped to epsGrowthClamp.
- Discount rate: CAPM (rf + beta*MRP) when beta is available and differs materially from the default.

These become the slider starting points while remaining fully user-editable.

Notes

- All rates in the UI are in percent; internal calculations convert to decimals where necessary.
- We recommend users cross-check sector-specific exit multiples and discount rates to reflect cyclicality and leverage differences.
- The tool intentionally favors conservative long-term assumptions to reduce overvaluation bias.

