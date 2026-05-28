"use client";

import Link from "next/link";

import { PassportButton } from "@/features/auth";
import { PlaneIcon } from "@/shared/ui/icons";

export function AppHeader({ active }: { active: "home" | "records" }) {
    return (
        <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-8 shrink-0">
            <div className="flex items-center gap-2.5 text-white">
                <PlaneIcon size={17} />
                {active === "home" ? (
                    <span className="font-semibold tracking-[0.25em] text-[12px] uppercase text-white/75">
                        Flightrail
                    </span>
                ) : (
                    <Link
                        href="/"
                        className="font-semibold tracking-[0.25em] text-[12px] uppercase text-white/75 hover:text-white transition-colors"
                    >
                        Flightrail
                    </Link>
                )}
            </div>
            <nav className="flex items-center gap-2">
                {active === "home" ? (
                    <>
                        <span className="px-3.5 py-2 text-white/60 text-[13px] rounded-xl bg-white/[0.06]">
                            홈
                        </span>
                        <Link
                            href="/records"
                            className="px-3.5 py-2 text-white/30 hover:text-white/60 text-[13px] transition-colors rounded-xl hover:bg-white/5"
                        >
                            기록
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/"
                            className="px-3.5 py-2 text-white/30 hover:text-white/60 text-[13px] transition-colors rounded-xl hover:bg-white/5"
                        >
                            홈
                        </Link>
                        <span className="px-3.5 py-2 text-white/60 text-[13px] rounded-xl bg-white/[0.06]">
                            기록
                        </span>
                    </>
                )}
                <PassportButton />
            </nav>
        </header>
    );
}
