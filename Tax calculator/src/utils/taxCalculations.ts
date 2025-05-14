/**
 * Tax Calculation Utilities
 * Contains all logic for Canadian tax calculations
 */

// Constants for tax brackets (Federal)
export const FEDERAL_TAX_BRACKETS = [
  { threshold: 0, rate: 0.15 },
  { threshold: 53359, rate: 0.205 },
  { threshold: 106717, rate: 0.26 },
  { threshold: 165430, rate: 0.29 },
  { threshold: 235675, rate: 0.33 }
];

// Constants for tax brackets (Quebec)
export const QUEBEC_TAX_BRACKETS = [
  { threshold: 0, rate: 0.15 },
  { threshold: 49275, rate: 0.20 },
  { threshold: 98540, rate: 0.24 },
  { threshold: 119910, rate: 0.2575 }
];

// Constants for deductions and contributions
export const RRQ_RATE = 0.0608; // Quebec Pension Plan rate
export const RRQ_MAX_CONTRIBUTION = 4038.40;
export const RRQ_EXEMPTION = 3500;

export const EI_RATE = 0.0156; // Employment Insurance rate
export const EI_MAX_CONTRIBUTION = 952.74;

export const QPIP_RATE = 0.00494; // Quebec Parental Insurance Plan
export const QPIP_MAX_CONTRIBUTION = 402.39;

/**
 * Calculate federal tax for a given income
 * @param income Annual income in CAD
 * @returns Federal tax amount
 */
export const calculateFederalTax = (income: number): number => {
  let tax = 0;
  
  for (let i = FEDERAL_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = FEDERAL_TAX_BRACKETS[i];
    
    if (income > bracket.threshold) {
      const taxableInThisBracket = income - bracket.threshold;
      tax += taxableInThisBracket * bracket.rate;
      income = bracket.threshold;
    }
  }
  
  return tax;
};

/**
 * Calculate Quebec provincial tax for a given income
 * @param income Annual income in CAD
 * @returns Quebec tax amount
 */
export const calculateQuebecTax = (income: number): number => {
  let tax = 0;
  
  for (let i = QUEBEC_TAX_BRACKETS.length - 1; i >= 0; i--) {
    const bracket = QUEBEC_TAX_BRACKETS[i];
    
    if (income > bracket.threshold) {
      const taxableInThisBracket = income - bracket.threshold;
      tax += taxableInThisBracket * bracket.rate;
      income = bracket.threshold;
    }
  }
  
  return tax;
};

/**
 * Calculate RRQ (Quebec Pension Plan) contribution
 * @param income Employment income in CAD
 * @returns RRQ contribution amount
 */
export const calculateRRQ = (income: number): number => {
  const contributionBase = Math.min(income - RRQ_EXEMPTION, 66600 - RRQ_EXEMPTION);
  return contributionBase > 0 ? Math.min(contributionBase * RRQ_RATE, RRQ_MAX_CONTRIBUTION) : 0;
};

/**
 * Calculate Employment Insurance premium
 * @param income Employment income in CAD
 * @returns EI premium amount
 */
export const calculateEI = (income: number): number => {
  return Math.min(income * EI_RATE, EI_MAX_CONTRIBUTION);
};

/**
 * Calculate Quebec Parental Insurance Plan premium
 * @param income Employment income in CAD
 * @returns QPIP premium amount
 */
export const calculateQPIP = (income: number): number => {
  return Math.min(income * QPIP_RATE, QPIP_MAX_CONTRIBUTION);
};

/**
 * Calculate maximum RRSP contribution room
 * @param income Previous year's earned income in CAD
 * @returns Maximum RRSP contribution room
 */
export const calculateRRSPRoom = (income: number): number => {
  return Math.min(income * 0.18, 30780); // 2023 RRSP dollar limit is $30,780
};

/**
 * Calculate optimal income distribution between salary and dividends
 * @param totalIncome Total target income in CAD
 * @returns Object containing recommended salary and dividend amounts
 */
