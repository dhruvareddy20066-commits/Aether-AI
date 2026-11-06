import React, { useState } from 'react';
import { UserProfile, GoogleAccount } from '../types';
import { User, Plus } from 'lucide-react';

interface RealGoogleLoginProps {
  onLogin: (user: UserProfile) => void;
  accounts: GoogleAccount[];
  onAddAccount: (acc: GoogleAccount) => void;
}

export const RealGoogleLogin: React.FC<RealGoogleLoginProps> = ({
  onLogin,
  accounts,
  onAddAccount,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || 'acc-1');
  const [isEnteringEmail, setIsEnteringEmail] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);
  const [activeDisplayName, setActiveDisplayName] = useState(accounts[0]?.name || 'Dhruva Reddy');
  const [isLoading, setIsLoading] = useState(false);

  const currentAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const handleSelectExisting = (acc: GoogleAccount) => {
    setSelectedAccountId(acc.id);
    setActiveDisplayName(acc.name);
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: acc.id,
        name: acc.name,
        email: acc.email,
        avatarColor: getAvatarBg(acc.email),
        joinedDate: 'November 2026',
      });
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    const newAcc: GoogleAccount = {
      id: `acc-${Date.now()}`,
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim().toLowerCase(),
      isDefault: false,
    };
    onAddAccount(newAcc);
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: newAcc.id,
        name: newAcc.name,
        email: newAcc.email,
        avatarColor: getAvatarBg(newAcc.email),
        joinedDate: 'November 2026',
      });
    }, 600);
  };

  const handleContinueCurrent = () => {
    if (!currentAccount) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: currentAccount.id,
        name: activeDisplayName.trim() || currentAccount.name,
        email: currentAccount.email,
        avatarColor: getAvatarBg(currentAccount.email),
        joinedDate: 'November 2026',
      });
    }, 600);
  };

  function getAvatarBg(email: string) {
    const colors = [
      'bg-[#0b57d0]',
      'bg-[#0f9d58]',
      'bg-[#673ab7]',
      'bg-[#d93025]',
      'bg-[#e37400]',
    ];
    let hash = 0;
    for (let i = 0; i < email.length; i++) hash += email.charCodeAt(i);
    return colors[hash % colors.length];
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-[#f0f4f9] font-sans overflow-hidden">
      {/* Background realistic image of robot and human conversing - crisp, realistic, and clearly visible */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-100 pointer-events-none"
        style={{ backgroundImage: "url('/background_login.jpg')" }}
      />

      {/* Subtle ambient contrast gradient with no heavy blur so the scene is clearly visible */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/15 to-slate-900/40 pointer-events-none" />

      {/* Subtle glowing lighting accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-300/15 rounded-full blur-2xl pointer-events-none" />

      {/* Top subtle branding badge */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 pt-2">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-white shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-xs font-bold text-slate-800">AetherFinance AI</span>
          <span className="text-[10px] text-slate-500 font-medium hidden sm:inline">• CIA-2 Assignment</span>
        </div>

        <div className="text-[11px] font-semibold text-slate-700 bg-white/90 px-3 py-1 rounded-full border border-white shadow-sm backdrop-blur-md">
          Google Identity Services
        </div>
      </div>

      {/* Authentic Google Sign-in Card (accounts.google.com style) */}
      <div className="relative z-10 w-full max-w-[448px] my-auto">
        <div className="bg-white rounded-[28px] p-8 sm:p-10 border border-[#dadce0] shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
          {/* Authentic Google 'G' Logo */}
          <div className="flex flex-col items-start mb-6">
            <svg viewBox="0 0 24 24" className="w-10 h-10 mb-4" aria-label="Google">
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

            <h1 className="text-2xl font-normal text-[#1f1f1f] tracking-tight">
              {isEnteringEmail ? 'Sign in' : 'Choose an account'}
            </h1>
            <p className="text-sm text-[#444746] mt-1">
              to continue to <span className="font-medium text-[#1a73e8]">AetherFinance AI</span>
            </p>
          </div>

          {/* Loading indicator bar */}
          {isLoading && (
            <div className="w-full h-1 bg-[#e8f0fe] rounded-full overflow-hidden mb-6">
              <div className="w-1/2 h-full bg-[#1a73e8] rounded-full animate-pulse" />
            </div>
          )}

          {!isEnteringEmail ? (
            /* Mode 1: Authentic Google Account Chooser */
            <div className="space-y-1">
              {accounts.map((acc) => {
                const isSelected = acc.id === selectedAccountId;
                return (
                  <div
                    key={acc.id}
                    onClick={() => handleSelectExisting(acc)}
                    className={`flex items-center justify-between py-3.5 px-3 rounded-2xl cursor-pointer transition-colors border-b border-[#f1f3f4] last:border-b-0 ${
                      isSelected ? 'bg-[#f0f4f9]' : 'hover:bg-[#f8fafd]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarBg(
                          acc.email
                        )}`}
                      >
                        {acc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 text-left">
                        <div className="text-sm font-medium text-[#1f1f1f] truncate">
                          {isSelected ? activeDisplayName : acc.name}
                        </div>
                        <div className="text-xs text-[#444746] truncate">{acc.email}</div>
                      </div>
                    </div>

                    {acc.isDefault && (
                      <span className="text-[11px] text-[#444746] font-normal px-2 py-0.5 rounded-full bg-[#f1f3f4]">
                        Default
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Use another account option */}
              <button
                type="button"
                onClick={() => setIsEnteringEmail(true)}
                className="w-full flex items-center gap-3.5 py-3.5 px-3 rounded-2xl hover:bg-[#f8fafd] text-left text-sm font-medium text-[#1f1f1f] transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#444746]">
                  <Plus className="w-4 h-4" />
                </div>
                <span>Use another account</span>
              </button>

              {/* Option to customize/edit name */}
              <div className="pt-4 border-t border-[#f1f3f4] mt-4">
                <div className="flex items-center justify-between text-xs text-[#444746] mb-1">
                  <span>Display name for session:</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingDisplayName(!isEditingDisplayName)}
                    className="text-[#0b57d0] font-medium hover:underline cursor-pointer"
                  >
                    {isEditingDisplayName ? 'Save' : 'Edit name'}
                  </button>
                </div>
                {isEditingDisplayName ? (
                  <input
                    type="text"
                    value={activeDisplayName}
                    onChange={(e) => setActiveDisplayName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#0b57d0] focus:outline-none text-[#1f1f1f]"
                    autoFocus
                  />
                ) : (
                  <div className="text-xs font-semibold text-[#1f1f1f]">
                    {activeDisplayName}
                  </div>
                )}
              </div>

              {/* Continue button */}
              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={handleContinueCurrent}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : `Continue as ${activeDisplayName.split(' ')[0]}`}
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Authentic Google Email / Name Input Field */
            <form onSubmit={handleCustomSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Email input with Google input outline */}
                <div className="relative">
                  <input
                    type="email"
                    required
                    id="google-email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="Email or phone"
                    className="w-full px-4 py-3.5 rounded-lg border border-[#747775] focus:border-[#0b57d0] focus:ring-1 focus:ring-[#0b57d0] outline-none text-sm text-[#1f1f1f] transition-all placeholder:text-[#747775]"
                    autoFocus
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="google-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Full name (optional)"
                    className="w-full px-4 py-3 rounded-lg border border-[#dadce0] focus:border-[#0b57d0] outline-none text-xs text-[#1f1f1f] placeholder:text-[#747775]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setIsEnteringEmail(false)}
                  className="text-xs text-[#0b57d0] font-medium hover:underline block cursor-pointer"
                >
                  Return to account list
                </button>
              </div>

              <div className="text-xs text-[#444746] leading-relaxed">
                To continue, Google will share your name, email address, language preference, and
                profile picture with AetherFinance AI.
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setIsEnteringEmail(false)}
                  className="text-sm font-medium text-[#0b57d0] hover:bg-[#f8fafd] px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs cursor-pointer"
                >
                  {isLoading ? 'Signing in...' : 'Next'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Authentic Google Footer (Language + Privacy + Terms) */}
        <div className="w-full flex items-center justify-between text-xs text-[#444746] px-4 mt-6">
          <div className="hover:text-[#1f1f1f] cursor-pointer">English (United States)</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#1f1f1f] cursor-pointer">Help</span>
            <span className="hover:text-[#1f1f1f] cursor-pointer">Privacy</span>
            <span className="hover:text-[#1f1f1f] cursor-pointer">Terms</span>
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
};
