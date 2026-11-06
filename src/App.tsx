/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RealGoogleLogin } from './components/RealGoogleLogin';
import { Dashboard } from './components/Dashboard';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ChatDrawer } from './components/ChatDrawer';
import { UserProfileModal } from './components/UserProfileModal';
import { ProjectReportModal } from './components/ProjectReportModal';
import {
  UserProfile,
  GoogleAccount,
  FinancialProfile,
  ChatSession,
  ChatMessage,
} from './types';

// Initial pre-configured Google Accounts
const INITIAL_GOOGLE_ACCOUNTS: GoogleAccount[] = [
  {
    id: 'acc-1',
    name: 'Dhruva Reddy',
    email: 'dhruvareddy20066@gmail.com',
    isDefault: true,
  },
  {
    id: 'acc-2',
    name: 'Dhruva (Finance & Portfolio)',
    email: 'dhruva.invest@gmail.com',
    isDefault: false,
  },
  {
    id: 'acc-3',
    name: 'Dhruva Reddy (Academic CIA-2)',
    email: 'reddy.cia2@gmail.com',
    isDefault: false,
  },
];

// Initial pre-populated sample Chat Sessions (ChatGPT & Gemini style logs)
const INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'session-1',
    title: '50/30/20 Budget Optimization',
    createdAt: 'Today',
    updatedAt: '10:45 AM',
    messages: [
      {
        id: 'm-1',
        role: 'user',
        content: 'How should I allocate my monthly income of $5,400?',
        timestamp: '10:44 AM',
      },
      {
        id: 'm-2',
        role: 'assistant',
        content: `### 50/30/20 Budget Optimization Plan

For your monthly take-home income of **$5,400**, the mathematical breakdown is:

- **50% Needs ($2,700/mo)**: Housing rent/mortgage, utilities, groceries, health insurance, minimum debt obligations.
- **30% Discretionary Wants ($1,620/mo)**: Weekend dinners, streaming subscriptions, tech gear, vacations.
- **20% Wealth & Savings ($1,080/mo)**: High-Yield Savings Account (HYSA) emergency buffer and broad market index funds.

**Key Rule**: Automate the $1,080 transfer right after your paycheck arrives so you always "pay yourself first"!`,
        timestamp: '10:45 AM',
      },
    ],
  },
  {
    id: 'session-2',
    title: 'Debt Avalanche vs Snowball',
    createdAt: 'Yesterday',
    updatedAt: '3:20 PM',
    messages: [
      {
        id: 'm-3',
        role: 'user',
        content: 'Should I prioritize my 22% credit card or my $2,000 personal loan first?',
        timestamp: '3:18 PM',
      },
      {
        id: 'm-4',
        role: 'assistant',
        content: `### Debt Strategy Breakdown

1. **Debt Avalanche (Recommended)**:
   - Always prioritize the **22% credit card**.
   - Paying off high-interest revolving credit yields an instant, risk-free 22% return on every dollar deployed.

2. **Debt Snowball**:
   - Focus on the smallest balance for rapid behavioral motivation.

**Conclusion**: If your credit card balance is under $5,000, Avalanche will save you hundreds of dollars in compounding interest!`,
        timestamp: '3:20 PM',
      },
    ],
  },
  {
    id: 'session-3',
    title: 'Compound Interest & ETF Strategy',
    createdAt: '3 days ago',
    updatedAt: '11:15 AM',
    messages: [
      {
        id: 'm-5',
        role: 'user',
        content: 'How much will $500 invested every month grow into in 20 years?',
        timestamp: '11:12 AM',
      },
      {
        id: 'm-6',
        role: 'assistant',
        content: `### Compound Interest Projection ($500/Month @ 8%)

- **Your Total Contributions**: $120,000 ($500 × 240 months)
- **Compound Interest Earned**: +$174,450
- **Final Portfolio Total**: **$294,450**

Notice that **more than 59%** of your final wealth was generated purely through compound interest rather than out-of-pocket savings!`,
        timestamp: '11:15 AM',
      },
    ],
  },
];

