import React, { useState } from 'react';
import { UserProfile, GoogleAccount } from '../types';
import { Check, Edit3, Plus, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface GoogleLoginCardProps {
  onLogin: (user: UserProfile) => void;
  accounts: GoogleAccount[];
  onAddAccount: (acc: GoogleAccount) => void;
}

export const GoogleLoginCard: React.FC<GoogleLoginCardProps> = ({
  onLogin,
  accounts,
  onAddAccount,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '1');
  const [isEditingName, setIsEditingName] = useState(false);
  const [customName, setCustomName] = useState(accounts[0]?.name || 'Dhruva Reddy');
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleSelectAccount = (acc: GoogleAccount) => {
    setSelectedAccountId(acc.id);
    setCustomName(acc.name);
  };

  const handleSignIn = () => {
    if (!currentAccount) return;
    onLogin({
      id: currentAccount.id,
      name: customName.trim() || currentAccount.name,
      email: currentAccount.email,
      avatarColor: getAvatarBg(currentAccount.email),
      joinedDate: 'November 2026',
    });
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const account: GoogleAccount = {
      id: `acc-${Date.now()}`,
      name: newName.trim() || newEmail.split('@')[0],
      email: newEmail.trim().toLowerCase(),
      isDefault: false,
    };
    onAddAccount(account);
    setSelectedAccountId(account.id);
    setCustomName(account.name);
    setShowAddAccountModal(false);
    setNewEmail('');
    setNewName('');
  };

  function getAvatarBg(email: string) {
    const colors = [
      'bg-blue-600',
      'bg-emerald-600',
      'bg-indigo-600',
      'bg-purple-600',
      'bg-rose-600',
      'bg-amber-600',
    ];
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash += email.charCodeAt(i);
    return colors[hash % colors.length];
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background realistic image with subtle cinematic blur and light overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{
          backgroundImage: "url('/background_login.jpg')",
        }}
      />

      {/* Light glass overlay with luminous gradient & soft animated mesh */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/80 via-white/60 to-blue-50/70 backdrop-blur-md" />

      {/* Subtle floating particles / lighting beam */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar floating badge */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl glass-panel border border-white/80 shadow-sm">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">AetherFinance AI</h1>
            <p className="text-[11px] text-slate-500 font-medium">CIA-2 Financial AI System</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Realtime Gemini 3.8 Flash Engine
        </div>
      </div>

      {/* Main Google Sign-In Card Container */}
      <div className="relative z-20 w-full max-w-md">
        <div className="glass-panel-accent rounded-3xl p-8 sm:p-10 border border-white/90 shadow-2xl backdrop-blur-2xl transition-all">
          {/* Authentic Google Header */}
          <div className="flex flex-col items-center text-center mb-7">
            {/* Google Multi-Color SVG Logo */}
            <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center p-3 mb-4 border border-slate-100">
              <svg viewBox="0 0 24 24" className="w-full h-full">
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
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Sign in with Google
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Choose an account to continue to <span className="font-semibold text-blue-600">AetherFinance AI</span>
            </p>
          </div>

          {/* Account Picker List */}
          <div className="space-y-2 mb-6">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-1">
              Select or Switch Google Account
            </div>

            {accounts.map((acc) => {
              const isSelected = acc.id === selectedAccountId;
              return (
                <div
                  key={acc.id}
                  onClick={() => handleSelectAccount(acc)}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-50/90 border-blue-400/80 shadow-sm'
                      : 'bg-white/60 hover:bg-white/90 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ${getAvatarBg(
                        acc.email
                      )}`}
                    >
                      {acc.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800 truncate">
                          {isSelected ? customName : acc.name}
                        </span>
                        {acc.isDefault && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 truncate block">
                        {acc.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add another Google account action */}
            <button
              type="button"
              onClick={() => setShowAddAccountModal(true)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl text-left bg-white/40 hover:bg-white/80 border border-dashed border-slate-300 text-slate-600 hover:text-slate-900 transition-all text-xs font-semibold"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                <Plus className="w-4 h-4" />
              </div>
              <span>Use another Google account</span>
            </button>
          </div>

          {/* Editable Display Name Section */}
          <div className="mb-6 p-3.5 rounded-2xl bg-white/50 border border-slate-200/60">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="display-name-input" className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                Customize Display Name
              </label>
              <button
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700"
              >
                {isEditingName ? 'Done' : 'Edit'}
              </button>
            </div>
            {isEditingName ? (
              <input
                id="display-name-input"
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 rounded-xl bg-white border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800"
                autoFocus
              />
            ) : (
              <div className="text-sm font-medium text-slate-700 flex items-center justify-between">
                <span>{customName}</span>
                <span className="text-[11px] text-slate-400">Shown in dashboard & chats</span>
              </div>
            )}
          </div>

          {/* Primary Continue Button */}
          <button
            type="button"
            onClick={handleSignIn}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continue as {customName.split(' ')[0]}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {/* Google Compliance Security Badge */}
          <div className="mt-6 pt-5 border-t border-slate-200/60 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google Identity Secured • Privacy & Terms Protected</span>
          </div>
        </div>
      </div>

      {/* Add Google Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel-accent rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-white/90 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">Add Google Account</h3>
                <p className="text-xs text-slate-500">Link another account to your workspace</p>
              </div>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Full Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dhruva Reddy"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
