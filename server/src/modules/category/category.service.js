import Category from "./category.model.js";
import ApiError from "../../utils/ApiError.js";
import { CATEGORY_MESSAGES } from "./category.constants.js";
import {uploadImage, deleteImage} from "../../utils/cloudinary.js";
import Service from "../services/service.model.js";

/* -------------------------------------------------------------------------- */
/*                           Create Category                                  */
/* -------------------------------------------------------------------------- */

export const createCategory = async (data, file) => {

    console.log("Data received in createCategory:", data);
  // Check duplicate category
  const existingCategory = await Category.findOne({
    name: data.name,
  });

  if (existingCategory) {
    throw new ApiError(409, CATEGORY_MESSAGES.ALREADY_EXISTS);
  }

  let image = {
    url: "",
    publicId: "",
  };

  // Upload image if provided
  console.log("File:", file);
console.log("Buffer exists:", !!file?.buffer);
console.log("Buffer length:", file?.buffer?.length);
  if (file) {
    const uploadedImage = await uploadImage(file, "categories");

    image = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  }

  // Create category
  const category = await Category.create({
    ...data,
    image,
  });

  invalidateCategoriesCache();

  return category;
};

/* -------------------------------------------------------------------------- */
/*                        Public Categories With Services                      */
/* -------------------------------------------------------------------------- */

let publicCategoriesCache = null;
let publicCategoriesCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL

export const invalidateCategoriesCache = () => {
  publicCategoriesCache = null;
  publicCategoriesCacheTime = 0;
};

export const getPublicCategories = async () => {
  const now = Date.now();
  if (publicCategoriesCache && now - publicCategoriesCacheTime < CACHE_TTL_MS) {
    return publicCategoriesCache;
  }

  const [categories, services] = await Promise.all([
    Category.find({ isActive: true })
      .select("name slug description image")
      .sort({ sortOrder: 1 })
      .lean(),
    Service.find({ isActive: true })
      .select("name category slug description image")
      .sort({ sortOrder: 1 })
      .lean(),
  ]);

  const result = categories.map((category) => ({
    ...category,
    services: services.filter(
      (service) => service.category.toString() === category._id.toString()
    ),
  }));

  publicCategoriesCache = result;
  publicCategoriesCacheTime = now;

  return result;
};

/* -------------------------------------------------------------------------- */
/*                           Get All Categories                               */
/* -------------------------------------------------------------------------- */

export const getAllCategories = async () => {
  return await Category.find().sort({
    sortOrder: 1,
    createdAt: -1,
  });
};

/* -------------------------------------------------------------------------- */
/*                           Get Category By Id                               */
/* -------------------------------------------------------------------------- */

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, CATEGORY_MESSAGES.NOT_FOUND);
  }

  return category;
};

/* -------------------------------------------------------------------------- */
/*                           Update Category                                  */
/* -------------------------------------------------------------------------- */

export const updateCategory = async (id, data, file) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, CATEGORY_MESSAGES.NOT_FOUND);
  }

  // Check duplicate name
  if (data.name && data.name !== category.name) {
    const exists = await Category.findOne({ name: data.name });

    if (exists) {
      throw new ApiError(409, CATEGORY_MESSAGES.ALREADY_EXISTS);
    }
  }

  // Replace image
  if (file) {
    if (category.image?.publicId) {
      await deleteImage(category.image.publicId);
    }

    const uploadedImage = await uploadImage(file, "categories");

    category.image = {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    };
  }

  Object.assign(category, data);

  await category.save();
  invalidateCategoriesCache();

  return category;
};

/* -------------------------------------------------------------------------- */
/*                           Delete Category                                  */
/* -------------------------------------------------------------------------- */

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, CATEGORY_MESSAGES.NOT_FOUND);
  }

  if (category.image?.publicId) {
    await deleteImage(category.image.publicId);
  }

  await category.deleteOne();
  invalidateCategoriesCache();
};