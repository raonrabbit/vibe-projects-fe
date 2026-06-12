"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../model/useAuth";

export default function PassportButton() {
  const { user, loading } = useAuth();

  return (
    <Link href="/auth" className="group relative">
      {/* Passport book shape */}
      <div className="relative flex h-8 w-11 items-center justify-center rounded-md border border-fr-passport-border bg-fr-passport-cover transition-all duration-150 group-hover:border-[#1e4060] group-hover:bg-[#0c2035]">
        {/* Spine */}
        <div className="absolute top-0 bottom-0 left-0 w-1.5 rounded-l-md border-r border-black/20 bg-fr-passport-spine" />
        {/* Emblem */}
        <span className="ml-0.5 text-[11px] font-bold tracking-wider text-fr-gold">
          P
        </span>
      </div>

      {/* Profile photo badge (logged in) */}
      {!loading && user?.user_metadata?.avatar_url && (
        <div className="absolute -right-1.5 -bottom-1.5 h-6 w-6 overflow-hidden rounded-full border-2 border-fr-base shadow">
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
        <div className="absolute -top-1 -right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-white/20 bg-[#060c18]">
          <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
        </div>
      )}

      {/* Tooltip */}
      <div className="pointer-events-none absolute top-full right-0 mt-2 rounded bg-black/70 px-2.5 py-1 text-[11px] whitespace-nowrap text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        {user ? "내 여권" : "로그인"}
      </div>
    </Link>
  );
}