// Initial realistic financial data
const INITIAL_FINANCES: FinancialProfile = {
  monthlyIncome: 5400,
  monthlySavings: 1200,
  needsExpenses: 2500,
  wantsExpenses: 1450,
  emergencyFundMonths: 4.2,
  riskTolerance: 'Moderate',
  debts: [
    {
      id: 'd-1',
      name: 'Credit Card Balance',
      balance: 1450,
      interestRate: 21.9,
      minPayment: 75,
      category: 'credit_card',
    },
    {
      id: 'd-2',
      name: 'Auto Loan',
      balance: 12200,
      interestRate: 5.4,
      minPayment: 320,
      category: 'car_loan',
    },
  ],
  savingsGoals: [
    {
      id: 'g-1',
      name: 'Emergency Fund (6 Months)',
      target: 18000,
      current: 15330,
      targetDate: 'Dec 2026',
      category: 'emergency',
    },
    {
      id: 'g-2',
      name: 'House Down Payment',
      target: 40000,
      current: 14500,
      targetDate: 'June 2028',
      category: 'house',
    },
    {
      id: 'g-3',
      name: 'Japan Travel Fund',
      target: 4500,
      current: 3800,
      targetDate: 'April 2027',
      category: 'vacation',
    },
  ],
  investments: [
    {
      id: 'i-1',
      symbol: 'VOO',
      name: 'Vanguard S&P 500 ETF',
      shares: 32,
      avgPrice: 420.5,
      currentPrice: 535.2,
      allocationPct: 55,
    },
    {
      id: 'i-2',
      symbol: 'QQQ',
      name: 'Invesco NASDAQ 100 ETF',
      shares: 18,
      avgPrice: 380.0,
      currentPrice: 495.8,
      allocationPct: 30,
    },
    {
      id: 'i-3',
      symbol: 'VXUS',
      name: 'Total International Stock ETF',
      shares: 60,
      avgPrice: 54.0,
      currentPrice: 62.4,
      allocationPct: 15,
    },
  ],
};

