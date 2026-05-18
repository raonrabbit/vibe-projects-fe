**모든 `apps/` 하위 프론트엔드 앱은 Feature-Sliced Design(FSD) 구조를 따른다.**

레이어 구조 (의존성은 아래 방향만 허용):

```
app/       # Next.js App Router — 라우팅 진입점만, 비즈니스 로직 없음
pages/     # 위젯 조합으로 페이지 구성
widgets/   # 복합 UI 블록 (여러 feature/entity를 조합)
features/  # 사용자 인터랙션 단위 (auth, theme, …)
entities/  # 비즈니스 엔티티 (article, keyword, user, …)
shared/    # 순수 재사용 리소스 (ui, api, lib, config, types)
```

Rules:

- 의존성 방향: `shared` ← `entities` ← `features` ← `widgets` ← `pages` ← `app`
- 같은 레이어 간 참조 금지 (예: widget → widget 불가)
- 각 슬라이스는 `index.ts` barrel export로 공개 API를 명시
- `app/` Next.js 라우트 파일은 해당 `pages/` 슬라이스를 렌더링하는 것만 담당
