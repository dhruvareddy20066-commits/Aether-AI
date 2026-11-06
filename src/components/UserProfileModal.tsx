import React, { useState } from 'react';
import { UserProfile, GoogleAccount, FinancialProfile } from '../types';
import {
  X,
  User,
  Mail,
  Shield,
  Check,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  accounts: GoogleAccount[];
  finances: FinancialProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onSwitchAccount: (account: GoogleAccount) => void;
  onAddAccount: (account: GoogleAccount) => void;
  onUpdateFinances: (updated: Partial<FinancialProfile>) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  accounts,
  finances,
  onUpdateProfile,
  onSwitchAccount,
  onAddAccount,
  onUpdateFinances,
}) => {
  const [name, setName] = useState(user.name);
  const [selectedColor, setSelectedColor] = useState(user.avatarColor || 'bg-blue-600');
  const [riskTolerance, setRiskTolerance] = useState(finances.riskTolerance);
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const colors = [
    { label: 'Royal Blue', class: 'bg-blue-600' },
    { label: 'Emerald', class: 'bg-emerald-600' },
    { label: 'Deep Indigo', class: 'bg-indigo-600' },
    { label: 'Amethyst', class: 'bg-purple-600' },
    { label: 'Crimson', class: 'bg-rose-600' },
    { label: 'Amber', class: 'bg-amber-600' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: name.trim() || user.name,
      avatarColor: selectedColor,
    });
    onUpdateFinances({
      riskTolerance,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2200);
  };

  const handleCreateGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const account: GoogleAccount = {
      id: `acc-${Date.now()}`,
      name: newName.trim() || newEmail.split('@')[0],
      email: newEmail.trim().toLowerCase(),
      isDefault: false,
    };
    onAddAccount(account);
    onSwitchAccount(account);
    setShowAddGoogleAccount(false);
    setNewEmail('');
    setNewName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-accent rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800">User Profile & Accounts</h2>
              <p className="text-xs text-slate-500">Manage display name and linked Google IDs</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close user profile"
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Avatar Preview & Name Input */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md transition-all ${selectedColor}`}
              >
                {name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">
                Avatar Theme Color
              </label>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <button
                    key={c.class}
                    type="button"
                    onClick={() => setSelectedColor(c.class)}
                    className={`w-7 h-7 rounded-full ${c.class} flex items-center justify-center text-white transition-transform ${
                      selectedColor === c.class ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    {selectedColor === c.class && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Linked Google Accounts Section (Switch Google Accounts) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                Linked Google Accounts
              </span>
              <button
                type="button"
                onClick={() => setShowAddGoogleAccount(true)}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Account</span>
              </button>
            </div>

            <div className="space-y-2">
              {accounts.map((acc) => {
                const isActive = acc.email.toLowerCase() === user.email.toLowerCase();
                return (
                  <div
                    key={acc.id}
                    onClick={() => onSwitchAccount(acc)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all ${
                      isActive
                        ? 'bg-blue-50/90 border-blue-400/80 shadow-xs'
                        : 'bg-white/60 hover:bg-white/90 border-slate-200/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                        {acc.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 truncate">
                            {acc.name}
                          </span>
                          {isActive && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                              Active
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 truncate block">
                          {acc.email}
                        </span>
                      </div>
                    </div>

                    {isActive ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-blue-600 hover:underline">
                        Switch
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Investment & Risk Profile */}
          <div className="p-4 rounded-2xl bg-white/70 border border-white/90 shadow-2xs space-y-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              Financial Advisor Profile
            </span>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Investment Risk Appetite
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Conservative', 'Moderate', 'Aggressive'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setRiskTolerance(level)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      riskTolerance === level
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>

            {isSavedNotice && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </form>

        {/* Add Google Account Submodal */}
        {showAddGoogleAccount && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="glass-panel-accent rounded-3xl p-6 max-w-sm w-full border border-white/90 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Link Another Google Account</h3>
              <form onSubmit={handleCreateGoogleAccount} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Google Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="account@gmail.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Name / Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhruva (Savings)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddGoogleAccount(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Link Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
