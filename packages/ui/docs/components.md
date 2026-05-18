# Component Catalog

## 컴포넌트 목록

| 컴포넌트           | 파일                 | 패턴                    | 주요 Props                                           |
| ------------------ | -------------------- | ----------------------- | ---------------------------------------------------- |
| `Button`           | Button.tsx           | forwardRef              | `variant` · `size` · `loading`                      |
| `IconButton`       | IconButton.tsx       | forwardRef              | `variant` · `size` · `loading` · `aria-label`(필수) |
| `Badge`            | Badge.tsx            | forwardRef              | `variant` · `size`                                  |
| `Card`             | Card.tsx             | forwardRef              | `padding` · `hoverable`                             |
| `Checkbox`         | Checkbox.tsx         | forwardRef + `useId`    | `label` · InputHTMLAttributes                       |
| `Input`            | Input.tsx            | forwardRef + `useId`    | `label` · `hint` · `error` · `leading` · `trailing` |
| `List`             | List.tsx             | **Compound**            | 아래 API 참고                                        |
| `Modal`            | Modal.tsx            | **Compound** (Radix)    | `open` · `onOpenChange` · `defaultOpen`             |
| `SegmentedControl` | SegmentedControl.tsx | controlled/uncontrolled | `options` · `value` · `defaultValue` · `onChange`   |
| `Skeleton`         | Skeleton.tsx         | 순수 표현               | HTMLDivElement 전체                                  |
| `Tab`              | Tab.tsx              | **Compound** (Radix)    | `value` · `defaultValue` · `onValueChange`          |
| `Table`            | Table.tsx            | **Compound**            | HTML table 속성 전체                                 |
| `Toast`            | Toast.tsx            | **Compound** (Radix)    | `open` · `onOpenChange` · `duration`                |
| `Divider`          | Divider.tsx          | 순수 표현               | `orientation` · `label`                             |
| `Spinner`          | Spinner.tsx          | 순수 표현               | `size`                                              |
| Icon 16종          | Icon.tsx             | 개별 named export       | `size` · SVGProps 전체                               |

---

## Input — 슬롯 확장 패턴

```tsx
// 기본
<Input label="이메일" placeholder="example@email.com" />

// 아이콘 슬롯 + 에러
<Input
  label="검색"
  leading={<SearchIcon size={16} />}
  trailing={<IconButton aria-label="지우기"><CloseIcon size={16} /></IconButton>}
  error="검색어를 입력해 주세요"
/>
```

- `leading` / `trailing`에는 아이콘이나 인터랙티브 노드 모두 허용
- `error`가 있으면 `hint`는 숨김

---

## List — Compound 패턴

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

- `List.Item.Leading` · `List.Item.Trailing` 생략 가능
- `onClick` 없으면 정적 행 (cursor-default, 호버 없음)

---

## Icon — 아이콘 목록

모든 아이콘은 `size?: number` (default 24) + `SVGProps<SVGSVGElement>` 수용.  
색상은 `className="text-{token}"` 으로 제어 (`currentColor` 기반).

| 이름                | 주요 용도                                         |
| ------------------- | ------------------------------------------------- |
| `ChevronRightIcon`  | 목록 행 →, 다음 페이지                            |
| `ChevronLeftIcon`   | 뒤로 이동                                         |
| `ChevronDownIcon`   | 드롭다운 열림 표시                                |
| `ChevronUpIcon`     | 접기                                              |
| `ArrowRightIcon`    | 주요 방향성 CTA (chevron보다 강한 무게)            |
| `SearchIcon`        | 검색 Input leading 슬롯, 검색 버튼                |
| `CloseIcon`         | 모달 닫기, 태그 dismiss, Input clear              |
| `CheckIcon`         | 성공 피드백, 체크박스 체크 상태                   |
| `InfoIcon`          | 정보성 힌트, 비중요 안내                          |
| `AlertTriangleIcon` | 경고 상태, 파괴적 동작 확인                       |
| `ExternalLinkIcon`  | 새 탭 외부 링크                                   |
| `BookmarkIcon`      | 기사 저장/취소 — `fill-current`로 저장 상태 표현 |
| `StarIcon`          | 즐겨찾기 — `fill-current`로 활성 상태 표현       |
| `ShareIcon`         | 공유                                              |
| `MenuIcon`          | 햄버거 / 메인 내비게이션 트리거                   |
| `UserIcon`          | 프로필 / 계정                                     |
| `MoonIcon`          | 다크 모드 전환                                    |
| `SunIcon`           | 라이트 모드 전환                                  |

```tsx
// 저장 토글
<BookmarkIcon size={20} className={saved ? "fill-current text-accent" : "text-text-secondary"} />

// 활성 별
<StarIcon size={16} className="fill-current text-warning" />
```
