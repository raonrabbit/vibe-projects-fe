"use client";

import { useState, useRef, useEffect } from "react";

interface ShareButtonProps {
    mercariUrl: string;
}

const IconShare = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
    >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const IconCopy = () => (
    <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.2}
    >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
);

export default function ShareButton({ mercariUrl }: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    function showToast(msg: string) {
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        setToast(msg);
        toastTimerRef.current = setTimeout(() => setToast(null), 2000);
    }

    async function handleShare(url: string, title: string) {
        setOpen(false);
        try {
            await navigator.share({ title, url });
        } catch {
            // cancelled or unsupported — silently ignore
        }
    }

    async function handleCopy(url: string, label: string) {
        setOpen(false);
        try {
            await navigator.clipboard.writeText(url);
        } catch {
            const el = document.createElement("textarea");
            el.value = url;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        showToast(`${label} 복사됨`);
    }

    const rows: {
        label: string;
        description: string;
        getUrl: () => string;
        shareTitle: string;
    }[] = [
        {
            label: "Merkori 링크",
            description: "이 페이지 URL",
            getUrl: () => window.location.href,
            shareTitle: "Merkori에서 보기",
        },
        {
            label: "메루카리 링크",
            description: "원본 상품 URL",
            getUrl: () => mercariUrl,
            shareTitle: "메루카리 상품 보기",
        },
    ];

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="공유"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border bg-surface-raised text-text-secondary border-border transition-colors hover:text-text-primary"
            >
                <IconShare />
                공유
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-2 w-60 rounded-xl border border-border bg-surface shadow-lg overflow-hidden z-10">
                    {rows.map((row, i) => (
                        <div
                            key={row.label}
                            className={`px-4 py-3 ${i < rows.length - 1 ? "border-b border-border" : ""}`}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary">
                                        {row.label}
                                    </p>
                                    <p className="text-xs text-text-secondary mt-0.5">
                                        {row.description}
                                    </p>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    {"share" in navigator && (
                                        <button
                                            onClick={() =>
                                                handleShare(
                                                    row.getUrl(),
                                                    row.shareTitle,
                                                )
                                            }
                                            title="공유하기"
                                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-raised hover:bg-border text-text-secondary transition-colors"
                                        >
                                            <IconShare />
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            handleCopy(row.getUrl(), row.label)
                                        }
                                        title="링크 복사"
                                        className="flex items-center justify-center w-8 h-8 rounded-lg bg-surface-raised hover:bg-border text-text-secondary transition-colors"
                                    >
                                        <IconCopy />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {toast && (
                <div className="absolute left-0 top-full mt-2 px-3 py-1.5 rounded-lg bg-text-primary text-bg text-xs font-medium whitespace-nowrap z-20 pointer-events-none">
                    {toast}
                </div>
            )}
        </div>
    );
}
