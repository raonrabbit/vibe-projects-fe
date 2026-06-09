import type { Metadata } from "next";
import Script from "next/script";
import { ActiveSectionProvider } from "@/features/active-section";
import { RabbitCharacter } from "@/features/rabbit";
import { Header } from "@/widgets/header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.raonrabbit.dev"),
  title: {
    default: "최준혁 | 프론트엔드 포트폴리오",
    template: "%s | 최준혁 포트폴리오",
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
        url: "/opengraph-image.png",
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
              knowsAbout: ["Next.js", "TypeScript", "React", "Tailwind CSS"],
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
