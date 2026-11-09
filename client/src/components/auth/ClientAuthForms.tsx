'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { marketplaceApi } from '@/lib/marketplace.api';
import { useAuth } from '@/context/AuthContext';
import { soundEngine } from '@/lib/soundEngine';

interface ClientSignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess: (role?: string) => void;
  portal?: 'vendor' | 'client';
}

export function ClientSignInForm({ onSwitchToSignUp, onSuccess, portal = 'client' }: ClientSignInFormProps) {
  const { setUser, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isVendor = portal === 'vendor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      soundEngine.playError();
      setErrorMessage('Please enter both email and password.');
      return;
    }

    soundEngine.playClick();
    setIsLoading(true);

    try {
      const res = await marketplaceApi.login({
        email: cleanEmail,
        password,
        requiredRole: isVendor ? 'vendor' : undefined,
      });

      const userData = res?.user || res?.data || res;
      if (typeof window !== 'undefined' && userData && isVendor) {
        try {
          localStorage.setItem('iv_vendor_user', JSON.stringify(userData));
        } catch {}
      }

      if (userData && (userData.email || userData.name || userData.fullName)) {
        setUser(userData);
      }

      soundEngine.playCelebration();
      toast.success('Signed in successfully. Welcome back!');
      onSuccess(userData?.role);
      refreshUser().catch(() => {});
    } catch (err: any) {
      soundEngine.playError();
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Invalid email or password. Please verify your credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        {isVendor && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0A1F66] border border-blue-200/80 mb-2">
            <Building2 className="w-3 h-3 text-[#1E5BFF]" />
            <span>Coworking Partner Portal</span>
          </div>
        )}
        <h1 className="auth-form__title">{isVendor ? 'Partner Sign In' : 'Sign in'}</h1>
        <p className="auth-form__subtitle">
          {isVendor
            ? 'Enter credentials to manage listings, inventory and leads.'
            : 'Enter your credentials to access your client dashboard.'}
        </p>
      </div>

      {errorMessage && (
        <div className="auth-error-banner" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email / Username Field */}
      <div className="auth-field">
        <label htmlFor="client-email" className="auth-label">
          {isVendor ? 'Partner Email' : 'Username or email'}
        </label>
        <div className="auth-input-wrapper">
          <input
            id="client-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={isVendor ? 'partner@coworking.com' : 'name@company.com'}
            className="auth-input"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="auth-field">
        <label htmlFor="client-password" className="auth-label">
          Password
        </label>
        <div className="auth-input-wrapper">
          <input
            id="client-password"
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

      {/* Options Row */}
      <div className="auth-options">
        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => {
              soundEngine.playToggle();
              setRememberMe(e.target.checked);
            }}
            className="auth-checkbox"
          />
          <span>Keep me signed in</span>
        </label>
        <a
          href="mailto:contact@i-vantage.in?subject=Password%20Reset%20Request"
          onClick={() => soundEngine.playClick()}
          onMouseEnter={() => soundEngine.playHover()}
          className="auth-link"
        >
          Forgot password?
        </a>
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
            <span>Authenticating...</span>
          </>
        ) : (
          <span>{isVendor ? 'Sign In to Partner Portal' : 'Sign in'}</span>
        )}
      </button>

      {/* Footer Switcher Line */}
      <p className="auth-switch-footer">
        {isVendor ? 'Want to list your coworking space?' : 'New to i-VANTAGE?'}
        <button
          type="button"
          onClick={() => {
            soundEngine.playToggle();
            onSwitchToSignUp();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="auth-switch-button"
        >
          {isVendor ? 'Register as Partner' : 'Create an account'}
        </button>
      </p>
    </form>
  );
}

interface ClientSignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess: () => void;
  portal?: 'vendor' | 'client';
}

