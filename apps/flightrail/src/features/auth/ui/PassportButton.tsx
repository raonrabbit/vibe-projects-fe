"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../model/useAuth";

export default function PassportButton() {
    const { user, loading } = useAuth();

    return (
        <Link href="/auth" className="relative group">
            {/* Passport book shape */}
            <div className="relative w-11 h-8 bg-[#0e2318] border border-[#1e4030] rounded-md flex items-center justify-center transition-all duration-150 group-hover:border-[#2e6048] group-hover:bg-[#102a1e]">
                {/* Spine */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0a1a10] rounded-l-md border-r border-black/20" />
                {/* Emblem */}
                <span className="text-[#c8a040] text-[11px] font-bold tracking-wider ml-0.5">
                    P
                </span>
            </div>

            {/* Profile photo badge (logged in) */}
            {!loading && user?.user_metadata?.avatar_url && (
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full overflow-hidden border-2 border-[#0a0806] shadow">
                    <Image
                        src={user.user_metadata.avatar_url as string}
                        alt="profile"
                        width={24}
                        height={24}
                        className="object-cover"
                    />
                </div>
            )}

            {/* Not logged in dot */}
            {!loading && !user && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#0a0806] border border-[#9a9080]/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
                </div>
            )}

            {/* Tooltip */}
            <div className="absolute top-full mt-2 right-0 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded text-[11px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {user ? "내 여권" : "로그인"}
            </div>
        </Link>
    );
}
