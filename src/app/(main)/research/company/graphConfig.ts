import {
    HistoricalPrice,
    HistoricalShares,
    Revenue,
    DividendHistory,
    ROCE,
    FreeCashFlow,
    NetIncome,
    Expenses,
    Margins,
    ROIC,
    CapitalStructure
  } from "@/components/dashboard/research/valuation/Graphs";

export const graphCards = [
  {
    title: "Price History",
    Component: HistoricalPrice,
    dataKey: ["historicalPrice", "incomeStatement"]
  },
  {
    title: "Revenue",
    Component: Revenue,
    dataKey: ["incomeStatement", "revenueBySegment", "revenueByGeography"],
    // noDataCheck: (data: any) => !data?.data?.length
  },
  {
    title: "Net Income",
    Component: NetIncome,
    dataKey: "incomeStatement"
  },
  {
    title: "Expenses",
    Component: Expenses,
    dataKey: ["incomeStatement", "cashFlowStatement"]
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
  },
  {
    title: "Margins",
    Component: Margins,
    dataKey: "incomeStatement"
  },
  {
    title: "Capital Structure",
    Component: CapitalStructure,
    dataKey: "balanceSheetStatement"
  },
  {
    title: "Return on Invested Capital",
    Component: ROIC,
    dataKey: ["incomeStatement", "balanceSheetStatement"]
  }
]; 