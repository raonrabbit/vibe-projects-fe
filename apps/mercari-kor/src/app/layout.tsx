import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "메루카리 검색",
    description: "메루카리 상품 검색 서비스",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t===null&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})();`,
                    }}
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
