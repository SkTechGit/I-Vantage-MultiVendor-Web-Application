import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "bsxx9sce";
const apiKey = process.env.CLOUDINARY_API_KEY || "737697222739134";
const apiSecret = process.env.CLOUDINARY_API_SECRET || "t91S2HoxNQyDi4O2JCURy4tWn0w";

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export function generateUploadSignature(folder = "ivantage/coworking") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
  };
}

export default cloudinary;
