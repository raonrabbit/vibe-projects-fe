import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dev & AI News Korea",
    description: "Frontend/AI 뉴스 큐레이션",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
            <head>
                <link
                    rel="stylesheet"
                    as="style"
                    href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
