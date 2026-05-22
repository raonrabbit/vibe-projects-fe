import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex h-screen items-center justify-center bg-slate-950">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-white tracking-tight">
                    Flightrail
                </h1>
                <p className="text-slate-400 text-lg">
                    공부 시간을 비행 여행으로 기록하세요
                </p>
                <div className="pt-4">
                    <Link
                        href="/timer"
                        className="inline-block px-8 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-colors"
                    >
                        출발하기
                    </Link>
                </div>
            </div>
        </main>
    );
}
