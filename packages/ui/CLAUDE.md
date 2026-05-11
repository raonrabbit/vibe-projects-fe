# packages/ui — Design System

범용 공유 디자인 시스템. 앱 전용 토큰/컴포넌트 없음.
컴포넌트 패턴은 `Button.tsx`를 레퍼런스로 삼을 것.

---

## Design Rules

### Color
Grayscale 토큰 기본. Accent(emerald)는 인터랙티브 요소(버튼·링크·포커스링)에만.
장식 목적 색상 및 앱 전용 색상 금지.

### Radius — 레이어 높이에 비례

| 요소 | 클래스 | 값 |
|------|--------|----|
| 배지·태그 | `rounded-sm` | 4px |
| 버튼·인풋 | `rounded-md` | 8px |
| 카드·패널 | `rounded-xl` | 16px |
| 모달·시트 | `rounded-3xl` | 24px |
| 아바타 | `rounded-full` | — |

### Spacing
넉넉하게. 카드 `p-5`↑, 섹션 `space-y-8`↑, 그리드 `gap-5`↑. `p-2` 이하는 아이콘 버튼만.

### Typography

`type-{role}-{level}` 프리셋 클래스를 사용한다. `text-*` + `font-*`를 개별 조합하지 말 것.

| 클래스 | 크기 | 굵기 | 용도 |
|--------|------|------|------|
| `type-display-1` | 48px | Bold | Hero, 랜딩 — 가장 큰 강조 |
| `type-display-2` | 40px | Bold | Feature 섹션 강조 |
| `type-display-3` | 36px | Bold | Title 위계보다 큰 강조 |
| `type-title-1` | 30px | SemiBold | 페이지 타이틀 |
| `type-title-2` | 24px | SemiBold | 섹션·모달 타이틀 |
| `type-title-3` | 20px | SemiBold | 카드·다이얼로그 타이틀 |
| `type-heading-1` | 18px | SemiBold | 서브섹션 헤딩 |
| `type-heading-2` | 16px | SemiBold | 아이템 헤딩 |
| `type-headline-1` | 16px | Medium | 본문 상위 강조 (Bold body) |
| `type-headline-2` | 14px | Medium | 작은 강조 텍스트 |
| `type-body-1` | 16px | Regular | 기본 본문 (읽기용) |
| `type-body-2` | 14px | Regular | 보조 본문 |
| `type-label-1` | 14px | Medium | 폼 레이블, 네비게이션 |
| `type-label-2` | 12px | Medium | 작은 UI 레이블 |
| `type-caption-1` | 12px | Regular | 메타 정보, 태그 |
| `type-caption-2` | 11px | Regular | 가장 작은 보조 텍스트 |

### 기타
- 그림자: 라이트 모드만 `shadow-sm/md`. 다크는 border로 구분.
- Hover: `hover:bg-surface-raised`. 카드는 `hover:shadow-md` 추가 가능.
- Focus: `focus-visible:ring-2 focus-visible:ring-accent` 필수.
- Transition: `transition-colors`만.

---

## Constraints

- `style={{}}` 인라인 스타일 금지 → Tailwind 토큰 사용
- 하드코딩 색상 금지 (`bg-accent` 등 시맨틱 토큰 사용)
- `next/image`, `next/link` 등 Next.js import 금지
- 다른 내부 패키지 import 금지

---

## Tokens

수정 시 세 곳 모두 업데이트: `tokens.json` → `src/styles/tokens.css` → `tailwind.config.ts`

---

## Figma Plugin 동기화

`packages/ui` (디자인 시스템)를 수정한 경우, `packages/figma-plugin`도 함께 수정이 필요할 수 있다.

**규칙**: 디자인 시스템 변경(토큰·컴포넌트·타이포그래피·색상 등) 후, 반드시 사용자에게 다음을 물어볼 것:

> "figma-plugin도 함께 업데이트할까요? 변경된 내용: [변경 요약]"

사용자가 동의하면 `packages/figma-plugin`의 관련 파일을 수정한다. 동의 없이 먼저 수정하지 않는다.
