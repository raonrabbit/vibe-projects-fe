# apps/flightrail — Flightrail

공부/작업 시간을 비행 여행으로 시각화하는 개인 생산성 도구. 기획 상세: `docs/기획.md`.

## Stack

- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS v4
- 3D: React Three Fiber (R3F) + @react-three/drei + Three.js
- Map: D3.js (세계지도 캔버스 → Three.js 텍스처)
- Auth + DB: Supabase (Google OAuth)
- UI Components: `shared/ui/` (앱 전용)

## Architecture

FSD (Feature-Sliced Design) — `apps/CLAUDE.md` 참조.
단, Next.js App Router 충돌 때문에 FSD `pages` 레이어는 **`views`** 로 사용한다 (`src/views/`).

## Rules

- 외부 dependency 추가: `pnpm add <pkg> --filter @vibe/flightrail`
- Three.js 씬 컴포넌트는 반드시 `"use client"` + dynamic import (SSR 비활성화)
- R3F Canvas는 페이지당 하나만 유지
- Supabase 클라이언트: `shared/lib/supabase.ts` 단일 인스턴스