export const calculateOptimalIncomeDistribution = (totalIncome: number): { 
  salary: number;
  dividends: number;
  rrspContribution: number;
  taxSavings: number;
} => {
  // Default strategy - all salary
  let bestStrategy = {
    salary: totalIncome,
    dividends: 0,
    rrspContribution: 0,
    taxSavings: 0
  };
  
  let lowestTax = calculateFederalTax(totalIncome) + calculateQuebecTax(totalIncome);
  
  // Only apply optimization strategies for higher incomes
  if (totalIncome > 100000) {
    // Test different salary/dividend combinations
    for (let salaryPercentage = 50; salaryPercentage <= 80; salaryPercentage += 5) {
      const salary = totalIncome * (salaryPercentage / 100);
      const dividends = totalIncome - salary;
      
      // Calculate RRSP room
      const rrspRoom = calculateRRSPRoom(salary);
      const optimalRRSP = Math.min(rrspRoom, salary * 0.12); // Use 12% as a reasonable contribution
      
      // Calculate tax with this distribution
      const taxableIncome = salary - optimalRRSP;
      const federalTax = calculateFederalTax(taxableIncome);
      
      // Simplified dividend tax calculation (actual calculation is more complex)
      const grossedUpDividends = dividends * 1.38; // Eligible dividends are grossed up by 38%
      const dividendFederalTax = calculateFederalTax(grossedUpDividends) * 0.8; // Dividend tax credit approx
      
      const totalTax = federalTax + dividendFederalTax + 
                       calculateQuebecTax(taxableIncome) + calculateQuebecTax(grossedUpDividends) * 0.8;
      
      if (totalTax < lowestTax) {
        lowestTax = totalTax;
        bestStrategy = {
          salary,
          dividends,
          rrspContribution: optimalRRSP,
          taxSavings: (calculateFederalTax(totalIncome) + calculateQuebecTax(totalIncome)) - totalTax
        };
      }
    }
  }
  
  return bestStrategy;
};

/**
 * Calculate all tax components for a given income
 * @param income Employment income in CAD
 * @param rrspContribution RRSP contribution amount
 * @returns Object containing all calculated tax components
 */
export const calculateTaxComponents = (income: number, rrspContribution: number = 0): {
  federalTax: number;
  provincialTax: number;
  rrq: number;
  ei: number;
  qpip: number;
  totalDeductions: number;
  netIncome: number;
  taxRate: number;
  averageTaxRate: number;
  marginTaxRate: number;
} => {
  const taxableIncome = income - rrspContribution;
  
  const federalTax = calculateFederalTax(taxableIncome);
  const provincialTax = calculateQuebecTax(taxableIncome);
  const rrq = calculateRRQ(income);
  const ei = calculateEI(income);
  const qpip = calculateQPIP(income);
  
  const totalDeductions = federalTax + provincialTax + rrq + ei + qpip + rrspContribution;
  const netIncome = income - totalDeductions + rrspContribution; // Add back RRSP as it's savings, not a tax
  
  // Calculate tax rates
  const totalTax = federalTax + provincialTax + rrq + ei + qpip;
  const averageTaxRate = totalTax / income;
  
  // Simplified marginal tax rate calculation
  let marginTaxRate = 0;
  for (let i = 0; i < FEDERAL_TAX_BRACKETS.length; i++) {
    if (income > FEDERAL_TAX_BRACKETS[i].threshold) {
      marginTaxRate = FEDERAL_TAX_BRACKETS[i].rate;
    } else {
      break;
    }
  }
  for (let i = 0; i < QUEBEC_TAX_BRACKETS.length; i++) {
    if (income > QUEBEC_TAX_BRACKETS[i].threshold) {
      marginTaxRate += QUEBEC_TAX_BRACKETS[i].rate;
    } else {
      break;
    }
  }
  
  return {
    federalTax,
    provincialTax,
    rrq,
    ei,
    qpip,
    totalDeductions,
    netIncome,
    taxRate: totalTax / income,
    averageTaxRate,
    marginTaxRate
  };
};

/**
 * Get optimization tips based on income level
 * @param income Annual income in CAD
 * @returns Array of tax optimization tips
 */
export const getTaxOptimizationTips = (income: number): string[] => {
  const tips: string[] = [];
  
  // Basic tips for everyone
  tips.push("Contribute to your RRSP to reduce taxable income.");
  tips.push("Consider a TFSA for tax-free investment growth.");
  
  if (income > 50000) {
    tips.push("Track your medical expenses for potential tax credits.");
    tips.push("Charitable donations can provide significant tax credits.");
  }
  
  if (income > 100000) {
    tips.push("Consider income splitting strategies with family members.");
    tips.push("Explore capital dividends to reduce overall tax burden.");
  }
  
  if (income > 170000) {
    tips.push("Consider incorporation to access small business tax rates.");
    tips.push("A mix of salary and dividends may optimize your tax situation.");
    tips.push("Maximize RRSP contributions to defer tax on higher-bracket income.");
  }
  
  return tips;
};