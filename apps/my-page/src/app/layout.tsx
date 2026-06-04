import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PROFILE } from "@/shared/config/profile";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raonrabbit.dev"),
  title: {
    default: "프론트엔드 포트폴리오",
    template: "%s | 프론트엔드 포트폴리오",
  },
  description:
    "프론트엔드 개발자 최준혁의 포트폴리오입니다. Next.js · React · TypeScript를 주로 사용하며, SSAFY 12기 수료 후 외주 개발과 팀 프로젝트 수상 경험을 보유하고 있습니다. 성능 최적화와 사용자 경험을 고민하는 개발자입니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.raonrabbit.dev",
    siteName: "최준혁 포트폴리오",
    title: "프론트엔드 포트폴리오",
    description:
      "프론트엔드 개발자 최준혁의 포트폴리오입니다. Next.js · React · TypeScript를 주로 사용하며, SSAFY 12기 수료 후 외주 개발과 팀 프로젝트 수상 경험을 보유하고 있습니다. 성능 최적화와 사용자 경험을 고민하는 개발자입니다.",
    images: [
      {
        url: "/token-imgs/me.png",
        width: 1200,
        height: 630,
        alt: "최준혁 프론트엔드 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "프론트엔드 포트폴리오",
    description:
      "프론트엔드 개발자 최준혁의 포트폴리오입니다. Next.js · React · TypeScript를 주로 사용하며, SSAFY 12기 수료 후 외주 개발과 팀 프로젝트 수상 경험을 보유하고 있습니다. 성능 최적화와 사용자 경험을 고민하는 개발자입니다.",
    images: ["/token-imgs/me.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href={PROFILE.photo}
          fetchPriority="high"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "최준혁",
              alternateName: "Choi JunHyeok",
              url: "https://www.raonrabbit.dev",
              email: "raonrabbit@gmail.com",
              sameAs: ["https://github.com/raonrabbit"],
              jobTitle: "Frontend Developer",
              knowsAbout: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-bg text-text-primary antialiased`}
      >
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
