import { Router } from "express";
import upload from "../../middlewares/upload.middleware.js";
import { authenticate } from "../auth/auth.middleware.js";

import {
  createCategory,
  getAllCategories,
  getPublicCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";

const router = Router();

// Public
router.get("/", getAllCategories);
router.get("/public", getPublicCategories);
router.get("/:id", getCategoryById);

// Protected

router.post("/", authenticate, upload.single("image"), createCategory);

router.patch("/:id", authenticate, upload.single("image"), updateCategory);

router.delete("/:id", authenticate, deleteCategory);


export default router;
