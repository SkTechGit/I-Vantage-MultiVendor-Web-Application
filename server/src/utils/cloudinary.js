import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";

export const uploadImage = (file, folder = "uploads", options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }

        resolve(result);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};