import axiosInstance from "@/lib/axios";

export interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  category: "lead" | "vendor" | "listing" | "security" | "system";
  priority: "high" | "normal" | "low";
  actionUrl: string;
  isRead: boolean;
  readAt?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
}

export interface NotificationsResponse {
  notifications: AdminNotification[];
  unreadCount: number;
  total: number;
}

export const getAdminNotifications = async (params?: {
  category?: string;
  unreadOnly?: boolean;
  limit?: number;
}): Promise<NotificationsResponse> => {
  const query = new URLSearchParams();
  if (params?.category && params.category !== "all") query.set("category", params.category);
  if (params?.unreadOnly) query.set("unreadOnly", "true");
  if (params?.limit) query.set("limit", params.limit.toString());

  const { data } = await axiosInstance.get(`/notifications?${query.toString()}`, {
    headers: { "x-portal": "admin" },
  });
  return data.data;
};

export const markNotificationRead = async (
  id: string
): Promise<{ notification: AdminNotification; unreadCount: number }> => {
  const { data } = await axiosInstance.patch(
    `/notifications/${id}/read`,
    {},
    {
      headers: { "x-portal": "admin" },
    }
  );
  return data.data;
};

export const markAllNotificationsRead = async (): Promise<{
  success: boolean;
  unreadCount: number;
}> => {
  const { data } = await axiosInstance.post(
    `/notifications/mark-all-read`,
    {},
    {
      headers: { "x-portal": "admin" },
    }
  );
  return data.data;
};

export const deleteNotification = async (
  id: string
): Promise<{ success: boolean; unreadCount: number }> => {
  const { data } = await axiosInstance.delete(`/notifications/${id}`, {
    headers: { "x-portal": "admin" },
  });
  return data.data;
};

export const clearAllNotifications = async (): Promise<{
  success: boolean;
  unreadCount: number;
}> => {
  const { data } = await axiosInstance.delete(`/notifications`, {
    headers: { "x-portal": "admin" },
  });
  return data.data;
};
