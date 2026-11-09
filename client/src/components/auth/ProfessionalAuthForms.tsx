'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, Loader2, Award, Briefcase, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { marketplaceApi } from '@/lib/marketplace.api';
import { useAuth } from '@/context/AuthContext';
import { soundEngine } from '@/lib/soundEngine';

interface CategoryOption {
  _id: string;
  name: string;
  label?: string;
  slug: string;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { _id: 'chartered-accountant', name: 'Chartered Accountants', label: 'Chartered Accountant', slug: 'chartered-accountant' },
  { _id: 'tax-gst-consultant', name: 'Tax & GST Consultants', label: 'Tax & GST Consultant', slug: 'tax-gst-consultant' },
  { _id: 'legal-consultant', name: 'Legal Consultants & Advocates', label: 'Legal Consultant', slug: 'legal-consultant' },
  { _id: 'hr-professional', name: 'HR Professionals & Advisors', label: 'HR Professional', slug: 'hr-professional' },
  { _id: 'company-secretary', name: 'Company Secretaries (CS)', label: 'Company Secretary (CS)', slug: 'company-secretary' },
  { _id: 'cost-management-accountant', name: 'Cost & Management Accountants (CMA)', label: 'Cost & Management Accountant (CMA)', slug: 'cost-management-accountant' },
  { _id: 'virtual-cfo-advisor', name: 'Virtual CFOs & Financial Advisors', label: 'Virtual CFO & Financial Advisor', slug: 'virtual-cfo-advisor' },
  { _id: 'ip-trademark-attorney', name: 'IP & Trademark Attorneys', label: 'IP & Trademark Attorney', slug: 'ip-trademark-attorney' },
  { _id: 'startup-valuation-expert', name: 'Startup Valuation & M&A Specialists', label: 'Startup Valuation & M&A Specialist', slug: 'startup-valuation-expert' },
  { _id: 'insolvency-professional', name: 'Insolvency Professionals (IBBI)', label: 'Insolvency Professional (IBBI)', slug: 'insolvency-professional' },
  { _id: 'labor-law-posh-consultant', name: 'Labor Law & POSH Consultants', label: 'Labor Law & POSH Consultant', slug: 'labor-law-posh-consultant' },
  { _id: 'fema-foreign-trade-consultant', name: 'FEMA & Foreign Trade Consultants', label: 'FEMA & Foreign Trade Consultant', slug: 'fema-foreign-trade-consultant' },
];

interface ProfessionalSignInFormProps {
  onSwitchToSignUp: () => void;
  onSuccess: () => void;
}

