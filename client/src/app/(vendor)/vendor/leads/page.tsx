"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VendorLeadsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/vendor");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[50vh] text-slate-500 text-sm">
      Redirecting to Vendor Portal...
    </div>
  );
}
