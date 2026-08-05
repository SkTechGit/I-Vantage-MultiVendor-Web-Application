import Service from "./service.model.js";
import Category from "../category/category.model.js";
import ApiError from "../../utils/ApiError.js";
import { SERVICE_MESSAGES } from "./service.constants.js";

/* -------------------------------------------------------------------------- */
/*                           Create Service                                   */
/* -------------------------------------------------------------------------- */

export const createService = async (data) => {
  const category = await Category.findById(data.category);

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  const exists = await Service.findOne({
    name: data.name,
  });

  if (exists) {
    throw new ApiError(409, SERVICE_MESSAGES.ALREADY_EXISTS);
  }

  return await Service.create(data);
};

/* -------------------------------------------------------------------------- */
/*                           Get All Services                                 */
/* -------------------------------------------------------------------------- */

export const getAllServices = async () => {
  return await Service.find()
    .populate("category", "name slug")
    .sort({
      sortOrder: 1,
      createdAt: -1,
    });
};

/* -------------------------------------------------------------------------- */
/*                              Search Services                               */
/* -------------------------------------------------------------------------- */

export const searchServices = async (query) => {
  return await Service.find({
    isActive: true,

    name: {
      $regex: query,
      $options: "i",
    },
  })
    .populate("category", "name slug")
    .sort({
      sortOrder: 1,
    });
};

export const getServicesByCategory = async (slug) => {
  const category = await Category.findOne({
    slug,
    isActive: true,
  });

  if (!category) {
    throw new ApiError(404, "Category not found.");
  }

  return await Service.find({
    category: category._id,
    isActive: true,
  }).sort({
    sortOrder: 1,
  });
};
/* -------------------------------------------------------------------------- */
/*                           Get Service By Id                                */
/* -------------------------------------------------------------------------- */

export const getServiceById = async (id) => {
  const service = await Service.findById(id).populate(
    "category",
    "name slug"
  );

  if (!service) {
    throw new ApiError(404, SERVICE_MESSAGES.NOT_FOUND);
  }

  return service;
};

/* -------------------------------------------------------------------------- */
/*                           Update Service                                   */
/* -------------------------------------------------------------------------- */

export const updateService = async (id, data) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, SERVICE_MESSAGES.NOT_FOUND);
  }

  if (data.category) {
    const category = await Category.findById(data.category);

    if (!category) {
      throw new ApiError(404, "Category not found.");
    }
  }

  // Prevent duplicate service names
  if (data.name && data.name !== service.name) {
    const exists = await Service.findOne({
      name: data.name,
      _id: { $ne: id },
    });

    if (exists) {
      throw new ApiError(409, SERVICE_MESSAGES.ALREADY_EXISTS);
    }
  }

  Object.assign(service, data);

  await service.save();

  return service;
};

/* -------------------------------------------------------------------------- */
/*                           Delete Service                                   */
/* -------------------------------------------------------------------------- */

export const deleteService = async (id) => {
  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, SERVICE_MESSAGES.NOT_FOUND);
  }

  await service.deleteOne();
};