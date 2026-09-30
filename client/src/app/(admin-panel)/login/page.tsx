import { Suspense } from "react";
import LoginForm from "@/modules/auth/components/LoginForm";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}