'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { AuthSwitcher, AuthMode, Audience } from '@/components/auth/AuthSwitcher';
import { AdminSignInForm } from '@/components/auth/AdminAuthForms';
import { useAuth } from '@/context/AuthContext';
import { soundEngine } from '@/lib/soundEngine';

function AdminLoginContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');

  useEffect(() => {
    if (user && (user.role === 'superadmin' || user.role === 'super_admin' || user.role === 'admin')) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSignInSuccess = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/dashboard';
    } else {
      router.push('/admin/dashboard');
    }
  };

  const handleAudienceChange = (nextAudience: Audience) => {
    if (nextAudience === 'client') {
      router.push('/vendor/login');
    } else if (nextAudience === 'professional') {
      router.push('/professional/login');
    }
  };

  return (
    <div className="relative min-h-[100dvh] md:h-[100dvh] md:max-h-[100dvh] bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-start md:justify-center items-center px-3 sm:px-4 py-4 md:py-3 overflow-y-auto md:overflow-hidden selection:bg-[#1E5BFF]/15 selection:text-[#0A1F66]">
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

      {/* The Animated Two-Pane Auth Card for Admin */}
      <AuthSwitcher
        audience="admin"
        mode={mode}
        onModeChange={setMode}
        onAudienceChange={handleAudienceChange}
        signInForm={
          <AdminSignInForm
            onSwitchToNotice={() => setMode('signup')}
            onSuccess={handleSignInSuccess}
          />
        }
      />
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E5BFF]" />
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
