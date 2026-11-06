import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateLoanEMI,
  calculateCompoundInterest,
  analyzeBudget50_30_20,
  calculateFinancialScore,
} from './finance.ts';

test('calculateLoanEMI computes standard amortization correctly', () => {
  // $10,000 at 12% annual rate for 12 months
  const result = calculateLoanEMI(10000, 12, 12);
  // Expected EMI is ~$888.49
  assert.ok(result.monthlyEmi > 880 && result.monthlyEmi < 895);
  assert.ok(result.totalInterest > 600 && result.totalInterest < 700);
  assert.equal(result.amortizationPreview.length, 12);
  assert.equal(result.amortizationPreview[0].month, 1);
});

test('calculateCompoundInterest calculates growth accurately', () => {
  // $1,000 initial + $100/mo at 8% for 5 years
  const res = calculateCompoundInterest(1000, 100, 8, 5);
  assert.equal(res.yearlyBreakdown.length, 5);
  // Total principal invested = 1000 + (100 * 60) = 7000
  assert.equal(res.totalInvested, 7000);
  // With 8% growth, final amount should be significantly greater than invested
  assert.ok(res.finalAmount > 8000);
  assert.ok(res.totalInterestEarned > 1000);
});

test('analyzeBudget50_30_20 evaluates budget splits properly', () => {
  // Income 5000, Needs 2500 (50%), Wants 1500 (30%), Savings 1000 (20%)
  const analysis = analyzeBudget50_30_20(5000, 2500, 1500, 1000);
  assert.equal(analysis.needsRatio, 50);
  assert.equal(analysis.wantsRatio, 30);
  assert.equal(analysis.savingsRatio, 20);
  assert.equal(analysis.healthGrade, 'A');
  assert.ok(analysis.recommendations.length > 0);
});

test('calculateFinancialScore scores healthy profile high', () => {
  const highHealth = calculateFinancialScore({
    monthlyIncome: 6000,
    monthlySavings: 1500, // 25% -> 30 pts
    monthlyDebtPayments: 500, // 8.3% -> 30 pts
    emergencyFundMonths: 6, // 25 pts
    hasInvestment: true, // 15 pts
  });
  assert.equal(highHealth, 100);

  const lowHealth = calculateFinancialScore({
    monthlyIncome: 2000,
    monthlySavings: 50,
    monthlyDebtPayments: 1200,
    emergencyFundMonths: 0.5,
    hasInvestment: false,
  });
  assert.ok(lowHealth < 40);
});
