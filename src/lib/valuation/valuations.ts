type FCFEInputs = {
    netIncome: number;
    depreciation: number;
    capEx: number;
    changeInNWC: number;
    netBorrowing: number;
    growthRate: number; // expected FCFE growth rate
    discountRate: number; // cost of equity
    terminalGrowthRate: number;
    forecastPeriod: number;
};

export function calculateFCFEValuation({
    netIncome,
    depreciation,
    capEx,
    changeInNWC,
    netBorrowing,
    growthRate,
    discountRate,
    terminalGrowthRate,
    forecastPeriod
}: FCFEInputs) {
    let fcfe = netIncome + depreciation - capEx - changeInNWC + netBorrowing;

    let presentValue = 0;
    for (let year = 1; year <= forecastPeriod; year++) {
        fcfe *= (1 + growthRate);
        const discountedFCFE = fcfe / Math.pow(1 + discountRate, year);
        presentValue += discountedFCFE;
    }

    const finalYearFCFE = fcfe;
    const terminalValue = (finalYearFCFE * (1 + terminalGrowthRate)) / (discountRate - terminalGrowthRate);
    const discountedTerminal = terminalValue / Math.pow(1 + discountRate, forecastPeriod);

    const totalEquityValue = presentValue + discountedTerminal;

    return {
        presentValue,
        terminalValue: discountedTerminal,
        totalEquityValue
    };
}

type EPSModelInputs = {
    eps: number; // current EPS
    growthRate: number; // expected EPS growth rate
    discountRate: number; // cost of equity
    forecastPeriod: number;
    exitMultiple: number; // P/E multiple for terminal value
};

export function calculateEPSValuation({
    eps,
    growthRate,
    discountRate,
    forecastPeriod,
    exitMultiple = 15
}: EPSModelInputs) {
    let currentEPS = eps;
    let presentValue = 0;

    for (let year = 1; year <= forecastPeriod; year++) {
        currentEPS *= (1 + growthRate);
        const discountedEPS = currentEPS / Math.pow(1 + discountRate, year);
        presentValue += discountedEPS;
    }

    // Calculate terminal value using exit multiple
    const terminalValue = currentEPS * exitMultiple;
    const discountedTerminal = terminalValue / Math.pow(1 + discountRate, forecastPeriod);
    const totalIntrinsicValue = presentValue + discountedTerminal;

    return {
        presentValue,
        terminalValue: discountedTerminal,
        totalIntrinsicValuePerShare: totalIntrinsicValue
    };
}
