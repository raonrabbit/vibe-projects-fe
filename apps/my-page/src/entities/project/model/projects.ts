export interface CodePanel {
  label: string;
  code: string;
  filename?: string;
}

export interface CodeDemoItem {
  title?: string;
  panels: CodePanel[];
}

export interface ProjectHighlight {
  title: string;
  metric?: string;
  why: string;
  how: string;
  result: string;
  codeDemos?: CodeDemoItem[];
  uiDemoId?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  images: string[];
  period: string;
  tech: string[];
  award?: string;
  team: string[];
  role: string[];
  highlights: ProjectHighlight[];
  github?: string;
  url?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "kua",
    title: "대한수중·핀수영협회",
    subtitle: "대한수중·핀수영협회 외주 개발",
    description:
      "기존 홈페이지의 노후화된 UI/UX와 비효율적인 관리 시스템을 개선하기 위해 Next.js 기반으로 전면 재개발했습니다. 공식 협회 사이트로 현재 운영 중입니다.",
    features: [
      "협회 소개 · 종목 소개 · 대회정보 페이지",
      "게시판 시스템 (공지사항, 갤러리, 대회일정 등 22개)",
      "관리자 대시보드 (팝업 · 회원 · 소개 페이지 콘텐츠 관리)",
    ],
    images: [
      "/project-imgs/kua/kua-thumbnail.png",
      "/project-imgs/kua/kua01.png",
      "/project-imgs/kua/kua02.png",
      "/project-imgs/kua/kua03.png",
      "/project-imgs/kua/kua04.png",
    ],
    period: "2025.11 – 2026.01",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Tanstack Query"],
    team: ["Web Designer 2", "Backend 2", "Frontend 2"],
    role: [
      "SEO & 메타데이터: 전체 페이지 SEO 구조 개선",
      "콘텐츠/게시판 기능 및 공통 레이아웃 설계: 게시판 CRUD, 공통 컴포넌트 개발, GNB·라우팅 설계 구현",
      "성능 최적화: 이미지·SVG 최적화, 폰트 최적화 및 렌더링 성능 개선",
      "운영/배포 파이프라인: GitHub Actions 기반 CD 파이프라인 구축 (rolling CD 포함)",
    ],
    highlights: [
      {
        title: "운영형 게시판 공통화 설계",
        why: "디자인 미확정·요구사항 변경이 잦은 환경에서 마감 기한은 타이트하여, 변경에 강한 구조 설계가 필수적인 상황이었습니다.",
        how: "Compound Component 패턴으로 PostForm을 설계해 게시판마다 필요한 필드만 조합해 사용하도록 했습니다. Generic 기반 DataTable<T>로 다양한 도메인 데이터를 단일 컴포넌트로 렌더링하고, 도메인마다 컬럼 정의만 주입하는 구조로 분리했습니다. JSDoc 기반 인터페이스 문서화로 서브 컴포넌트 조합 방식과 props 계약을 명시해 팀 내 불필요한 구현 문의를 최소화했습니다.",
        result:
          "신규 게시판 추가 시 서브 컴포넌트 조합과 컬럼 정의만으로 구현 가능. 22개 게시판 전반에 일관된 UX 유지, 운영 요구사항 변경에 빠르게 대응 가능한 구조를 확보했습니다.",
        codeDemos: [
          {
            title: "Compound Component — 게시판마다 필드 조합만 교체",
            panels: [
              {
                label: "일반·문의 게시판",
                filename: "BasicPostCreate.tsx",
                code: `<PostForm.Root onSubmit={handleSubmit} isSubmitting={submitting}>
  {isAdmin && <PostForm.PinField />}
  {isAdmin && <PostForm.ShowField />}
  <PostForm.TitleField placeholder={titlePlaceholder} />
  <PostForm.ContentField />
  <PostForm.AttachmentField />
  <PostForm.Actions />
</PostForm.Root>`,
              },
              {
                label: "소식·활동 게시판",
                filename: "NewsAndActivitiesCreate.tsx",
                code: `// ImageField 하나만 추가하면 이미지 업로드 게시판 완성
<PostForm.Root onSubmit={handleSubmit} isSubmitting={isSubmitting}>
  <PostForm.PinField />
  <PostForm.TitleField placeholder="제목을 입력하세요 (50자 이내)" />
  <PostForm.ContentField />
  <PostForm.ImageField />        {/* 이미지 필드 추가 */}
  <PostForm.AttachmentField />
  <PostForm.Actions />
</PostForm.Root>`,
              },
              {
                label: "선수 정보 게시판",
                filename: "PlayerInfoPostCreate.tsx",
                code: `// 커스텀 날짜 필드를 Root 안에 자유롭게 삽입 가능
<PostForm.Root onSubmit={handleSubmit} isSubmitting={submitting}>
  {isAdmin && <PostForm.PinField />}
  {isAdmin && <PostForm.ShowField />}
  <PostForm.TitleField placeholder={titlePlaceholder} />
  {/* 커스텀 필드: 대회 기간 */}
  <div className="flex gap-3">
    <input type="date" value={competitionStartDate} onChange={...} />
    <input type="date" value={competitionEndDate} onChange={...} />
  </div>
  <PostForm.ExcelAttachmentField />  {/* Excel 전용 */}
  <PostForm.Actions />
</PostForm.Root>`,
              },
            ],
          },
          {
            title:
              "Generic DataTable<T> — Column 정의만 주입, 테이블 로직 재사용",
            panels: [
              {
                label: "지부 관리",
                filename: "BranchesManager.tsx",
                code: `// Column<BranchItem>[] 정의만 작성하면 테이블 완성
const columns: Column<BranchItem>[] = [
  { key: "name",      header: "지부명", accessor: (row) => row.name,      width: "300px" },
  { key: "president", header: "회장",   accessor: (row) => row.president, width: "100px" },
  { key: "phone",     header: "전화",   accessor: (row) => row.phone,     width: "120px" },
  { key: "email",     header: "메일",   accessor: (row) => row.email,     width: "180px" },
];

<DataTable columns={columns} data={data}
  getRowId={(row) => String(row.id)}
  onSelectionChange={setSelectedRows} />`,
              },
              {
                label: "임원 관리",
                filename: "ExecutivesManager.tsx",
                code: `// 완전히 다른 타입(ExecutiveItem)도 동일한 DataTable 재사용
const columns: Column<ExecutiveItem>[] = [
  { key: "image",       header: "이미지", accessor: (row) => <Avatar src={row.imagePath} />, width: "80px"  },
  { key: "committee",   header: "직책",   accessor: (row) => row.committee,                  width: "120px" },
  { key: "name",        header: "이름",   accessor: (row) => row.name,                       width: "100px" },
  { key: "description", header: "설명",   accessor: (row) => row.description },
];

<DataTable columns={columns} data={data}
  getRowId={(row) => String(row.id)}
  onSelectionChange={setSelectedRows} />`,
              },
            ],
          },
        ],
      },
      {
        title: "주요 보안 취약점(XSS·SSRF) 탐지 및 방어 구현",
        why: "사용자 입력과 게시글을 다루는 구조에서 보안 취약점이 발생할 수 있다고 판단해 직접 점검했고, XSS · SSRF 취약점을 확인했습니다.",
        how: "XSS는 isomorphic-dompurify를 도입해 렌더링 전 sanitizeHtml()로 악성 스크립트를 제거했습니다. SSRF는 Route Handler URL을 http/https로 제한하고 허용 API 호스트만 fetch하도록 검증 로직을 적용했습니다.",
        result:
          "XSS · SSRF 각 공격 벡터의 발생 원리와 방어 패턴을 이해하고 운영 코드에 적용했습니다.",
      },
      {
        title: "LCP 80% 단축 (3.0s → 0.6s) 폰트 최적화",
        metric: "3.0s → 0.6s (80% 단축)",
        why: "운영 배포 후 Lighthouse 측정 결과 Performance 83점, LCP가 3초를 초과하는 이슈를 확인했습니다. Next.js 이미지 최적화로 이미지가 WebP로 서빙되고 있었음에도 LCP 요소로 잡혀 Font 파일 로딩이 병목임을 개발자 도구 Performance 탭으로 확인했습니다.",
        how: "기존 Font 전체 파일(2MB)을 단일 로드하는 방식에서, 폰트를 서브셋 woff2 파일로 분할하고 Dynamic Subsetting 방식을 적용해 브라우저가 실제 사용되는 문자 범위의 청크만 요청하도록 변경했습니다.",
        result:
          "LCP 점수 3.0초 → 0.6초 (약 80% 단축). 폰트 구조 개선을 통한 LCP 최적화 전략을 이해했습니다.",
      },
    ],
    url: "http://kua.or.kr",
  },
  {
    id: "donghang",
    title: "동행",
    subtitle: "시니어를 위한 쉽고 편한 AI 기반 뱅킹 키오스크",
    description:
      "사라져 가는 은행 점포의 대안을 위해 3D AI 은행원과 음성을 통해 은행 업무를 볼 수 있는 뱅킹 키오스크를 개발하는 프로젝트를 기획했습니다.",
    features: [
      "영상 분석으로 연령대 자동 판별",
      "3D AI 은행원과 음성 기반 대화",
      "입금, 이체, 적금 등 다양한 뱅킹 기능 제공",
      "음성으로 보이스 피싱 유추",
    ],
    images: [
      "/project-imgs/donghang/donghang-thumbnail.png",
      "/project-imgs/donghang/donghang01.png",
      "/project-imgs/donghang/donghang02.png",
      "/project-imgs/donghang/donghang03.png",
    ],
    period: "2025.03 – 2025.04",
    tech: ["Electron", "TypeScript", "Tailwind CSS", "Three.js", "Blender"],
    award: "SSAFY 2학기 프로젝트 우수상(1등)",
    team: ["Backend 2", "Frontend 2", "Infra 1", "AI 1"],
    role: [
      "아바타 & 3D 렌더링: 3D 아바타 모델 및 애니메이션 시스템 구현 (idle, walk, bow 등)",
      "음성 인식 (VAD): VAD(Voice Activity Detection) 시스템 구현",
      "영상 분석 (Video Detection): 소켓 통신 훅 구현, 비디오 분석 기반 사용자 감지 및 연령대별 화면 분기",
      "AI 액션 / 대화 시스템: 음성·자막 처리 시스템 및 전체 액션 흐름 구현",
      "시니어 레이아웃 & 페이지: 시니어 전용 레이아웃 및 전체 페이지 구현",
    ],
    highlights: [
      {
        title:
          "useActionPlay 커스텀 훅 — 음성·자막·애니메이션 3시스템 통합 제어",
        why: "27개 화면에서 음성, 자막, 3D 애니메이션이 함께 실행됐습니다. 화면마다 재생 시점과 종료 처리 방식이 달라 같은 제어 로직이 반복됐고, 화면이 늘어날수록 수정 범위가 커지며 중복 실행이나 재생 누락 관리도 어려웠습니다.",
        how: "각 화면은 '지금 이 액션을 재생할지'와 '끝나면 무엇을 할지'만 전달하도록 설계했습니다. 재생 조건은 하나로 통일하고, 이미 실행한 작업은 ref로 기억해 중복 실행을 차단했습니다. 음성 종료 후 분기는 onComplete로 연결해 화면마다 타이머와 후속 처리 로직이 흩어지지 않도록 정리하고, 공통 재생 상태와 제어 함수는 Context로 묶어 여러 화면이 같은 방식으로 연결되도록 통일했습니다.",
        result:
          "개선 전에는 화면마다 오디오 실행, 애니메이션 제어, 종료 처리, 정리 로직을 직접 작성했습니다. 개선 후에는 화면에서 재생 조건과 완료 이후 동작만 넘기면 같은 패턴으로 연결 가능. 비동기 충돌과 중복 실행을 줄이고, 새 화면 추가 시에도 훅 호출 규칙만 맞추면 바로 붙일 수 있는 구조를 확보했습니다.",
        codeDemos: [
          {
            title: "선언형 API — shouldActivate 조건만 명시",
            panels: [
              {
                label: "훅 인터페이스",
                filename: "useActionPlay.tsx",
                code: `interface UseActionPlayOptions {
  audioFile?: string;      // 재생할 음성 파일
  dialogue?: string;       // 화면에 표시할 자막
  avatarState?: AvatarState; // Three.js 애니메이션 상태
  shouldActivate?: boolean;  // 선언형: 외부에서 조건만 명시
  animationDelay?: number;
  onComplete?: () => void;   // 완료 후 체이닝
}

// ref 기반 Idempotency Guard — 중복 실행 방지
const hasPlayed = useRef(false);

useEffect(() => {
  if (shouldActivate && !hasPlayed.current) {
    playAudio();
    setDialogue(dialogue);
    setAvatarState(avatarState);
    hasPlayed.current = true; // 동일 액션 재실행 차단
  }
}, [shouldActivate]);`,
              },
              {
                label: "27개 화면 사용 예시",
                filename: "TransferScreen.tsx",
                code: `// 각 화면은 shouldActivate 조건만 선언 → 훅이 타이밍 관리
useActionPlay({
  audioFile: "/audio/transfer-greeting.mp3",
  dialogue: "이체하실 계좌번호를 입력해 주세요.",
  avatarState: "talking",
  shouldActivate: step === "input-account",  // 조건만 명시
  onComplete: () => setStep("input-amount"), // 음성 종료 후 다음 단계
});

useActionPlay({
  audioFile: "/audio/transfer-amount.mp3",
  dialogue: "이체하실 금액을 입력해 주세요.",
  avatarState: "talking",
  shouldActivate: step === "input-amount",
  onComplete: () => setStep("confirm"),
});`,
              },
            ],
          },
        ],
      },
      {
        title: "Electron 듀얼 윈도우 멀티 화면 구현",
        why: "실제 ATM은 메인 디스플레이와 숫자 패드가 물리적으로 분리된 구조로, 이를 소프트웨어로 재현해 실제 ATM에 가까운 사용자 경험을 만들자는 방향으로 기획했습니다.",
        how: "Screen.getAllDisplays() API를 활용하여 연결된 디스플레이를 실시간으로 감지하고, 단일/듀얼 모니터 환경에 따라 자동으로 윈도우를 배치하는 시스템을 구축했습니다. Main / Renderer / Preload 프로세스를 분리하고 Context Bridge를 적용하여 보안 아키텍처를 설계했습니다. IPC 통신 구조를 설계하여 메인(뱅킹 서비스)과 서브(키패드) 윈도우 간 안정적인 양방향 데이터 동기화를 구현했습니다.",
        result:
          "메인 화면과 입력 화면이 실시간 동기화되는 듀얼 윈도우 키오스크를 구현했습니다. Electron의 Main / Preload / Renderer 구조에 대한 이해를 얻었습니다.",
        uiDemoId: "donghang-dual-window",
      },
      {
        title: "시니어 사용자를 위한 3D 은행원 모델링 · 애니메이션",
        why: "시니어 사용자에게 실제 은행원과 대화하는 듯한 친밀감 있는 경험을 제공하고자 했으며, 애니메이션 부재로 인한 몰입감 저하를 개선할 필요가 있었습니다.",
        how: "Blender를 활용하여 3D 은행원 모델링을 수정하고, 키프레임 애니메이션(idle, walk, bow 등)을 제작했습니다. Three.js를 통해 제작한 3D 모델과 애니메이션을 프로젝트에 적용했습니다.",
        result:
          "시니어 사용자에게 실제 은행원과 대화하는 듯한 몰입감 있는 경험을 제공했습니다.",
      },
    ],
    github: "https://github.com/raonrabbit",
  },
  {
    id: "hangbokdog",
    title: "행복하개",
    subtitle: "유기견 보호소를 위한 보호소 관리 플랫폼",
    description:
      "소규모 사설 유기견 보호소에서 네이버 카페로 수작업 관리하던 후원·봉사·유기견 정보를 통합 관리할 수 있는 플랫폼을 개발했습니다.",
    features: [
      "보호소 등록 및 관리",
      "봉사 및 입양 / 유기견 임시보호 신청 등 일반 사용자용 기능",
      "관리자 전용 통합 대시보드",
    ],
    images: [
      "/project-imgs/happydog/happydog-thumbnail.png",
      "/project-imgs/happydog/happydog01.png",
    ],
    period: "2025.04 – 2025.05",
    tech: [
      "React",
      "TypeScript",
      "Zustand",
      "Tailwind CSS",
      "Tanstack Query",
      "EasyOCR",
    ],
    award: "SSAFY 2학기 프로젝트 우수상(2등)",
    team: ["Backend 3", "Frontend 3"],
    role: [
      "프론트엔드 라우팅 & 페이지 구조: 전역 라우팅 구조 설계 및 페이지 연결",
      "공고/긴급공고 기능: 긴급공고 리스트·아이템 UI 구현 및 상세 연동 처리",
      "강아지 도메인 기능: 강아지 등록/조회/상세 화면 및 공통 카드 UI 구현",
      "상태 관리 (TanStack Query · Zustand): 캐싱·자동 갱신·무한 스크롤·낙관적 업데이트 / 전역 상태 분리 및 sessionStorage 영속화",
      "AI 연계 기능 (OCR): OCR 기반 강아지 정보 추출 API 연동 및 파싱 로직 구현",
    ],
    highlights: [
      {
        title: "TanStack Query · Zustand를 활용한 서버·클라이언트 상태 분리",
        why: "강아지 목록/봉사 일정 등 API 데이터를 여러 컴포넌트에서 공유하면서 중복 요청, 뮤테이션 후 갱신 타이밍, 무한 스크롤·페이징 관리가 필요했습니다. 한편 로그인 토큰/선택 보호소처럼 앱 전반에서 필요하고 새로고침 후에도 유지돼야 하는 전역 상태는 prop drilling 없이 접근할 수 있어야 했습니다.",
        how: "Zustand는 authStore / centerStore / notificationStore로 역할별로 스토어를 분리했습니다. authStore·centerStore는 sessionStorage와 연동해 새로고침 후 자동 복원되도록 하고, 로그아웃 시 연쇄 초기화로 상태 불일치를 방지했습니다. TanStack Query는 useQuery·useInfiniteQuery로 캐싱·자동 갱신·무한 스크롤을 처리하고, enabled: !!centerId로 보호소 미선택 시 요청을 차단했습니다. 낙관적 업데이트로 서버 응답 전 UI를 즉시 반영해 체감 반응 속도를 높였습니다.",
        result:
          "TanStack Query의 캐싱/자동 갱신/무한 스크롤/낙관적 업데이트와 Zustand의 sessionStorage 기반 영속화·역할별 스토어 분리를 실제 서비스에 적용하며 서버·클라이언트 상태를 목적에 맞게 나눠 관리하는 경험을 쌓았습니다.",
      },
      {
        title: "접종 관리 검색 — 클라이언트 필터링 방식 채택",
        why: "접종 관리 페이지는 강아지 이름을 하나씩 검색해 체크하는 방식으로 운영되어, 짧은 시간 안에 검색을 여러 번 사용하는 구조였습니다. 매번 서버에 요청해야 하는지 의문이 생겼습니다.",
        how: "보호소당 최대 약 500마리 수준임을 확인하고, 전체 페이로드가 약 72KB(비압축), gzip 시 15~20KB 수준임을 측정했습니다. performance.now() 기준 클라이언트 필터링 중앙값 ~0.1ms를 실측하고, 초기 1회 로드 후 클라이언트에서 직접 필터링하는 방식을 채택했습니다.",
        result:
          "반복 검색 시 API 요청을 제거해 응답 속도를 개선했습니다. 직관이 아닌 실측 수치(페이로드 크기·필터링 시간)를 근거로 서버 vs 클라이언트 처리 방식을 결정하는 판단 기준을 확립했습니다.",
        uiDemoId: "hangbokdog-vaccination-search",
      },
      {
        title: "EasyOCR 기반 유기견 공고 자동 등록",
        why: "보호소 관리자가 유기견 공고 이미지를 보며 정보를 직접 입력하는 반복 작업이 발생했고, 공고 이미지마다 항목 위치가 달라 정규식 단순 파싱으로는 필드 추출 정확도에 한계가 있었습니다.",
        how: "Python EasyOCR 라이브러리로 공고 이미지를 텍스트로 변환한 후 성별, 품종 등 키워드를 파싱해 구조화된 객체로 반환했습니다. 프론트엔드에서 공고 이미지 업로드 시 파싱된 필드 값을 수신해 해당 폼 필드에 자동 입력했습니다. OCR로 자동 입력된 필드는 하이라이팅으로 시각적으로 구분해 사용자가 오입력 여부를 즉시 확인하고 수정할 수 있도록 안내했습니다.",
        result:
          "공고 이미지 업로드만으로 주요 필드 자동 입력 → 반복 수기 입력 작업 대폭 감소. EasyOCR 기반 이미지 텍스트 추출 파이프라인 구현 및 Python 서버 AWS 배포 경험을 확보했습니다.",
        uiDemoId: "hangbokdog-ocr",
      },
    ],
    github: "https://github.com/raonrabbit",
  },
  {
    id: "ezip",
    title: "이집어때",
    subtitle: "AI를 활용한 부동산 추천 플랫폼",
    description:
      "매물·시세를 AI로 쉽게 보고, Naver 뉴스·핫한 매물 등을 시각화한 부동산 추천 플랫폼입니다.",
    features: [
      "지도·차트 기반 부동산 정보",
      "OpenAI API 시세 예측·챗봇",
      "부동산 뉴스, 핫한 매물 시스템",
    ],
    images: [
      "/project-imgs/ezip/ezip-thumbnail.png",
      "/project-imgs/ezip/ezip01.png",
      "/project-imgs/ezip/ezip02.png",
      "/project-imgs/ezip/ezip03.png",
    ],
    period: "2024.10 – 2024.11",
    tech: ["React", "TypeScript", "Chakra UI", "Tanstack Query", "Spring Boot"],
    award: "SSAFY 1학기 프로젝트 최우수상(1등)",
    team: ["Backend 1", "Frontend 1", "Infra 1"],
    role: [
      "Spring Boot MVC 구현, DB 설계, API 개발 (백엔드 주기여 ~70%)",
      "네이버 뉴스 Open API 연동 및 뉴스 카드 UI 개발",
      "OpenAI API 연동 및 부동산 챗봇 개발",
      "다크모드 구현",
    ],
    highlights: [
      {
        title: "네이버 뉴스 Open API 연동 및 부동산 뉴스 카드 UI",
        why: "부동산 거래에 도움이 되는 최신 뉴스 정보를 사용자에게 쉽게 제공할 필요가 있었습니다.",
        how: "네이버 뉴스 Open API를 통해 부동산 관련 뉴스를 수집하고, Chakra UI의 Grid 시스템을 사용해 반응형 카드 레이아웃과 호버 효과를 가진 뉴스 카드 UI를 구현했습니다.",
        result:
          "사용자가 부동산 관련 최신 뉴스를 한눈에 확인할 수 있는 직관적인 UI를 제공했습니다.",
        uiDemoId: "ezip-news-card",
      },
      {
        title: "OpenAI API 기반 부동산 챗봇 구현",
        why: "어려운 부동산 용어를 사용자에게 쉽게 전달할 필요가 있었습니다.",
        how: "OpenAI API와 사전 프롬프팅을 통해 부동산 전문 챗봇 시스템을 개발했습니다. AI와 사용자의 대화를 유지시키기 위해 SessionStorage를 사용해 사용자의 대화 상태를 저장하고 관리했습니다.",
        result:
          "사용자가 복잡한 부동산 용어를 쉽게 이해하고, 연속된 대화로 맥락 있는 상담을 받을 수 있게 됐습니다.",
        uiDemoId: "ezip-chatbot",
      },
      {
        title: "다크모드 & 반응형 레이아웃 구현",
        why: "다양한 환경과 기기에서 일관된 사용자 경험을 제공해야 했습니다.",
        how: "Chakra UI의 useColorMode와 useColorModeValue를 활용해 버튼, 로고, 배경 색상까지 일관된 다크모드를 구현했습니다. extendTheme로 커스텀 색상을 정의하고, 라이트/다크 모드별 버튼 변형을 추가해 브랜드 일관성을 유지했습니다. useBreakpointValue를 활용해 화면 크기에 따라 로고, 텍스트 크기, 레이아웃을 동적으로 전환하는 반응형 UI를 구현했습니다.",
        result:
          "다양한 화면 크기와 다크/라이트 모드 모두에서 일관되고 브랜드에 맞는 UI를 제공했습니다.",
        uiDemoId: "ezip-darkmode",
      },
    ],
    github: "https://github.com/raonrabbit",
  },
];
