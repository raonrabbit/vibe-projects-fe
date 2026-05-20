# apps/my-page — Personal Portfolio

개인 포트폴리오 앱. 프로젝트, 스킬, 수상 이력을 정적 TypeScript 데이터로 관리.

## Stack

- Framework: Next.js 16 (App Router)
- Animation: framer-motion
- Styling: Tailwind CSS 4 + tailwind-merge + clsx
- UI Components: `@vibe/ui` (packages/ui)

## Rules

- UI 컴포넌트는 `@vibe/ui` 또는 `shared/ui/`에서 import.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/my-page`
- 콘텐츠(프로젝트, 스킬, 수상 등)는 `entities/*/model/*.ts`에서 관리.
- 외부 API / DB 연동 추가 전 반드시 사용자 확인.
