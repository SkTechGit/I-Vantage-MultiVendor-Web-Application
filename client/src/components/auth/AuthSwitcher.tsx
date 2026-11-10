'use client';

import React, { type ReactNode, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowLeft, User, Building2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundEngine } from '@/lib/soundEngine';
import './AuthSwitcher.css';

export type AuthMode = 'signin' | 'signup';
export type Audience = 'client' | 'professional' | 'admin';

export interface AuthSwitcherProps {
  audience: Audience;
  mode: AuthMode;
  onModeChange: (next: AuthMode) => void;
  onAudienceChange?: (next: Audience) => void;
  signInForm: ReactNode;
  signUpForm?: ReactNode;
  brandName?: string;
}

export function AuthSwitcher({
  audience,
  mode,
  onModeChange,
  onAudienceChange,
  signInForm,
  signUpForm,
  brandName = 'i-VANTAGE',
}: AuthSwitcherProps) {
  const isAdmin = audience === 'admin';
  const signupAllowed = !isAdmin && Boolean(signUpForm);
  const containerRef = useRef<HTMLElement>(null);

  // When switching modes, set focus appropriately to the revealed pane
  useEffect(() => {
    if (!containerRef.current) return;
    const activePane = containerRef.current.querySelector<HTMLElement>(
      mode === 'signin' ? '.auth-pane--signin' : '.auth-pane--signup'
    );
    if (activePane) {
      const heading = activePane.querySelector<HTMLElement>('h1, h2, input');
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      heading?.focus?.();
    }
  }, [mode]);

  return (
    <div className="auth-wrapper">
      {/* Role / Audience Portal Switcher (3 Tabs: Client Portal, Professionals, Admin Console) */}
      {onAudienceChange && (
        <div className="auth-portal-selector" role="tablist" aria-label="Select Portal">
          <div className="auth-portal-tabs">
            <button
              type="button"
              role="tab"
              aria-selected={audience === 'client'}
              className={`auth-portal-tab ${audience === 'client' ? 'is-active' : ''}`}
              data-portal="client"
              onClick={() => {
                if (audience !== 'client') soundEngine.playToggle();
                onAudienceChange('client');
              }}
              onTouchStart={() => soundEngine.triggerHaptic('toggle')}
              onMouseEnter={() => soundEngine.playHover()}
            >
              <User className="w-3.5 h-3.5" />
              <span>Client Portal</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={audience === 'professional'}
              className={`auth-portal-tab ${audience === 'professional' ? 'is-active' : ''}`}
              data-portal="professional"
              onClick={() => {
                if (audience !== 'professional') soundEngine.playToggle();
                onAudienceChange('professional');
              }}
              onTouchStart={() => soundEngine.triggerHaptic('toggle')}
              onMouseEnter={() => soundEngine.playHover()}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Professionals</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={audience === 'admin'}
              className={`auth-portal-tab ${audience === 'admin' ? 'is-active' : ''}`}
              data-portal="admin"
              onClick={() => {
                if (audience !== 'admin') soundEngine.playToggle();
                onAudienceChange('admin');
              }}
              onTouchStart={() => soundEngine.triggerHaptic('toggle')}
              onMouseEnter={() => soundEngine.playHover()}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>
      )}

      <section
        ref={containerRef}
        className={`auth-card ${mode === 'signup' ? 'is-signup' : ''}`}
        aria-label={
          audience === 'admin'
            ? 'Admin authentication'
            : audience === 'professional'
            ? 'Professional authentication'
            : 'Client authentication'
        }
        data-audience={audience}
      >
        {/* Window Titlebar Header (matching reference video) */}
        <div className="auth-card__header">
          <div className="auth-card__dots">
            <span className="auth-card__dot auth-card__dot--close" />
            <span className="auth-card__dot auth-card__dot--minimize" />
            <span className="auth-card__dot auth-card__dot--maximize" />
          </div>
          <div className="auth-card__title">
            {brandName} &bull;{' '}
            {audience === 'admin'
              ? 'ADMIN MANAGEMENT CONSOLE'
              : audience === 'professional'
              ? 'PROFESSIONAL PRACTICE CONSOLE'
              : 'CLIENT INTELLIGENCE HUB'}
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile View: High-Performance Full-Width Sliding Track Stage       */}
        {/* ------------------------------------------------------------------ */}
        <div className="auth-mobile-container sm:hidden">
          {/* Mobile Branded Header Blade with Signature Dark Navy Gradient */}
          <div className="auth-mobile-blade">
            <div className="auth-mobile-blade__glow" />
            <div className="auth-mobile-blade__top">
              <span className="auth-mobile-blade__brand">{brandName}</span>
              <span className="auth-mobile-blade__badge">
                {audience === 'admin'
                  ? 'ADMIN CONSOLE'
                  : audience === 'professional'
                  ? 'PRACTICE CONSOLE'
                  : 'CLIENT HUB'}
              </span>
            </div>

            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="auth-mobile-blade__content"
            >
              <h2 className="auth-mobile-blade__heading">
                {audience === 'admin'
                  ? mode === 'signin'
                    ? 'Admin Console.'
                    : 'Invitation Only.'
                  : audience === 'professional'
                  ? mode === 'signin'
                    ? 'Welcome back.'
                    : 'Verified Practice.'
                  : mode === 'signin'
                  ? 'Welcome back.'
                  : 'Start the first page.'}
              </h2>
              <p className="auth-mobile-blade__sub">
                {audience === 'admin'
                  ? mode === 'signin'
                    ? 'Secure access for authorized enterprise administrators.'
                    : 'Administrative roles are provisioned directly by system security.'
                  : audience === 'professional'
                  ? mode === 'signin'
                    ? 'Direct access to corporate clients, briefs, and retainers.'
                    : "Join India's premier CA, legal, and compliance network."
                  : mode === 'signin'
                  ? 'Your account, your workspace, all in one place.'
                  : 'One account for every board, every draft and every device you own.'}
              </p>
            </motion.div>
          </div>

          {/* Framer Motion Animated Mode Toggle Pills */}
          {signupAllowed && (
            <div className="auth-mobile-tabs" role="tablist" aria-label="Authentication Mode">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                onClick={() => {
                  if (mode !== 'signin') {
                    soundEngine.triggerHaptic('toggle');
                    onModeChange('signin');
                  }
                }}
                className={`auth-mobile-tab ${mode === 'signin' ? 'is-active' : ''}`}
              >
                <span className="relative z-10">Sign In</span>
                {mode === 'signin' && (
                  <motion.div
                    layoutId="authMobileActivePill"
                    className="auth-mobile-tab-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                onClick={() => {
                  if (mode !== 'signup') {
                    soundEngine.triggerHaptic('toggle');
                    onModeChange('signup');
                  }
                }}
                className={`auth-mobile-tab ${mode === 'signup' ? 'is-active' : ''}`}
              >
                <span className="relative z-10">
                  {audience === 'professional' ? 'Join Network' : 'Create Account'}
                </span>
                {mode === 'signup' && (
                  <motion.div
                    layoutId="authMobileActivePill"
                    className="auth-mobile-tab-pill"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
              </button>
            </div>
          )}

          {/* True Full-Width Continuous Horizontal Sliding Stage */}
          <div className="auth-mobile-slider-viewport">
            <motion.div
              className="auth-mobile-slider-track"
              initial={false}
              animate={{ x: mode === 'signin' ? '0%' : '-50%' }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                mass: 0.85,
              }}
            >
              {/* Slide 1: Sign-in Form (100% Mobile Viewport Width) */}
              <div
                className="auth-mobile-slide"
                aria-hidden={mode !== 'signin'}
                {...(mode !== 'signin' ? { inert: true } : {})}
              >
                <div className="auth-mobile-pane">
                  {signInForm}
                </div>
              </div>

              {/* Slide 2: Sign-up Form (100% Mobile Viewport Width) */}
              <div
                className="auth-mobile-slide"
                aria-hidden={mode !== 'signup'}
                {...(mode !== 'signup' ? { inert: true } : {})}
              >
                <div className="auth-mobile-pane">
                  {signupAllowed ? (
                    signUpForm
                  ) : (
                    <AdminInvitationNotice onReturnToSignIn={() => onModeChange('signin')} />
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Desktop / Tablet View: Two-Column Split Stage & Sliding Blade      */}
        {/* ------------------------------------------------------------------ */}
        <div className="auth-stage auth-stage--desktop hidden sm:grid">
          {/* Left Pane: Sign-in (Fixed in Column 1) */}
          <div
            className={`auth-pane auth-pane--signin ${mode === 'signin' ? 'is-active' : ''}`}
            aria-hidden={mode !== 'signin'}
            {...(mode !== 'signin' ? { inert: true } : {})}
          >
            {signInForm}
          </div>

          {/* Right Pane: Sign-up / Admin Invitation Notice (Fixed in Column 2) */}
          <div
            className={`auth-pane auth-pane--signup ${mode === 'signup' ? 'is-active' : ''}`}
            aria-hidden={mode !== 'signup'}
            {...(mode !== 'signup' ? { inert: true } : {})}
          >
            {signupAllowed ? (
              signUpForm
            ) : (
              <AdminInvitationNotice onReturnToSignIn={() => onModeChange('signin')} />
            )}
          </div>

          {/* ONE Travelling Dark Branded Blade (Horizontal translateX only, no opacity fade) */}
          <aside className="auth-blade" aria-hidden="true">
            <span className="auth-blade__brand">{brandName}</span>
            <h2>
              {audience === 'admin'
                ? mode === 'signin'
                  ? 'Admin Console.'
                  : 'Invitation Only.'
                : audience === 'professional'
                ? mode === 'signin'
                  ? 'Welcome back.'
                  : 'Verified Practice.'
                : mode === 'signin'
                ? 'Welcome back.'
                : 'Start the first page.'}
            </h2>
            <p>
              {audience === 'admin'
                ? mode === 'signin'
                  ? 'Secure access for authorized enterprise administrators.'
                  : 'Administrative roles are provisioned directly by system security.'
                : audience === 'professional'
                ? mode === 'signin'
                  ? 'Direct access to corporate clients, briefs, and retainers.'
                  : "Join India's premier CA, legal, and compliance network."
                : mode === 'signin'
                ? 'Your account, your workspace, all in one place.'
                : 'One account for every board, every draft and every device you own.'}
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

interface AdminInvitationNoticeProps {
  onReturnToSignIn: () => void;
}

export function AdminInvitationNotice({ onReturnToSignIn }: AdminInvitationNoticeProps) {
  return (
    <div className="auth-invitation">
      <div className="auth-invitation__icon">
        <ShieldCheck className="size-6" />
      </div>
      <h1>Admin access is invitation-only</h1>
      <p>
        Administrative roles are provisioned directly by system security. Public registration is not permitted.
      </p>
      <button
        type="button"
        onClick={() => {
          soundEngine.playBack();
          onReturnToSignIn();
        }}
        onMouseEnter={() => soundEngine.playHover()}
        className="auth-invitation__btn"
      >
        <ArrowLeft className="size-4" />
        <span>Return to Admin Sign In</span>
      </button>
    </div>
  );
}
