import { clearAuthCookies } from "@/lib/auth";
import { apiSuccess } from "@/lib/guard";

export async function POST() {
  const response = apiSuccess(null, 200, "Logged out successfully");
  clearAuthCookies(response);
  return response;
}
