import type { QuizQuestion } from "./types";

export const NEXTJS_QUESTIONS: QuizQuestion[] = [
  // ─── Routing ───────────────────────────────────────────────────────────────
  {
    id: "next-01",
    category: "nextjs",
    question: "App Router와 Pages Router의 차이를 설명해주세요.",
    answer:
      "Pages Router는 pages/ 디렉토리 기반으로 getServerSideProps·getStaticProps로 페이지 단위 데이터 패칭을 했습니다. App Router는 Next.js 13+에서 도입된 방식으로 app/ 디렉토리를 사용하며 React Server Component가 기본입니다. 컴포넌트 내부에서 async/await으로 직접 데이터를 패칭하고, layout.tsx·loading.tsx·error.tsx 특수 파일로 레이아웃·로딩·에러 상태를 선언적으로 관리합니다. 현재 공식 권장 방식은 App Router입니다.\n\n**부가설명:** Pages Router도 여전히 지원되며 마이그레이션 없이 두 방식을 혼용할 수 있습니다. 신규 프로젝트는 App Router를 선택하고, 기존 프로젝트는 점진적으로 마이그레이션합니다.",
  },
  {
    id: "next-02",
    category: "nextjs",
    question: "Next.js의 파일 기반 라우팅이 무엇인가요?",
    answer:
      "파일 시스템 구조 자체가 URL 경로가 되는 방식입니다. App Router 기준으로 app/about/page.tsx → /about, app/blog/[id]/page.tsx → /blog/:id가 됩니다. 특수 파일 규칙: page.tsx(라우트 UI), layout.tsx(중첩 레이아웃), loading.tsx(Suspense 스켈레톤 UI), error.tsx(ErrorBoundary), not-found.tsx(404 페이지)가 있습니다. 별도 라우터 설정 없이 파일 구조만으로 라우팅과 UI 상태를 한 번에 처리할 수 있습니다.",
  },
  {
    id: "next-03",
    category: "nextjs",
    question: "Dynamic Route가 무엇인가요?",
    answer:
      "URL에 동적 파라미터가 포함된 라우트입니다. 파일명을 [id]처럼 대괄호로 작성하면 /blog/1, /blog/abc 등 모든 경로를 처리합니다. params.id로 파라미터를 읽습니다. [...slug]는 /docs/a/b/c처럼 중첩 경로를 모두 캐치하는 Catch-all 라우트, [[...slug]]는 파라미터 없는 /docs도 처리하는 Optional Catch-all 라우트입니다.\n\n**부가설명:** App Router에서는 generateStaticParams 함수로 빌드 시 생성할 동적 경로 목록을 반환하면 SSG로 동작합니다. Pages Router의 getStaticPaths와 동일한 역할입니다.",
  },
  {
    id: "next-04",
    category: "nextjs",
    question: "Parallel Routes와 Intercepting Routes가 무엇인가요?",
    answer:
      "Parallel Routes는 @folder 규칙으로 하나의 레이아웃에서 여러 페이지를 동시에 렌더링합니다. 대시보드의 사이드바와 메인 콘텐츠를 독립적으로 렌더링하거나 각 슬롯별 로딩·에러 상태를 분리할 때 사용합니다. Intercepting Routes는 (.)folder 규칙으로 다른 라우트를 현재 레이아웃 내 모달처럼 인터셉트합니다. 피드에서 사진을 클릭하면 URL은 /photo/1로 변경되지만 현재 페이지를 유지하며 모달로 보여주는 Instagram 스타일의 UX를 구현할 때 사용합니다.",
    isAdvanced: true,
  },

  // ─── Data Fetching ─────────────────────────────────────────────────────────
  {
    id: "next-05",
    category: "nextjs",
    question:
      "Pages Router의 getServerSideProps vs getStaticProps vs getStaticPaths의 차이는?",
    answer:
      "getServerSideProps는 매 요청마다 서버에서 실행되어 항상 최신 데이터를 제공합니다. 실시간성이 필요하거나 사용자별로 다른 데이터가 필요한 페이지에 사용합니다. getStaticProps는 빌드 시 한 번만 실행되어 정적 HTML을 생성합니다. revalidate 옵션으로 ISR도 가능합니다. 블로그·문서처럼 데이터가 자주 바뀌지 않는 페이지에 적합합니다. getStaticPaths는 getStaticProps와 함께 동적 라우트([id])에서 빌드 시 생성할 경로 목록을 반환합니다. fallback: blocking은 목록에 없는 경로를 SSR처럼 처리합니다.",
  },
  {
    id: "next-06",
    category: "nextjs",
    question: "App Router에서 데이터를 어떻게 fetch 하나요?",
    answer:
      "Server Component에서 async/await을 직접 사용합니다. 별도 API 함수 없이 컴포넌트 내부에서 await fetch(url)을 호출합니다. Next.js는 fetch API를 확장하여 캐싱 옵션을 제공합니다. { cache: 'force-cache' }는 SSG처럼 빌드 시 캐시, { next: { revalidate: 60 } }는 ISR처럼 60초 후 재검증, { cache: 'no-store' }는 SSR처럼 매 요청마다 새로 가져옵니다. 동일 URL의 fetch는 렌더링 중 자동으로 중복 제거(Request Memoization)됩니다.\n\n**부가설명:** Client Component에서의 데이터 패칭은 useEffect + fetch 또는 React Query/SWR을 사용합니다. 서버에서 데이터를 가져와 props로 내려주는 것이 아니라 컴포넌트가 직접 fetch하는 구조가 App Router의 핵심 변화입니다.",
  },
  {
    id: "next-07",
    category: "nextjs",
    question: "Server Actions가 무엇인가요?",
    answer:
      "'use server' 지시어로 선언하여 서버에서만 실행되는 비동기 함수입니다. 클라이언트에서 일반 함수처럼 호출하면 내부적으로 POST 요청이 자동 생성됩니다. API Route를 별도로 만들지 않고 폼 제출, DB 쓰기 작업을 처리할 수 있습니다. form의 action 속성에 Server Action을 직접 넣으면 JS 없이도(Progressive Enhancement) 동작합니다. Server Action 내부에서 revalidatePath나 revalidateTag를 호출하여 캐시를 무효화할 수 있습니다.\n\n**부가설명:** 보안상 중요한 점: 'use server'는 해당 함수가 서버에서 실행된다는 의미이지, 자동으로 인증/인가를 처리하지는 않습니다. Server Action 내부에서도 직접 세션 검증 등 인증 로직을 구현해야 합니다.",
  },
  {
    id: "next-08",
    category: "nextjs",
    question: "Server Actions와 API Route의 차이는?",
    answer:
      "API Route(route.ts)는 RESTful 엔드포인트로 외부 서비스나 모바일 앱에서도 접근 가능하며, GET/POST 등 HTTP 메서드를 명시적으로 처리합니다. Server Actions는 Next.js 앱 내부에서만 사용하는 서버 함수로, RPC처럼 함수를 직접 호출하는 방식입니다. 폼 제출·DB 쓰기처럼 외부에 노출할 필요 없는 내부 데이터 변경에는 Server Actions가 간결합니다. 외부 클라이언트(모바일 앱, 써드파티)도 소비해야 하는 API라면 API Route가 적합합니다.",
    isAdvanced: true,
  },

  // ─── Caching ───────────────────────────────────────────────────────────────
  {
    id: "next-09",
    category: "nextjs",
    question: "Next.js의 4가지 캐싱 레이어를 설명해주세요.",
    answer:
      "① Request Memoization: 하나의 렌더링 사이클 동안 동일한 URL의 fetch 호출을 메모리에서 중복 제거합니다. 여러 컴포넌트에서 같은 API를 호출해도 실제 요청은 한 번만 발생합니다. ② Data Cache: fetch 옵션으로 제어하며 서버에 영구 저장됩니다. revalidatePath/revalidateTag로 무효화합니다. ③ Full Route Cache: 빌드 또는 revalidation 시 생성된 라우트의 HTML+RSC Payload를 서버에 저장합니다. ④ Router Cache: 클라이언트 인메모리 캐시로 방문한 라우트의 RSC Payload를 30초~5분간 저장합니다. 뒤로가기 시 서버 요청 없이 즉시 화면이 표시됩니다.\n\n**부가설명:** 이 4레이어는 계층적으로 동작합니다. Router Cache가 히트하면 나머지를 건너뛰고, Full Route Cache가 히트하면 Data Cache를 건너뜁니다. 캐싱 문제가 발생하면 어느 레이어의 캐시인지 구분하는 것이 중요합니다.",
  },
  {
    id: "next-10",
    category: "nextjs",
    question: "revalidate가 무엇인가요?",
    answer:
      "캐시된 데이터를 다시 가져오는(재검증하는) 방법입니다. 두 가지 방식이 있습니다. Time-based Revalidation: { next: { revalidate: 60 } }처럼 초 단위를 지정합니다. stale-while-revalidate 전략으로 이전 캐시를 즉시 반환하고 백그라운드에서 새 데이터를 가져옵니다. On-demand Revalidation: revalidatePath('/blog')나 revalidateTag('blog-posts')를 Server Action이나 Route Handler에서 호출하여 특정 경로나 태그를 즉시 무효화합니다. CMS 웹훅에서 콘텐츠가 업데이트될 때 호출하는 방식으로 많이 사용합니다.",
  },
  {
    id: "next-11",
    category: "nextjs",
    question: "`cache: 'no-store'`와 `revalidate: 0`의 차이는?",
    answer:
      "둘 다 매 요청마다 새 데이터를 가져오는 동작을 하지만 의미가 다릅니다. cache: 'no-store'는 이 fetch 결과를 캐시에 저장하지 말라는 명시적 선언으로, Data Cache를 완전히 우회합니다. revalidate: 0은 캐시에 저장하되 즉시 만료(0초) 처리하여 항상 재검증하겠다는 의미입니다. 실제 동작은 유사하지만 cache: 'no-store'가 의도를 더 명확하게 표현합니다. 실시간 데이터가 필요한 페이지에는 cache: 'no-store'를 사용하는 것이 권장됩니다.",
    isAdvanced: true,
  },

  // ─── Middleware ────────────────────────────────────────────────────────────
  {
    id: "next-12",
    category: "nextjs",
    question: "Next.js Middleware가 무엇이고 어디서 실행되나요?",
    answer:
      "middleware.ts 파일에 정의하며, 요청이 완료되기 전에 Edge Runtime에서 실행되는 함수입니다. Edge Runtime은 CDN 엣지 노드에서 실행되어 서버보다 사용자와 물리적으로 가깝습니다. NextRequest·NextResponse를 사용하여 요청을 수정하거나 리다이렉트·리라이트할 수 있습니다. matcher 옵션으로 실행할 경로 패턴을 지정합니다. Node.js API 전체를 사용할 수 없고 Edge 호환 API(fetch, crypto 등)만 사용 가능합니다.\n\n**부가설명:** Edge Runtime은 Node.js Runtime보다 콜드 스타트가 빠르고 사용자에게 가깝지만, 파일 시스템 접근·일부 Node.js 전용 모듈을 사용할 수 없습니다. 인증 처리를 Middleware에서 할 때 DB 조회 없이 JWT 검증만 하는 것이 권장되는 이유입니다.",
  },
  {
    id: "next-13",
    category: "nextjs",
    question: "Middleware는 어떤 상황에서 사용하나요?",
    answer:
      "① 인증/인가(가장 흔한 사례): 쿠키·토큰으로 로그인 여부를 확인하고 미로그인 시 /login으로 리다이렉트합니다. ② A/B 테스팅: 사용자를 두 그룹으로 나누어 다른 페이지를 보여줍니다. ③ 국제화(i18n): Accept-Language 헤더를 읽어 언어별 URL(/ko, /en)로 리다이렉트합니다. ④ 봇 차단: User-Agent를 확인하여 스크래퍼를 차단합니다. 주의: Middleware는 모든 요청에 실행되므로 DB 조회 같은 무거운 작업은 피하고 Edge에서 빠르게 처리할 수 있는 경량 로직만 넣어야 합니다.",
  },

  // ─── 렌더링 전략 ───────────────────────────────────────────────────────────
  {
    id: "next-14",
    category: "nextjs",
    question: "Next.js에서 SSR, SSG, ISR, CSR을 각각 어떻게 구현하나요?",
    answer:
      "App Router 기준: SSR은 fetch에 { cache: 'no-store' } 또는 headers()·cookies() 같은 동적 함수 사용 시 자동으로 동적 렌더링됩니다. SSG는 캐시 옵션 없이 fetch하거나 generateStaticParams로 정적 경로를 생성합니다. ISR은 { next: { revalidate: 60 } }처럼 revalidate를 지정합니다. CSR은 'use client' 컴포넌트에서 useEffect+fetch 또는 React Query/SWR을 사용합니다. Pages Router: getServerSideProps(SSR), getStaticProps(SSG/ISR), 함수 없음(CSR)으로 구분됩니다.\n\n**부가설명:** App Router에서는 렌더링 전략이 페이지 단위가 아닌 컴포넌트 단위입니다. 하나의 페이지에서 정적 부분과 동적 부분을 Suspense로 분리하여 혼합할 수 있습니다.",
  },
  {
    id: "next-15",
    category: "nextjs",
    question: "Streaming SSR이 무엇인가요?",
    answer:
      "전통 SSR은 서버가 HTML 전체를 생성 후 한 번에 보내지만, Streaming SSR은 준비된 부분부터 청크 단위로 브라우저에 전송합니다. Suspense로 느린 컴포넌트를 감싸면, 빠른 부분(헤더·레이아웃)이 먼저 전송되어 사용자에게 표시되고, 느린 부분은 데이터가 준비되면 순차적으로 스트리밍됩니다. TTFB(첫 바이트 시간)가 개선되어 사용자가 콘텐츠를 더 빨리 볼 수 있습니다. Next.js App Router의 loading.tsx가 이 메커니즘을 활용합니다.\n\n**부가설명:** Streaming SSR은 HTTP의 chunked transfer encoding을 사용합니다. React 18의 renderToPipeableStream API로 구현되며, 이전 renderToString은 스트리밍이 불가능했습니다.",
  },

  // ─── 최적화 ────────────────────────────────────────────────────────────────
  {
    id: "next-17",
    category: "nextjs",
    question: "Next.js Image 컴포넌트가 일반 img 태그와 다른 점은?",
    answer:
      "① 포맷 자동 변환: 브라우저 지원에 따라 WebP·AVIF로 변환하여 파일 크기를 줄입니다. ② 반응형 크기 최적화: 디바이스 화면 크기에 맞는 이미지를 자동 생성합니다(srcset). ③ 지연 로딩: 뷰포트에 들어올 때 로딩하여 초기 로드 시간을 줄입니다. ④ CLS 방지: width·height를 필수로 받아 이미지 로딩 전 레이아웃 공간을 미리 확보합니다. ⑤ priority 속성으로 LCP 이미지를 preload할 수 있습니다.\n\n**부가설명:** 외부 도메인 이미지를 사용하려면 next.config.js의 images.remotePatterns에 허용 도메인을 등록해야 합니다. placeholder='blur' 옵션으로 로딩 전 블러 이미지를 보여주는 것도 가능합니다.",
  },
  {
    id: "next-18",
    category: "nextjs",
    question: "Next.js Font 최적화가 어떻게 동작하나요?",
    answer:
      "next/font를 사용하면 빌드 시 Google Fonts 파일을 다운로드하여 자체 서버에서 호스팅합니다. 사용자 브라우저가 Google 서버에 직접 요청하지 않아 추가 DNS 조회가 없고 개인정보 보호에도 유리합니다. CSS의 size-adjust·font-metric-override 속성으로 폰트 로딩 전후의 레이아웃 이동(CLS)을 최소화합니다. 폰트 파일이 다른 정적 자산과 함께 CDN에 캐싱됩니다.\n\n**부가설명:** next/font/local로 커스텀 폰트도 동일하게 최적화할 수 있습니다. font-display: swap을 기본 적용하여 폰트 로딩 중 시스템 폰트를 먼저 보여줍니다.",
    isAdvanced: true,
  },
  {
    id: "next-19",
    category: "nextjs",
    question: "next/dynamic이 무엇인가요?",
    answer:
      "React.lazy와 Suspense를 Next.js에 맞게 감싼 동적 임포트 유틸리티입니다. ssr: false 옵션으로 서버에서 렌더링하지 않고 클라이언트에서만 로드할 수 있습니다. window·document 등 브라우저 전용 API에 의존하는 서드파티 라이브러리에 유용합니다. loading 옵션으로 로딩 중 표시할 컴포넌트를 지정할 수 있습니다. 번들 크기를 줄이고 초기 로딩 성능을 개선하는 코드 스플리팅에 활용됩니다.\n\n**부가설명:** ssr: false를 사용하면 해당 컴포넌트는 서버에서 렌더링되지 않아 초기 HTML에 포함되지 않습니다. 따라서 SEO가 중요한 콘텐츠에는 사용하지 않는 것이 좋습니다.",
  },
];
