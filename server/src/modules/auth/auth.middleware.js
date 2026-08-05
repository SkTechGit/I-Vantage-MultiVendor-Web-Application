import Auth from "./auth.model.js";
import { AUTH_COOKIE, AUTH_MESSAGES } from "./auth.constants.js";
import { verifyAccessToken } from "../../utils/jwt.js";

// export const authenticate = async (req, res, next) => {
//   try {
//     const token = req.cookies[AUTH_COOKIE.NAME];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: AUTH_MESSAGES.TOKEN_REQUIRED,
//       });
//     }

//     const payload = verifyAccessToken(token);

//     const user = await Auth.findById(payload.id).select("-password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: AUTH_MESSAGES.UNAUTHORIZED,
//       });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: AUTH_MESSAGES.ACCOUNT_DISABLED,
//       });
//     }

//     req.user = user;

//     next();
//   }  catch (error) {
//   console.log("JWT Error:", error);

//   return res.status(401).json({
//     success: false,
//     message: error.message,
//   });
// }
// };

export const authenticate = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies[AUTH_COOKIE.NAME];

    console.log("Token:", token);

    if (!token) {
      console.log("No token");

      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const payload = verifyAccessToken(token);

    console.log("Payload:", payload);

    const user = await Auth.findById(payload.id).select("-password");

    console.log("User:", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log(error);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};