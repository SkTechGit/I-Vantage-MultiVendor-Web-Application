import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import serviceRoutes from "../modules/services/service.routes.js";
import leadRoutes from "../modules/leads/lead.routes.js";
import crmRoutes from "../modules/crm/crm.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import blogRoutes from "../modules/blog/blog.routes.js";
import realtimeRoutes from "../modules/realtime/realtime.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/leads", leadRoutes);
router.use("/crm", crmRoutes);
router.use("/admin", adminRoutes);
router.use("/blogs", blogRoutes);
router.use("/realtime", realtimeRoutes);

export default router;