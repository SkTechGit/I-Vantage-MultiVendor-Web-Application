import React from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";
import Button from "@/components/ui/Button";

export interface TeamInviteFormProps {
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteRole: "vendor" | "super_admin" | "user";
  setInviteRole: (role: "vendor" | "super_admin" | "user") => void;
  submittingInvite: boolean;
  generatedInviteUrl: string | null;
  copied: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCopyLink: () => void;
}

export default function TeamInviteForm({
  inviteEmail,
  setInviteEmail,
  inviteRole,
  setInviteRole,
  submittingInvite,
  generatedInviteUrl,
  copied,
  onSubmit,
  onCopyLink,
}: TeamInviteFormProps) {
  return (
    <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#0A1F66]">
          Issue Secure Team Invitation
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Generate a single-use, 72-hour cryptographic invitation link. The
          recipient will register directly with their pre-authorized role.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="inviteEmail"
            className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
          >
            Recipient Work Email
          </label>
          <input
            id="inviteEmail"
            type="email"
            required
            placeholder="colleague@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="inviteRole"
            className="mb-1.5 block text-sm font-medium text-[#0A1F66]"
          >
            Assign Role
          </label>
          <select
            id="inviteRole"
            value={inviteRole}
            onChange={(e) =>
              setInviteRole(e.target.value as "vendor" | "super_admin" | "user")
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
          >
            <option value="vendor">Vendor (Partner Portal Access)</option>
            <option value="user">User (Standard Access)</option>
            <option value="super_admin">Super Admin (Universal Executive Access)</option>
          </select>
        </div>

        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-slate-600 space-y-1">
          <p className="font-semibold text-[#0A1F66]">
            🔒 Enterprise Security Policy:
          </p>
          <p>
            The invitation token is cryptographically random and strictly
            bound to the specified email address. It expires in 72 hours and
            cannot be reused.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={submittingInvite}
        >
          Generate Invitation Link
        </Button>
      </form>

      {/* Generated Link Display */}
      {generatedInviteUrl && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Invitation Link Ready
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              readOnly
              value={generatedInviteUrl}
              className="w-full rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-mono text-slate-700 outline-none select-all"
            />
            <Button
              size="sm"
              variant="primary"
              onClick={onCopyLink}
              className="shrink-0 flex items-center justify-center gap-1.5"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          <p className="text-xs text-emerald-700">
            Send this link to the team member. They can open it directly to
            complete their signup.
          </p>
        </div>
      )}
    </div>
  );
}
