import React from 'react';
import { X, FileText, Download, CheckCircle, Sparkles, BookOpen, Cpu, ShieldCheck } from 'lucide-react';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDownloadReport = () => {
    const reportText = `# AI FOR FINANCE CIA-2: PROJECT REPORT
Topic 5: AI-Powered Financial Chatbot (AetherFinance AI)
Candidate Name: Dhruva Reddy
Date: November 2026

## 1. Executive Summary & Problem Statement
Modern personal financial management is burdened by fragmented data, complex banking terminology, and high barriers to entry for professional financial advice. This project develops an intelligent, interactive AI-powered financial assistant capable of providing automated, accurate, and multi-modal financial guidance across budgeting, savings growth, loan amortization, and investment fundamentals, while supporting natural everyday conversational fluency.

## 2. Core AI Technologies & Architecture
- **Language Model**: Google Gemini 3.8 Flash (\`@google/genai\` SDK).
- **Architecture**: Full-Stack TypeScript architecture with Express backend proxy, client-side React 19 SPA, and Vite middleware.
- **Multi-Modal Capabilities**:
  - Web Speech API integration for real-time Speech-to-Text voice querying.
  - Web Speech Synthesis with natural acoustic modulation for conversational voice output.
  - Animated full-body floating humanoid avatar with dynamic visual state tracking (idle, listening, thinking, speaking).
- **Session & Memory System**: Persistent multi-turn conversation logging, chat history session management (New, Rename, Delete, Revisit), mirroring ChatGPT/Gemini paradigms.

## 3. Financial Domains Covered
1. **Budgeting**: Mathematical 50/30/20 framework analysis, categorization of fixed vs. discretionary spending, expense leak identification.
2. **Savings**: Compound interest projection ($A = P(1 + r/n)^{nt}$), emergency fund sufficiency index (3-6 months benchmark).
3. **Loans & Debt**: Standard loan amortization schedule generation, Debt Avalanche vs. Debt Snowball strategy comparison.
4. **Investments**: Dollar-cost averaging (DCA), broad index ETF fundamentals, risk appetite profiling (Conservative, Moderate, Aggressive).
5. **Conversational Engine**: Everyday casual dialog, motivation, and practical Q&A.

## 4. Practical Real-World Applications
- **Democratizing Wealth Advisory**: Provides institutional-grade financial literacy to students and young professionals without advisor fees.
- **Debt Relief Navigation**: Helps borrowers calculate precise interest savings by accelerating loan payments.
- **Interactive Voice Accessibility**: Hands-free financial consultation via floating robotic voice avatar.

## 5. Verification & Testing
- Unit tested pure financial algorithms using \`node:test\` and \`node:assert/strict\`.
- Comprehensive UI validation with Light Glass UI design principles.
`;

    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'AI_Finance_CIA2_Project_Report.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel-accent rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  AI for Finance CIA-2 Report
                </h2>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Topic 5 Project
                </span>
              </div>
              <p className="text-xs text-slate-500">
                AI-Powered Financial Chatbot Architecture & Documentation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download (.md)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Report Content */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2 text-xs sm:text-sm text-slate-700">
          {/* Section 1 */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              1. Project Scope & CIA-2 Alignment
            </h3>
            <p className="leading-relaxed text-slate-600 mb-2">
              This application was built in direct response to <strong>Topic 5 of CIA-2: AI-Powered Financial Chatbot</strong>:
              <em> "Build an intelligent chatbot that answers users' questions about budgeting, savings, loans, investments, and financial planning using natural language processing and AI."</em>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-center">
                <span className="block text-[10px] font-bold text-blue-600 uppercase">Domain 1</span>
                <span className="text-xs font-semibold text-slate-800">50/30/20 Budget</span>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-center">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase">Domain 2</span>
                <span className="text-xs font-semibold text-slate-800">Compound Savings</span>
              </div>
              <div className="p-2 rounded-xl bg-purple-50/70 border border-purple-200/60 text-center">
                <span className="block text-[10px] font-bold text-purple-600 uppercase">Domain 3</span>
                <span className="text-xs font-semibold text-slate-800">Loan Amortization</span>
              </div>
              <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-200/60 text-center">
                <span className="block text-[10px] font-bold text-amber-600 uppercase">Domain 4</span>
                <span className="text-xs font-semibold text-slate-800">Investment Growth</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-600" />
              2. How AI is Implemented in this Project
            </h3>
            <ul className="space-y-2 list-disc list-inside text-slate-600">
              <li>
                <strong>Server-Side Gemini 3.8 Flash Engine</strong>: Runs on Express backend using official Google GenAI SDK with structured system prompts trained in certified personal finance principles.
              </li>
              <li>
                <strong>Multi-Modal Speech-to-Speech & Text-to-Speech</strong>: Features speech recognition and acoustic synthesis with real-time audio visualization.
              </li>
              <li>
                <strong>Full-Body Floating Robot Avatar (AetherBot)</strong>: Interactive SVG agent featuring blinking eyes, audio-reactive equalizers, and glowing quantum reactor status indicators.
              </li>
              <li>
                <strong>Persistent Conversation History</strong>: Sessions are archived, organized, searchable, and retrievable mirroring commercial LLM platforms like ChatGPT and Gemini.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Verification & Validation Metrics
            </h3>
            <p className="text-slate-600 leading-relaxed mb-2">
              All financial math is decoupled into pure TypeScript modules and audited with automated test suites:
            </p>
            <div className="space-y-1.5 font-mono text-[11px] bg-slate-900 text-emerald-400 p-3 rounded-xl overflow-x-auto">
              <div>✓ calculateLoanEMI: Verified exact EMI and 12-month amortization curve</div>
              <div>✓ calculateCompoundInterest: Verified multi-year compounding calculation</div>
              <div>✓ analyzeBudget50_30_20: Verified income variance and grading rubric</div>
              <div>✓ calculateFinancialScore: Verified health score algorithmic accuracy (10-100 scale)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
