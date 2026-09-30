import MarketplaceService from "./service.model.js";

/**
 * Vendor: GET own services + global services
 */
export const getVendorServices = async (req, res, next) => {
  try {
    const services = await MarketplaceService.find({
      $or: [{ isGlobal: true }, { vendorId: req.user._id }],
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
    const { name, size, price, description } = req.body;
    const service = await MarketplaceService.create({
      name,
      size,
      price,
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
    const service = await MarketplaceService.create({
      ...req.body,
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
