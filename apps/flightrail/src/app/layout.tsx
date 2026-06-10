import "./globals.css";

import type { Metadata } from "next";

const SITE_URL = "https://flightrail.vercel.app";
const DESCRIPTION =
    "공부와 작업 시간을 비행 여행으로 시각화하는 생산성 앱. 출발지와 목적지를 설정하고 집중 시간을 실제 항공 경로처럼 기록하세요.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Flightrail",
        template: "%s | Flightrail",
    },
    description: DESCRIPTION,
    openGraph: {
        type: "website",
        siteName: "Flightrail",
        locale: "ko_KR",
        url: SITE_URL,
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Flightrail — 공부 시간을 비행 여행으로 기록하세요",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        images: ["/og.png"],
    },
    themeColor: "#0c1420",
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Flightrail",
    url: SITE_URL,
    description: DESCRIPTION,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Web",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>
                {children}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </body>
        </html>
    );
}
