import asyncHandler from "../../utils/asyncHandler.js";
import * as adminService from "./admin.service.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboardStats();

  res.json({
    success: true,
    message: "Dashboard fetched successfully.",
    data,
  });
});

export const getAdminAnalytics = asyncHandler(async (req, res) => {
  const data = await adminService.getMarketplaceAnalytics();

  res.status(200).json({
    success: true,
    data,
  });
});

export const getVendors = asyncHandler(async (req, res) => {
  const data = await adminService.getVendors();

  res.status(200).json({
    success: true,
    data,
  });
});

export const updateVendorStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await adminService.updateVendorStatus(id, status, req.user);

  res.status(200).json({
    success: true,
    message: `Vendor status updated to ${status}.`,
    data,
  });
});

export const updateVendorRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const data = await adminService.updateVendorRole(id, role, req.user);

  res.status(200).json({
    success: true,
    message: `Vendor role updated to ${role}.`,
    data,
  });
});

export const deleteVendor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await adminService.deleteVendor(id, req.user);

  res.status(200).json(data);
});

export const getAllPlatformUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const data = await adminService.getAllPlatformUsers({ role, search });

  res.status(200).json({
    success: true,
    data,
  });
});

export const getAuditLogs = asyncHandler(async (req, res) => {
  const { portal, limit } = req.query;
  const data = await adminService.getAuditLogs({ portal, limit });

  res.status(200).json({
    success: true,
    data,
  });
});