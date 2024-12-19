import {
    HistoricalPrice,
    HistoricalShares,
    Revenue,
    DividendHistory,
    ROCE,
    FreeCashFlow
  } from "@/components/dashboard/Graphs";

export const graphCards = [
  {
    title: "Price History",
    Component: HistoricalPrice,
    dataKey: "historicalPrice"
  },
  {
    title: "Revenue",
    Component: Revenue,
    dataKey: "incomeStatement"
  },
  {
    title: "Dividend History",
    Component: DividendHistory,
    dataKey: "dividendHistory",
    noDataCheck: (data: any) => !data?.historical?.length
  },
  {
    title: "Shares Outstanding",
    Component: HistoricalShares,
    dataKey: "historicalShares"
  },
  {
    title: "Return on Capital Employed",
    Component: ROCE,
    dataKey: ["incomeStatement", "balanceSheetStatement"]
  },
  {
    title: "Free Cash Flow",
    Component: FreeCashFlow,
    dataKey: "cashFlowStatement"
  }
]; 