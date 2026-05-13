import Link from "next/link";
import { Badge, Card } from "@vibe/ui";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "error";

const NEWS_LIST: {
    category: string;
    badgeVariant: BadgeVariant;
    title: string;
    source: string;
    time: string;
}[] = [
    {
        category: "AI",
        badgeVariant: "primary",
        title: "Claude 4로 뉴스 요약 파이프라인 구축하기 — 단일 API 호출로 비용 최소화",
        source: "toss.tech",
        time: "1시간 전",
    },
    {
        category: "Frontend",
        badgeVariant: "primary",
        title: "React 19 Compiler — 자동 메모이제이션의 실제 성능 개선 수치",
        source: "web.dev",
        time: "3시간 전",
    },
    {
        category: "릴리즈",
        badgeVariant: "success",
        title: "Next.js 15.3 — Turbopack 안정화 및 캐싱 전략 개선",
        source: "github",
        time: "5시간 전",
    },
    {
        category: "Frontend",
        badgeVariant: "primary",
        title: "CSS Grid Subgrid — 드디어 실무에서 쓸 수 있는 브라우저 지원율 93%",
        source: "smashingmagazine.com",
        time: "8시간 전",
    },
    {
        category: "도구",
        badgeVariant: "default",
        title: "Bun 2.0 — Node.js 호환성 100% 달성 및 패키지 매니저 성능 향상",
        source: "bun.sh",
        time: "10시간 전",
    },
    {
        category: "AI",
        badgeVariant: "primary",
        title: "Vercel AI SDK 4.0 — 스트리밍과 툴 콜링 API 통합",
        source: "vercel.com",
        time: "12시간 전",
    },
];

export function NewsFeed() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="type-title-2 text-text-primary">오늘의 뉴스</h2>
                <Link
                    href="/news"
                    className="type-label-1 text-accent hover:text-accent-hover transition-colors"
                >
                    전체 보기 →
                </Link>
            </div>
            <Card padding="none">
                <ul className="divide-y divide-border">
                    {NEWS_LIST.map((item, i) => (
                        <li key={i}>
                            <a
                                href="#"
                                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-raised transition-colors"
                            >
                                <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={item.badgeVariant}
                                            size="sm"
                                        >
                                            {item.category}
                                        </Badge>
                                        <span className="type-caption-1 text-text-secondary">
                                            {item.source} · {item.time}
                                        </span>
                                    </div>
                                    <p className="type-headline-2 text-text-primary line-clamp-2">
                                        {item.title}
                                    </p>
                                </div>
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="shrink-0 text-text-disabled"
                                >
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </a>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
}
