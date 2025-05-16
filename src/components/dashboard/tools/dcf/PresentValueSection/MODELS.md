| Input                       | Required For | User Controllable? | Default Value | Notes |
|----------------------------|--------------|---------------------|---------------|-------|
| **Net Income**             | FCFE         | ❌                  | From financials | TTM or average |
| **Depreciation & Amort.**  | FCFE         | ❌                  | From financials | From cash flow stmt |
| **Capital Expenditures**   | FCFE         | ❌                  | From financials | Use most recent year |
| **Change in NWC**          | FCFE         | ❌                  | From balance sheet | Δ (A/R + Inventory - A/P) |
| **Net Borrowing**          | FCFE         | ✅                  | 0             | Allow override (e.g., average) |
| **FCFE Growth Rate**       | FCFE         | ✅                  | Historical CAGR of FCFE (or 7–10%) | Computed or editable |
| **Discount Rate**          | Both         | ✅                  | 8%            | Cost of equity (CAPM if available) |
| **Forecast Period (yrs)**  | Both         | ✅                  | 5             | 3–10 range |
| **Terminal Growth Rate**   | Both         | ✅                  | 2%            | Conservative long-run GDP-ish rate |
| **EPS (TTM)**              | EPS Model    | ❌                  | From financials | Net Income / Shares |
| **EPS Growth Rate**        | EPS Model    | ✅                  | Historical CAGR (or 10%) | Can default to average EPS growth |
| **Exit Multiple**          | EPS Model*   | ✅                  | 15×           | Optional alternative to terminal growth |
| **Use Exit Multiple?**     | EPS Model    | ✅                  | true          | Toggle in UI |