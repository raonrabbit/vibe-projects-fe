"use client";

import { ArrowRightIcon, Badge, ChevronLeftIcon, ChevronRightIcon, cn } from "@vibe/ui";
import { useEffect, useRef, useState } from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";

interface Slide {
    category: string;
    badgeVariant: BadgeVariant;
    title: string;
    excerpt: string;
    source: string;
    time: string;
}

const SLIDES: Slide[] = [
    {
        category: "AI",
        badgeVariant: "primary",
        title: "GPT-5 API 공개 — 개발자 베타 등록 시작",
        excerpt:
            "기존 대비 응답 속도 2배, 컨텍스트 창 200k 토큰으로 확장. 지금 바로 웨이트리스트에 등록할 수 있습니다.",
        source: "openai.com",
        time: "방금 전",
    },
    {
        category: "Frontend",
        badgeVariant: "primary",
        title: "React 19.1 — Server Actions 성능 대폭 개선",
        excerpt:
            "Server Actions 응답 처리 방식을 개선하고 hydration 관련 주요 버그를 수정한 패치 릴리즈입니다.",
        source: "react.dev",
        time: "2시간 전",
    },
    {
        category: "릴리즈",
        badgeVariant: "success",
        title: "Vite 6.0 출시 — Rolldown 기반 빌드 10배 단축",
        excerpt:
            "새로운 Rolldown 번들러로 대규모 프로젝트 빌드 시간이 최대 10배 빨라집니다. 마이그레이션 가이드도 공개됐습니다.",
        source: "vitejs.dev",
        time: "4시간 전",
    },
    {
        category: "도구",
        badgeVariant: "default",
        title: "Cursor 0.45 — AI 코드 리뷰 & PR 요약 통합",
        excerpt:
            "GitHub PR 자동 요약과 보안 취약점 감지 기능이 추가됩니다. 멀티 파일 컨텍스트를 분석해 더 정확한 리뷰를 제공합니다.",
        source: "cursor.sh",
        time: "6시간 전",
    },
];

export function HeroCarousel() {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(
            () => setCurrent((c) => (c + 1) % SLIDES.length),
            4500,
        );
        return () => clearInterval(id);
    }, [paused]);

    const prev = () =>
        setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

    return (
        <div
            className="relative rounded-xl overflow-hidden bg-surface border border-border"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
                touchStartX.current = e.touches[0].clientX;
                setPaused(true);
            }}
            onTouchEnd={(e) => {
                if (touchStartX.current === null) return;
                const diff = touchStartX.current - e.changedTouches[0].clientX;
                if (Math.abs(diff) > 40) {
                    if (diff > 0) next();
                    else prev();
                }
                touchStartX.current = null;
                setPaused(false);
            }}
        >
            {/* Slides track */}
            <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {SLIDES.map((slide, i) => (
                    <div
                        key={i}
                        className="min-w-full p-6 md:p-8 pb-14 space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <Badge variant={slide.badgeVariant} size="sm">
                                {slide.category}
                            </Badge>
                            <span className="type-caption-1 text-text-secondary">
                                {slide.source} · {slide.time}
                            </span>
                        </div>
                        <h3 className="type-title-3 text-text-primary">
                            {slide.title}
                        </h3>
                        <p className="type-body-2 text-text-secondary">
                            {slide.excerpt}
                        </p>
                        <a
                            href="#"
                            className="inline-flex items-center gap-1 type-label-1 text-accent hover:text-accent-hover transition-colors"
                        >
                            자세히 보기
                            <ArrowRightIcon size={13} />
                        </a>
                    </div>
                ))}
            </div>

            {/* Prev */}
            <button
                onClick={prev}
                aria-label="이전 슬라이드"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
            >
                <ChevronLeftIcon size={14} />
            </button>

            {/* Next */}
            <button
                onClick={next}
                aria-label="다음 슬라이드"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
            >
                <ChevronRightIcon size={14} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        aria-label={`슬라이드 ${i + 1}`}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            i === current
                                ? "w-5 bg-accent"
                                : "w-1.5 bg-border-strong",
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