export default function App() {
  // Login state: Defaults to false so user immediately sees the authentic Google login page
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') return true;
      return localStorage.getItem('aether_is_logged_in') === 'true';
    }
    return false;
  });

  // Google accounts list
  const [accounts, setAccounts] = useState<GoogleAccount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aether_google_accounts');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_GOOGLE_ACCOUNTS;
  });

  // Current logged in user
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aether_user_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      id: 'acc-1',
      name: 'Dhruva Reddy',
      email: 'dhruvareddy20066@gmail.com',
      avatarColor: 'bg-[#0b57d0]',
      joinedDate: 'November 2026',
    };
  });

  // Financial profile state
  const [finances, setFinances] = useState<FinancialProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aether_finances');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_FINANCES;
  });

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aether_chat_sessions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return INITIAL_CHAT_SESSIONS;
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(
    sessions[0]?.id || 'session-1'
  );

  // Modals visibility state
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [isProjectReportOpen, setIsProjectReportOpen] = useState(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('aether_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('aether_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aether_google_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('aether_finances', JSON.stringify(finances));
  }, [finances]);

  useEffect(() => {
    localStorage.setItem('aether_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Auth actions
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsVoiceAssistantOpen(false);
    setIsChatDrawerOpen(false);
    setIsUserProfileOpen(false);
    setIsProjectReportOpen(false);
  };

  // Google Account Management
  const handleAddAccount = (acc: GoogleAccount) => {
    setAccounts((prev) => [...prev, acc]);
  };

  const handleSwitchAccount = (acc: GoogleAccount) => {
    setUser((prev) => ({
      ...prev,
      id: acc.id,
      name: acc.name,
      email: acc.email,
    }));
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === user.id ? { ...a, name: updated.name || a.name } : a
      )
    );
  };

  const handleUpdateFinances = (updated: Partial<FinancialProfile>) => {
    setFinances((prev) => ({ ...prev, ...updated }));
  };

  // Chat Sessions Management (like ChatGPT / Gemini)
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Financial Query',
      createdAt: 'Just now',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      messages: [
        {
          id: `m-init-${Date.now()}`,
          role: 'assistant',
          content: `### Hello ${user.name.split(' ')[0]}! 🤖✨\n\nI'm AetherBot, your financial advisor and conversational companion. What financial topic or calculation would you like to review today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id);
      }
    }
  };

  const handleRenameSession = (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleAddMessage = (sessionId: string, message: ChatMessage) => {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === sessionId) {
          const updatedMessages = [...s.messages, message];
          let title = s.title;
          if (
            (s.title === 'New Financial Query' || s.title.startsWith('New Conversation')) &&
            message.role === 'user'
          ) {
            title = message.content.slice(0, 32) + (message.content.length > 32 ? '...' : '');
          }
          return {
            ...s,
            title,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            messages: updatedMessages,
          };
        }
        return s;
      })
    );
  };

  // Helper when Voice Assistant finishes a turn -> saves to current chat log
  const handleSaveVoiceMessage = (userPrompt: string, aiReply: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    handleAddMessage(currentSessionId, {
      id: `voice-u-${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp: time,
      isVoice: true,
    });
    handleAddMessage(currentSessionId, {
      id: `voice-a-${Date.now() + 1}`,
      role: 'assistant',
      content: aiReply,
      timestamp: time,
      isVoice: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-200">
      {!isLoggedIn ? (
        /* STEP 1: Authentic Google Login Screen with Realistic Robot Background */
        <RealGoogleLogin
          onLogin={handleLoginSuccess}
          accounts={accounts}
          onAddAccount={handleAddAccount}
        />
      ) : (
        /* STEP 2: Main Working Dashboard & AI Financial Assistant */
        <>
          <Dashboard
            user={user}
            finances={finances}
            onUpdateFinances={handleUpdateFinances}
            onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
            onOpenTextChat={() => setIsChatDrawerOpen(true)}
            onOpenUserProfile={() => setIsUserProfileOpen(true)}
            onOpenProjectReport={() => setIsProjectReportOpen(true)}
            onLogout={handleLogout}
          />

          {/* Voice Assistant Modal with floating robot with lights & eyes */}
          <VoiceAssistantModal
            isOpen={isVoiceAssistantOpen}
            onClose={() => setIsVoiceAssistantOpen(false)}
            user={user}
            finances={finances}
            onSaveMessageToSession={handleSaveVoiceMessage}
            onOpenTextChat={() => {
              setIsVoiceAssistantOpen(false);
              setIsChatDrawerOpen(true);
            }}
          />

          {/* Alternative Text Chatbot & Chat History Sessions Drawer */}
          <ChatDrawer
            isOpen={isChatDrawerOpen}
            onClose={() => setIsChatDrawerOpen(false)}
            user={user}
            finances={finances}
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={(id) => setCurrentSessionId(id)}
            onNewSession={handleNewSession}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
            onAddMessage={handleAddMessage}
            onOpenVoiceAssistant={() => {
              setIsChatDrawerOpen(false);
              setIsVoiceAssistantOpen(true);
            }}
          />

          {/* User Profile & Linked Google Accounts Modal */}
          <UserProfileModal
            isOpen={isUserProfileOpen}
            onClose={() => setIsUserProfileOpen(false)}
            user={user}
            accounts={accounts}
            finances={finances}
            onUpdateProfile={handleUpdateProfile}
            onSwitchAccount={handleSwitchAccount}
            onAddAccount={handleAddAccount}
            onUpdateFinances={handleUpdateFinances}
          />

          {/* CIA-2 Academic Project Report Modal */}
          <ProjectReportModal
            isOpen={isProjectReportOpen}
            onClose={() => setIsProjectReportOpen(false)}
          />
        </>
      )}
    </div>
  );
}
