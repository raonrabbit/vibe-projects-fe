# apps/dev-news — Frontend Dev News App

Frontend/AI 개발 뉴스 큐레이션 앱. 기획 상세: `docs/기획.md`.

## Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS v4
- UI Components: `shared/ui/` (앱 전용)

## Rules

- UI 컴포넌트는 `shared/ui/`에서 import.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/dev-news`
- 서버 컴포넌트와 클라이언트 컴포넌트 경계를 명확히 표시 (`"use client"` 최소화).
