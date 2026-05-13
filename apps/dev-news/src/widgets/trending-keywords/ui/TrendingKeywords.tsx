import { Badge, Card } from "@vibe/ui";

const TRENDING: { rank: number; keyword: string; count: number }[] = [
    { rank: 1, keyword: "React Compiler", count: 24 },
    { rank: 2, keyword: "GPT-5 API", count: 21 },
    { rank: 3, keyword: "Turbopack", count: 18 },
    { rank: 4, keyword: "LLM Pipeline", count: 15 },
    { rank: 5, keyword: "Bun 2.0", count: 9 },
];

export function TrendingKeywords() {
    return (
        <div className="space-y-4">
            <h2 className="type-title-2 text-text-primary">급상승 키워드</h2>
            <Card>
                <p className="type-caption-1 text-text-secondary mb-4">
                    최근 24시간 기준
                </p>
                <div className="space-y-0.5">
                    {TRENDING.map(({ rank, keyword, count }) => (
                        <div
                            key={keyword}
                            className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-surface-raised transition-colors cursor-pointer"
                        >
                            <span
                                className={`type-label-1 w-5 text-center shrink-0 ${rank <= 3 ? "text-accent" : "text-text-disabled"}`}
                            >
                                {rank}
                            </span>
                            <span className="type-label-1 text-text-primary flex-1">
                                {keyword}
                            </span>
                            <Badge variant="default" size="sm">
                                {count}건
                            </Badge>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
