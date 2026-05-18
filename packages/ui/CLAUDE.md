# packages/ui — Design System

범용 공유 디자인 시스템. 앱 전용 토큰/컴포넌트 없음.

→ 컴포넌트 목록 및 API: [docs/components.md](docs/components.md)  
→ 타이포그래피 스케일: [docs/typography.md](docs/typography.md)

---

## Constraints

- `style={{}}` 인라인 스타일 금지 → Tailwind 토큰 사용
- 하드코딩 색상 금지 → 시맨틱 토큰 사용 (`bg-accent`, `text-text-primary` 등)
- `next/image`, `next/link` 등 Next.js import 금지
- 다른 내부 패키지 import 금지
- `"use client"` 는 이벤트 핸들러·훅 사용 컴포넌트에만 (`Icon`, `Divider`, `Spinner` 제외)

---

## Design Rules

**Color** — Grayscale 토큰 기본. Accent(emerald)는 인터랙티브 요소(버튼·링크·포커스링)에만. 장식 목적 색상 금지.

**Radius** — 레이어 높이에 비례.

| 요소           | 클래스         |
| -------------- | -------------- |
| 배지·태그      | `rounded-sm`   |
| 버튼·인풋      | `rounded-md`   |
| 카드·패널·List | `rounded-xl`   |
| 모달·시트      | `rounded-3xl`  |
| 아바타         | `rounded-full` |

**Spacing** — 넉넉하게. 카드 `p-5`↑, 섹션 `space-y-8`↑, 그리드 `gap-5`↑. `p-2` 이하는 아이콘 버튼만.

**Typography** — `type-{role}-{level}` 프리셋 클래스 사용. `text-*` + `font-*` 개별 조합 금지.

**Interaction**

- Hover: `hover:bg-surface-raised`. 카드는 `hover:shadow-md` 추가 가능.
- Focus: `focus-visible:ring-2 focus-visible:ring-accent` 필수. 에러 상태면 `ring-error`.
- Transition: `transition-colors`만.
- Shadow: 라이트 모드만 `shadow-sm/md`. 다크는 border로 구분.

---

## Extensibility Rules

새 컴포넌트 추가 시:

1. **슬롯 먼저** — leading/trailing/children 슬롯으로 해결 가능하면 prop 추가 전에 슬롯 사용
2. **Compound는 3개 이상 서브컴포넌트일 때** — `Object.assign(Root, { Sub })` 패턴
3. **과도한 자유도 금지** — 모든 className을 override하는 `unstyled` prop 없음

---

## Tokens

수정 시 세 곳 모두 업데이트: `tokens.json` → `src/styles/tokens.css` → `tailwind.config.ts`

---

## Figma Plugin 동기화

디자인 시스템 변경(토큰·컴포넌트·타이포그래피·색상 등) 후, 반드시 사용자에게 물어볼 것:

> "figma-plugin도 함께 업데이트할까요? 변경된 내용: [변경 요약]"

동의 없이 먼저 수정하지 않는다.
