import * as notificationService from "./notification.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const { limit, category, unreadOnly } = req.query;
  const data = await notificationService.getNotifications({
    limit,
    category,
    unreadOnly: unreadOnly === "true",
  });

  res.status(200).json({
    success: true,
    data,
  });
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await notificationService.markAsRead(id);

  res.status(200).json({
    success: true,
    data,
  });
});

export const markAllAsRead = asyncHandler(async (req, res) => {
  const data = await notificationService.markAllAsRead();

  res.status(200).json({
    success: true,
    data,
  });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await notificationService.deleteNotification(id);

  res.status(200).json({
    success: true,
    data,
  });
});

export const clearAllNotifications = asyncHandler(async (req, res) => {
  const data = await notificationService.clearAllNotifications();

  res.status(200).json({
    success: true,
    data,
  });
});
