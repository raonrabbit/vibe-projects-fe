# packages/ui — Design System

공유 디자인 시스템. 모든 앱(`apps/*`)에서 참조함.

## Rules

- 컴포넌트는 React + TypeScript 기준으로 작성. 프레임워크 종속 로직(Next.js Image, router 등) 금지.
- 스타일: Tailwind CSS 유틸리티 클래스 사용. 인라인 style 속성 금지.
- 모든 컴포넌트는 `src/index.ts`에서 named export.
- Props 타입은 컴포넌트 파일 내에서 정의 (`interface ComponentProps`).
- 디자인 토큰(색상, 타이포그래피, 스페이싱)은 Tailwind config에서 관리.

## Structure

```
packages/ui/
├── src/
│   ├── components/   # 개별 컴포넌트
│   └── index.ts      # public export
├── package.json
└── tsconfig.json
```

## Dependency Rules

- `packages/ui`는 다른 내부 패키지를 참조하지 않음.
- 외부 dependency 추가 시: `pnpm add <pkg> --filter @vibe/ui`
