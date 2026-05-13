# prompt-brief skill

사용자가 "A 기능 만들고 싶어"처럼 막연하게 말했을 때, **질문으로 의도/목표/제약을 구체화**한 다음, 최종적으로 **Claude Code에 그대로 붙여넣을 수 있는 프롬프트 텍스트**를 생성한다.

## 언제 쓰나 (트리거)

- 사용자가 요구사항이 모호한 상태로 기능/화면/개선 요청을 할 때 (예: "A 만들자", "이거 좀 해줘", "기능 추가")
- 사용자가 "요구사항 정리", "프롬프트 만들어줘", "Claude에게 시킬 프롬프트"를 원할 때
- 구현 전에 질문을 통해 범위를 고정하고 성공 기준을 정의해야 할 때

## 동작 규칙 (중요)

- **추측 금지**: 모르면 질문한다. 사용자가 답을 못 하는 항목은 "미정"으로 남긴다.
- **범위 고정**: "무엇을/왜/언제 완료로 볼지"를 먼저 확정한다.
- **질문은 최소·고효율**: 한 번에 6–10개 내로 핵심만 묻고, 답변에 따라 2차 질문을 0–5개로 제한한다.
- **출력은 2단 구성**:
  1) 사용자에게 던질 질문 리스트
  2) Claude Code에 붙여넣을 최종 프롬프트(템플릿 채움)

## 1) 1차 질문 세트 (필수)

아래 질문을 순서대로 묻고, 답을 받아 요약한다.

1. **목표/가치**: 이 기능으로 사용자가 얻는 결과는 무엇인가? (한 문장)
2. **사용자/대상**: 누가 쓰나? (로그인 사용자/관리자/게스트 등)
3. **사용 시나리오**: 언제/어떤 흐름에서 쓰나? (시작점 → 완료까지)
4. **성공 기준**: "완료"를 어떻게 판단하나? (측정 가능/검증 가능하게)
5. **범위(포함/제외)**: 반드시 포함할 것 3개 / 하지 않을 것 3개
6. **제약**: 기술/디자인/일정/호환성/성능 제약이 있나?
7. **데이터/연동**: 필요한 API/DB/외부 서비스/권한이 있나? 없으면 "없음/미정"
8. **UI/UX**: 어떤 화면/컴포넌트가 바뀌나? 참고 화면/링크/스케치가 있나?

## 2) 2차 질문 (조건부)

아래는 답변에 따라 필요한 것만 추가로 묻는다.

- **엣지 케이스**: 오류/빈 상태/권한 없음/네트워크 실패 시 동작은?
- **정책/문구**: 토스트/에러 문구/로그 정책이 필요한가?
- **테스트**: 최소 테스트 요구(유닛/통합/e2e)나 재현 시나리오가 있나?
- **릴리즈**: 점진 배포/플래그/마이그레이션 필요?

## 3) 결과물 생성 (Claude Code 프롬프트)

질문 답을 반영해 아래 템플릿을 채워 **그대로 출력**한다.
답이 없는 항목은 `미정`으로 둔다.

---

### Claude Code Prompt (copy/paste)

```markdown
You are working in a monorepo. Follow the repository rules in CLAUDE.md.

## Goal
[한 문장 목표]

## Context
- Target users: [누가 쓰는지]
- Primary scenario: [시작점 → 완료 흐름]

## Requirements (must)
- [필수 요구사항 1]
- [필수 요구사항 2]
- [필수 요구사항 3]

## Non-goals (must NOT do)
- [제외 1]
- [제외 2]
- [제외 3]

## UX / UI
- Affected screens/components: [미정 또는 구체 목록]
- Copy/text requirements: [미정 또는 문구 정책]
- Empty/error states: [정의된 동작 또는 미정]

## Data / Integrations
- APIs/DB/external services: [없음/미정/구체]
- Permissions/roles: [미정 또는 구체]

## Constraints
- Tech constraints: [예: pnpm only, turborepo tasks via turbo, etc.]
- Other constraints: [성능/호환/일정 등]

## Acceptance criteria
- [검증 가능한 완료 기준 1]
- [검증 가능한 완료 기준 2]

## Test plan (minimum)
- [사용자가 원하는 테스트 또는 "미정"]

## Deliverables
- Code changes scoped only to what is required.
- Clear summary of what changed and why.
```

---

## 4) 출력 형식 (너의 응답 형식)

항상 아래 형식으로만 답한다.

1) **Clarifying questions**: 번호 목록 (필수 1차 + 필요한 2차만)
2) **Filled Claude Code Prompt**: 위 템플릿을 채운 블록

## 예시 (아주 짧게)

사용자: "로그인 후 프로필 사진 바꾸는 기능 만들고 싶어"

너의 질문 예:
- 목표가 "업로드 후 즉시 반영"인지, "승인 후 반영"인지?
- 지원 포맷/용량 제한?
- 실패 시 문구/재시도 UX?

그 다음 Claude Code Prompt를 채워서 출력한다.

