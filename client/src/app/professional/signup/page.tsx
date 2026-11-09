'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { AuthSwitcher, AuthMode, Audience } from '@/components/auth/AuthSwitcher';
import { ProfessionalSignInForm, ProfessionalSignUpForm } from '@/components/auth/ProfessionalAuthForms';
import { soundEngine } from '@/lib/soundEngine';

function ProfessionalSignupContent() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>('signup');

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    if (typeof window !== 'undefined') {
      const targetPath = nextMode === 'signup' ? '/professional/signup' : '/professional/login';
      window.history.replaceState(null, '', targetPath);
    }
  };

  const handleAudienceChange = (nextAudience: Audience) => {
    if (nextAudience === 'client') {
      router.push('/vendor/login');
    } else if (nextAudience === 'admin') {
      router.push('/admin/login');
    }
  };

  const handleSignInSuccess = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/professional';
    } else {
      router.push('/dashboard/professional');
    }
  };

  const handleSignUpSuccess = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/professional';
    } else {
      router.push('/dashboard/professional');
    }
  };

  return (
    <div className="relative h-[100dvh] max-h-[100dvh] bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center items-center px-3 sm:px-4 py-2 sm:py-3 overflow-hidden selection:bg-[#1E5BFF]/15 selection:text-[#0A1F66]">
      {/* Background ambient branding glows */}
      <div className="absolute top-1/4 -left-20 w-[450px] h-[450px] bg-[#1E5BFF]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#D99000]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand & Navigation Header (Original i-VANTAGE Logo) */}
      <div className="w-full max-w-[940px] mb-1.5 sm:mb-2.5 flex items-center justify-between shrink-0">
        <Link
          href="/"
          onClick={() => soundEngine.playBack()}
          onMouseEnter={() => soundEngine.playHover()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0A1F66] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <Logo href="/" width={80} height={60} priority />
        </div>
      </div>

      {/* The Animated Two-Pane Auth Card */}
      <AuthSwitcher
        audience="professional"
        mode={mode}
        onModeChange={handleModeChange}
        onAudienceChange={handleAudienceChange}
        signInForm={
          <ProfessionalSignInForm
            onSwitchToSignUp={() => handleModeChange('signup')}
            onSuccess={handleSignInSuccess}
          />
        }
        signUpForm={
          <ProfessionalSignUpForm
            onSwitchToSignIn={() => handleModeChange('signin')}
            onSuccess={handleSignUpSuccess}
          />
        }
      />
    </div>
  );
}

export default function ProfessionalSignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        </div>
      }
    >
      <ProfessionalSignupContent />
    </Suspense>
  );
}
