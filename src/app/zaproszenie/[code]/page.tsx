"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ReferralPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();

  useEffect(() => {
    if (code) {
      // Store referral code in sessionStorage, redirect to registration
      sessionStorage.setItem("referral_code", code.toUpperCase());
      router.replace("/rejestracja");
    }
  }, [code, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600 mb-4" />
        <p className="text-muted-foreground">Przekierowanie do rejestracji...</p>
      </div>
    </div>
  );
}
