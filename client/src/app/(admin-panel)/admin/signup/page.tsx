import { Suspense } from "react";
import SignupForm from "@/modules/auth/components/SignupForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Admin Signup | i-VANTAGE",
  description: "Secure administrator registration and access portal for i-VANTAGE.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5BFF]" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
