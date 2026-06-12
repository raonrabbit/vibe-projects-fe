"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { supabase } from "@/shared/lib/supabase";

function Callback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const code = params.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(() => {
        router.push("/auth");
      });
    } else {
      router.push("/auth");
    }
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0806]">
      <p className="text-[13px] tracking-wide text-white/40">인증 처리 중...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <Callback />
    </Suspense>
  );
}
