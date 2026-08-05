import Auth from "./auth.model.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { generateAccessToken } from "../../utils/jwt.js";
import ApiError from "../../utils/ApiError.js";

export const login = async ({ email, password }) => {
  // Find user with password
  const user = await Auth.findOne({ email }).select("+password");

  if (!user) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Check account status
  if (!user.isActive) {
    throw new Error(AUTH_MESSAGES.ACCOUNT_DISABLED);
  }

  // Compare password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    throw new Error(AUTH_MESSAGES.INVALID_CREDENTIALS);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT
  const token = generateAccessToken({
    id: user._id,
    email: user.email,
  });

  // Remove password before sending response
  user.password = undefined;

  return {
    user,
    token,
  };
};