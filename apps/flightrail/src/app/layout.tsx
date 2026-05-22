import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Flightrail",
    description: "공부 시간을 비행 여행으로 기록하세요",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
