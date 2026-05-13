# packages/ui — Design System

범용 공유 디자인 시스템. 앱 전용 토큰/컴포넌트 없음.

---

## Component Catalog

| 컴포넌트            | 파일                    | 패턴                  | 주요 Props                                          |
| ------------------- | ----------------------- | --------------------- | --------------------------------------------------- |
| `Button`            | Button.tsx              | forwardRef            | `variant` · `size` · `loading`                     |
| `Badge`             | Badge.tsx               | forwardRef            | `variant` · `size`                                  |
| `Card`              | Card.tsx                | forwardRef            | `padding` · `hoverable`                             |
| `Checkbox`          | Checkbox.tsx            | forwardRef + `useId`  | `label` · InputHTMLAttributes                       |
| `Input`             | Input.tsx               | forwardRef + `useId`  | `label` · `hint` · `error` · `leading` · `trailing` |
| `List`              | List.tsx                | **Compound**          | 아래 compound API 참고                               |
| `Modal`             | Modal.tsx               | **Compound** (Radix)  | `open` · `onOpenChange` · `defaultOpen`             |
| `SegmentedControl`  | SegmentedControl.tsx    | controlled/uncontrolled | `options` · `value` · `defaultValue` · `onChange` |
| `Skeleton`          | Skeleton.tsx            | 순수 표현             | HTMLDivElement 전체                                  |
| `Tab`               | Tab.tsx                 | **Compound** (Radix)  | `value` · `defaultValue` · `onValueChange`          |
| `Table`             | Table.tsx               | **Compound**          | HTML table 속성 전체                                 |
| `Toast`             | Toast.tsx               | **Compound** (Radix)  | `open` · `onOpenChange` · `duration`                |
| `Divider`           | Divider.tsx             | 순수 표현             | `orientation` · `label`                             |
| `Spinner`           | Spinner.tsx             | 순수 표현             | `size`                                              |
| Icon 16종           | Icon.tsx                | 개별 named export     | `size` · SVGProps 전체 (아래 아이콘 목록 참고)       |

### Input — 슬롯 확장 패턴

```tsx
// 기본
<Input label="이메일" placeholder="example@email.com" />

// 아이콘 슬롯 + 에러
<Input
  label="검색"
  leading={<SearchIcon size={16} />}
  trailing={<button aria-label="지우기"><CloseIcon size={16} /></button>}
  error="검색어를 입력해 주세요"
/>
```

- `leading` / `trailing`에는 아이콘이나 인터랙티브 노드 모두 허용
- `trailing`이 버튼이면 `pointer-events-none` 제거 후 직접 전달
- `error` 가 있으면 `hint` 는 숨김

### List — Compound 패턴

```tsx
<List>
  <List.Item onClick={() => navigate("/profile")}>
    <List.Item.Leading><UserIcon size={20} /></List.Item.Leading>
    <List.Item.Content title="프로필" description="계정 설정 관리" />
    <List.Item.Trailing><ChevronRightIcon size={16} /></List.Item.Trailing>
  </List.Item>

  <List.Divider />

  <List.Item disabled>
    <List.Item.Content title="비공개 기능" />
  </List.Item>

  <List.Footer>
    <List.Footer.Icon><InfoIcon size={14} /></List.Footer.Icon>
    마지막 업데이트: 5분 전
  </List.Footer>
</List>
```

Sub-component 트리:
```
List
├── List.Item          onClick? disabled?
│   ├── List.Item.Leading    children
│   ├── List.Item.Content    title  description?
│   └── List.Item.Trailing   children
├── List.Divider
└── List.Footer
    └── List.Footer.Icon     children
```

- `List.Item.Leading` · `List.Item.Trailing` 은 생략 가능 (Content만 있어도 됨)
- `onClick` 없으면 정적 행 (cursor-default, 호버 없음)

### Icon — 아이콘 목록

모든 아이콘은 `size?: number` (default 24) + `SVGProps<SVGSVGElement>` 를 수용.  
색상은 `className="text-{token}"` 으로 제어 (`currentColor` 기반).

| 이름                 | 주요 용도                                          |
| -------------------- | -------------------------------------------------- |
| `ChevronRightIcon`   | 목록 행 →, 다음 페이지                             |
| `ChevronLeftIcon`    | 뒤로 이동                                          |
| `ChevronDownIcon`    | 드롭다운 열림 표시                                 |
| `ChevronUpIcon`      | 접기                                               |
| `ArrowRightIcon`     | 주요 방향성 CTA (chevron보다 강한 무게)             |
| `SearchIcon`         | 검색 Input leading 슬롯, 검색 버튼                 |
| `CloseIcon`          | 모달 닫기, 태그 dismiss, Input clear               |
| `CheckIcon`          | 성공 피드백, 체크박스 체크 상태                    |
| `InfoIcon`           | 정보성 힌트, 비중요 안내                           |
| `AlertTriangleIcon`  | 경고 상태, 파괴적 동작 확인                        |
| `ExternalLinkIcon`   | 새 탭 외부 링크                                    |
| `BookmarkIcon`       | 기사 저장/취소 — `fill-current` 로 저장 상태 표현 |
| `StarIcon`           | 즐겨찾기 — `fill-current` 로 활성 상태 표현       |
| `ShareIcon`          | 공유                                               |
| `MenuIcon`           | 햄버거 / 메인 내비게이션 트리거                    |
| `UserIcon`           | 프로필 / 계정                                      |

