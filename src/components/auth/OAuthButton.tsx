'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

interface OAuthButtonProps {
  provider: 'google' | 'github' | 'apple';
  label: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

export default function OAuthButton({ provider, label, icon, disabled = false }: OAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      await signIn(provider, { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#0f1419] disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={label}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        icon
      )}
      <span>{loading ? 'Connecting...' : label}</span>
    </button>
  );
}
