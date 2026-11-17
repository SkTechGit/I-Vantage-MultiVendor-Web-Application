import MarketplaceService from "./service.model.js";
import User from "../users/user.model.js";
import Auth from "../auth/auth.model.js";

/**
 * Infer billing unit dynamically per platform rules:
 * - Coworking / Dedicated Desk / Private Cabin -> month
 * - Meeting Room / Conference Room -> hour (or day if Full-Day)
 * - Day Pass / Event Pass -> day
 */
export const inferServiceUnit = (name = "", categoryName = "", fallback = "month") => {
  const lower = String(name || "").toLowerCase();
  if (lower.includes("hourly") || lower.includes("per-hour") || lower.includes("/hour") || lower.includes("/hr")) {
    return "hour";
  }
  if (lower.includes("full-day") || lower.includes("full day") || lower.includes("meeting room day") || lower.includes("daily") || lower.includes("per-day") || lower.includes("/day")) {
    return "day";
  }
  if (lower.includes("per-year") || lower.includes("yearly") || lower.includes("annual") || lower.includes("/year") || lower.includes("/yr")) {
    return "year";
  }
  if (lower.includes("per-month") || lower.includes("monthly") || lower.includes("/month")) {
    return "month";
  }

  // 1. Meeting Room -> per hour
  if (lower.includes("meeting")) return "hour";
  // 2. Conference Room -> per hour
  if (lower.includes("conference") || lower.includes("confference") || lower.includes("boardroom")) return "hour";
  // 3. Day Pass -> per day
  if (lower.includes("day pass") || lower.includes("daypass") || lower.includes("day paas")) return "day";
  // 4. Event Pass -> per day
  if (lower.includes("event")) return "day";
  // 5. Coworking Price -> per month
  if (lower.includes("coworking") || lower.includes("hot desk") || lower.includes("flexi desk") || lower.includes("open desk")) return "month";
  // 6. Dedicated Seat / Desk -> per month
  if (lower.includes("dedicated") || lower.includes("fixed")) return "month";
  // 7. Virtual Office -> per month (or year if specified)
  if (lower.includes("virtual office") || lower.includes("virtual")) {
    if (lower.includes("annual") || lower.includes("year")) return "year";
    return "month";
  }
  // 8. Private Cabin -> per month
  if (lower.includes("cabin") || lower.includes("office") || lower.includes("suite")) return "month";

  const catLower = String(categoryName || "").toLowerCase();
  if (catLower.includes("meeting")) return "hour";
  if (catLower.includes("conference") || catLower.includes("confference")) return "hour";
  if (catLower.includes("day pass") || catLower.includes("daypass")) return "day";
  if (catLower.includes("event")) return "day";
  if (catLower.includes("virtual")) return "month";
  if (catLower.includes("coworking") || catLower.includes("desk") || catLower.includes("cabin")) return "month";

  return fallback;
};

/**
 * Vendor: GET own services + global services
 */
export const getVendorServices = async (req, res, next) => {
  try {
    const vendorIds = [req.user._id];
    if (req.user?.email) {
      const normalizedEmail = req.user.email.toLowerCase().trim();
      const [uList, aList] = await Promise.all([
        User.find({ email: normalizedEmail }).select("_id").lean(),
        Auth.find({ email: normalizedEmail }).select("_id").lean(),
      ]);
      uList.forEach((u) => vendorIds.push(u._id));
      aList.forEach((a) => vendorIds.push(a._id));
    }

    const services = await MarketplaceService.find({
      $or: [{ isGlobal: true }, { vendorId: { $in: vendorIds } }],
      isActive: true,
    }).sort("-createdAt");

    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: POST create own service
 */
export const createVendorService = async (req, res, next) => {
  try {
    const { name, size, price, unit, description } = req.body;
    const finalUnit = unit || inferServiceUnit(name);

    const service = await MarketplaceService.create({
      name,
      size,
      price,
      unit: finalUnit,
      description,
      isGlobal: false,
      vendorId: req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: PATCH own service
 */
export const updateVendorService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await MarketplaceService.findOne({ _id: id, vendorId: req.user._id });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found or unauthorized." });
    }

    if (req.body.name && !req.body.unit && !service.unit) {
      req.body.unit = inferServiceUnit(req.body.name);
    }

    Object.assign(service, req.body);
    service.isGlobal = false; // ensure vendor cannot change to global
    await service.save();

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Vendor: DELETE own service
 */
export const deleteVendorService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await MarketplaceService.findOneAndDelete({ _id: id, vendorId: req.user._id });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found or unauthorized." });
    }

    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: GET all services
 */
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await MarketplaceService.find().populate("vendorId", "name fullName email businessName").sort("-createdAt");
    res.status(200).json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: POST create service (can set isGlobal: true)
 */
export const createAdminService = async (req, res, next) => {
  try {
    const finalUnit = req.body.unit || inferServiceUnit(req.body.name);
    const service = await MarketplaceService.create({
      ...req.body,
      unit: finalUnit,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: PATCH any service
 */
export const updateAdminService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await MarketplaceService.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin: DELETE any service
 */
export const deleteAdminService = async (req, res, next) => {
  try {
    const { id } = req.params;
    await MarketplaceService.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
