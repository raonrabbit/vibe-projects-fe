"use client";

import Link from "next/link";

import { PassportButton } from "@/features/auth";
import { PlaneIcon } from "@/shared/ui/icons";

export function AppHeader({ active }: { active: "home" | "records" }) {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between px-5 pt-5 sm:px-10 sm:pt-8">
      <div className="flex items-center gap-2.5 text-white">
        <PlaneIcon size={17} />
        {active === "home" ? (
          <span className="text-[12px] font-semibold tracking-[0.25em] text-white/75 uppercase">
            Flightrail
          </span>
        ) : (
          <Link
            href="/"
            className="text-[12px] font-semibold tracking-[0.25em] text-white/75 uppercase transition-colors hover:text-white"
          >
            Flightrail
          </Link>
        )}
      </div>
      <nav className="flex items-center gap-2">
        {active === "home" ? (
          <>
            <span className="rounded-xl bg-white/[0.06] px-3.5 py-2 text-[13px] text-white/60">
              홈
            </span>
            <Link
              href="/records"
              className="rounded-xl px-3.5 py-2 text-[13px] text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              기록
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/"
              className="rounded-xl px-3.5 py-2 text-[13px] text-white/30 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              홈
            </Link>
            <span className="rounded-xl bg-white/[0.06] px-3.5 py-2 text-[13px] text-white/60">
              기록
            </span>
          </>
        )}
        <PassportButton />
      </nav>
    </header>
  );
}
