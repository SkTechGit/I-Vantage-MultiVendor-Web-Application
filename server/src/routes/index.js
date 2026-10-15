import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import categoryRoutes from "../modules/category/category.routes.js";
import serviceRoutes from "../modules/services/service.routes.js";
import leadRoutes from "../modules/leads/lead.routes.js";
import crmRoutes from "../modules/crm/crm.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";
import blogRoutes from "../modules/blog/blog.routes.js";
import realtimeRoutes from "../modules/realtime/realtime.routes.js";
import notificationRoutes from "../modules/notifications/notification.routes.js";
import listingRoutes from "../modules/listings/listing.routes.js";
import amenityRoutes from "../modules/amenities/amenity.routes.js";
import marketplaceCategoryRoutes from "../modules/marketplace-categories/category.routes.js";
import marketplaceServiceRoutes from "../modules/marketplace-services/service.routes.js";
import mediaRoutes from "../modules/media/media.routes.js";
import marketplaceLeadRoutes from "../modules/marketplace-leads/lead.routes.js";
import vendorRoutes from "../modules/vendor/vendor.routes.js";
import newsletterRoutes from "../modules/newsletter/subscriber.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/leads", leadRoutes);
router.use("/crm", crmRoutes);
router.use("/admin", adminRoutes);
router.use("/blogs", blogRoutes);
router.use("/realtime", realtimeRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin/notifications", notificationRoutes);
router.use("/newsletter", newsletterRoutes);

/* Marketplace routes */
router.use("/vendor", vendorRoutes);
router.use("/listings", listingRoutes);
router.use("/amenities", amenityRoutes);
router.use("/marketplace-categories", marketplaceCategoryRoutes);
router.use("/marketplace-services", marketplaceServiceRoutes);
router.use("/media", mediaRoutes);
router.use("/marketplace-leads", marketplaceLeadRoutes);

export default router;