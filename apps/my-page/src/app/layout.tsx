import "./globals.css";

import type { Metadata } from "next";
import Script from "next/script";

import { ActiveSectionProvider } from "@/features/active-section";
import { RabbitCharacter } from "@/features/rabbit";
import { Header } from "@/widgets/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raonrabbit.dev"),
  title: {
    default: "최준혁 | 프론트엔드 포트폴리오",
    template: "%s | 최준혁 포트폴리오",
  },
  description:
    "Next.js · React · TypeScript를 주력으로 하는 프론트엔드 개발자 최준혁의 포트폴리오입니다. 사용자 경험과 성능 최적화를 고민하며, 외주 개발 및 팀 프로젝트 다수 수상 이력을 보유하고 있습니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://www.raonrabbit.dev",
    siteName: "최준혁 포트폴리오",
    title: "최준혁 | 프론트엔드 개발자 포트폴리오",
    description:
      "Next.js · React · TypeScript를 주력으로 하는 프론트엔드 개발자 최준혁의 포트폴리오입니다. 사용자 경험과 성능 최적화를 고민하며, 외주 개발 및 팀 프로젝트 다수 수상 이력을 보유하고 있습니다.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "최준혁 프론트엔드 개발자 포트폴리오",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "최준혁 | 프론트엔드 개발자 포트폴리오",
    description:
      "Next.js · React · TypeScript를 주력으로 하는 프론트엔드 개발자 최준혁의 포트폴리오입니다. 사용자 경험과 성능 최적화를 고민하며, 외주 개발 및 팀 프로젝트 다수 수상 이력을 보유하고 있습니다.",
    images: ["/opengraph-image.png"],
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
          href="/fonts/pretendard/pretendard.css"
          as="style"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='/fonts/pretendard/pretendard.css';document.head.appendChild(l);})()`,
          }}
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
              description:
                "사용자 경험과 성능 최적화를 고민하는 프론트엔드 개발자. Next.js, React, TypeScript를 주력으로 합니다.",
              knowsAbout: [
                "Next.js",
                "TypeScript",
                "React",
                "Tailwind CSS",
                "Framer Motion",
                "Performance Optimization",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-bg text-text-primary antialiased">
        <ActiveSectionProvider>
          <Header />
          {children}
          <RabbitCharacter />
        </ActiveSectionProvider>
      </body>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-ZFY09Z75X0"
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZFY09Z75X0');
        `}
      </Script>
    </html>
  );
}
