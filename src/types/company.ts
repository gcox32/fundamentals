export interface CompanyEventEarnings {
  symbol: string;
  date: string;
  epsActual: number;
  epsEstimated: number;
  revenueActual: number;
  revenueEstimated: number;
  lastUpdated: string;
}

export interface CompanyEventDividends {
  symbol: string;
  date: string;
  dividend: number;
  recordDate: string;
  paymentDate: string;
  declarationDate: string;
  adjDividend: number;
  yield: number;
  frequency: string;
}

export interface CompanyCalendarEvents {
  symbol: string;
  nextEarningsDate: { 
    raw: number;
    fmt: string;
  };
  nextDividendDate: {
    raw: number;
    fmt: string;
  };
  nextExDividendDate: {
    raw: number;
    fmt: string;
  };
};

export interface CompanyProfile {
    symbol: string;
    price: number;
    beta: number;
    volAvg: number;
    mktCap: number;
    lastDiv: number;
    range: string;
    changes: number;
    companyName: string;
    currency: string;
    cik: string;
    isin: string;
    cusip: string;
    exchange: string;
    exchangeShortName: string;
    industry: string;
    website: string;
    description: string;
    ceo: string;
    sector: string;
    country: string;
    fullTimeEmployees: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    dcfDiff: number;
    dcf: number;
    image: string;
    ipoDate: string;
    defaultImage: boolean;
    isEtf: boolean;
    isActivelyTrading: boolean;
    isAdr: boolean;
    isFund: boolean;
}

export interface CompanyMetrics {
  dividendYielTTM: number;
  volume: number;
  yearHigh: number;
  yearLow: number;
}

export interface MarketNews {
  symbol: string;
  publishedDate: string;
  title: string;
  image: string;
  site: string;
  text: string;
  url: string;
}

export interface CompanyRatios {
    dividendYielTTM: number;
    dividendYielPercentageTTM: number;
    peRatioTTM: number;
    pegRatioTTM: number;
    payoutRatioTTM: number;
    currentRatioTTM: number;
    quickRatioTTM: number;
    cashRatioTTM: number;
    daysOfSalesOutstandingTTM: number;
    daysOfInventoryOutstandingTTM: number;
    operatingCycleTTM: number;
    daysOfPayablesOutstandingTTM: number;
    cashConversionCycleTTM: number;
    grossProfitMarginTTM: number;
    operatingProfitMarginTTM: number;
    pretaxProfitMarginTTM: number;
    netProfitMarginTTM: number;
    effectiveTaxRateTTM: number;
    returnOnAssetsTTM: number;
    returnOnEquityTTM: number;
    returnOnCapitalEmployedTTM: number;
    netIncomePerEBTTTM: number;
    ebtPerEbitTTM: number;
    ebitPerRevenueTTM: number;
    debtRatioTTM: number;
    debtEquityRatioTTM: number;
    longTermDebtToCapitalizationTTM: number;
    totalDebtToCapitalizationTTM: number;
    interestCoverageTTM: number;
    cashFlowToDebtRatioTTM: number;
    companyEquityMultiplierTTM: number;
    receivablesTurnoverTTM: number;
    payablesTurnoverTTM: number;
    inventoryTurnoverTTM: number;
    fixedAssetTurnoverTTM: number;
    assetTurnoverTTM: number;
    operatingCashFlowPerShareTTM: number;
    freeCashFlowPerShareTTM: number;
    cashPerShareTTM: number;
    operatingCashFlowSalesRatioTTM: number;
    freeCashFlowOperatingCashFlowRatioTTM: number;
    cashFlowCoverageRatiosTTM: number;
    shortTermCoverageRatiosTTM: number;
    capitalExpenditureCoverageRatioTTM: number;
    dividendPaidAndCapexCoverageRatioTTM: number;
    priceBookValueRatioTTM: number;
    priceToBookRatioTTM: number;
    priceToSalesRatioTTM: number;
    priceEarningsRatioTTM: number;
    priceToFreeCashFlowsRatioTTM: number;
    priceToOperatingCashFlowsRatioTTM: number;
    priceCashFlowRatioTTM: number;
    priceEarningsToGrowthRatioTTM: number;
    priceSalesRatioTTM: number;
    enterpriseValueMultipleTTM: number;
    priceFairValueTTM: number;
    dividendPerShareTTM: number;
}

