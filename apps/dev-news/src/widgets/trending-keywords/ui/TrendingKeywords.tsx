import { Badge, Card } from "@/shared/ui";

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
        <p className="mb-4 type-caption-1 text-text-secondary">
          최근 24시간 기준
        </p>
        <div className="space-y-0.5">
          {TRENDING.map(({ rank, keyword, count }) => (
            <div
              key={keyword}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface-raised"
            >
              <span
                className={`w-5 shrink-0 text-center type-label-1 ${rank <= 3 ? "text-accent" : "text-text-disabled"}`}
              >
                {rank}
              </span>
              <span className="flex-1 type-label-1 text-text-primary">
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
