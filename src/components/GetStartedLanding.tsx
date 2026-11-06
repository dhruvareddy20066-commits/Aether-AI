import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Bot,
  Mic,
  PieChart,
  TrendingUp,
  Calculator,
  Lock,
  ChevronRight,
  Layers,
} from 'lucide-react';

interface GetStartedLandingProps {
  onGetStarted: () => void;
  onOpenReport: () => void;
}

export const GetStartedLanding: React.FC<GetStartedLandingProps> = ({
  onGetStarted,
  onOpenReport,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans text-slate-800">
      {/* Background realistic image with light glass overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-all duration-1000 scale-105 pointer-events-none"
        style={{ backgroundImage: "url('/background_login.jpg')" }}
      />
      <div className="fixed inset-0 bg-gradient-to-tr from-white/90 via-white/75 to-blue-50/80 backdrop-blur-md pointer-events-none" />

      {/* Floating glow spheres */}
      <div className="fixed top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-300/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="fixed bottom-1/3 right-1/4 w-[450px] h-[450px] bg-cyan-300/25 rounded-full blur-3xl pointer-events-none" />

      {/* ================= HEADER NAVBAR ================= */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-5">
        <div className="glass-panel-accent rounded-3xl px-5 py-3 border border-white/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-slate-900 tracking-tight">
                  AetherFinance AI
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase">
                  CIA-2 Project
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                AI-Powered Financial Advisory & Voice Companion
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenReport}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-panel hover:bg-white text-xs font-semibold text-slate-700 border border-white/80 transition-all cursor-pointer"
            >
              <span>CIA-2 Assignment Docs</span>
            </button>

            {/* Main Google Login Trigger */}
            <button
              type="button"
              onClick={onGetStarted}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              {/* Google G Icon */}
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION & GET STARTED DASHBOARD ================= */}
      <main className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 my-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-blue-700 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>AI for Finance CIA-2 • Intelligent Financial Assistant</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Meet Your Next-Gen{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Financial AI Advisor
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
              An intelligent, conversational financial partner powered by{' '}
              <strong>Gemini 3.8 Flash</strong>. Optimize your 50/30/20 budget, calculate loan
              amortization schedules, forecast compound index fund growth, and talk live with a
              floating robot companion!
            </p>

            {/* Primary Get Started CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 transition-all transform hover:scale-[1.02] cursor-pointer flex items-center gap-3 group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={onGetStarted}
                className="px-6 py-4 rounded-2xl glass-panel-accent hover:bg-white text-slate-800 font-bold text-sm border border-white/95 shadow-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                {/* Google G Icon */}
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Real Google Authentication • Switch Multiple Accounts Anytime</span>
            </div>
          </div>

          {/* Right Column: Live Interactive Glass Dashboard Preview */}
          <div className="lg:col-span-5">
            <div
              onClick={onGetStarted}
              className="glass-panel-accent rounded-3xl p-6 border border-white/95 shadow-2xl space-y-5 cursor-pointer transform hover:scale-[1.01] transition-all group relative overflow-hidden"
            >
              {/* Top Banner overlay prompt */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">AetherBot Financial Engine</h3>
                    <p className="text-[10px] text-slate-400">Click preview to sign in</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 group-hover:underline">
                  <span>Sign In</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Sample Metrics Widget Preview */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Net Worth</span>
                  <div className="text-xl font-extrabold text-slate-900">$49,774</div>
                  <span className="text-[10px] text-emerald-600 font-bold">+4.8% this month</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Health Score</span>
                  <div className="text-xl font-extrabold text-blue-600">90 / 100</div>
                  <span className="text-[10px] text-slate-500 font-medium">Grade A (Optimal)</span>
                </div>
              </div>

              {/* Sample 50/30/20 preview bar */}
              <div className="p-3.5 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>50/30/20 Budgeting Allocation</span>
                  <span className="text-blue-600">$5,400/mo</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                  <div className="bg-blue-500 w-[50%]" title="Needs 50%" />
                  <div className="bg-indigo-500 w-[30%]" title="Wants 30%" />
                  <div className="bg-emerald-500 w-[20%]" title="Savings 20%" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Needs $2,700</span>
                  <span>Wants $1,620</span>
                  <span className="text-emerald-600 font-bold">Savings $1,080</span>
                </div>
              </div>

              {/* Robot Voice & Chat callout banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500 text-white flex items-center justify-center shadow-xs">
                    <Mic className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Floating Robot Voice Assistant
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Blinking eyes & glowing lights
                    </span>
                  </div>
                </div>
                <div className="text-xs font-bold text-blue-600 bg-white px-3 py-1.5 rounded-xl border border-blue-200 shadow-2xs">
                  Try it
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="glass-card-interactive rounded-2xl p-4 border border-white/90">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <PieChart className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">50/30/20 Smart Budget</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Automated mathematical categorization and variance tracking for your monthly cash flow.
            </p>
          </div>

          <div className="glass-card-interactive rounded-2xl p-4 border border-white/90">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
              <Calculator className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Loan & EMI Calculator</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Amortization tables, total interest calculations, and Debt Avalanche vs Snowball logic.
            </p>
          </div>

          <div className="glass-card-interactive rounded-2xl p-4 border border-white/90">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Compound Simulator</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Visualize exponential returns in low-cost index funds over 5 to 30 year horizons.
            </p>
          </div>

          <div className="glass-card-interactive rounded-2xl p-4 border border-white/90">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
              <Bot className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Persistent Chat History</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              All discussions are archived like ChatGPT and Gemini with multi-turn memory.
            </p>
          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">AetherFinance AI</span>
          <span>• CIA-2 Financial AI Project</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onOpenReport}
            className="hover:text-blue-600 font-medium cursor-pointer"
          >
            Project Documentation
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="hover:text-blue-600 font-semibold cursor-pointer"
          >
            Sign in with Google
          </button>
        </div>
      </footer>
    </div>
  );
};
