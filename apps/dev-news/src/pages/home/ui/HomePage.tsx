import Link from "next/link";
import { Badge, Button } from "@vibe/ui";
import { Header } from "@/widgets/header";
import { HeroCarousel } from "@/widgets/hero-carousel";
import { NewsFeed } from "@/widgets/news-feed";
import { TrendingKeywords } from "@/widgets/trending-keywords";

export function HomePage() {
    return (
        <div className="min-h-screen bg-bg">
            <Header />

            <main>
                {/* Hero */}
                <section className="max-w-5xl mx-auto px-5 py-12 md:py-20">
                    <div className="grid gap-10 md:grid-cols-2 md:gap-14 items-center">
                        <div className="space-y-6">
                            <Badge variant="primary" size="sm">
                                한국어 큐레이션
                            </Badge>
                            <div className="space-y-3">
                                <h1 className="type-display-3 text-text-primary">
                                    프론트엔드·AI 뉴스,
                                    <br />
                                    정보 홍수 없이 빠르게
                                </h1>
                                <p className="type-body-1 text-text-secondary max-w-sm">
                                    매일 쏟아지는 개발 소식에서 진짜 중요한
                                    것만 골라드립니다. 한국어 큐레이션으로
                                    흐름을 놓치지 마세요.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link href="/news">
                                    <Button variant="primary" size="md">
                                        최신 뉴스 보기
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="ghost" size="md">
                                        개인화 설정
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <HeroCarousel />
                    </div>
                </section>

                {/* Latest News + Trending */}
                <section className="bg-bg-subtle border-t border-border">
                    <div className="max-w-5xl mx-auto px-5 py-12 md:py-16">
                        <div className="grid gap-10 md:grid-cols-[1fr_300px] md:gap-8 items-start">
                            <NewsFeed />
                            <TrendingKeywords />
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t border-border">
                <div className="max-w-5xl mx-auto px-5 py-8 flex items-center justify-between">
                    <p className="type-caption-1 text-text-disabled">
                        © 2026 Dev &amp; AI News Korea
                    </p>
                    <p className="type-caption-1 text-text-disabled">
                        Powered by @vibe/ui
                    </p>
                </div>
            </footer>
        </div>
    );
}
