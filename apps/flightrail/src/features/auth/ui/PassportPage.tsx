"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../model/useAuth";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function Emblem() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.25"
      />
      <path
        d="M4 32h56M32 4v56"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.2"
      />
      <ellipse
        cx="32"
        cy="32"
        rx="10"
        ry="28"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.15"
      />
      <path
        d="M39 27v-2.5l-8-4.5V14a1.5 1.5 0 0 0-3 0v6l-8 4.5V27l8-2.5V30l-2 1.5V34l3.5-1 3.5 1v-2.5L31 30v-5.5l8 2.5z"
        fill="currentColor"
        fillOpacity="0.7"
      />
    </svg>
  );
}

function MrzLine(text: string, total = 44) {
  const padded = text.padEnd(total, "<").slice(0, total);
  return padded;
}

export default function PassportPage() {
  const { user, loading, signIn, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name as string | undefined;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const mrz1 = MrzLine(
    `P<KOR${(displayName ?? "TRAVELER").toUpperCase().replace(/\s+/g, "<")}`,
  );
  const mrz2 = MrzLine(
    `FL${(user?.id ?? "0".repeat(9)).slice(0, 9).toUpperCase()}6KOR9001011`,
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-fr-base">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-fr-surface via-fr-base to-fr-deep" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(56,189,248,0.05),transparent)]" />

      <Link
        href="/"
        className="relative z-10 flex items-center gap-2 text-[13px] text-white/30 transition-colors hover:text-white/60"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        홈으로
      </Link>

      {/* Passport book */}
      <div className="relative z-10 mx-4 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/80 md:mx-0 md:w-auto md:max-w-none md:flex-row">
        {/* Top page (mobile) / Left page (desktop) — cover */}
        <div className="relative flex w-full flex-col items-center justify-between overflow-hidden bg-fr-passport-cover px-8 py-8 text-fr-gold select-none md:w-72 md:py-10">
          {/* background pattern */}
          <div className="absolute inset-0 opacity-[0.04]">
            {Array.from({ length: 8 }).map((_, r) =>
              Array.from({ length: 6 }).map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="absolute h-12 w-12 rounded-full border border-current"
                  style={{
                    top: r * 56 - 12,
                    left: c * 56 - 12,
                  }}
                />
              )),
            )}
          </div>

          {/* Spine line — right on desktop, bottom on mobile */}
          <div className="absolute top-0 right-0 bottom-0 hidden w-px bg-black/30 md:block" />
          <div className="absolute right-0 bottom-0 left-0 h-px bg-black/30 md:hidden" />

          <div className="text-[9px] tracking-[0.3em] uppercase opacity-50">
            Study Travel Document
          </div>

          <div className="flex flex-col items-center gap-4">
            <Emblem />
            <div className="text-center">
              <p className="mb-1 text-[10px] tracking-[0.35em] uppercase opacity-50">
                Republic of
              </p>
              <p className="text-[26px] leading-none font-bold tracking-wider">
                FLIGHTRAIL
              </p>
              <p className="mt-2 text-[11px] tracking-[0.4em] uppercase opacity-60">
                Passport
              </p>
            </div>
          </div>

          <div className="text-[9px] tracking-widest uppercase opacity-30">
            Study Journal
          </div>
        </div>

        {/* Bottom page (mobile) / Right page (desktop) — data page */}
        <div className="flex w-full flex-col bg-fr-parchment px-7 py-7 md:w-80">
          {/* Photo + basic info */}
          <div className="mb-5 flex gap-4">
            <div className="flex h-28 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-sm border border-fr-parchment-border bg-fr-parchment-dim">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="profile"
                  width={96}
                  height={112}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
                  <circle cx="20" cy="15" r="10" fill="#b8b0a0" />
                  <path
                    d="M0 48c0-11.046 8.954-20 20-20s20 8.954 20 20"
                    fill="#b8b0a0"
                  />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <p className="mb-0.5 text-[8px] tracking-widest text-fr-ink-dim uppercase">
                Surname / Given Name
              </p>
              <p className="truncate text-[13px] leading-snug font-bold text-fr-ink">
                {displayName ?? "— / —"}
              </p>
              <p className="mt-3 mb-0.5 text-[8px] tracking-widest text-fr-ink-dim uppercase">
                Nationality
              </p>
              <p className="text-[12px] font-semibold text-fr-ink">
                FLIGHTRAIL
              </p>
              <p className="mt-3 mb-0.5 text-[8px] tracking-widest text-fr-ink-dim uppercase">
                Status
              </p>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-widest ${
                  user
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-[#e8e0d0] text-fr-ink-dim"
                }`}
              >
                {user ? "ACTIVE" : "NOT ISSUED"}
              </span>
            </div>
          </div>

          {/* Fields grid */}
          <div className="mb-4 grid grid-cols-2 gap-x-5 gap-y-3">
            {[
              {
                label: "Passport No.",
                value: user ? `FL-${user.id.slice(0, 6).toUpperCase()}` : "—",
              },
              {
                label: "Date of Issue",
                value: user ? new Date().toLocaleDateString("en-GB") : "—",
              },
              { label: "Expiry", value: "—" },
              { label: "Provider", value: user ? "Google" : "—" },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="mb-0.5 text-[8px] tracking-widest text-fr-ink-dim uppercase">
                  {label}
                </p>
                <p className="text-[12px] font-semibold text-fr-ink">{value}</p>
              </div>
            ))}
          </div>

          {/* MRZ */}
          <div className="mb-4 border-t border-dashed border-fr-parchment-border pt-3">
            <p className="font-mono text-[8px] leading-relaxed tracking-[0.08em] break-all text-fr-ink-dim">
              {mrz1}
              <br />
              {mrz2}
            </p>
          </div>

          {/* Auth button */}
          <div className="mt-auto">
            {loading ? (
              <div className="h-10 animate-pulse rounded-xl bg-fr-parchment-muted" />
            ) : user ? (
              <button
                onClick={signOut}
                className="w-full rounded-xl border border-fr-parchment-border py-2.5 text-[13px] font-medium text-fr-ink-mid transition-colors hover:bg-fr-parchment-dim"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={signIn}
                className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-fr-parchment-border bg-white py-2.5 text-[13px] font-medium text-fr-ink shadow-sm transition-colors hover:bg-fr-parchment-mid"
              >
                <GoogleIcon />
                Google로 계속하기
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="relative z-10 text-[11px] text-white/20">
        로그인하면 비행 기록이 저장됩니다
      </p>
    </div>
  );
}
