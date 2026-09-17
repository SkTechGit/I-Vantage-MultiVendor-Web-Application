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

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};

export const logout = async () => {
  const { data } = await axiosInstance.post("/auth/logout", {});
  return data;
};

export const refreshTokenApi = async () => {
  const { data } = await axiosInstance.post("/auth/refresh-token", {});
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