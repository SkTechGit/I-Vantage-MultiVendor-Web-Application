'use client';

import React, { type ReactNode, useEffect, useRef } from 'react';
import { ShieldCheck, ArrowLeft, User, Building2, Award } from 'lucide-react';
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

        {/* Two-Column Stage */}
        <div className="auth-stage">
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