아이콘 상태 예시:
```tsx
// 저장 토글
<BookmarkIcon
  size={20}
  className={saved ? "fill-current text-accent" : "text-text-secondary"}
/>

// 비활성 별
<StarIcon size={16} className="text-text-disabled" />
// 활성 별
<StarIcon size={16} className="fill-current text-warning" />
```

---

## Design Rules

### Color

Grayscale 토큰 기본. Accent(emerald)는 인터랙티브 요소(버튼·링크·포커스링·Spinner 강조)에만.
장식 목적 색상 및 앱 전용 색상 금지.

### Radius — 레이어 높이에 비례

| 요소           | 클래스         | 값    |
| -------------- | -------------- | ----- |
| 배지·태그      | `rounded-sm`   | 4px   |
| 버튼·인풋      | `rounded-md`   | 8px   |
| 카드·패널·List | `rounded-xl`   | 16px  |
| 모달·시트      | `rounded-3xl`  | 24px  |
| 아바타         | `rounded-full` | —     |

### Spacing

넉넉하게. 카드 `p-5`↑, 섹션 `space-y-8`↑, 그리드 `gap-5`↑.  
List.Item: `px-4 py-3`. Input: `h-10 px-3`. `p-2` 이하는 아이콘 버튼만.

### Typography

`type-{role}-{level}` 프리셋 클래스를 사용한다. `text-*` + `font-*`를 개별 조합하지 말 것.

| 클래스            | 크기 | 굵기     | 용도                       |
| ----------------- | ---- | -------- | -------------------------- |
| `type-display-1`  | 48px | Bold     | Hero, 랜딩 — 가장 큰 강조  |
| `type-display-2`  | 40px | Bold     | Feature 섹션 강조          |
| `type-display-3`  | 36px | Bold     | Title 위계보다 큰 강조     |
| `type-title-1`    | 30px | SemiBold | 페이지 타이틀              |
| `type-title-2`    | 24px | SemiBold | 섹션·모달 타이틀           |
| `type-title-3`    | 20px | SemiBold | 카드·다이얼로그 타이틀     |
| `type-heading-1`  | 18px | SemiBold | 서브섹션 헤딩              |
| `type-heading-2`  | 16px | SemiBold | 아이템 헤딩                |
| `type-headline-1` | 16px | Medium   | 본문 상위 강조 (Bold body) |
| `type-headline-2` | 14px | Medium   | 작은 강조 텍스트           |
| `type-body-1`     | 16px | Regular  | 기본 본문 (읽기용)         |
| `type-body-2`     | 14px | Regular  | 보조 본문                  |
| `type-label-1`    | 14px | Medium   | 폼 레이블, 네비게이션      |
| `type-label-2`    | 12px | Medium   | 작은 UI 레이블             |
| `type-caption-1`  | 12px | Regular  | 메타 정보, 태그            |
| `type-caption-2`  | 11px | Regular  | 가장 작은 보조 텍스트      |

컴포넌트별 적용 기준:
- Input label → `type-label-1`
- Input hint/error → `type-caption-1`
- List.Item title → `type-headline-2`
- List.Item description → `type-caption-1`
- List.Footer → `type-caption-1`

### 기타

- 그림자: 라이트 모드만 `shadow-sm/md`. 다크는 border로 구분.
- Hover: `hover:bg-surface-raised`. 카드는 `hover:shadow-md` 추가 가능.
- Focus: `focus-visible:ring-2 focus-visible:ring-accent` 필수. 에러 상태면 `ring-error`.
- Transition: `transition-colors`만.
- Active (List.Item 탭/클릭): `active:bg-surface-overlay`.

---

## Constraints

- `style={{}}` 인라인 스타일 금지 → Tailwind 토큰 사용
- 하드코딩 색상 금지 (`bg-accent` 등 시맨틱 토큰 사용)
- `next/image`, `next/link` 등 Next.js import 금지
- 다른 내부 패키지 import 금지
- "use client" 는 이벤트 핸들러·훅 사용 컴포넌트에만 (`Icon`, `Divider`, `Spinner` 제외)

---

## Extensibility Rules

새 컴포넌트 추가 시:
1. **슬롯 먼저**: leading/trailing/children 슬롯으로 해결 가능하면 prop 추가 전에 슬롯 사용
2. **Compound는 3개 이상 서브컴포넌트일 때**: `Object.assign(Root, { Sub })` 패턴
3. **과도한 자유도 금지**: 모든 className을 override하는 `unstyled` prop 없음
4. **신규 컴포넌트 추가 후** figma-plugin에도 반영 (아래 규칙 참고)

---

## Tokens

수정 시 세 곳 모두 업데이트: `tokens.json` → `src/styles/tokens.css` → `tailwind.config.ts`

---

## Figma Plugin 동기화

`packages/ui` (디자인 시스템)를 수정한 경우, `packages/figma-plugin`도 함께 수정이 필요할 수 있다.

**규칙**: 디자인 시스템 변경(토큰·컴포넌트·타이포그래피·색상 등) 후, 반드시 사용자에게 다음을 물어볼 것:

> "figma-plugin도 함께 업데이트할까요? 변경된 내용: [변경 요약]"

사용자가 동의하면 `packages/figma-plugin`의 관련 파일을 수정한다. 동의 없이 먼저 수정하지 않는다.

현재 Figma plugin이 지원하는 컴포넌트: `Button`, `Badge`, `Card`, `Input`, `List`, `Divider`, `Spinner`, `Icon`
