import { Router } from "express";
import * as mediaController from "./media.controller.js";
import { authenticate } from "../auth/auth.middleware.js";

const router = Router();

router.post("/sign", authenticate, mediaController.signUpload);
router.post("/register", authenticate, mediaController.registerMedia);
router.post("/", authenticate, mediaController.registerMedia);
router.get("/", authenticate, mediaController.getMediaAssets);

export default router;