export interface CompanyInsideTrades {
    symbol: string;
    filingDate: string;
    transactionDate: string;
    reportingCik: string;
    transactionType: string;
    securitiesOwned: number;
    companyCik: string;
    reportingName: string;
    typeOfOwner: string;
    acquistionOrDisposition: string;
    formType: string;
    securitiesTransacted: number;
    price: number;
    securityName: string;
    link: string;
}

interface CompanyKeyExecutives {
    title: string;
    name: string;
    pay: number;
    currencyPay: string;
    gender: string;
    yearBorn: number;
    titleSince: number;
}

interface CompanySplitsHistory {
    date: string;
    label: string;
    numerator: number;
    denominator: number;
}

interface CompanyStockDividend {
    date: string;
    label: string;
    adjDividend: number;
    dividend: number;
    recordDate: string;
    paymentDate: string;
    declarationDate: string;
}

interface CompanyRating {
    symbol: string;
    date: string;
    rating: string;
    ratingScore: number;
    ratingRecommendation: string;
    ratingDetailsDCFScore: number;
    ratingDetailsDCFRecommendation: string;
    ratingDetailsROEScore: number;
    ratingDetailsROERecommendation: string;
    ratingDetailsROAScore: number;
    ratingDetailsROARecommendation: string;
    ratingDetailsDEScore: number;
    ratingDetailsDERecommendation: string;
    ratingDetailsPEScore: number;
    ratingDetailsPERecommendation: string;
    ratingDetailsPBScore: number;
    ratingDetailsPBRecommendation: string;
}

interface CompanyFinancialsAnnual {
    symbol: string;
    fiscalDateEnding: string;
    reportedCurrency: string;
    revenue: number;
    costOfRevenue: number;
    grossProfit: number;
    grossProfitRatio: number;
}

interface CompanyFinancialsQuarter {
    symbol: string;
    fiscalDateEnding: string;
    reportedCurrency: string;
    revenue: number;
    costOfRevenue: number;
    grossProfit: number;
    grossProfitRatio: number;
}

export interface RevenueBySegment {
  [segment: string]: number;
}

export interface RevenueBySegmentDate {
  [date: string]: RevenueBySegment;
}

export interface RevenueBySegmentData {
  [index: string]: RevenueBySegmentDate;
}

export interface HistoricalRevenueBySegment {
  symbol: string;
  data: RevenueBySegmentData;
  lastUpdated?: number;
  ttl?: number;
}

export interface CompanyOutlook {
  profile: CompanyProfile;
  metrics: CompanyMetrics;
  ratios: Array<CompanyRatios>;
  insideTrades?: Array<CompanyInsideTrades>;
  keyExecutives?: Array<CompanyKeyExecutives>;
  splitsHistory?: Array<CompanySplitsHistory>;
  stockDividend?: Array<CompanyStockDividend>;
  stockNews?: Array<MarketNews>;
  rating?: Array<CompanyRating>;
  financialsAnnual?: Array<CompanyFinancialsAnnual>;
  financialsQuarter?: Array<CompanyFinancialsQuarter>;
}

export interface RevenueByGeography {
  [geography: string]: number;
}

export interface RevenueByGeographyDate {
  [date: string]: RevenueByGeography;
}

export interface RevenueByGeographyData {
  [index: string]: RevenueByGeographyDate;
}

export interface HistoricalRevenueByGeography {
  symbol: string;
  data: RevenueByGeographyData;
  lastUpdated?: number;
  ttl?: number;
}