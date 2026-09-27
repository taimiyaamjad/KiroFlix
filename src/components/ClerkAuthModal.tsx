import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Key, Shield, User, Mail, Check, LogOut, Sliders } from 'lucide-react';
import { StorageService } from '../services/storageService';

export const ClerkAuthModal: React.FC = () => {
  const {
    user,
    isSignedIn,
    isAuthModalOpen,
    authModalView,
    closeAuthModal,
    signOut,
    signInWithEmail,
    signUpWithEmail,
    updatePreferences,
    clerkPublishableKey,
    setClerkPublishableKey
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'sign-in' | 'sign-up' | 'profile' | 'clerk-config'>('sign-in');
  const [emailInput, setEmailInput] = useState(user?.email || 'zencloud0006@gmail.com');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [pkInput, setPkInput] = useState(clerkPublishableKey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Sync initial tab from context
  React.useEffect(() => {
    if (authModalView === 'user-profile' && isSignedIn) {
      setActiveTab('profile');
    } else if (authModalView === 'sign-up') {
      setActiveTab('sign-up');
    } else {
      setActiveTab(isSignedIn ? 'profile' : 'sign-in');
    }
  }, [authModalView, isSignedIn]);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signInWithEmail(emailInput, passwordInput);
    setIsSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signUpWithEmail(nameInput, emailInput, passwordInput);
    setIsSubmitting(false);
  };

  const handleSaveClerkKey = () => {
    setClerkPublishableKey(pkInput.trim());
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const stats = StorageService.getUserStats();

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-md bg-[#0F131D] border border-[#23293D] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Clerk Header Lockup */}
        <div className="p-5 border-b border-[#1C2234] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Signature Clerk logo icon */}
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-bold text-xs">
              C
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Clerk Authentication</h3>
              <p className="text-[11px] text-neutral-400">Secure Identity & Sync</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#1C2234] bg-[#0B0E16] text-xs font-medium text-neutral-400">
          {!isSignedIn ? (
            <>
              <button
                onClick={() => setActiveTab('sign-in')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'sign-in'
                    ? 'border-red-500 text-white font-semibold'
                    : 'border-transparent hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('sign-up')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'sign-up'
                    ? 'border-red-500 text-white font-semibold'
                    : 'border-transparent hover:text-white'
                }`}
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-red-500 text-white font-semibold'
                    : 'border-transparent hover:text-white'
                }`}
              >
                My Account
              </button>
              <button
                onClick={() => setActiveTab('clerk-config')}
                className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'clerk-config'
                    ? 'border-red-500 text-white font-semibold'
                    : 'border-transparent hover:text-white'
                }`}
              >
                Clerk Key Config
              </button>
            </>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6">
          {/* Sign In View */}
          {activeTab === 'sign-in' && !isSignedIn && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#080A10] border border-[#23293D] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-neutral-300">Password</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-red-400 hover:underline">
                    Forgot?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#080A10] border border-[#23293D] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                {isSubmitting ? 'Authenticating with Clerk...' : 'Continue with Email'}
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-[#1C2234] w-full" />
                <span className="bg-[#0F131D] px-2 text-[10px] text-neutral-500 uppercase tracking-wider absolute">
                  or
                </span>
              </div>

              {/* Social Login Options */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => signInWithEmail('zencloud0006@gmail.com', 'demo')}
                  className="py-2 px-3 bg-[#161B29] hover:bg-[#1E2538] border border-[#23293D] rounded-lg text-xs font-medium text-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="font-bold text-red-500">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => signInWithEmail('zencloud0006@gmail.com', 'demo')}
                  className="py-2 px-3 bg-[#161B29] hover:bg-[#1E2538] border border-[#23293D] rounded-lg text-xs font-medium text-neutral-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="font-bold text-white">🐙</span> GitHub
                </button>
              </div>
            </form>
          )}

          {/* Sign Up View */}
          {activeTab === 'sign-up' && !isSignedIn && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Zen Cloud"
                  className="w-full bg-[#080A10] border border-[#23293D] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Email address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="zencloud0006@gmail.com"
                  className="w-full bg-[#080A10] border border-[#23293D] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">Create Password</label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#080A10] border border-[#23293D] rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md"
              >
                {isSubmitting ? 'Registering with Clerk...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* User Profile View (Signed In) */}
          {activeTab === 'profile' && isSignedIn && user && (
            <div className="space-y-5">
              {/* Profile Card */}
              <div className="flex items-center gap-3.5 p-3.5 bg-[#141826] rounded-xl border border-[#22283D]">
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500/50"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{user.fullName}</h4>
                  <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-1">
                    <Shield className="w-3 h-3" />
                    <span>Clerk Verified · 2FA Active</span>
                  </div>
                </div>
              </div>

              {/* Personalized Watch Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 bg-[#0C0F17] rounded-lg border border-[#1E2436]">
                  <span className="text-neutral-500 text-[10px] block">Watched</span>
                  <span className="font-bold text-white font-mono-numbers">{stats.hoursWatched} hrs</span>
                </div>
                <div className="p-2.5 bg-[#0C0F17] rounded-lg border border-[#1E2436]">
                  <span className="text-neutral-500 text-[10px] block">Completed</span>
                  <span className="font-bold text-white font-mono-numbers">{stats.completedEpisodesCount} eps</span>
                </div>
                <div className="p-2.5 bg-[#0C0F17] rounded-lg border border-[#1E2436]">
                  <span className="text-neutral-500 text-[10px] block">Watchlist</span>
                  <span className="font-bold text-white font-mono-numbers">{stats.watchlistTotal} titles</span>
                </div>
              </div>

              {/* Streaming Preferences */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-semibold text-neutral-300 block">Streaming Preferences</span>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-neutral-400">Default Audio Track</span>
                  <select
                    value={user.preferences.preferredAudio}
                    onChange={(e) => updatePreferences({ preferredAudio: e.target.value as any })}
                    className="bg-[#080A10] border border-[#23293D] rounded px-2 py-1 text-white text-xs outline-none"
                  >
                    <option value="ja">Japanese (Original Sub)</option>
                    <option value="en">English (Dub)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-neutral-400">Default Stream Quality</span>
                  <select
                    value={user.preferences.preferredQuality}
                    onChange={(e) => updatePreferences({ preferredQuality: e.target.value as any })}
                    className="bg-[#080A10] border border-[#23293D] rounded px-2 py-1 text-white text-xs outline-none"
                  >
                    <option value="1080p">1080p Ultra HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p SD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-neutral-400">Auto-Skip Openings</span>
                  <input
                    type="checkbox"
                    checked={user.preferences.autoSkipIntro}
                    onChange={(e) => updatePreferences({ autoSkipIntro: e.target.checked })}
                    className="rounded accent-red-600"
                  />
                </div>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={signOut}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-red-400 hover:text-red-300 text-xs font-semibold rounded-lg border border-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out of Clerk</span>
              </button>
            </div>
          )}

          {/* Clerk Key Configuration View */}
          {activeTab === 'clerk-config' && (
            <div className="space-y-4 text-xs">
              <p className="text-neutral-400">
                To connect your live production Clerk instance, enter your Clerk Publishable Key (from your Clerk dashboard):
              </p>

              <div>
                <label className="block text-neutral-300 font-medium mb-1.5">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={pkInput}
                    onChange={(e) => setPkInput(e.target.value)}
                    placeholder="pk_test_..."
                    className="w-full bg-[#080A10] border border-[#23293D] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-neutral-600 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#121622] rounded-lg border border-[#1E2436] text-[11px] text-neutral-400 space-y-1">
                <span className="font-semibold text-white block">Next.js & Clerk Integration Note:</span>
                <p>When running on Vercel with Next.js, Clerk middleware protects routes at <code>middleware.ts</code> and syncs authenticated sessions with JWT tokens.</p>
              </div>

              <button
                onClick={handleSaveClerkKey}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {saveToast ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Publishable Key Saved!</span>
                  </>
                ) : (
                  <span>Update Clerk Credentials</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
