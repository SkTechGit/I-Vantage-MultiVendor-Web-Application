"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  UserPlus,
  Shield,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Users,
  Key,
  Building,
  User as UserIcon,
  ChevronDown,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
};

import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeEvent } from "@/context/RealtimeContext";
import {
  getTeamMembers,
  getInvitations,
  getAccessRequests,
  createInvitation,
  revokeInvitation,
  approveAccessRequest,
  rejectAccessRequest,
  updateMemberRole,
  toggleMemberStatus,
  deleteTeamMember,
} from "@/modules/auth/auth.api";

interface Member {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

interface Invitation {
  _id: string;
  email: string;
  role: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  invitedBy?: {
    fullName: string;
    email: string;
  };
}

interface AccessRequest {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<
    "members" | "invite" | "requests" | "invitations"
  >("members");

  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "editor">("admin");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(
    null
  );
  const [copied, setCopied] = useState(false);

  // Approval state
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});

  // SuperAdmin role & access management state
  const { user: currentUser } = useAuth();
  const isSuperAdmin =
    currentUser?.role === "super_admin" || currentUser?.role === "superadmin";
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);
  const [togglingStatusId, setTogglingStatusId] = useState<string | null>(null);

  // Delete member modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRoleChange = async (
    memberId: string,
    memberName: string,
    newRole: string
  ) => {
    setUpdatingRoleId(memberId);
    try {
      await updateMemberRole(memberId, newRole);
      setMembers((prev) =>
        prev.map((m) => (m._id === memberId ? { ...m, role: newRole } : m))
      );
      const roleLabel =
        newRole === "super_admin"
          ? "Super Admin"
          : newRole === "admin" || newRole === "vendor"
          ? "Admin / Vendor"
          : "User";
      toast.success(`Role updated to "${roleLabel}" for ${memberName}.`);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update member role."));
      loadData();
    } finally {
      setUpdatingRoleId(null);
    }
  };

  const handleToggleStatus = async (member: Member) => {
    const isSelf = Boolean(
      (currentUser?._id && member._id === currentUser._id) ||
      (currentUser?.id && member._id === currentUser.id) ||
      (currentUser?.email &&
        member.email.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (isSelf) {
      toast.error("You cannot modify your own active status to prevent system lockout.");
      return;
    }

    const currentIsActive = member.isActive !== false && member.status === "active";
    const nextIsActive = !currentIsActive;

    setTogglingStatusId(member._id);

    // Optimistic local state update (instant UI flip)
    setMembers((prev) =>
      prev.map((m) =>
        m._id === member._id
          ? {
              ...m,
              isActive: nextIsActive,
              status: nextIsActive ? "active" : "suspended",
            }
          : m
      )
    );

    try {
      await toggleMemberStatus(member._id, nextIsActive);
      if (nextIsActive) {
        toast.success(`Account for ${member.fullName} is now Active.`);
      } else {
        toast.warning(
          `Account for ${member.fullName} is now Inactive & Blocked across all portals.`
        );
      }
    } catch (err: unknown) {
      // Rollback on failure
      setMembers((prev) =>
        prev.map((m) =>
          m._id === member._id
            ? {
                ...m,
                isActive: currentIsActive,
                status: currentIsActive ? "active" : "suspended",
              }
            : m
        )
      );
      toast.error(getErrorMessage(err, "Failed to update member status."));
      loadData(true);
    } finally {
      setTogglingStatusId(null);
    }
  };

  const handleOpenDeleteModal = (member: Member) => {
    const isSelf = Boolean(
      (currentUser?._id && member._id === currentUser._id) ||
      (currentUser?.id && member._id === currentUser.id) ||
      (currentUser?.email &&
        member.email.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (isSelf) {
      toast.error("You cannot delete your own account to prevent system lockout.");
      return;
    }

    setMemberToDelete(member);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    setIsDeleting(true);
    try {
      await deleteTeamMember(memberToDelete._id);
      setMembers((prev) => prev.filter((m) => m._id !== memberToDelete._id));
      toast.success(
        `Member ${memberToDelete.fullName} (${memberToDelete.email}) permanently removed.`
      );
      setDeleteModalOpen(false);
      setMemberToDelete(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete team member."));
      loadData();
    } finally {
      setIsDeleting(false);
    }
  };


  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [membersData, invitesData, requestsData] = await Promise.all([
        getTeamMembers(),
        getInvitations(),
        getAccessRequests(),
      ]);
      setMembers(membersData || []);
      setInvitations(invitesData || []);
      setRequests(requestsData || []);
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to load team management data.")
      );
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([getTeamMembers(), getInvitations(), getAccessRequests()])
      .then(([membersData, invitesData, requestsData]) => {
        if (!isMounted) return;
        setMembers(membersData || []);
        setInvitations(invitesData || []);
        setRequests(requestsData || []);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        toast.error(
          getErrorMessage(err, "Failed to load team management data.")
        );
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Real-time live synchronization listeners
  useRealtimeEvent("team", "TEAM_MEMBER_STATUS_CHANGED", (payload) => {
    setMembers((prev) =>
      prev.map((m) =>
        m._id === payload.memberId
          ? {
              ...m,
              isActive: payload.isActive,
              status: payload.status,
            }
          : m
      )
    );

    // If updated by someone else, show friendly live notification
    if (payload.updatedBy && payload.updatedBy !== currentUser?.email) {
      toast.info(
        `Live Update: ${payload.fullName}'s status changed to ${payload.isActive ? "Active" : "Inactive"} by ${payload.updatedBy}`
      );
    }
  });

  useRealtimeEvent("team", "TEAM_MEMBER_ROLE_CHANGED", (payload) => {
    setMembers((prev) =>
      prev.map((m) =>
        m._id === payload.memberId ? { ...m, role: payload.newRole } : m
      )
    );
    if (payload.updatedBy && payload.updatedBy !== currentUser?.email) {
      toast.info(
        `Live Update: ${payload.fullName}'s role updated to ${payload.newRole} by ${payload.updatedBy}`
      );
    }
  });

  useRealtimeEvent("team", "TEAM_MEMBER_DELETED", (payload) => {
    setMembers((prev) => prev.filter((m) => m._id !== payload.memberId));
    if (payload.deletedBy && payload.deletedBy !== currentUser?.email) {
      toast.info(
        `Live Update: Member ${payload.fullName || payload.email} was removed by ${payload.deletedBy}`
      );
    }
  });

  useRealtimeEvent("team", "TEAM_INVITATION_UPDATED", () => {
    getInvitations().then((data) => setInvitations(data || [])).catch(() => {});
  });

  useRealtimeEvent("team", "TEAM_REQUEST_UPDATED", () => {
    getAccessRequests().then((data) => setRequests(data || [])).catch(() => {});
    getTeamMembers().then((data) => setMembers(data || [])).catch(() => {});
  });

  const handleGenerateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) {
      toast.error("Please enter a valid work email address.");
      return;
    }

    setSubmittingInvite(true);
    try {
      const res = await createInvitation({
        email: inviteEmail,
        role: inviteRole,
      });

      const rawToken = res.data.rawToken;
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const fullUrl = `${origin}/admin/signup?invite=${rawToken}`;

      setGeneratedInviteUrl(fullUrl);
      setInviteEmail("");
      toast.success(res.message || "Invitation generated successfully!");
      loadData();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to generate invitation.")
      );
    } finally {
      setSubmittingInvite(false);
    }
  };

  const handleCopyLink = () => {
    if (!generatedInviteUrl) return;
    navigator.clipboard.writeText(generatedInviteUrl);
    setCopied(true);
    toast.success("Invitation link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApprove = async (id: string) => {
    const role = selectedRoles[id] || "admin";
    setApprovingId(id);
    try {
      const res = await approveAccessRequest(id, role);
      toast.success(res.message || "Access request approved!");
      loadData();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to approve access request.")
      );
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to reject this access request?")) return;
    setRejectingId(id);
    try {
      const res = await rejectAccessRequest(id);
      toast.success(res.message || "Access request rejected.");
      loadData();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to reject access request.")
      );
    } finally {
      setRejectingId(null);
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this invitation?")) return;
    try {
      await revokeInvitation(id);
      toast.success("Invitation revoked successfully.");
      loadData();
    } catch (err: unknown) {
      toast.error(
        getErrorMessage(err, "Failed to revoke invitation.")
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F66]">
            Team & Access Control
          </h1>
          <p className="text-sm text-slate-500">
            Authorize administrators, issue cryptographically secure invitations,
            and review access requests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(false)}
            loading={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setActiveTab("invite")}
            className="flex items-center gap-1.5"
          >
            <UserPlus size={16} />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          onClick={() => setActiveTab("members")}
          className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md ${
            activeTab === "members" ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Active Team
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1E5BFF]">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#0A1F66]">
              {members.filter((m) => m.isActive !== false && m.status === "active").length}
            </p>
            <span className="text-xs font-semibold text-slate-400">
              / {members.length} Total
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {(() => {
              const inactiveCount = members.filter(
                (m) => m.isActive === false || m.status === "suspended"
              ).length;
              return inactiveCount > 0
                ? `${inactiveCount} blocked / inactive`
                : "All members active & authorized";
            })()}
          </p>
        </div>

        <div
          onClick={() => setActiveTab("requests")}
          className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md ${
            activeTab === "requests" ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Pending Requests
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#0A1F66]">
              {requests.length}
            </p>
            {requests.length > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                Action Required
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Waiting for admin review
          </p>
        </div>

        <div
          onClick={() => setActiveTab("invitations")}
          className={`cursor-pointer rounded-2xl border bg-white p-5 shadow-sm transition hover:border-purple-300 hover:shadow-md ${
            activeTab === "invitations" ? "border-purple-400 ring-2 ring-purple-100" : "border-slate-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">
              Active Invitations
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Key size={20} />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-[#0A1F66]">
            {invitations.filter((i) => i.status === "pending").length}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Valid single-use invite tokens
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "members"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Members ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invite")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "invite"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Invite Team Member
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("requests")}
          className={`relative border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "requests"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Access Requests
          {requests.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {requests.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invitations")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap ${
            activeTab === "invitations"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Invitations History ({invitations.length})
        </button>
      </div>

      {/* TAB 1: MEMBERS */}
      {activeTab === "members" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-[#0A1F66]">
              Authorized Administrators & Team Members
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Users with privileged access to i-VANTAGE administration portal.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Name & Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status & Access</th>
                  <th className="px-6 py-3.5">Last Login</th>
                  <th className="px-6 py-3.5">Registered</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
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
                      (currentUser?._id && member._id === currentUser._id) ||
                      (currentUser?.id && member._id === currentUser.id) ||
                      (currentUser?.email &&
                        member.email.toLowerCase() ===
                          currentUser.email.toLowerCase())
                    );
                    const isMemberActive =
                      member.isActive !== false && member.status === "active";

                    return (
                      <tr key={member._id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">
                            {member.fullName}
                          </div>
                          <div className="text-xs text-slate-400">{member.email}</div>
                        </td>

                        <td className="px-6 py-4">
                          {(() => {
                            if (isSuperAdmin && !isSelf) {
                              const currentVal =
                                member.role === "super_admin"
                                  ? "super_admin"
                                  : member.role === "admin" ||
                                    member.role === "vendor"
                                  ? "admin"
                                  : "user";

                              return (
                                <div className="relative inline-flex items-center">
                                  <select
                                    value={currentVal}
                                    disabled={updatingRoleId === member._id}
                                    onChange={(e) =>
                                      handleRoleChange(
                                        member._id,
                                        member.fullName,
                                        e.target.value
                                      )
                                    }
                                    className={`appearance-none cursor-pointer pl-7 pr-8 py-1.5 text-xs font-semibold rounded-full border transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                                      currentVal === "super_admin"
                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 focus:ring-indigo-400"
                                        : currentVal === "admin"
                                        ? "bg-blue-50 text-[#1E5BFF] border-blue-200 hover:bg-blue-100 focus:ring-blue-400"
                                        : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 focus:ring-slate-400"
                                    }`}
                                    title="Change member role (Super Admin only)"
                                  >
                                    <option value="super_admin">Super Admin</option>
                                    <option value="admin">Admin / Vendor</option>
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
                                    ) : currentVal === "admin" ? (
                                      <Building
                                        size={12}
                                        className="text-[#1E5BFF]"
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
                                  member.role === "super_admin"
                                    ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                    : member.role === "admin" ||
                                      member.role === "vendor"
                                    ? "bg-blue-50 text-[#1E5BFF] border border-blue-200"
                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                                title="Managed by Super Admin"
                              >
                                <Shield size={12} />
                                {member.role === "super_admin"
                                  ? "Super Admin"
                                  : member.role === "admin" ||
                                    member.role === "vendor"
                                  ? "Admin / Vendor"
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
                                disabled={togglingStatusId === member._id}
                                onClick={() => handleToggleStatus(member)}
                                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#1E5BFF] focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed ${
                                  isMemberActive ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                                title={
                                  isMemberActive
                                    ? "Toggle Off to Deactivate & Block member across all portals"
                                    : "Toggle On to Activate member and restore access"
                                }
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                                    isMemberActive ? "translate-x-5" : "translate-x-0"
                                  }`}
                                >
                                  {togglingStatusId === member._id && (
                                    <Loader2
                                      size={10}
                                      className="animate-spin text-slate-500"
                                    />
                                  )}
                                </span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className={`relative inline-flex h-6 w-11 shrink-0 opacity-60 cursor-not-allowed rounded-full border-2 border-transparent ${
                                  isMemberActive ? "bg-emerald-500" : "bg-slate-300"
                                }`}
                                title={
                                  isSelf
                                    ? "Self-lockout safeguard: You cannot deactivate your own account"
                                    : "Only Super Admin can toggle member status"
                                }
                              >
                                <span
                                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 ${
                                    isMemberActive ? "translate-x-5" : "translate-x-0"
                                  }`}
                                />
                              </button>
                            )}

                            {isMemberActive ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                <CheckCircle2 size={12} />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
                                <AlertCircle size={12} />
                                Inactive (Blocked)
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500">
                          {member.lastLogin
                            ? new Date(member.lastLogin).toLocaleString()
                            : "Never"}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-400">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {isSuperAdmin ? (
                            isSelf ? (
                              <span
                                className="inline-flex items-center justify-center p-1.5 text-slate-300 cursor-not-allowed"
                                title="Self-lockout safeguard: You cannot delete your own account"
                              >
                                <Trash2 size={16} />
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(member)}
                                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-200"
                                title={`Delete ${member.fullName} permanently`}
                              >
                                <Trash2 size={16} />
                              </button>
                            )
                          ) : (
                            <span className="text-slate-300 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVITE FORM */}
      {activeTab === "invite" && (
        <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#0A1F66]">
              Issue Secure Team Invitation
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Generate a single-use, 72-hour cryptographic invitation link. The
              recipient will register directly with their pre-authorized role.
            </p>
          </div>

          <form onSubmit={handleGenerateInvite} className="space-y-4">
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
                  setInviteRole(e.target.value as "admin" | "editor")
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#1E5BFF] focus:ring-4 focus:ring-blue-100"
              >
                <option value="admin">Administrator (Full CMS Management)</option>
                <option value="editor">Content Editor (Content & Leads Access)</option>
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
                  onClick={handleCopyLink}
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
      )}

      {/* TAB 3: ACCESS REQUESTS */}
      {activeTab === "requests" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-[#0A1F66]">
              Pending Administrator Access Requests
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Users who registered via public access request and require
              administrative authorization before login is enabled.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Applicant</th>
                  <th className="px-6 py-3.5">Requested Date</th>
                  <th className="px-6 py-3.5">Assign Role</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400">
                      <CheckCircle2
                        size={32}
                        className="mx-auto mb-2 text-emerald-500"
                      />
                      No pending requests. All access applications have been reviewed.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req._id} className="hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">
                          {req.fullName}
                        </div>
                        <div className="text-xs text-slate-400">{req.email}</div>
                      </td>

                      <td className="px-6 py-4 text-xs text-slate-500">
                        {new Date(req.createdAt).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={selectedRoles[req._id] || "admin"}
                          onChange={(e) =>
                            setSelectedRoles((prev) => ({
                              ...prev,
                              [req._id]: e.target.value,
                            }))
                          }
                          className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-[#1E5BFF]"
                        >
                          <option value="admin">Administrator</option>
                          <option value="editor">Content Editor</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="primary"
                          loading={approvingId === req._id}
                          disabled={
                            approvingId === req._id || rejectingId === req._id
                          }
                          onClick={() => handleApprove(req._id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          loading={rejectingId === req._id}
                          disabled={
                            approvingId === req._id || rejectingId === req._id
                          }
                          onClick={() => handleReject(req._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: INVITATIONS HISTORY */}
      {activeTab === "invitations" && (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-[#0A1F66]">
              Invitation History & Token Status
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Audit log of issued administrative invitation tokens.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Invited Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Issued At</th>
                  <th className="px-6 py-3.5">Expires At</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invitations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                      No invitations issued yet.
                    </td>
                  </tr>
                ) : (
                  invitations.map((inv) => {
                    const isExpired =
                      inv.status === "pending" &&
                      new Date() > new Date(inv.expiresAt);

                    return (
                      <tr key={inv._id} className="hover:bg-slate-50/70">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          {inv.email}
                        </td>

                        <td className="px-6 py-4 text-xs capitalize font-medium text-slate-700">
                          {inv.role}
                        </td>

                        <td className="px-6 py-4">
                          {inv.status === "accepted" ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              Accepted
                            </span>
                          ) : inv.status === "revoked" ? (
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                              Revoked
                            </span>
                          ) : isExpired ? (
                            <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 border border-red-200">
                              Expired
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                              Active / Pending
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-xs text-slate-500">
                          {new Date(inv.expiresAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 text-right">
                          {inv.status === "pending" && !isExpired && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevoke(inv._id)}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Revoke
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Member Confirmation Modal */}
      {deleteModalOpen && memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A1F66]">
                  Delete Team Member
                </h3>
                <p className="text-xs text-slate-500">
                  Permanent account deletion & access revocation
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-4 text-xs text-rose-800 space-y-1.5">
              <p className="font-semibold text-rose-900">
                Warning: This action cannot be undone.
              </p>
              <p>
                You are about to permanently remove{" "}
                <strong className="font-bold underline">
                  {memberToDelete.fullName}
                </strong>{" "}
                ({memberToDelete.email}).
              </p>
              <p className="text-rose-700/80">
                This user will be permanently deleted from the database and immediately
                blocked from accessing the partner portal, administration console,
                and all APIs.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMemberToDelete(null);
                }}
              >
                Cancel
              </Button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Deleting Member...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
