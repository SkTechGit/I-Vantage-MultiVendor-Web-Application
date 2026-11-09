'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { marketplaceApi } from '@/lib/marketplace.api';
import { useAuth } from '@/context/AuthContext';
import { soundEngine } from '@/lib/soundEngine';

interface AdminSignInFormProps {
  onSwitchToNotice: () => void;
  onSuccess: () => void;
}

export function AdminSignInForm({ onSwitchToNotice, onSuccess }: AdminSignInFormProps) {
  const { setUser, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      soundEngine.playError();
      setErrorMessage('Please enter both admin email and password.');
      return;
    }

    soundEngine.playClick();
    setIsLoading(true);

    try {
      const res = await marketplaceApi.login({
        email: cleanEmail,
        password,
        requiredRole: 'super_admin',
      });

      const userData = res?.user || res?.data || res;
      if (userData && (userData.email || userData.name || userData.fullName)) {
        setUser(userData);
      }

      soundEngine.playCelebration();
      toast.success('Identity verified. Welcome to the i-VANTAGE Command Console.');
      onSuccess();
      refreshUser().catch(() => {});
    } catch (err: any) {
      soundEngine.playError();
      const status = err?.response?.status;
      const errData = err?.response?.data;
      const msg =
        errData?.message ||
        errData?.error ||
        err?.message ||
        'Invalid administrative credentials.';

      if (errData?.code === 'ACCOUNT_LOCKED' || status === 429) {
        setErrorMessage(
          msg || 'Too many failed attempts detected. Access is temporarily restricted.'
        );
      } else {
        setErrorMessage(msg);
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F5F9FF] text-[#0A1F66] border border-[#DCE5F5] mb-2">
          <Lock className="w-3 h-3 text-[#D99000]" />
          <span>Restricted Access</span>
        </div>
        <h1 className="auth-form__title">Admin Sign In</h1>
        <p className="auth-form__subtitle">
          Enter administrative credentials to manage leads, funnels, and questions.
        </p>
      </div>

      {errorMessage && (
        <div className="auth-error-banner" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Admin Email Field */}
      <div className="auth-field">
        <label htmlFor="admin-email" className="auth-label">
          Admin Email
        </label>
        <div className="auth-input-wrapper">
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@i-vantage.in"
            className="auth-input"
          />
        </div>
      </div>

      {/* Admin Password Field */}
      <div className="auth-field">
        <label htmlFor="admin-password" className="auth-label">
          Password
        </label>
        <div className="auth-input-wrapper">
          <input
            id="admin-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="auth-input auth-input--with-icon"
          />
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setShowPassword(!showPassword);
            }}
            onMouseEnter={() => soundEngine.playHover()}
            className="auth-input-icon"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        onMouseEnter={() => soundEngine.playHover()}
        className="auth-button-submit"
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            <span>Verifying Admin Credentials...</span>
          </>
        ) : (
          <span>Sign in to Console</span>
        )}
      </button>

      {/* Footer Switcher Line */}
      <p className="auth-switch-footer">
        Need administrative access?
        <button
          type="button"
          onClick={() => {
            soundEngine.playToggle();
            onSwitchToNotice();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="auth-switch-button"
        >
          Invitation policy
        </button>
      </p>
    </form>
  );
}
