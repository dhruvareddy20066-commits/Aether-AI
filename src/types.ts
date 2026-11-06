export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  avatarColor: string;
  joinedDate: string;
}

export interface GoogleAccount {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  isDefault: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface DebtItem {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minPayment: number;
  category: 'credit_card' | 'student_loan' | 'car_loan' | 'personal';
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  targetDate: string;
  category: 'emergency' | 'house' | 'vacation' | 'car' | 'investing';
}

export interface InvestmentAsset {
  id: string;
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  allocationPct: number;
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlySavings: number;
  needsExpenses: number;
  wantsExpenses: number;
  debts: DebtItem[];
  savingsGoals: SavingsGoal[];
  investments: InvestmentAsset[];
  emergencyFundMonths: number;
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
}
