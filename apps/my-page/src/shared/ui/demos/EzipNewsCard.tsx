const NEWS_ITEMS = [
  {
    title: "2024년 아파트 거래량 전년 대비 18% 증가",
    description:
      "금리 인하 기대감으로 수도권 아파트 매수 심리가 회복되며 거래량이 큰 폭으로 늘었습니다.",
    date: "2024.11.04",
    tag: "시세",
  },
  {
    title: "강남구 재건축 단지 분양가 상한제 적용 논의",
    description:
      "정부가 고분양가 논란이 이어지는 강남 재건축 단지에 분양가 상한제 적용을 검토 중입니다.",
    date: "2024.11.03",
    tag: "정책",
  },
  {
    title: "전세 사기 피해자 지원 특별법 국회 통과",
    description:
      "전세 사기 피해자에 대한 긴급 지원과 보증금 반환 절차를 간소화하는 특별법이 통과됐습니다.",
    date: "2024.11.02",
    tag: "법규",
  },
];

const TAG_COLORS: Record<string, string> = {
  시세: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
  정책: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  법규: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export function EzipNewsCardDemo() {
  return (
    <div className="space-y-3">
      {/* Grid layout — 위쪽 2개 + 아래 1개 넓은 카드 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {NEWS_ITEMS.slice(0, 2).map((news, i) => (
          <div
            key={i}
            className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800"
          >
            <div className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${TAG_COLORS[news.tag]}`}
                >
                  {news.tag}
                </span>
                <span className="text-xs text-zinc-400">{news.date}</span>
              </div>
              <p className="mb-2 text-base leading-snug font-bold text-zinc-800 transition-colors group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
                {news.title}
              </p>
              <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                {news.description}
              </p>
            </div>
            <div className="h-28 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800" />
          </div>
        ))}
      </div>

      {/* 넓은 하단 카드 */}
      <div className="group cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:scale-[1.01] hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-start gap-5 p-5">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${TAG_COLORS[NEWS_ITEMS[2].tag]}`}
              >
                {NEWS_ITEMS[2].tag}
              </span>
              <span className="text-xs text-zinc-400">
                {NEWS_ITEMS[2].date}
              </span>
            </div>
            <p className="mb-2 text-base leading-snug font-bold text-zinc-800 transition-colors group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
              {NEWS_ITEMS[2].title}
            </p>
            <p className="line-clamp-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {NEWS_ITEMS[2].description}
            </p>
          </div>
          <div className="h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800" />
        </div>
      </div>

      <p className="text-center text-xs text-zinc-400">
        Naver News Open API 연동 · 카드에 마우스를 올려보세요
      </p>
    </div>
  );
}
