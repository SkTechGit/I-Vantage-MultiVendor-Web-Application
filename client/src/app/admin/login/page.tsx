import { Suspense } from "react";
import LoginForm from "@/modules/auth/components/LoginForm";

export const metadata = {
  title: "Admin Login | i-VANTAGE",
  description: "Secure administrator login for i-VANTAGE administration portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