export function ProfessionalSignInForm({ onSwitchToSignUp, onSuccess }: ProfessionalSignInFormProps) {
  const { setUser, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      soundEngine.playError();
      setErrorMessage('Please enter your professional email and password.');
      return;
    }

    soundEngine.playClick();
    setIsLoading(true);

    try {
      const res = await marketplaceApi.login({
        email: cleanEmail,
        password,
        requiredRole: 'professional',
      });

      const proUser = res?.user || res?.data || res;
      if (typeof window !== 'undefined' && proUser) {
        try {
          localStorage.setItem('iv_pro_user', JSON.stringify(proUser));
        } catch {}
      }

      if (proUser && (proUser.email || proUser.name || proUser.fullName)) {
        setUser(proUser);
      }

      soundEngine.playCelebration();
      toast.success('Identity verified. Welcome to Professional Practice Console.');
      onSuccess();
      refreshUser().catch(() => {});
    } catch (err: any) {
      soundEngine.playError();
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Invalid professional credentials.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-[#B45309] border border-amber-200/80 mb-2">
          <Award className="w-3 h-3 text-[#F4A900]" />
          <span>Verified Professional Portal</span>
        </div>
        <h1 className="auth-form__title">Professional Sign In</h1>
        <p className="auth-form__subtitle">
          Sign in to access client briefs, compliance documents, and practice leads.
        </p>
      </div>

      {errorMessage && (
        <div className="auth-error-banner" role="alert">
          <AlertCircle className="size-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Email Field */}
      <div className="auth-field">
        <label htmlFor="pro-email" className="auth-label">
          Professional Email
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ca@practice.com"
            className="auth-input"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="auth-field">
        <label htmlFor="pro-password" className="auth-label">
          Password
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-password"
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
          href="mailto:contact@i-vantage.in?subject=Professional%20Password%20Reset"
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
            <span>Signing In...</span>
          </>
        ) : (
          <span>Sign in as Professional</span>
        )}
      </button>

      {/* Footer Switcher Line */}
      <p className="auth-switch-footer">
        New professional partner?
        <button
          type="button"
          onClick={() => {
            soundEngine.playToggle();
            onSwitchToSignUp();
          }}
          onMouseEnter={() => soundEngine.playHover()}
          className="auth-switch-button"
        >
          Apply to join network
        </button>
      </p>
    </form>
  );
}

interface ProfessionalSignUpFormProps {
  onSwitchToSignIn: () => void;
  onSuccess: () => void;
}

export function ProfessionalSignUpForm({ onSwitchToSignIn, onSuccess }: ProfessionalSignUpFormProps) {
  const { setUser, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [categoryId, setCategoryId] = useState('chartered-accountant');
  const [categories, setCategories] = useState<CategoryOption[]>(DEFAULT_CATEGORIES);
  const [qualification, setQualification] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedConsent, setAgreedConsent] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/professionals/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setCategories(data.data);
        }
      })
      .catch(() => {});
  }, []);

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
        categoryId: categoryId || undefined,
        qualification: qualification.trim() || undefined,
        password,
        role: 'professional',
      });

      const proUser = res?.user || res?.data || res;
      if (typeof window !== 'undefined' && proUser) {
        try {
          localStorage.setItem('iv_pro_user', JSON.stringify(proUser));
        } catch {}
      }

      if (proUser && (proUser.email || proUser.name || proUser.fullName)) {
        setUser(proUser);
      }

      soundEngine.playCelebration();
      toast.success('Registration submitted! Welcome to the Verified Professional Network.');
      onSuccess();
      refreshUser().catch(() => {});
    } catch (err: any) {
      soundEngine.playError();
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to register. Please check your details.';
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="auth-form">
      <div className="auth-form__header">
        <h1 className="auth-form__title">Join Verified Network</h1>
        <p className="auth-form__subtitle">
          Apply as a verified CA, Legal or Compliance consultant.
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
        <label htmlFor="pro-name" className="auth-label">
          Full name
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Adv. Rahul Sharma"
            className="auth-input"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="auth-field">
        <label htmlFor="pro-signup-email" className="auth-label">
          Professional email
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-signup-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="partner@legalpractice.com"
            className="auth-input"
          />
        </div>
      </div>

      {/* Practice Domain Field */}
      <div className="auth-field">
        <label htmlFor="pro-category" className="auth-label">
          PRACTICE DOMAIN <span className="text-red-500">*</span>
        </label>
        <div className="auth-input-wrapper relative">
          <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            id="pro-category"
            name="categoryId"
            value={categoryId}
            onChange={(e) => {
              soundEngine.playToggle();
              setCategoryId(e.target.value);
            }}
            className="auth-input pl-10 pr-9 bg-white cursor-pointer appearance-none text-slate-900 font-medium"
            required
          >
            {categories.map((c) => (
              <option key={c._id || c.slug} value={c._id || c.slug}>
                {c.label || c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Qualification / Practice Field */}
      <div className="auth-field">
        <label htmlFor="pro-qualification" className="auth-label">
          Practice / Qualification
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-qualification"
            name="qualification"
            type="text"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
            placeholder="e.g. FCA, High Court Advocate, CS"
            className="auth-input"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="auth-field">
        <label htmlFor="pro-signup-password" className="auth-label">
          Password
        </label>
        <div className="auth-input-wrapper">
          <input
            id="pro-signup-password"
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
            <span>Submitting Application...</span>
          </>
        ) : (
          <span>Apply for Verified Practice</span>
        )}
      </button>

      {/* Footer Switcher Line */}
      <p className="auth-switch-footer">
        Already registered?
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
