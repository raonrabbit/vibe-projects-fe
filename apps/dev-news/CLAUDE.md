# apps/dev-news — Frontend Dev News App

Frontend/AI 개발 뉴스 큐레이션 앱. 기획 상세: `docs/기획.md` (루트 기준).

## Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- UI Components: `@vibe/ui` (packages/ui)
- Package manager: pnpm

## Rules

- UI 컴포넌트는 `@vibe/ui`에서 import. 앱 내 일회성 UI는 `src/components/`에 위치.
- 앱 전용 로직(API 호출, 라우팅 등)을 `packages/ui`로 올리지 말 것.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/dev-news`
- 서버 컴포넌트와 클라이언트 컴포넌트 경계를 명확히 표시 (`"use client"` 최소화).

## Structure

```
apps/dev-news/
├── src/
│   ├── app/          # Next.js App Router
│   ├── components/   # 앱 전용 컴포넌트
│   └── lib/          # 유틸, API 클라이언트
├── package.json
└── tsconfig.json
```
