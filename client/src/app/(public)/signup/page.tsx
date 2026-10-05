import { Suspense } from "react";
import SignupForm from "@/modules/auth/components/SignupForm";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Create Account | i-VANTAGE Business Hub",
  description: "Join i-VANTAGE as a Coworking Space Partner or standard client.",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#1E5BFF]" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
