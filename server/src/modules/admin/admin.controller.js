import asyncHandler from "../../utils/asyncHandler.js";
import * as adminService from "./admin.service.js";

export const getDashboardStats = asyncHandler(
  async (req, res) => {
    const data =
      await adminService.getDashboardStats();

    res.json({
      success: true,
      message: "Dashboard fetched successfully.",
      data,
    });
  }
);