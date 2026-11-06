import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  FinancialProfile,
  SavingsGoal,
  InvestmentAsset,
  DebtItem,
} from '../types';
import {
  calculateLoanEMI,
  calculateCompoundInterest,
  analyzeBudget50_30_20,
  calculateFinancialScore,
} from '../utils/finance';
import { FinancialTooltip } from './FinancialTooltip';
import {
  Sparkles,
  Mic,
  MessageSquare,
  User,
  LogOut,
  TrendingUp,
  DollarSign,
  PieChart,
  Calculator,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Layers,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  finances: FinancialProfile;
  onUpdateFinances: (updated: Partial<FinancialProfile>) => void;
  onOpenVoiceAssistant: () => void;
  onOpenTextChat: (initialPrompt?: string) => void;
  onOpenUserProfile: () => void;
  onOpenProjectReport: () => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  finances,
  onUpdateFinances,
  onOpenVoiceAssistant,
  onOpenTextChat,
  onOpenUserProfile,
  onOpenProjectReport,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'budget' | 'loan' | 'invest' | 'goals'>('budget');

  // Loan Calculator State
  const [loanPrincipal, setLoanPrincipal] = useState<number>(25000);
  const [loanInterestRate, setLoanInterestRate] = useState<number>(6.5);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(36);

  // Compound Interest State
  const [investInitial, setInvestInitial] = useState<number>(5000);
  const [investMonthly, setInvestMonthly] = useState<number>(450);
  const [investRate, setInvestRate] = useState<number>(8.5);
  const [investYears, setInvestYears] = useState<number>(15);

  // Budget Analysis
  const budgetAnalysis = analyzeBudget50_30_20(
    finances.monthlyIncome,
    finances.needsExpenses,
    finances.wantsExpenses,
    finances.monthlySavings
  );

  // Loan Analysis
  const loanResult = calculateLoanEMI(loanPrincipal, loanInterestRate, loanTenureMonths);

  // Compound Interest Analysis
  const compoundResult = calculateCompoundInterest(
    investInitial,
    investMonthly,
    investRate,
    investYears
  );

  // Health Score
  const healthScore = calculateFinancialScore({
    monthlyIncome: finances.monthlyIncome,
    monthlySavings: finances.monthlySavings,
    monthlyDebtPayments: finances.debts.reduce((sum, d) => sum + d.minPayment, 0),
    emergencyFundMonths: finances.emergencyFundMonths,
    hasInvestment: finances.investments.length > 0,
  });

  // Calculate Net Worth
  const totalAssets =
    finances.investments.reduce((sum, i) => sum + i.shares * i.currentPrice, 0) +
    finances.savingsGoals.reduce((sum, g) => sum + g.current, 0);
  const totalDebts = finances.debts.reduce((sum, d) => sum + d.balance, 0);
  const netWorth = totalAssets - totalDebts;

  // Add contribution to goal + trigger confetti
  const handleContributeToGoal = (goalId: string, amount: number) => {
    const updatedGoals = finances.savingsGoals.map((g) => {
      if (g.id === goalId) {
        const newCurrent = Math.min(g.target, g.current + amount);
        if (newCurrent >= g.target) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
          });
        }
        return { ...g, current: newCurrent };
      }
      return g;
    });

    onUpdateFinances({ savingsGoals: updatedGoals });
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/80 text-slate-800 flex flex-col relative pb-24 font-sans">
      {/* Luminous background gradients */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="sticky top-0 z-40 glass-panel-accent border-b border-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900">
                  AetherFinance AI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  CIA-2 Bot
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                AI-Powered Financial Advisory & Multi-Modal Assistant
              </p>
            </div>
          </div>

          {/* Market Pulse Ticker */}
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-full glass-panel text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">S&P 500</span>
              <span className="text-slate-900">5,892.40</span>
              <span className="text-emerald-600 flex items-center text-[11px]">
                <ArrowUpRight className="w-3 h-3" /> +0.74%
              </span>
            </div>
            <div className="w-px h-3.5 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">NASDAQ</span>
              <span className="text-slate-900">18,518.25</span>
              <span className="text-emerald-600 flex items-center text-[11px]">
                <ArrowUpRight className="w-3 h-3" /> +1.12%
              </span>
            </div>
            <div className="w-px h-3.5 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">10Y Yield</span>
              <span className="text-slate-900">4.18%</span>
              <span className="text-rose-500 flex items-center text-[11px]">
                <ArrowDownRight className="w-3 h-3" /> -0.04%
              </span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary Mic Option Button (Voice Assistant Mode) */}
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/25 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Mic className="w-4 h-4 animate-pulse" />
              <span>Voice Robot</span>
            </button>

            {/* AI Chatbot Button */}
            <button
              type="button"
              onClick={() => onOpenTextChat()}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-2xl glass-panel hover:bg-white text-slate-700 text-xs sm:text-sm font-bold border border-white/90 shadow-2xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">AI Chatbot</span>
            </button>

            {/* CIA-2 Report Modal Button */}
            <button
              type="button"
              onClick={onOpenProjectReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl glass-panel hover:bg-white text-slate-600 hover:text-slate-900 text-xs font-semibold border border-white/80 shadow-2xs transition-all cursor-pointer"
              title="View CIA-2 Academic Report"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">CIA-2 Report</span>
            </button>

            {/* User Profile Button with active Google account indicator */}
            <button
              type="button"
              onClick={onOpenUserProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl glass-panel hover:bg-white border border-white/90 shadow-2xs transition-all cursor-pointer"
              title="Edit Profile & Switch Google Accounts"
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs ${user.avatarColor}`}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight truncate max-w-[100px]">
                  {user.email}
                </span>
              </div>
            </button>

            {/* Logout / Switch User */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl glass-panel hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
              title="Sign Out / Switch Google Account"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN DASHBOARD CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 w-full flex-1 space-y-6">
        {/* Welcome Banner with Light Glass Design */}
        <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 border border-white/95 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Smart Financial Assistant Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              Your financial health score is currently in the{' '}
              <strong className="text-blue-700 font-bold">Top Tier ({healthScore}/100)</strong>. Hover
              over any metric to see financial literacy explanations, or click the mic button to
              talk directly with AetherBot!
            </p>
          </div>

          {/* Quick Assistant Launch Strip */}
          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <Mic className="w-4 h-4" />
              <span>Talk with Robot</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenTextChat('Can you review my financial health and recommend improvements?')}
              className="px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm border border-slate-200/80 shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Ask AI for Advice</span>
            </button>
          </div>
        </div>

        {/* ================= 4 FINANCIAL STAT METRICS WITH INTERACTIVE TOOLTIPS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Net Worth */}
          <div className="glass-card-interactive rounded-3xl p-5 border border-white/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <FinancialTooltip
                title="Total Net Worth"
                explanation="The aggregate monetary value of all your financial assets (brokerage investments, bank accounts, savings) minus all liabilities (credit cards, auto loans, mortgages)."
                formula="Assets - Liabilities = Net Worth"
                benchmark="Aim to grow net worth by at least 10-15% annually in your wealth accumulation years."
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Total Net Worth
                </span>
              </FinancialTooltip>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${netWorth.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+$2,150 (+4.8%) this month</span>
            </div>
          </div>

          {/* Card 2: Monthly Cash Flow */}
          <div className="glass-card-interactive rounded-3xl p-5 border border-white/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <FinancialTooltip
                title="Monthly Take-Home & Cash Flow"
                explanation="Your actual disposable income after income taxes and deductions. Healthy cash flow provides capital for living expenses and compound wealth creation."
                benchmark="Keep fixed living overhead under 50% to maintain comfortable cash cushion."
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Monthly Take-Home
                </span>
              </FinancialTooltip>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ${finances.monthlyIncome.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Savings: ${finances.monthlySavings.toLocaleString()}</span>
              <FinancialTooltip
                title="Savings Rate Percentage"
                explanation="The percentage of your take-home pay that is directed towards building your future net worth."
                formula="(Monthly Savings / Monthly Income) × 100"
                benchmark="20% is the universal benchmark; 25%+ fast-tracks financial freedom."
              >
                <span className="font-bold text-blue-600">
                  {((finances.monthlySavings / finances.monthlyIncome) * 100).toFixed(0)}% Rate
                </span>
              </FinancialTooltip>
            </div>
          </div>

          {/* Card 3: Financial Health Score */}
          <div className="glass-card-interactive rounded-3xl p-5 border border-white/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <FinancialTooltip
                title="Financial Health Index"
                explanation="A composite 0-100 algorithmic score assessing 4 pillars: Savings Rate (30 pts), Debt-to-Income DTI (30 pts), Emergency Liquidity (25 pts), and Investment Participation (15 pts)."
                benchmark="Scores 80-100 represent Grade A (Peak financial resilience)."
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Health Index
                </span>
              </FinancialTooltip>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-1">
              <span>{healthScore}</span>
              <span className="text-sm font-semibold text-slate-400">/ 100</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Grade {budgetAnalysis.healthGrade} • Low Debt Risk</span>
            </div>
          </div>

          {/* Card 4: Emergency Reserve */}
          <div className="glass-card-interactive rounded-3xl p-5 border border-white/90 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <FinancialTooltip
                title="Emergency Reserve Months"
                explanation="The number of months you could sustain all necessary living expenses if you experienced an unexpected income interruption or emergency."
                benchmark="Maintain 3 to 6 months of non-negotiable living expenses in liquid HYSA accounts."
              >
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Emergency Fund
                </span>
              </FinancialTooltip>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {finances.emergencyFundMonths} Months
            </div>
            <div className="mt-2 text-xs font-semibold text-slate-500 flex items-center justify-between">
              <span>HYSA at 4.60% APY</span>
              <span className="text-emerald-600 font-bold">Liquid</span>
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE FINANCIAL MODULE TABS ================= */}
        <div className="glass-panel-accent rounded-3xl border border-white/95 shadow-xl overflow-hidden">
          {/* Tab Selector Bar */}
          <div className="flex border-b border-slate-200/80 bg-white/50 overflow-x-auto no-scrollbar">
            {[
              { id: 'budget', label: '50/30/20 Smart Budget', icon: PieChart },
              { id: 'loan', label: 'Loan & EMI Amortizer', icon: Calculator },
              { id: 'invest', label: 'Compound Growth Simulator', icon: TrendingUp },
              { id: 'goals', label: 'Savings Goals Tracker', icon: Flame },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-4 px-6 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'border-blue-600 text-blue-600 bg-white/80'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: 50/30/20 Budget */}
          {activeTab === 'budget' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    50/30/20 Budgeting Rule Analyzer
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hover over each tier to learn the financial literacy principles behind the 50/30/20 model.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTextChat(
                      `Analyze my current monthly budget: Income $${finances.monthlyIncome}, Needs $${finances.needsExpenses}, Wants $${finances.wantsExpenses}, and Savings $${finances.monthlySavings}. Give me 3 tips to boost savings.`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AetherBot to Optimize</span>
                </button>
              </div>

              {/* Sliders / Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Needs */}
                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <FinancialTooltip
                      title="50% Needs & Fixed Expenses"
                      explanation="Essential survival expenses that you must pay regardless of employment status: rent/mortgage, utilities, groceries, medicines, transportation to work, and minimum debt payments."
                      benchmark="Must not exceed 50% of monthly take-home pay."
                    >
                      <span className="font-bold text-slate-700">50% Needs & Fixed</span>
                    </FinancialTooltip>
                    <span className="font-extrabold text-blue-600">
                      ${finances.needsExpenses.toLocaleString()} ({budgetAnalysis.needsRatio}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="4500"
                    step="50"
                    value={finances.needsExpenses}
                    onChange={(e) => onUpdateFinances({ needsExpenses: Number(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budgetAnalysis.needsRatio <= 50 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, budgetAnalysis.needsRatio)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Housing, utilities, groceries, transport
                  </span>
                </div>

                {/* Wants */}
                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <FinancialTooltip
                      title="30% Discretionary Wants"
                      explanation="Lifestyle desires that enhance quality of life but are not strictly required for survival: dining out, streaming services, vacations, hobbies, and personal shopping."
                      benchmark="Cap wants at 30% to prevent lifestyle creep from eroding long-term investments."
                    >
                      <span className="font-bold text-slate-700">30% Discretionary Wants</span>
                    </FinancialTooltip>
                    <span className="font-extrabold text-indigo-600">
                      ${finances.wantsExpenses.toLocaleString()} ({budgetAnalysis.wantsRatio}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="2500"
                    step="50"
                    value={finances.wantsExpenses}
                    onChange={(e) => onUpdateFinances({ wantsExpenses: Number(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        budgetAnalysis.wantsRatio <= 30 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, budgetAnalysis.wantsRatio)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Dining out, entertainment, shopping
                  </span>
                </div>

                {/* Savings */}
                <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <FinancialTooltip
                      title="20% Savings & Wealth Building"
                      explanation="Surplus capital deployed into emergency reserves, retirement matching, broad-market index ETFs, and debt acceleration. 'Paying yourself first' ensures automated wealth accumulation."
                      benchmark="Target minimum 20% of net income; higher percentages accelerate early retirement."
                    >
                      <span className="font-bold text-slate-700">20% Savings & Wealth</span>
                    </FinancialTooltip>
                    <span className="font-extrabold text-emerald-600">
                      ${finances.monthlySavings.toLocaleString()} ({budgetAnalysis.savingsRatio}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={finances.monthlySavings}
                    onChange={(e) => onUpdateFinances({ monthlySavings: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{ width: `${Math.min(100, (budgetAnalysis.savingsRatio / 20) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Emergency fund, retirement, index funds
                  </span>
                </div>
              </div>

              {/* Dynamic Recommendations Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-2">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  AI Budget Assessment: Grade {budgetAnalysis.healthGrade}
                </span>
                <ul className="space-y-1 text-xs text-blue-800">
                  {budgetAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Loan Calculator */}
          {activeTab === 'loan' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Loan Amortization & EMI Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hover over loan inputs and results to see amortization formulas and interest reduction strategies.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTextChat(
                      `I'm evaluating a loan of $${loanPrincipal} at ${loanInterestRate}% for ${loanTenureMonths} months (EMI is $${loanResult.monthlyEmi}). Should I pay extra towards principal or invest in the S&P 500?`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AetherBot Loan Advice</span>
                </button>
              </div>

              {/* Sliders and Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4 lg:col-span-2">
                  {/* Principal Slider */}
                  <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <FinancialTooltip
                        title="Principal Loan Amount"
                        explanation="The original sum of money borrowed from the bank or financial institution before interest accrues."
                        benchmark="Keep total non-mortgage borrowing below 20% of your annual take-home pay."
                      >
                        <span className="font-bold text-slate-700">Principal Loan Amount</span>
                      </FinancialTooltip>
                      <span className="font-extrabold text-blue-600 text-sm">
                        ${loanPrincipal.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={loanPrincipal}
                      onChange={(e) => setLoanPrincipal(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Interest Rate Slider */}
                  <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <FinancialTooltip
                        title="Annual Percentage Rate (APR)"
                        explanation="The annual cost of borrowing money, inclusive of interest rate and associated fees. Lower APR significantly decreases total dollars wasted on interest."
                        benchmark="Under 7% is considered moderate; loans over 15% (e.g. credit cards) should be paid off aggressively with the Avalanche method."
                      >
                        <span className="font-bold text-slate-700">Annual Interest Rate (APR)</span>
                      </FinancialTooltip>
                      <span className="font-extrabold text-indigo-600 text-sm">
                        {loanInterestRate}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2.0"
                      max="24.0"
                      step="0.25"
                      value={loanInterestRate}
                      onChange={(e) => setLoanInterestRate(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                  </div>

                  {/* Tenure Slider */}
                  <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <FinancialTooltip
                        title="Loan Tenure / Repayment Period"
                        explanation="The total duration over which the loan must be repaid. Shorter tenures lower total interest paid, while longer tenures reduce monthly payment sizes."
                        benchmark="For auto loans, avoid exceeding 48 to 60 months."
                      >
                        <span className="font-bold text-slate-700">Loan Tenure</span>
                      </FinancialTooltip>
                      <span className="font-extrabold text-purple-600 text-sm">
                        {loanTenureMonths} Months ({(loanTenureMonths / 12).toFixed(1)} Yrs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="84"
                      step="6"
                      value={loanTenureMonths}
                      onChange={(e) => setLoanTenureMonths(Number(e.target.value))}
                      className="w-full accent-purple-600 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Calculated Result Card */}
                <div className="glass-panel rounded-2xl p-6 border border-white/90 shadow-md flex flex-col justify-between">
                  <div>
                    <FinancialTooltip
                      title="Equated Monthly Installment (EMI)"
                      explanation="The fixed monthly dollar amount paid to the lender until the loan is fully satisfied."
                      formula="EMI = P × r × (1+r)^n / ((1+r)^n - 1)"
                      benchmark="Total debt obligations should not consume more than 36% of gross income."
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Calculated Monthly EMI
                      </span>
                    </FinancialTooltip>
                    <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">
                      ${loanResult.monthlyEmi.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Due every 30 days</p>

                    <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/60 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Principal:</span>
                        <span className="font-bold text-slate-800">
                          ${loanPrincipal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <FinancialTooltip
                          title="Total Interest Payable"
                          explanation="The cumulative finance charge collected by the lender over the full tenure of the loan."
                        >
                          <span className="text-slate-500">Total Interest Payable:</span>
                        </FinancialTooltip>
                        <span className="font-bold text-rose-600">
                          ${loanResult.totalInterest.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-slate-200/60">
                        <span className="font-bold text-slate-800">Total Payment:</span>
                        <span className="font-extrabold text-slate-900">
                          ${loanResult.totalPayment.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-blue-50/80 text-[11px] text-blue-800">
                    💡 <strong>Pro Tip:</strong> Paying an extra $50/month towards principal directly reduces remaining balance and cuts overall interest cost.
                  </div>
                </div>
              </div>

              {/* Amortization Schedule Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  First 12 Months Amortization Schedule
                </span>
                <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Month</th>
                        <th className="py-2.5 px-4">Principal Paid</th>
                        <th className="py-2.5 px-4">Interest Paid</th>
                        <th className="py-2.5 px-4">Remaining Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {loanResult.amortizationPreview.map((row) => (
                        <tr key={row.month} className="hover:bg-slate-50/80">
                          <td className="py-2 px-4 font-bold text-slate-900">Month {row.month}</td>
                          <td className="py-2 px-4 text-emerald-600 font-semibold">
                            ${row.principalPaid.toLocaleString()}
                          </td>
                          <td className="py-2 px-4 text-rose-500">
                            ${row.interestPaid.toLocaleString()}
                          </td>
                          <td className="py-2 px-4 text-slate-800">
                            ${row.remainingBalance.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Compound Interest */}
          {activeTab === 'invest' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Compound Interest & Wealth Simulator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Hover over investment variables to learn how compound interest creates exponential wealth.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTextChat(
                      `Explain compound interest principles to me. If I invest $${investInitial} plus $${investMonthly}/month at ${investRate}% return for ${investYears} years, it compounds to $${compoundResult.finalAmount.toLocaleString()}. How does Einstein's "8th wonder of the world" work mathematically?`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AetherBot Investment Basics</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4 lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Initial Principal */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <FinancialTooltip
                          title="Initial Investment Principal"
                          explanation="The initial lump-sum capital placed in a diversified portfolio at year zero."
                        >
                          <span className="font-bold text-slate-700">Initial Investment</span>
                        </FinancialTooltip>
                        <span className="font-extrabold text-blue-600">
                          ${investInitial.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={investInitial}
                        onChange={(e) => setInvestInitial(Number(e.target.value))}
                        className="w-full accent-blue-600 cursor-pointer"
                      />
                    </div>

                    {/* Monthly Contribution */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <FinancialTooltip
                          title="Dollar-Cost Averaging (Monthly DCA)"
                          explanation="Investing a steady fixed dollar amount every 30 days regardless of market swings, lowering average purchase cost over time."
                        >
                          <span className="font-bold text-slate-700">Monthly Contribution</span>
                        </FinancialTooltip>
                        <span className="font-extrabold text-indigo-600">
                          ${investMonthly.toLocaleString()}/mo
                        </span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="3000"
                        step="50"
                        value={investMonthly}
                        onChange={(e) => setInvestMonthly(Number(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Return Rate */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <FinancialTooltip
                          title="Expected Annual Return (CAGR)"
                          explanation="The compound annual growth rate of your portfolio. The US S&P 500 has historically delivered ~8-10% average annual returns before inflation."
                        >
                          <span className="font-bold text-slate-700">Expected Annual Return</span>
                        </FinancialTooltip>
                        <span className="font-extrabold text-emerald-600">{investRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        step="0.5"
                        value={investRate}
                        onChange={(e) => setInvestRate(Number(e.target.value))}
                        className="w-full accent-emerald-600 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400">
                        Historical S&P 500 average ~8-10%
                      </span>
                    </div>

                    {/* Years */}
                    <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/70 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <FinancialTooltip
                          title="Time Horizon & The Compounding Curve"
                          explanation="Compounding is an exponential hockey-stick function. The majority of earnings occur in the final 10-15 years of the timeline."
                        >
                          <span className="font-bold text-slate-700">Time Horizon</span>
                        </FinancialTooltip>
                        <span className="font-extrabold text-purple-600">{investYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="35"
                        step="1"
                        value={investYears}
                        onChange={(e) => setInvestYears(Number(e.target.value))}
                        className="w-full accent-purple-600 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Wealth Result Card */}
                <div className="glass-panel rounded-2xl p-6 border border-white/90 shadow-md flex flex-col justify-between">
                  <div>
                    <FinancialTooltip
                      title="Projected Future Wealth"
                      explanation="The total estimated balance after reinvesting all dividends and capital appreciation over the full time horizon."
                      formula="A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]"
                    >
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Projected Portfolio Value
                      </span>
                    </FinancialTooltip>
                    <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">
                      ${compoundResult.finalAmount.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">After {investYears} years of growth</p>

                    <div className="mt-6 space-y-3 pt-4 border-t border-slate-200/60 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Your Total Invested:</span>
                        <span className="font-bold text-slate-800">
                          ${compoundResult.totalInvested.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Compound Interest Earned:</span>
                        <span className="font-extrabold text-emerald-600">
                          +${compoundResult.totalInterestEarned.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 rounded-xl bg-emerald-50/80 text-[11px] text-emerald-900">
                    📈 <strong>Compounding Magic:</strong> Interest earned represents{' '}
                    <strong>
                      {(
                        (compoundResult.totalInterestEarned / compoundResult.finalAmount) *
                        100
                      ).toFixed(0)}
                      %
                    </strong>{' '}
                    of your final portfolio!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Savings Goals Tracker with Confetti */}
          {activeTab === 'goals' && (
            <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Targeted Savings Goals
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Fund individual financial milestones. Click +$100 to allocate funds!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onOpenTextChat(
                      `I have 3 savings goals (Emergency Fund, Home Down Payment, Investment Bucket). What is the optimal allocation order for my surplus savings?`
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/80 flex items-center gap-1.5 transition-all self-start md:self-auto cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AetherBot Goal Advice</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {finances.savingsGoals.map((goal) => {
                  const pct = Math.min(100, (goal.current / goal.target) * 100);
                  const isDone = goal.current >= goal.target;

                  return (
                    <div
                      key={goal.id}
                      className="glass-card-interactive rounded-2xl p-5 border border-white/90 shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-900">{goal.name}</span>
                        {isDone && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            Completed! 🎉
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-extrabold text-blue-600">{pct.toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              isDone ? 'bg-emerald-500' : 'bg-blue-600'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-baseline text-xs pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Saved</span>
                          <span className="font-bold text-slate-800 text-sm">
                            ${goal.current.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 block text-[10px]">Target</span>
                          <span className="font-medium text-slate-500">
                            ${goal.target.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => handleContributeToGoal(goal.id, 100)}
                          className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200/60 transition-all shadow-2xs cursor-pointer"
                        >
                          + $100
                        </button>
                        <button
                          type="button"
                          onClick={() => handleContributeToGoal(goal.id, 500)}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          + $500
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ================= FLOATING DOCK QUICK-LAUNCHER (BOTTOM RIGHT) ================= */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Quick Voice Assistant Mic Button */}
        <button
          type="button"
          onClick={onOpenVoiceAssistant}
          className="group relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/45 transition-all transform hover:scale-105 cursor-pointer ring-4 ring-white/80"
          title="Open Floating Voice Robot"
        >
          <Mic className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline font-bold text-xs">Talk with AetherBot</span>
        </button>

        {/* Quick Text Chatbot Button */}
        <button
          type="button"
          onClick={() => onOpenTextChat()}
          className="relative p-3 sm:p-3.5 rounded-full bg-white text-slate-800 hover:bg-slate-50 shadow-xl shadow-slate-300/40 border border-slate-200/80 transition-all transform hover:scale-105 cursor-pointer ring-4 ring-white/80"
          title="Open Text Chatbot & History"
        >
          <MessageSquare className="w-5 h-5 text-blue-600" />
        </button>
      </div>
    </div>
  );
};
