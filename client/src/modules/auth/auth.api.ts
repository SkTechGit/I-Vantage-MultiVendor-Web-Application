import axiosInstance from "@/lib/axios";

export const login = async (payload: unknown) => {
  const { data } = await axiosInstance.post("/auth/login", payload);
  return data;
};

export const signup = async (payload: unknown) => {
  const { data } = await axiosInstance.post("/auth/signup", payload);
  return data;
};

export const validateInvitation = async (token: string) => {
  const { data } = await axiosInstance.get(
    `/auth/invitation/validate?token=${encodeURIComponent(token)}`
  );
  return data.data;
};

export const getCurrentUser = async (portal?: string) => {
  let resolvedPortal = portal;
  if (!resolvedPortal && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/admin")) resolvedPortal = "admin";
    else if (window.location.pathname.startsWith("/vendor")) resolvedPortal = "vendor";
  }
  const query = resolvedPortal ? `?portal=${encodeURIComponent(resolvedPortal)}` : "";
  const { data } = await axiosInstance.get(`/auth/me${query}`, {
    headers: resolvedPortal ? { "x-portal": resolvedPortal } : undefined,
  });
  return data;
};

export const getSessionUser = getCurrentUser;

export const logout = async (portal?: string) => {
  let resolvedPortal = portal;
  if (!resolvedPortal && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/admin")) resolvedPortal = "admin";
    else if (window.location.pathname.startsWith("/vendor")) resolvedPortal = "vendor";
  }
  const query = resolvedPortal ? `?portal=${encodeURIComponent(resolvedPortal)}` : "";
  const { data } = await axiosInstance.post(
    `/auth/logout${query}`,
    { portal: resolvedPortal },
    { headers: resolvedPortal ? { "x-portal": resolvedPortal } : undefined }
  );
  return data;
};

export const refreshTokenApi = async (portal?: string) => {
  let resolvedPortal = portal;
  if (!resolvedPortal && typeof window !== "undefined") {
    if (window.location.pathname.startsWith("/admin")) resolvedPortal = "admin";
    else if (window.location.pathname.startsWith("/vendor")) resolvedPortal = "vendor";
  }
  const query = resolvedPortal ? `?portal=${encodeURIComponent(resolvedPortal)}` : "";
  const { data } = await axiosInstance.post(
    `/auth/refresh-token${query}`,
    { portal: resolvedPortal },
    { headers: resolvedPortal ? { "x-portal": resolvedPortal } : undefined }
  );
  return data;
};

/* -------------------------------------------------------------------------- */
/*                            Team Management APIs                            */
/* -------------------------------------------------------------------------- */

export const getTeamMembers = async () => {
  const { data } = await axiosInstance.get("/auth/team/members");
  return data.data;
};

export const createInvitation = async (payload: { email: string; role: string }) => {
  const { data } = await axiosInstance.post("/auth/team/invite", payload);
  return data;
};

export const getInvitations = async () => {
  const { data } = await axiosInstance.get("/auth/team/invitations");
  return data.data;
};

export const revokeInvitation = async (id: string) => {
  const { data } = await axiosInstance.post(`/auth/team/invitations/${id}/revoke`);
  return data;
};

export const getAccessRequests = async () => {
  const { data } = await axiosInstance.get("/auth/team/requests");
  return data.data;
};

export const approveAccessRequest = async (id: string, role: string) => {
  const { data } = await axiosInstance.post(`/auth/team/requests/${id}/approve`, {
    role,
  });
  return data;
};

export const rejectAccessRequest = async (id: string) => {
  const { data } = await axiosInstance.post(`/auth/team/requests/${id}/reject`);
  return data;
};

export const updateMemberRole = async (id: string, role: string) => {
  const { data } = await axiosInstance.patch(`/auth/team/members/${id}/role`, {
    role,
  });
  return data;
};

export const toggleMemberStatus = async (id: string, isActive: boolean) => {
  const { data } = await axiosInstance.patch(`/auth/team/members/${id}/status`, {
    isActive,
  });
  return data;
};

export const deleteTeamMember = async (id: string) => {
  const { data } = await axiosInstance.delete(`/auth/team/members/${id}`);
  return data;
};

/* -------------------------------------------------------------------------- */
/*                  Platform Users & Security Audit Trail APIs                 */
/* -------------------------------------------------------------------------- */

export const getAllPlatformUsers = async (params?: {
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { data } = await axiosInstance.get("/admin/users", { params });
  return data.data;
};

export const getAuditLogs = async (params?: {
  limit?: number;
  action?: string;
  portal?: string;
}) => {
  const { data } = await axiosInstance.get("/admin/audit-logs", { params });
  return data.data;
};

/* -------------------------------------------------------------------------- */
/*                        Vendor Management CRUD APIs                         */
/* -------------------------------------------------------------------------- */

export const updateVendorStatus = async (
  vendorId: string,
  status: "active" | "suspended"
) => {
  const { data } = await axiosInstance.patch(`/admin/vendors/${vendorId}/status`, {
    status,
  });
  return data;
};

export const updateVendorRole = async (vendorId: string, role: string) => {
  const { data } = await axiosInstance.patch(`/admin/vendors/${vendorId}/role`, {
    role,
  });
  return data;
};

export const deleteVendor = async (vendorId: string) => {
  const { data } = await axiosInstance.delete(`/admin/vendors/${vendorId}`);
  return data;
};
