# apps/mercari-kor — Mercari Japan Search App

메르카리 일본 상품을 한국 UX로 탐색하는 앱. Supabase 인증 + 즐겨찾기 기능 포함.

## Stack

- Framework: Next.js 16 (App Router)
- Auth / DB: Supabase (`@supabase/ssr`)
- Styling: Tailwind CSS v4
- UI Components: `shared/ui/` (앱 전용)

## Rules

- UI 컴포넌트는 `shared/ui/`에서 import.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/mercari-kor`
- Mercari API는 반드시 `/api/mercari/*` Route Handler를 통해 호출 (클라이언트 직접 호출 금지).
- Supabase 클라이언트: 서버 컴포넌트는 `shared/supabase/server.ts`, 클라이언트 컴포넌트는 `shared/supabase/client.ts`.
- 서버 컴포넌트와 클라이언트 컴포넌트 경계를 명확히 표시 (`"use client"` 최소화).
