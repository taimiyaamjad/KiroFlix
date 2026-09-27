import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClerkUser } from '../types/auth';

interface AuthContextType {
  user: ClerkUser | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  clerkPublishableKey: string;
  setClerkPublishableKey: (key: string) => void;
  openSignIn: () => void;
  openSignUp: () => void;
  openUserProfile: () => void;
  isAuthModalOpen: boolean;
  authModalView: 'sign-in' | 'sign-up' | 'user-profile' | 'clerk-config';
  closeAuthModal: () => void;
  signOut: () => void;
  signInWithEmail: (email: string, pass: string) => Promise<boolean>;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  updatePreferences: (prefs: Partial<ClerkUser['preferences']>) => void;
}

const DEFAULT_USER: ClerkUser = {
  id: 'user_2b9xZ7Y3mKpL0w1',
  firstName: 'Zen',
  lastName: 'Cloud',
  fullName: 'Zen Cloud',
  email: 'zencloud0006@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  username: 'zencloud06',
  createdAt: 1735689600000,
  lastSignInAt: Date.now(),
  twoFactorEnabled: true,
  preferences: {
    preferredAudio: 'ja',
    preferredQuality: '1080p',
    autoPlayNext: true,
    autoSkipIntro: true,
    cinemaBackdrop: true
  }
};

const STORAGE_USER_KEY = 'kuroflix_clerk_user';
const STORAGE_CLERK_KEY_KEY = 'kuroflix_clerk_pk';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ClerkUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clerkPublishableKey, setClerkKey] = useState<string>('pk_test_Y2xlcmsuYW5pbWUuYXBwbGV0LnBsYXRmb3JtJDA0');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'sign-in' | 'sign-up' | 'user-profile' | 'clerk-config'>('sign-in');

  useEffect(() => {
    // Load stored key
    const storedKey = localStorage.getItem(STORAGE_CLERK_KEY_KEY);
    if (storedKey) setClerkKey(storedKey);

    // Load stored user or default to Zen Cloud
    const storedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(DEFAULT_USER);
      }
    } else {
      setUser(DEFAULT_USER);
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(DEFAULT_USER));
    }
    setIsLoaded(true);
  }, []);

  const setClerkPublishableKey = (key: string) => {
    setClerkKey(key);
    localStorage.setItem(STORAGE_CLERK_KEY_KEY, key);
  };

  const openSignIn = () => {
    setAuthModalView('sign-in');
    setIsAuthModalOpen(true);
  };

  const openSignUp = () => {
    setAuthModalView('sign-up');
    setIsAuthModalOpen(true);
  };

  const openUserProfile = () => {
    setAuthModalView('user-profile');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    closeAuthModal();
  };

  const signInWithEmail = async (email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 400));
    const newUser: ClerkUser = {
      ...DEFAULT_USER,
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      email: email.trim(),
      fullName: email.split('@')[0],
      firstName: email.split('@')[0],
      lastSignInAt: Date.now()
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    closeAuthModal();
    return true;
  };

  const signUpWithEmail = async (name: string, email: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 450));
    const newUser: ClerkUser = {
      ...DEFAULT_USER,
      id: 'user_' + Math.random().toString(36).substring(2, 10),
      email: email.trim(),
      fullName: name.trim() || email.split('@')[0],
      firstName: (name.trim() || email.split('@')[0]).split(' ')[0],
      createdAt: Date.now(),
      lastSignInAt: Date.now()
    };
    setUser(newUser);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUser));
    closeAuthModal();
    return true;
  };

  const updatePreferences = (prefs: Partial<ClerkUser['preferences']>) => {
    if (!user) return;
    const updated: ClerkUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...prefs
      }
    };
    setUser(updated);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        isLoaded,
        clerkPublishableKey,
        setClerkPublishableKey,
        openSignIn,
        openSignUp,
        openUserProfile,
        isAuthModalOpen,
        authModalView,
        closeAuthModal,
        signOut,
        signInWithEmail,
        signUpWithEmail,
        updatePreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
