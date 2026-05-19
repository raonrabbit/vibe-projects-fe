# Frontend Developer Portfolio — 최준혁

> PDF `포트폴리오.pdf`에서 텍스트를 추출해 정리한 마크다운입니다. 도표·다이어그램·스크린샷 등은 원본 PDF를 참고하세요.

## 연락처

- **이메일:** raonrabbit@gmail.com
- **전화:** 010-4000-4887
- **GitHub:** [https://github.com/raonrabbit](https://github.com/raonrabbit)

## 한 줄 소개

> Next.js · TypeScript 기반으로 운영 환경의 UI 구조 설계와 성능 개선을 경험한 프론트엔드 개발자 최준혁입니다.

## 학력

| 기간              | 내용                                        |
| ----------------- | ------------------------------------------- |
| 2018-03 ~ 2024-02 | 안양대학교 컴퓨터공학 전공, 3.89 / 4.5 학점 |

## 자격증

| 취득일     | 자격증       |
| ---------- | ------------ |
| 2023-11-15 | 정보처리기사 |

## 수상

| 시기    | 내용                               |
| ------- | ---------------------------------- |
| 2025-05 | SSAFY 2학기 프로젝트 우수상(2등)   |
| 2025-04 | SSAFY 2학기 프로젝트 우수상(1등)   |
| 2024-11 | SSAFY 1학기 프로젝트 최우수상(1등) |

## 활동 및 교육

| 기간              | 내용                       | 비고 |
| ----------------- | -------------------------- | ---- |
| 2025-11 ~ 2026-01 | 대한수중·핀수영협회        | 외주 |
| 2024-07 ~ 2025-06 | 삼성 청년 SW · AI 아카데미 | 수료 |

## 어학

| 날짜       | 시험 | 등급 |
| ---------- | ---- | ---- |
| 2025-09-05 | OPIC | IM1  |

---

## 기술 스택

### JavaScript

- ES6+ 문법에 대한 이해와 활용 가능
- async/await, Promise 등 비동기 통신 및 데이터 처리 이해

### TypeScript

- 타입, 인터페이스, 제네릭 등에 대한 이해
- 런타임 에러를 줄이고 코드 안정성을 높이기 위해 프로젝트에 적극적으로 활용

### React

- 컴포넌트 설계·재사용 및 상태 관리 가능
- 커스텀 훅 설계로 로직 분리·재사용 경험
- TanStack Query 등 다양한 라이브러리 활용 경험

### Next.js

- Next.js 16(App Router) 기반의 상용 서비스 아키텍처 설계 및 배포 경험
- Server/Client Component에 대한 이해 및 설계 경험

### AI Agent 프로젝트

- 구조, 컨벤션을 AI에 주입해 일관된 코드 생성 환경 구축 경험
- AI를 설계 도구로 활용한 4주 내 실 서비스 배포 경험

### Git & JIRA

- Git Flow 전략을 활용한 협업 경험
- JIRA를 활용한 이슈 및 스프린트 관리 경험

### Figma

- Auto Layout으로 반응형 레이아웃 설계 가능
- 와이어프레임, 목업 제작 경험

---

## PJT 1. 대한수중·핀수영협회

**대한수중·핀수영협회 외주 개발**

기존 홈페이지의 노후화된 UI/UX와 비효율적인 관리 시스템을 개선하기 위해 Next.js 기반으로 전면 재개발했습니다. 공식 협회 사이트로 현재 운영 중입니다.

| 항목      | 내용                                              |
| --------- | ------------------------------------------------- |
| 성과      | 실사용자를 대상으로 하는 웹페이지 개발 및 운영    |
| 개발 기간 | 2025.11 ~ 2026.01 (5주, 이후 유지보수)            |
| 사용 기술 | Next.js, TypeScript, Tailwind CSS, TanStack Query |
| 개발 인원 | Web Designer 2, Backend 2, Frontend 2             |
| 담당 파트 | \* (프론트엔드 중심)                              |

**주요 기능**

- 협회 소개 · 종목 소개 · 대회정보 페이지
- 게시판 시스템 (공지사항, 갤러리, 대회일정 등 22개)
- 관리자 대시보드 (팝업 · 회원 · 소개 페이지 콘텐츠 관리)

**담당 역할**

- **SEO & 메타데이터**: 전체 페이지 SEO 구조 개선
- **콘텐츠/게시판 기능 및 공통 레이아웃 설계**
  - 공지사항, 포토갤러리 등 게시판 페이지 CRUD 구현
  - 게시글 작성/관리 공통 컴포넌트 및 기능 개발
  - GNB, Routing 등 공통 레이아웃 설계 및 구현
- **성능 최적화**
  - 이미지 최적화 전략 적용 및 SVG 처리 정책 개선
  - 폰트 최적화 및 렌더링 성능 개선
- **운영/배포 파이프라인**: GitHub Actions 기반 CD 파이프라인 개선(rolling CD 포함)

**참고:** [http://kua.or.kr/](http://kua.or.kr/)

### 운영형 게시판 공통화 설계

**주제:** 22개 게시판 일관된 구조 유지 및 신규 추가 비용 최소화

- **Why?** 디자인 미확정 · 요구사항 변경이 잦은 환경에서 마감 기한은 타이트하여 변경에 강한 구조 설계가 필수
- **How**
  - Compound Component 패턴으로 PostForm 설계 — 10개 서브 컴포넌트 조합, 게시판마다 필요한 필드만 구성
  - Generic 기반 DataTable — `DataTable<T>`로 도메인 데이터를 단일 컴포넌트로 렌더링, 컬럼 정의만 주입
  - JSDoc 기반 문서화 — 서브 컴포넌트 조합 방식과 props 계약 명시
- **Result** 신규 게시판은 서브 컴포넌트 조합과 컬럼 정의만으로 구현 가능. 22개 게시판 전반 UX 일관, 운영 변경에 빠르게 대응

**관련 필드 예시:** PinField, ShowField, TitleField, ContentField, Attachment Field, Thumbnail ImageField

### 운영 서비스 보안 (XSS · SSRF)

**주제:** 운영 중 확인된 취약점 자체 탐지 및 대응

- **Why?** `dangerouslySetInnerHTML` 렌더링 구조와 URL 검증 없는 Route Handler fetch 구조에서 XSS·SSRF 이슈 확인
- **How**
  - **XSS:** `isomorphic-dompurify` 도입, `sanitizeHtml()`로 렌더링 전 스크립트 제거
  - **SSRF:** Route Handler URL을 http/https로 제한하고 허용 API 호스트만 fetch하도록 검증 로직 적용
- **Result** XSS·SSRF 발생 원리와 방어 패턴을 실서비스 흐름 기준으로 정리

### LCP 개선

**주제:** 페이지 체감 로딩 속도 약 80% 단축 (3.0s → 0.6s)

- **Why?** 운영 배포 후 Lighthouse Performance 83점, LCP 3초 초과
- **How**
  - 폰트: 대용량 폰트 preload 구조를 woff2 기반 Dynamic Subsetting으로 전환
  - 이미지: LCP 대상 이미지 포맷/요청 구조를 점검해 병목 제거
- **Result** LCP 약 80% 단축(3.0s -> 0.6s), 렌더링 초기 리소스 최적화 경험 확보

### SEO

**주제:** 사용자 접근 가능 전 페이지 SEO 적용

- **Why?** 공통 Metadata·OG만 있어 링크 공유 시 모든 페이지가 동일 썸네일·제목으로 노출
- **How** `robots.ts` · `sitemap.ts` (43개 정적 라우트), 정적 페이지 메타, 동적 라우트는 API 기반 메타 생성
- **Result** 관리자·인증·API 라우트 제외 사용자 페이지 SEO 완료, 공유 시 페이지별 제목·썸네일

### 무중단 배포

**주제:** GitHub Actions + PM2 cluster

- **Why?** 잦은 배포 필요, 기존 방식은 재시작 시 요청 끊김
- **How** PM2 클러스터 2인스턴스, `pm2 reload`로 순차 재시작
- **Result** 추가 인프라 없이 단일 서버에서 체감 다운타임 최소화

---

## PJT 2. 동행

**시니어를 위한 쉽고 편한 AI 기반 뱅킹 키오스크**

사라져 가는 은행 점포의 대안을 위해 3D AI 은행원과 음성을 통해 은행 업무를 볼 수 있는 뱅킹 키오스크를 개발하는 프로젝트를 기획했습니다. **삼성 청년 SW·AI 아카데미 우수상(1등)**

| 항목      | 내용                                                  |
| --------- | ----------------------------------------------------- |
| 성과      | 삼성 청년 SW·AI 아카데미 우수상(1등)                  |
| 개발 기간 | 2025.03 ~ 2025.04                                     |
| 사용 기술 | Electron, TypeScript, Tailwind CSS, Three.js, Blender |
| 개발 인원 | Backend 2, Frontend 2, Infra 1, AI 1                  |
| GitHub    | donghang                                              |

**주요 기능**

- 영상 분석으로 연령대 자동 판별
- 3D AI 은행원과 음성 기반 대화
- 입금, 이체, 적금 등 다양한 뱅킹 기능 제공
- 음성으로 보이스 피싱 유추

**담당 역할**

- **아바타 & 3D 렌더링**: 3D 아바타 모델 및 애니메이션 시스템 구현 (idle, walk, bow 등)
- **음성 인식 (VAD)**: VAD(Voice Activity Detection) 시스템 구현
- **영상 분석 (Video Detection)**
  - 소켓 통신 훅 구현
  - 비디오 분석을 통한 사용자 감지 및 연령대에 따른 화면 분기 로직 구현
- **AI 액션 / 대화 시스템**: 음성 및 자막 처리 시스템, 대화 등 전체적인 액션 시스템 구현
- **시니어 레이아웃 & 페이지**: 시니어 전용 레이아웃 구현 및 시니어 페이지 전체 구현

### 접근성 (시니어 UI)

- **Why?** 시니어 대상 플랫폼으로 접근성 중요
- **How** WCAG 2.1 AA 목표, 명암비 4.5:1 이상, 폰트 25% 확대, 터치 영역 최소 44×44px, 금융권 가이드라인 참고 용어(예: 이체 → 송금하기)

### 3D 모델링·애니메이션

- Blender로 3D 은행원 수정·키프레임 애니메이션
- Three.js로 모델·애니메이션 적용

### 멀티 윈도우 (Electron)

- **Why?** 실제 ATM은 메인 디스플레이와 숫자 패드 분리
- **How** Main / Preload / Renderer, 듀얼 Window, IPC로 입력·메인 화면 동기화
- **Result** 듀얼 윈도우 키오스크, Electron 구조 이해

### useActionPlay 커스텀 훅

**주제:** 음성 · 자막 · 애니메이션 3시스템 통합 제어

- **Why?** 27개 화면 · 60여 상황에서 AI 은행원 음성·자막·Three.js 애니메이션 동시 관리
- **How** `shouldActivate` 선언형 API, ref 기반 Idempotency Guard(`hasActivated.current`), `onComplete` 콜백 체이닝, Context와 조합
- **Result** 동일 인터페이스로 아바타 행동 제어, 비동기 충돌·누수 방지 로직을 훅 한곳에서 관리

---

## PJT 3. 행복하개

**유기견 보호소를 위한 보호소 관리 플랫폼**

소규모 사설 유기견 보호소에서 네이버 카페로 수작업 관리하던 후원 · 봉사 · 유기견 정보를 통합 관리할 수 있는 플랫폼을 개발했습니다. **SSAFY 우수상(2등)**

| 항목      | 내용                                                              |
| --------- | ----------------------------------------------------------------- |
| 성과      | 삼성 청년 SW·AI 아카데미 우수상(2등)                              |
| 개발 기간 | 2025.04 ~ 2025.05                                                 |
| 사용 기술 | React, TypeScript, Tailwind CSS, TanStack Query, Zustand, EasyOCR |
| 개발 인원 | Backend3, Frontend3                                               |
| 담당 파트 | \* (프론트엔드 중심)                                              |
| GitHub    | hangbokdog (원본 표기 참고)                                       |

**주요 기능**

- 보호소 등록 및 관리
- 봉사 및 입양 / 유기견 임시보호 신청 등 일반 사용자용 기능
- 관리자 전용 통합 대시보드

**담당 역할**

- **프론트엔드 라우팅 & 페이지 구조**: 전역 라우팅 구조(router) 설계 및 페이지 연결 구현
- **공고/긴급공고 기능**: 긴급공고 리스트·아이템 UI 구현 및 상세 연동 처리
- **강아지 도메인 기능**: 강아지 등록/조회/상세 화면 및 공통 카드 UI 구현
- **상태 관리 (TanStack Query · Zustand)**: TanStack Query 기반 캐싱, 자동 갱신, 무한 스크롤, 뮤테이션 이후 invalidate 처리 적용 / Zustand 기반 전역 상태 분리 및 `sessionStorage` 연동 영속화 구조 적용
- **AI 연계 기능 (OCR · 유사도)**: OCR 기반 강아지 정보 추출 API 연동 및 파싱 로직 구현

### TanStack Query · Zustand를 활용한 상태 관리

- **Why?**
  - **TanStack Query**: 강아지 목록/봉사 일정 등 API 데이터를 여러 컴포넌트에서 공유하면서 중복 요청, 뮤테이션 후 갱신 타이밍, 무한 스크롤·페이징 관리가 필요
  - **Zustand**: 로그인 토큰/선택 보호소가 앱 전반에 필요하고, 새로고침 시 상태 유실 문제를 해결하며 prop drilling 없이 전역 접근이 필요
- **How**
  - **Zustand**: `authStore` / `centerStore` / `notificationStore`로 역할별 스토어 분리, `authStore`·`centerStore`는 `sessionStorage` 연동으로 새로고침 후 자동 복원, 로그아웃 시 연쇄 초기화로 상태 불일치 방지
  - **TanStack Query**: `useQuery`, `useInfiniteQuery`로 캐싱·자동 갱신·무한 스크롤 처리, `enabled: !!centerId`로 보호소 미선택 시 요청 차단, 낙관적 업데이트로 응답 전 UI 즉시 반영
- **Result**
  - TanStack Query의 캐싱/자동 갱신/무한 스크롤/낙관적 업데이트 적용 경험
  - Zustand의 `sessionStorage` 기반 영속화와 역할별 스토어 분리를 구현

### 접종 관리 검색 — 클라이언트 필터링

- **Why?** 검색마다 서버 요청이 과한지 의문
- **How** 보호소당 최대 약 500마리, 전체 페이로드 ~72KB(비압축), gzip 시 ~15–20KB, 클라 필터링 `performance.now()` 기준 중앙값 ~0.1ms 실측 → 초기 1회 로드 후 클라 필터
- **Result** 반복 검색 시 API 요청 제거, 수치 기반 아키텍처 결정 경험

### EasyOCR 공고 자동 입력

- **Why?** 공고 이미지 수기 입력 반복, 레이아웃 다양해 정규식 한계
- **How** Python EasyOCR → 키워드 파싱 → 프론트 폼 자동 입력, 하이라이트로 자동 입력 구분
- **Result** 업로드만으로 주요 필드 입력, Python 서버 AWS 배포 경험

---

## PJT 4. 이집어때

**AI를 활용한 부동산 추천 플랫폼**

매물·시세를 AI로 쉽게 보고, Naver 뉴스·핫한 매물 등을 시각화. **SSAFY 최우수상(1등)**

| 항목      | 내용                                                      |
| --------- | --------------------------------------------------------- |
| 성과      | 삼성 청년 SW·AI 아카데미 최우수상(1등)                    |
| 개발 기간 | 2024.10 ~ 2024.11                                         |
| 사용 기술 | React, TypeScript, Chakra UI, TanStack Query, Spring Boot |
| 개발 인원 | Backend 1, Frontend 1, Infra 1                            |
| 담당 비중 | 백엔드 70% · 프론트 30% (표기 기준)                       |
| GitHub    | Ezip                                                      |

**주요 기능**

- 지도·차트 기반 부동산 정보
- OpenAI API 시세 예측·챗봇
- 부동산 뉴스, 핫한 매물 시스템

**담당 역할**

- Naver 뉴스 Open API 연동·화면, OpenAI API·챗봇
- 다크모드 구현
- Spring Boot MVC, DB 설계

### Naver 뉴스 · 챗봇

- Naver 뉴스 API 수집, Chakra UI Grid로 반응형 카드·호버
- OpenAI 사전 프롬프팅 챗봇, SessionStorage로 대화 상태 유지

### 다크모드 · 반응형

- `useColorMode` / `useColorModeValue`, `extendTheme`로 일관 다크모드
- `useBreakpointValue`로 로고·텍스트·레이아웃 동적 전환

---

_원본 PDF 마지막 문구: 긴 문서 봐주셔서 감사합니다._
