import { Router } from "express";
import { authenticate, authorize } from "../auth/auth.middleware.js";
import { authRateLimiter } from "../../middlewares/rateLimit.middleware.js";
import upload from "../../middlewares/upload.middleware.js";
import * as controller from "./professionals.controller.js";

const router = Router();

const proAuth = [authenticate, authorize(["professional", "super_admin"])];
const adminAuth = [authenticate, authorize(["super_admin"])];
const enquiryLimiter = authRateLimiter(15, 15 * 60 * 1000);

/* -------------------------------------------------------------------------- */
/*                                Public Routes                               */
/* -------------------------------------------------------------------------- */

router.get("/", controller.listPublic);
router.get("/facets", controller.getFacets);
router.get("/categories", controller.getCategories);

/* -------------------------------------------------------------------------- */
/*                       Professional Self-Service (/me)                      */
/* -------------------------------------------------------------------------- */

router.get("/me/profile", proAuth, controller.getMyProfile);
router.patch("/me/profile/content", proAuth, controller.updateMyContent);
router.post("/me/profile/photo", proAuth, upload.single("photo"), controller.uploadProfilePhoto);
router.delete("/me/profile/photo", proAuth, controller.removeProfilePhoto);
router.post("/me/profile/cover", proAuth, upload.single("cover"), controller.uploadCoverPhoto);
router.delete("/me/profile/cover", proAuth, controller.removeCoverPhoto);
router.post("/me/profile/document", proAuth, upload.single("document"), controller.uploadProfileDocument);
router.delete("/me/profile/document/:docId", proAuth, controller.deleteProfileDocument);
router.post("/me/profile/portfolio", proAuth, upload.single("portfolio"), controller.uploadPortfolio);
router.delete("/me/profile/portfolio", proAuth, controller.removePortfolio);
router.post("/me/profile/identity", proAuth, controller.requestIdentityChange);
router.post("/me/profile/submit", proAuth, controller.submitForReview);
router.get("/me/enquiries", proAuth, controller.getMyEnquiries);
router.patch("/me/enquiries/:id", proAuth, controller.updateMyEnquiry);

/* -------------------------------------------------------------------------- */
/*                                Admin Routes                                */
/* -------------------------------------------------------------------------- */

router.get("/admin/all", adminAuth, controller.adminList);
router.get("/admin/:id/details", adminAuth, controller.adminGetDetails);
router.patch("/admin/:id/approve", adminAuth, controller.adminApprove);
router.patch("/admin/:id/verify", adminAuth, controller.adminVerify);
router.patch("/admin/:id/suspend", adminAuth, controller.adminSuspend);
router.get("/admin/revisions", adminAuth, controller.adminListRevisions);
router.patch("/admin/revisions/:id/approve", adminAuth, controller.adminApproveRevision);
router.patch("/admin/revisions/:id/reject", adminAuth, controller.adminRejectRevision);
router.get("/admin/enquiries", adminAuth, controller.adminListEnquiries);

/* -------------------------------------------------------------------------- */
/*                        Dynamic Parameterized Slugs                         */
/* -------------------------------------------------------------------------- */

router.get("/:slug", controller.getBySlug);
router.get("/:slug/articles", controller.getArticles);
router.get("/:slug/articles/:articleSlug", controller.getArticleBySlug);
router.get("/:slug/related", controller.getRelated);
router.post("/:slug/enquiries", enquiryLimiter, controller.submitEnquiry);

export default router;
