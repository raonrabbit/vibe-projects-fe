"use client";

import type { User } from "@supabase/supabase-js";
import type { MercariItem } from "@/entities/item/model";

type Tab = "search" | "favorites";

interface AppHeaderProps {
    user: User | null;
    isDark: boolean;
    tab: Tab;
    favorites: MercariItem[];
    inAppBrowser?: boolean;
    onGoHome: () => void;
    onToggleTheme: () => void;
    onSignIn: () => void;
    onSignOut: () => void;
    onTabChange: (tab: Tab) => void;
}

export function AppHeader({
    user,
    isDark,
    tab,
    favorites,
    inAppBrowser,
    onGoHome,
    onToggleTheme,
    onSignIn,
    onSignOut,
    onTabChange,
}: AppHeaderProps) {
    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={onGoHome}
                    className="text-left hover:opacity-80 transition-opacity"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-accent">
                        Merkori
                    </h1>
                    <p className="text-xs mt-0.5 text-text-secondary">
                        일본 메루카리 상품을 검색해보세요
                    </p>
                </button>

                <div className="flex items-center gap-2">
                    {user ? (
                        <>
                            {user.user_metadata?.avatar_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt=""
                                    className="w-8 h-8 rounded-full"
                                />
                            )}
                            <span className="text-xs hidden sm:block text-text-secondary">
                                {user.user_metadata?.full_name ?? user.email}
                            </span>
                            <button
                                onClick={onSignOut}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-raised text-text-secondary border border-border"
                            >
                                로그아웃
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onSignIn}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-raised text-text-primary border border-border"
                            title={
                                inAppBrowser
                                    ? "외부 브라우저에서 열어 로그인합니다"
                                    : undefined
                            }
                        >
                            {inAppBrowser ? (
                                <>
                                    <svg
                                        width="14"
                                        height="14"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                    브라우저에서 로그인
                                </>
                            ) : (
                                <>
                                    <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Google로 로그인
                                </>
                            )}
                        </button>
                    )}

                    <button
                        onClick={onToggleTheme}
                        className="rounded-full p-2 bg-surface-raised text-text-secondary border border-border"
                        title={
                            isDark ? "라이트 모드로 전환" : "다크 모드로 전환"
                        }
                    >
                        {isDark ? (
                            <svg
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx="12" cy="12" r="5" />
                                <path
                                    strokeLinecap="round"
                                    d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                                />
                            </svg>
                        ) : (
                            <svg
                                width="18"
                                height="18"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                                />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {user && (
                <div className="flex gap-1 mb-4">
                    {(["search", "favorites"] as Tab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => onTabChange(t)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                                tab === t
                                    ? "bg-accent text-white border-accent"
                                    : "bg-surface-raised text-text-secondary border-border"
                            }`}
                        >
                            {t === "search"
                                ? "목록"
                                : `관심${favorites.length > 0 ? ` (${favorites.length})` : ""}`}
                        </button>
                    ))}
                </div>
            )}
        </>
    );
}
