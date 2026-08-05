import asyncHandler from "../../utils/asyncHandler.js";
import { CATEGORY_MESSAGES } from "./category.constants.js";

import {
  createCategory as createCategoryService,
  getAllCategories as getAllCategoriesService,
  getPublicCategories as getPublicCategoriesService,
  getCategoryById as getCategoryByIdService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
} from "./category.service.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.schema.js";

/* -------------------------------------------------------------------------- */
/*                           Create Category                                  */
/* -------------------------------------------------------------------------- */

export const createCategory = asyncHandler(async (req, res) => {
  console.log("Request body in createCategory controller:", req.body);
  const validatedData = createCategorySchema.parse(req.body);

  console.log("Validated data in createCategory controller:", validatedData);

  const category = await createCategoryService(validatedData, req.file);

  console.log("Created category in createCategory controller:", category);
  res.status(201).json({
    success: true,
    message: CATEGORY_MESSAGES.CREATED,
    data: category,
  });
});

/* -------------------------------------------------------------------------- */
/*                           Get All Categories                               */
/* -------------------------------------------------------------------------- */
export const getPublicCategories = asyncHandler(async (req, res) => {
  const categories = await getPublicCategoriesService();

  res.status(200).json({
    success: true,
    data: categories,
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesService();

  res.status(200).json({
    success: true,
    message: CATEGORY_MESSAGES.FETCHED,
    data: categories,
  });
});

/* -------------------------------------------------------------------------- */
/*                           Get Category By Id                               */
/* -------------------------------------------------------------------------- */

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await getCategoryByIdService(req.params.id);

  res.status(200).json({
    success: true,
    data: category,
  });
});

/* -------------------------------------------------------------------------- */
/*                           Update Category                                  */
/* -------------------------------------------------------------------------- */

export const updateCategory = asyncHandler(async (req, res) => {
  const validatedData = updateCategorySchema.parse(req.body);

  const category = await updateCategoryService(
    req.params.id,
    validatedData,
    req.file,
  );

  res.status(200).json({
    success: true,
    message: CATEGORY_MESSAGES.UPDATED,
    data: category,
  });
});

/* -------------------------------------------------------------------------- */
/*                           Delete Category                                  */
/* -------------------------------------------------------------------------- */

export const deleteCategory = asyncHandler(async (req, res) => {
  await deleteCategoryService(req.params.id);

  res.status(200).json({
    success: true,
    message: CATEGORY_MESSAGES.DELETED,
  });
});
