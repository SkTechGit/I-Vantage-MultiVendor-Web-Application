import React from "react";
import {
  Shield,
  Briefcase,
  User as UserIcon,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { Member } from "./team.types";

export interface TeamMembersTableProps {
  members: Member[];
  currentUserId?: string;
  currentUserEmail?: string;
  isSuperAdmin: boolean;
  updatingRoleId: string | null;
  onRoleChange: (memberId: string, memberName: string, newRole: string) => void;
  onToggleStatus: (member: Member) => void;
  onOpenDeleteModal: (member: Member) => void;
}

function formatDateTime(dateStr?: string | Date | null): string {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Never";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr?: string | Date | null): string {
  if (!dateStr) return "Recent";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}

export default function TeamMembersTable({
  members,
  currentUserId,
  currentUserEmail,
  isSuperAdmin,
  updatingRoleId,
  onRoleChange,
  onToggleStatus,
  onOpenDeleteModal,
}: TeamMembersTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      <div className="p-4 sm:p-6 border-b border-slate-200">
        <h2 className="text-lg font-bold text-[#0A1F66]">
          Authorized Administrators & Team Members
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Users with privileged access to i-VANTAGE administration portal.
        </p>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="pl-4 sm:pl-6 pr-2 py-3">Name &amp; Email</th>
              <th className="px-2 py-3">Role</th>
              <th className="px-2 py-3">Status &amp; Access</th>
              <th className="px-2 py-3">Last Login</th>
              <th className="px-2 py-3">Registered</th>
              <th className="pr-4 sm:pr-6 pl-2 py-3 text-center w-12">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No active members found.
                </td>
              </tr>
            ) : (
              members.map((member) => {
                const isSelf = Boolean(
                  (currentUserId && member._id === currentUserId) ||
                  (currentUserEmail &&
                    member.email.toLowerCase() === currentUserEmail.toLowerCase())
                );
                const isMemberActive =
                  member.isActive !== false && member.status === "active";

                return (
                  <tr key={member._id} className="hover:bg-slate-50/70">
                    <td className="pl-4 sm:pl-6 pr-2 py-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[150px] xl:max-w-[200px]" title={member.fullName}>
                        {member.fullName}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[150px] xl:max-w-[200px]" title={member.email}>{member.email}</div>
                    </td>

                    <td className="px-2 py-3">
                      {(() => {
                        if (isSuperAdmin && !isSelf) {
                          const currentVal =
                            member.role === "super_admin" || member.role === "superadmin"
                              ? "super_admin"
                              : member.role === "vendor"
                              ? "vendor"
                              : "user";

                          return (
                            <div className="relative inline-flex items-center">
                              <select
                                value={currentVal}
                                disabled={updatingRoleId === member._id}
                                onChange={(e) =>
                                  onRoleChange(
                                    member._id,
                                    member.fullName,
                                    e.target.value
                                  )
                                }
                                className={`appearance-none cursor-pointer pl-7 pr-8 py-1.5 text-xs font-semibold rounded-full border transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                                  currentVal === "super_admin"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-400"
                                    : currentVal === "vendor"
                                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 focus:ring-amber-400"
                                    : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 focus:ring-slate-400"
                                }`}
                                title="Change member role (Super Admin only)"
                              >
                                <option value="super_admin">Super Admin</option>
                                <option value="vendor">Vendor (Partner)</option>
                                <option value="user">User</option>
                              </select>

                              <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
                                {updatingRoleId === member._id ? (
                                  <Loader2
                                    size={12}
                                    className="animate-spin text-slate-500"
                                  />
                                ) : currentVal === "super_admin" ? (
                                  <Shield
                                    size={12}
                                    className="text-indigo-600"
                                  />
                                ) : currentVal === "vendor" ? (
                                  <Briefcase
                                    size={12}
                                    className="text-amber-600"
                                  />
                                ) : (
                                  <UserIcon
                                    size={12}
                                    className="text-slate-600"
                                  />
                                )}
                              </span>

                              <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <ChevronDown size={11} />
                              </span>
                            </div>
                          );
                        }

                        if (isSelf) {
                          return (
                            <div className="inline-flex items-center gap-1.5">
                              <span
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                                title="You cannot alter your own role"
                              >
                                <Shield size={12} />
                                Super Admin
                              </span>
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 border border-slate-200">
                                You
                              </span>
                            </div>
                          );
                        }

                        return (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                              member.role === "super_admin" || member.role === "superadmin"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : member.role === "vendor"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-slate-100 text-slate-700 border border-slate-200"
                            }`}
                            title="Managed by Super Admin"
                          >
                            {member.role === "super_admin" || member.role === "superadmin" ? (
                              <Shield size={12} />
                            ) : member.role === "vendor" ? (
                              <Briefcase size={12} />
                            ) : (
                              <UserIcon size={12} />
                            )}
                            {member.role === "super_admin" || member.role === "superadmin"
                              ? "Super Admin"
                              : member.role === "vendor"
                              ? "Vendor (Partner)"
                              : "User"}
                          </span>
                        );
                      })()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        {isSuperAdmin && !isSelf ? (
                          <button
                            type="button"
                            role="switch"
                            aria-checked={isMemberActive}
                            onClick={() => onToggleStatus(member)}
                            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF] active:scale-95 ${
                              isMemberActive
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-slate-300 hover:bg-slate-400"
                            }`}
                            title={
                              isMemberActive
                                ? "Toggle Off to Deactivate & Block member across all portals"
                                : "Toggle On to Activate member and restore access"
                            }
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-250 cubic-bezier(0.16, 1, 0.3, 1) ${
                                isMemberActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className={`relative inline-flex h-5 w-9 shrink-0 opacity-50 cursor-not-allowed rounded-full border-2 border-transparent ${
                              isMemberActive ? "bg-emerald-500" : "bg-slate-300"
                            }`}
                            title={
                              isSelf
                                ? "Self-lockout safeguard: You cannot deactivate your own account"
                                : "Only Super Admin can toggle member status"
                            }
                          >
                            <span
                              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 ${
                                isMemberActive ? "translate-x-4" : "translate-x-0"
                              }`}
                            />
                          </button>
                        )}

                        {isMemberActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200 whitespace-nowrap">
                            <CheckCircle2 size={10} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200 whitespace-nowrap">
                            <AlertCircle size={10} />
                            Inactive
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-2 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(member.lastLogin)}
                    </td>

                    <td className="px-2 py-3 text-xs text-slate-400 whitespace-nowrap">
                      {formatDate(member.createdAt)}
                    </td>

                    <td className="pr-4 sm:pr-6 pl-2 py-3 text-center w-12 shrink-0">
                      <div className="flex items-center justify-center">
                        {isSuperAdmin ? (
                          isSelf ? (
                            <span
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-300 cursor-not-allowed"
                              title="Self-lockout safeguard: You cannot delete your own account"
                            >
                              <Trash2 size={15} />
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => onOpenDeleteModal(member)}
                              className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
                              title={`Delete ${member.fullName} permanently`}
                            >
                              <Trash2 size={15} />
                            </button>
                          )
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
