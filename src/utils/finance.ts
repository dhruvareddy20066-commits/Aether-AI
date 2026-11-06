/**
 * Core Financial Math and Assessment Utilities
 * Pure functions for loan calculations, compound interest, budgeting, and financial health scoring.
 */

export interface LoanResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayment: number;
  amortizationPreview: Array<{
    month: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

export function calculateLoanEMI(principal: number, annualRatePct: number, tenureMonths: number): LoanResult {
  if (principal <= 0 || tenureMonths <= 0) {
    return { monthlyEmi: 0, totalInterest: 0, totalPayment: 0, amortizationPreview: [] };
  }

  const monthlyRate = annualRatePct / 12 / 100;
  let monthlyEmi = 0;

  if (monthlyRate === 0) {
    monthlyEmi = principal / tenureMonths;
  } else {
    monthlyEmi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  }

  const totalPayment = monthlyEmi * tenureMonths;
  const totalInterest = totalPayment - principal;

  // Generate preview of first 6 months and last month
  const amortizationPreview = [];
  let balance = principal;
  for (let m = 1; m <= Math.min(12, tenureMonths); m++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyEmi - interest;
    balance = Math.max(0, balance - principalPaid);
    amortizationPreview.push({
      month: m,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest),
      remainingBalance: Math.round(balance),
    });
  }

  return {
    monthlyEmi: Math.round(monthlyEmi * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    amortizationPreview,
  };
}

export interface CompoundInterestResult {
  finalAmount: number;
  totalInvested: number;
  totalInterestEarned: number;
  yearlyBreakdown: Array<{
    year: number;
    invested: number;
    interest: number;
    balance: number;
  }>;
}

export function calculateCompoundInterest(
  initialPrincipal: number,
  monthlyContribution: number,
  annualReturnPct: number,
  years: number
): CompoundInterestResult {
  const r = annualReturnPct / 100;
  const months = years * 12;
  const monthlyRate = r / 12;

  let currentBalance = initialPrincipal;
  let totalInvested = initialPrincipal;
  const yearlyBreakdown = [];

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
      totalInvested += monthlyContribution;
    }
    yearlyBreakdown.push({
      year: y,
      invested: Math.round(totalInvested),
      interest: Math.round(currentBalance - totalInvested),
      balance: Math.round(currentBalance),
    });
  }

  return {
    finalAmount: Math.round(currentBalance),
    totalInvested: Math.round(totalInvested),
    totalInterestEarned: Math.round(currentBalance - totalInvested),
    yearlyBreakdown,
  };
}

export interface BudgetAssessment {
  income: number;
  needsRatio: number;
  wantsRatio: number;
  savingsRatio: number;
  needsVariance: number; // diff from 50%
  wantsVariance: number; // diff from 30%
  savingsVariance: number; // diff from 20%
  healthGrade: 'A+' | 'A' | 'B' | 'C' | 'Needs Attention';
  recommendations: string[];
}

export function analyzeBudget50_30_20(
  monthlyIncome: number,
  needsAmount: number,
  wantsAmount: number,
  savingsAmount: number
): BudgetAssessment {
  if (monthlyIncome <= 0) {
    return {
      income: 0,
      needsRatio: 0,
      wantsRatio: 0,
      savingsRatio: 0,
      needsVariance: 0,
      wantsVariance: 0,
      savingsVariance: 0,
      healthGrade: 'Needs Attention',
      recommendations: ['Please enter your monthly take-home income to generate budget analysis.'],
    };
  }

  const needsRatio = (needsAmount / monthlyIncome) * 100;
  const wantsRatio = (wantsAmount / monthlyIncome) * 100;
  const savingsRatio = (savingsAmount / monthlyIncome) * 100;

  const needsVariance = needsRatio - 50;
  const wantsVariance = wantsRatio - 30;
  const savingsVariance = savingsRatio - 20;

  const recommendations: string[] = [];

  if (savingsRatio >= 20) {
    recommendations.push('Superb savings rate! You exceed the recommended 20% threshold.');
  } else {
    recommendations.push(`Aim to increase your savings rate from ${savingsRatio.toFixed(1)}% to at least 20%.`);
  }

  if (needsRatio > 55) {
    recommendations.push(`Essentials consume ${needsRatio.toFixed(1)}% of your income. Look into trimming fixed utilities or subscriptions.`);
  }

  if (wantsRatio > 35) {
    recommendations.push(`Discretionary spending is at ${wantsRatio.toFixed(1)}%. Consider the 48-hour rule before non-essential purchases.`);
  }

  let healthGrade: BudgetAssessment['healthGrade'] = 'B';
  if (savingsRatio >= 25 && needsRatio <= 50) {
    healthGrade = 'A+';
  } else if (savingsRatio >= 20 && needsRatio <= 52) {
    healthGrade = 'A';
  } else if (savingsRatio >= 15 && needsRatio <= 60) {
    healthGrade = 'B';
  } else if (savingsRatio >= 8) {
    healthGrade = 'C';
  } else {
    healthGrade = 'Needs Attention';
  }

  return {
    income: monthlyIncome,
    needsRatio: Math.round(needsRatio * 10) / 10,
    wantsRatio: Math.round(wantsRatio * 10) / 10,
    savingsRatio: Math.round(savingsRatio * 10) / 10,
    needsVariance: Math.round(needsVariance * 10) / 10,
    wantsVariance: Math.round(wantsVariance * 10) / 10,
    savingsVariance: Math.round(savingsVariance * 10) / 10,
    healthGrade,
    recommendations,
  };
}

export function calculateFinancialScore(params: {
  monthlyIncome: number;
  monthlySavings: number;
  monthlyDebtPayments: number;
  emergencyFundMonths: number;
  hasInvestment: boolean;
}): number {
  const { monthlyIncome, monthlySavings, monthlyDebtPayments, emergencyFundMonths, hasInvestment } = params;
  if (monthlyIncome <= 0) return 40;

  let score = 0;

  // 1. Savings rate (max 30 pts)
  const savingsRate = (monthlySavings / monthlyIncome) * 100;
  if (savingsRate >= 25) score += 30;
  else if (savingsRate >= 20) score += 25;
  else if (savingsRate >= 15) score += 18;
  else if (savingsRate >= 10) score += 10;
  else score += 5;

  // 2. Debt to Income Ratio (max 30 pts)
  const dti = (monthlyDebtPayments / monthlyIncome) * 100;
  if (dti <= 15) score += 30;
  else if (dti <= 28) score += 24;
  else if (dti <= 36) score += 16;
  else if (dti <= 45) score += 8;
  else score += 2;

  // 3. Emergency fund (max 25 pts)
  if (emergencyFundMonths >= 6) score += 25;
  else if (emergencyFundMonths >= 3) score += 20;
  else if (emergencyFundMonths >= 1) score += 10;
  else score += 3;

  // 4. Investment participation (max 15 pts)
  if (hasInvestment) score += 15;
  else score += 5;

  return Math.min(100, Math.max(10, score));
}
