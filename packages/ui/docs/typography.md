# Typography Scale

`type-{role}-{level}` 프리셋 클래스를 사용한다. `text-*` + `font-*` 개별 조합 금지.

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

## 컴포넌트별 적용 기준

| 위치                 | 클래스            |
| -------------------- | ----------------- |
| Input label          | `type-label-1`    |
| Input hint/error     | `type-caption-1`  |
| List.Item title      | `type-headline-2` |
| List.Item description| `type-caption-1`  |
| List.Footer          | `type-caption-1`  |
