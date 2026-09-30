import { v2 as cloudinary } from "cloudinary";
import MediaAsset from "./media.model.js";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
const apiKey = process.env.CLOUDINARY_API_KEY || "";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "";

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

/**
 * POST /api/v1/media/sign
 * Generates secure, short-lived Cloudinary signature for direct browser upload
 */
export const signUpload = async (req, res, next) => {
  try {
    const { folder = "ivantage/coworking" } = req.body || {};
    const timestamp = Math.round(new Date().getTime() / 1000);

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

    res.status(200).json({
      success: true,
      data: {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/media/register
 * Registers an uploaded media asset into marketplace_media_assets
 */
export const registerMedia = async (req, res, next) => {
  try {
    const { cloudinaryPublicId, secureUrl, width, height, format } = req.body;

    let asset = await MediaAsset.findOne({ cloudinaryPublicId });
    if (!asset) {
      asset = await MediaAsset.create({
        cloudinaryPublicId,
        secureUrl,
        uploadedBy: req.user._id,
        width,
        height,
        format,
      });
    }

    res.status(201).json({
      success: true,
      data: asset,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/v1/media
 * Get media assets uploaded by user or all if admin
 */
export const getMediaAssets = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role !== "super_admin") {
      filter.uploadedBy = req.user._id;
    }

    const assets = await MediaAsset.find(filter).sort("-createdAt").limit(50);
    res.status(200).json({
      success: true,
      data: assets,
    });
  } catch (error) {
    next(error);
  }
};
