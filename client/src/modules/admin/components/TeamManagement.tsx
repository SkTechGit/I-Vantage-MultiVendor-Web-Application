"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { UserPlus, RefreshCw } from "lucide-react";

import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
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
  getAllPlatformUsers,
  getAuditLogs,
  updateVendorStatus,
  updateVendorRole,
  deleteVendor,
} from "@/modules/auth/auth.api";

import {
  Member,
  Invitation,
  AccessRequest,
  TeamTab,
  PlatformUser,
  SecurityAuditItem,
  TeamMetricsCards,
  TeamMembersTable,
  TeamInviteForm,
  AccessRequestsTable,
  InvitationsHistoryTable,
  VendorsDirectoryTable,
  AuditLogsTable,
} from "./team";

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || fallback;
  }
  return fallback;
};

export default function TeamManagement() {
  const [activeTab, setActiveTab] = useState<TeamTab>("members");
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [vendors, setVendors] = useState<PlatformUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<SecurityAuditItem[]>([]);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"vendor" | "super_admin" | "user">("vendor");
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [generatedInviteUrl, setGeneratedInviteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Approval state
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<{ [key: string]: string }>({});

  // SuperAdmin role & access management state
  const { user: currentUser, refreshUser } = useAuth();
  const isSuperAdmin =
    currentUser?.role === "super_admin" || currentUser?.role === "superadmin";
  const [updatingRoleId, setUpdatingRoleId] = useState<string | null>(null);

  // Delete team member modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Vendor CRUD management states
  const [updatingVendorRoleId, setUpdatingVendorRoleId] = useState<string | null>(null);
  const [updatingVendorStatusId, setUpdatingVendorStatusId] = useState<string | null>(null);
  const [deleteVendorModalOpen, setDeleteVendorModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<PlatformUser | null>(null);
  const [isDeletingVendor, setIsDeletingVendor] = useState(false);

  /* -------------------------------------------------------------------------- */
  /*                       Admin Team Member Actions                            */
  /* -------------------------------------------------------------------------- */
  const handleRoleChange = async (
    memberId: string,
    memberName: string,
    newRole: string
  ) => {
    setUpdatingRoleId(memberId);
    try {
      await updateMemberRole(memberId, newRole);
      const roleLabel =
        newRole === "super_admin" || newRole === "superadmin"
          ? "Super Admin"
          : newRole === "vendor"
          ? "Vendor (Partner)"
          : "User";

      if (newRole === "vendor" || newRole === "user") {
        toast.success(
          `Role updated to "${roleLabel}" for ${memberName}. Moved to Coworking Vendors directory.`
        );
      } else {
        toast.success(`Role updated to "${roleLabel}" for ${memberName}.`);
      }

      await loadData(true);
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

  /* -------------------------------------------------------------------------- */
  /*                  Marketplace Vendor Actions & Handlers                    */
  /* -------------------------------------------------------------------------- */
  const handleToggleVendorStatus = async (vendor: PlatformUser) => {
    const currentIsActive = vendor.status === "active" && vendor.isActive !== false;
    const nextStatus: "active" | "suspended" = currentIsActive ? "suspended" : "active";
    setUpdatingVendorStatusId(vendor._id);

    // Optimistic UI update
    setVendors((prev) =>
      prev.map((v) =>
        v._id === vendor._id
          ? {
              ...v,
              status: nextStatus,
              isActive: nextStatus === "active",
            }
          : v
      )
    );

    try {
      await updateVendorStatus(vendor._id, nextStatus);
      if (nextStatus === "active") {
        toast.success(
          `Partner ${vendor.businessName || vendor.name} is now Active.`
        );
      } else {
        toast.warning(
          `Partner ${vendor.businessName || vendor.name} is now Suspended & Blocked.`
        );
      }
    } catch (err: unknown) {
      // Rollback on failure
      setVendors((prev) =>
        prev.map((v) =>
          v._id === vendor._id
            ? { ...v, status: vendor.status, isActive: vendor.isActive }
            : v
        )
      );
      toast.error(getErrorMessage(err, "Failed to update vendor status."));
      loadVendorsAndAudit();
    } finally {
      setUpdatingVendorStatusId(null);
    }
  };

  const handleVendorRoleChange = async (
    vendorId: string,
    vendorName: string,
    newRole: string
  ) => {
    setUpdatingVendorRoleId(vendorId);
    try {
      await updateVendorRole(vendorId, newRole);
      const roleLabel =
        newRole === "vendor"
          ? "Vendor (Partner)"
          : newRole === "superadmin" || newRole === "super_admin"
          ? "Super Admin"
          : "Marketplace User";

      if (newRole === "superadmin" || newRole === "super_admin") {
        toast.success(
          `Role updated to "${roleLabel}" for ${vendorName}. User promoted and moved to Authorized Administrators.`
        );
      } else {
        toast.success(`Role updated to "${roleLabel}" for ${vendorName}.`);
      }

      await loadData(true);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update vendor role."));
      loadData();
    } finally {
      setUpdatingVendorRoleId(null);
    }
  };

  const handleOpenDeleteVendorModal = (vendor: PlatformUser) => {
    setVendorToDelete(vendor);
    setDeleteVendorModalOpen(true);
  };

  const handleConfirmDeleteVendor = async () => {
    if (!vendorToDelete) return;
    setIsDeletingVendor(true);
    try {
      await deleteVendor(vendorToDelete._id);
      setVendors((prev) => prev.filter((v) => v._id !== vendorToDelete._id));
      toast.success(
        `Partner ${vendorToDelete.businessName || vendorToDelete.name} (${vendorToDelete.email}) permanently removed.`
      );
      setDeleteVendorModalOpen(false);
      setVendorToDelete(null);
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete vendor."));
      loadVendorsAndAudit();
    } finally {
      setIsDeletingVendor(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            Data Fetching                                   */
  /* -------------------------------------------------------------------------- */
  const loadVendorsAndAudit = async () => {
    try {
      const [usersResult, logsResult] = await Promise.allSettled([
        getAllPlatformUsers({ role: "vendor" }),
        getAuditLogs({ limit: 50 }),
      ]);
      if (usersResult.status === "fulfilled" && usersResult.value?.users) {
        setVendors(usersResult.value.users);
      }
      if (logsResult.status === "fulfilled") {
        setAuditLogs(logsResult.value || []);
      }
    } catch {}
  };

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [membersResult, invitesResult, requestsResult] =
        await Promise.allSettled([
          getTeamMembers(),
          getInvitations(),
          getAccessRequests(),
        ]);

      if (membersResult.status === "fulfilled") {
        setMembers(membersResult.value || []);
      }
      if (invitesResult.status === "fulfilled") {
        setInvitations(invitesResult.value || []);
      }
      if (requestsResult.status === "fulfilled") {
        setRequests(requestsResult.value || []);
      }

      await loadVendorsAndAudit();

      if (
        membersResult.status === "rejected" &&
        invitesResult.status === "rejected" &&
        requestsResult.status === "rejected"
      ) {
        toast.error(
          getErrorMessage(membersResult.reason, "Failed to load team management data.")
        );
      }
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
    Promise.allSettled([
      getTeamMembers(),
      getInvitations(),
      getAccessRequests(),
      getAllPlatformUsers({ role: "vendor" }),
      getAuditLogs({ limit: 50 }),
    ])
      .then(([membersResult, invitesResult, requestsResult, vendorsResult, logsResult]) => {
        if (!isMounted) return;
        if (membersResult.status === "fulfilled") {
          setMembers(membersResult.value || []);
        }
        if (invitesResult.status === "fulfilled") {
          setInvitations(invitesResult.value || []);
        }
        if (requestsResult.status === "fulfilled") {
          setRequests(requestsResult.value || []);
        }
        if (vendorsResult.status === "fulfilled" && vendorsResult.value?.users) {
          setVendors(vendorsResult.value.users);
        }
        if (logsResult.status === "fulfilled") {
          setAuditLogs(logsResult.value || []);
        }

        if (
          membersResult.status === "rejected" &&
          invitesResult.status === "rejected" &&
          requestsResult.status === "rejected"
        ) {
          toast.error(
            getErrorMessage(membersResult.reason, "Failed to load team management data.")
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                 Real-time Live Synchronization Listeners                   */
  /* -------------------------------------------------------------------------- */
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
    const isCurrentUserTarget = Boolean(
      (currentUser?._id && payload.memberId === currentUser._id) ||
      (currentUser?.id && payload.memberId === currentUser.id) ||
      (currentUser?.email && payload.email?.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (isCurrentUserTarget) {
      if (payload.newRole !== "super_admin" && payload.newRole !== "superadmin") {
        toast.error("Your Super Administrator privileges have been revoked by an administrator. Redirecting to login...");
        try {
          localStorage.removeItem("iv_user");
          sessionStorage.clear();
        } catch {}
        setTimeout(() => {
          window.location.href = "/admin/login?reason=demoted";
        }, 1200);
      } else {
        toast.info("Your account permissions have been updated. Refreshing session...");
        refreshUser();
      }
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

  // Granular Real-time Vendor Event Handlers
  useRealtimeEvent("users", "VENDOR_STATUS_CHANGED", (payload) => {
    setVendors((prev) =>
      prev.map((v) =>
        v._id === payload.vendorId
          ? { ...v, status: payload.status, isActive: payload.isActive }
          : v
      )
    );
    if (payload.updatedBy && payload.updatedBy !== currentUser?.email) {
      toast.info(
        `Live Update: Partner ${payload.name}'s status changed to ${payload.isActive ? "Active" : "Suspended"}`
      );
    }
  });

  useRealtimeEvent("users", "VENDOR_ROLE_CHANGED", (payload) => {
    setVendors((prev) =>
      prev.map((v) =>
        v._id === payload.vendorId ? { ...v, role: payload.newRole } : v
      )
    );
    if (payload.updatedBy && payload.updatedBy !== currentUser?.email) {
      toast.info(
        `Live Update: Partner ${payload.name}'s role updated to ${payload.newRole}`
      );
    }
  });

  useRealtimeEvent("users", "VENDOR_DELETED", (payload) => {
    setVendors((prev) => prev.filter((v) => v._id !== payload.vendorId));
    if (payload.deletedBy && payload.deletedBy !== currentUser?.email) {
      toast.info(
        `Live Update: Partner ${payload.name || payload.email} was deleted by ${payload.deletedBy}`
      );
    }
  });

  // Real-time Vendor & Admin Login Live Activity Synchronization
  useRealtimeEvent("users", "USER_LOGIN", (payload) => {
    if (!payload?.email && !payload?.userId) return;

    setVendors((prev) =>
      prev.map((v) => {
        const isMatch =
          v._id === payload.userId ||
          (payload.email && v.email?.toLowerCase() === payload.email.toLowerCase());

        if (isMatch) {
          return {
            ...v,
            lastLogin: payload.lastLogin || new Date().toISOString(),
            lastLoginIp: payload.lastLoginIp || payload.ipAddress || v.lastLoginIp || "127.0.0.1",
            loginCount: typeof payload.loginCount === "number" ? payload.loginCount : (v.loginCount || 0) + 1,
          };
        }
        return v;
      })
    );

    setMembers((prev) =>
      prev.map((m) => {
        const isMatch =
          m._id === payload.userId ||
          (payload.email && m.email?.toLowerCase() === payload.email.toLowerCase());

        if (isMatch) {
          return {
            ...m,
            lastLogin: payload.lastLogin || new Date().toISOString(),
          };
        }
        return m;
      })
    );

    loadVendorsAndAudit();
  });

  useRealtimeEvent("team", "USER_LOGIN", (payload) => {
    if (!payload?.email && !payload?.userId) return;

    setVendors((prev) =>
      prev.map((v) => {
        const isMatch =
          v._id === payload.userId ||
          (payload.email && v.email?.toLowerCase() === payload.email.toLowerCase());

        if (isMatch) {
          return {
            ...v,
            lastLogin: payload.lastLogin || new Date().toISOString(),
            lastLoginIp: payload.lastLoginIp || payload.ipAddress || v.lastLoginIp || "127.0.0.1",
            loginCount: typeof payload.loginCount === "number" ? payload.loginCount : (v.loginCount || 0) + 1,
          };
        }
        return v;
      })
    );
  });

  // General users & directory sync (e.g. on new signup, login, role migration)
  useRealtimeEvent("users", () => {
    loadData(true);
  });
  useRealtimeEvent("team", "USER_DIRECTORY_UPDATED", () => {
    loadData(true);
  });
  useRealtimeEvent("users", "USER_DIRECTORY_UPDATED", () => {
    loadData(true);
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
    const role = selectedRoles[id] || "vendor";
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

  /* -------------------------------------------------------------------------- */
  /*                     Calculated Real-Time Metrics                           */
  /* -------------------------------------------------------------------------- */
  const activeMembersCount = members.filter(
    (m) => m.isActive !== false && m.status === "active"
  ).length;

  const activeVendorsCount = vendors.filter(
    (v) => v.status === "active" && v.isActive !== false
  ).length;

  const suspendedVendorsCount = vendors.filter(
    (v) => v.status === "suspended" || v.isActive === false
  ).length;

  const loggedInVendorsCount = vendors.filter(
    (v) => Boolean(v.lastLogin) || (v.loginCount && v.loginCount > 0)
  ).length;

  const neverLoggedInVendorsCount = vendors.length - loggedInVendorsCount;

  const totalVendorLogins = vendors.reduce(
    (sum, v) => sum + (v.loginCount || (v.lastLogin ? 1 : 0)),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0A1F66]">
            Team &amp; Access Control
          </h1>
          <p className="text-sm text-slate-500">
            Authorize administrators, oversee registered marketplace vendors, and monitor real-time logins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadData(false)}
            disabled={loading}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#1E5BFF]" : ""} />
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

      {/* Real-time Metric Cards (Signups, Logins, Sessions, Administrators) */}
      <TeamMetricsCards
        totalVendors={vendors.length}
        activeVendorsCount={activeVendorsCount}
        suspendedVendorsCount={suspendedVendorsCount}
        loggedInVendorsCount={loggedInVendorsCount}
        neverLoggedInVendorsCount={neverLoggedInVendorsCount}
        totalVendorLogins={totalVendorLogins}
        totalMembers={members.length}
        activeMembersCount={activeMembersCount}
        pendingRequestsCount={requests.length}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "members"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Active Administrators ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vendors")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "vendors"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Coworking Vendors ({vendors.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
            activeTab === "audit"
              ? "border-[#1E5BFF] text-[#1E5BFF]"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Login &amp; Activity Stream
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invite")}
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
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
          className={`relative border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
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
          className={`border-b-2 px-5 py-3 text-sm font-semibold transition whitespace-nowrap cursor-pointer ${
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
        <TeamMembersTable
          members={members}
          currentUserId={currentUser?._id || currentUser?.id}
          currentUserEmail={currentUser?.email}
          isSuperAdmin={isSuperAdmin}
          updatingRoleId={updatingRoleId}
          onRoleChange={handleRoleChange}
          onToggleStatus={handleToggleStatus}
          onOpenDeleteModal={handleOpenDeleteModal}
        />
      )}

      {/* TAB 2: VENDORS (Full CRUD identical to TeamMembersTable) */}
      {activeTab === "vendors" && (
        <VendorsDirectoryTable
          vendors={vendors}
          loading={loading}
          isSuperAdmin={isSuperAdmin}
          updatingRoleId={updatingVendorRoleId}
          updatingStatusId={updatingVendorStatusId}
          onRefresh={loadVendorsAndAudit}
          onToggleStatus={handleToggleVendorStatus}
          onRoleChange={handleVendorRoleChange}
          onOpenDeleteModal={handleOpenDeleteVendorModal}
        />
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeTab === "audit" && (
        <AuditLogsTable
          logs={auditLogs}
          loading={loading}
          onRefresh={loadVendorsAndAudit}
        />
      )}

      {/* TAB 4: INVITE FORM */}
      {activeTab === "invite" && (
        <TeamInviteForm
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          inviteRole={inviteRole}
          setInviteRole={setInviteRole}
          submittingInvite={submittingInvite}
          generatedInviteUrl={generatedInviteUrl}
          copied={copied}
          onSubmit={handleGenerateInvite}
          onCopyLink={handleCopyLink}
        />
      )}

      {/* TAB 5: ACCESS REQUESTS */}
      {activeTab === "requests" && (
        <AccessRequestsTable
          requests={requests}
          selectedRoles={selectedRoles}
          onRoleSelectChange={(id: string, role: string) =>
            setSelectedRoles((prev) => ({ ...prev, [id]: role }))
          }
          approvingId={approvingId}
          rejectingId={rejectingId}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* TAB 6: INVITATIONS HISTORY */}
      {activeTab === "invitations" && (
        <InvitationsHistoryTable
          invitations={invitations}
          onRevoke={handleRevoke}
        />
      )}

      {/* Delete Admin Member Confirmation Accessible Modal */}
      {memberToDelete && (
        <ConfirmDialog
          open={deleteModalOpen}
          title="Delete Team Member"
          variant="danger"
          confirmLabel="Yes, Delete Member"
          cancelLabel="Cancel"
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setDeleteModalOpen(false);
            setMemberToDelete(null);
          }}
          description={
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Permanent account deletion &amp; access revocation
              </p>
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3.5 text-xs text-rose-800 space-y-1.5">
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
                  blocked from accessing the administration console and all APIs.
                </p>
              </div>
            </div>
          }
        />
      )}

      {/* Delete Vendor Confirmation Accessible Modal */}
      {vendorToDelete && (
        <ConfirmDialog
          open={deleteVendorModalOpen}
          title="Delete Marketplace Vendor"
          variant="danger"
          confirmLabel="Yes, Delete Vendor"
          cancelLabel="Cancel"
          loading={isDeletingVendor}
          onConfirm={handleConfirmDeleteVendor}
          onCancel={() => {
            setDeleteVendorModalOpen(false);
            setVendorToDelete(null);
          }}
          description={
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Permanent partner deletion &amp; marketplace revocation
              </p>
              <div className="rounded-xl border border-rose-100 bg-rose-50/70 p-3.5 text-xs text-rose-800 space-y-1.5">
                <p className="font-semibold text-rose-900">
                  Warning: This action cannot be undone.
                </p>
                <p>
                  You are about to permanently remove partner{" "}
                  <strong className="font-bold underline">
                    {vendorToDelete.businessName || vendorToDelete.name}
                  </strong>{" "}
                  ({vendorToDelete.email}).
                </p>
                <p className="text-rose-700/80">
                  This partner will be permanently deleted from the database and immediately
                  blocked from accessing the partner portal, managing listings, and accessing APIs.
                </p>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}