export function ClientSignUpForm({ onSwitchToSignIn, onSuccess, portal = 'client' }: ClientSignUpFormProps) {
  const { setUser, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedConsent, setAgreedConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isVendor = portal === 'vendor';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
      soundEngine.playError();
      setErrorMessage('Please fill in your name, email, and password.');
      return;
    }

    if (password.length < 8) {
      soundEngine.playError();
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    if (!agreedConsent) {
      soundEngine.playError();
      setErrorMessage('Please accept the privacy policy to proceed.');
      return;
    }

    soundEngine.playClick();
    setIsLoading(true);

    try {
      const res = await marketplaceApi.register({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone || undefined,
        password,
        businessName: companyName.trim() || undefined,
        role: isVendor ? 'vendor' : 'user',
      });

      const userData = res?.user || res?.data || res;
      if (typeof window !== 'undefined' && userData && isVendor) {
        try {
          localStorage.setItem('iv_vendor_user', JSON.stringify(userData));
        } catch {}
      }

      if (userData && (userData.email || userData.name || userData.fullName)) {
        setUser(userData);
      }

      soundEngine.playCelebration();
      toast.success(isVendor ? 'Partner account registered!' : 'Account created successfully!');
      onSuccess();
      refreshUser().catch(() => {});
    } catch (err: any) {
      soundEngine.playError();
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to create account. Please check your details.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">{isVendor ? 'Register as Partner' : 'Create account'}</h1>
        <p className="auth-form__subtitle">
          {isVendor
            ? 'Join i-VANTAGE to list and scale your coworking workspace.'
            : 'Join i-VANTAGE to benchmark and automate your enterprise.'}
        </p>
      </div>

      {errorMessage && (
        <div className="auth-error-banner" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Name Field */}
      <div className="auth-field">
        <label htmlFor="signup-name" className="auth-label">
          Full name
        </label>
        <div className="auth-input-wrapper">
          <input
            id="signup-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Sharma"
            className="auth-input"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="auth-field">
        <label htmlFor="signup-email" className="auth-label">
          Email address
        </label>
        <div className="auth-input-wrapper">
          <input
            id="signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@company.com"
            className="auth-input"
          />
        </div>
      </div>

      {/* Phone Field */}
      <div className="auth-field">
        <label htmlFor="signup-phone" className="auth-label">
          Mobile number
        </label>
        <div className="auth-input-wrapper">
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="auth-input"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="auth-field">
        <label htmlFor="signup-password" className="auth-label">
          Password
        </label>
        <div className="auth-input-wrapper">
          <input
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
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
        <span className="text-[11px] text-slate-500">
          Use 8+ characters with a mix of letters and numbers.
        </span>
      </div>

      {/* Company Name */}
      <div className="auth-field">
        <label htmlFor="signup-company" className="auth-label">
          {isVendor ? 'Coworking brand / company name' : 'Company name (Optional)'}
        </label>
        <div className="auth-input-wrapper">
          <input
            id="signup-company"
            name="companyName"
            type="text"
            autoComplete="organization"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder={isVendor ? 'Apex Coworking Hub' : 'e.g. Apex Dynamics Ltd'}
            className="auth-input"
          />
        </div>
      </div>

      {/* DPDP Consent */}
      <div className="auth-options">
        <label className="auth-checkbox-label">
          <input
            type="checkbox"
            required
            checked={agreedConsent}
            onChange={(e) => {
              soundEngine.playToggle();
              setAgreedConsent(e.target.checked);
            }}
            className="auth-checkbox"
          />
          <span className="text-[11px] leading-relaxed">
            I agree to the{' '}
            <Link
              href="/privacy-policy"
              onClick={() => soundEngine.playClick()}
              className="auth-link"
            >
              Privacy Policy
            </Link>{' '}
            (DPDP 2023 compliant).
          </span>
        </label>
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
            <span>{isVendor ? 'Registering Partner...' : 'Creating Account...'}</span>
          </>
        ) : (
          <span>{isVendor ? 'Register as Partner' : 'Create account'}</span>
        )}
      </button>

      {/* Footer Switcher Line */}
      <p className="auth-switch-footer">
        Already have an account?
        <button
          type="button"
          onClick={() => {
            soundEngine.playToggle();
            onSwitchToSignIn();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="auth-switch-button"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
