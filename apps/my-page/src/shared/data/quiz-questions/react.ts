import type { QuizQuestion } from "./types";

export const REACT_QUESTIONS: QuizQuestion[] = [
  // ─── Virtual DOM ───────────────────────────────────────────────────────────
  {
    id: "react-01",
    category: "react",
    question: "Virtual DOM이란 무엇이고, 왜 사용하나요?",
    answer:
      "Virtual DOM은 실제 DOM 트리를 메모리에 복사한 JS 객체 트리입니다. React는 상태 변경 시 새 Virtual DOM을 생성하고, 이전 Virtual DOM과 Diffing 알고리즘으로 비교하여 변경된 부분만 실제 DOM에 적용합니다. 실제 DOM 조작은 레이아웃 재계산·리페인팅을 유발해 비용이 크기 때문에, Virtual DOM을 통해 변경사항을 배치로 모아 최소한의 DOM 조작을 수행함으로써 성능을 최적화합니다.",
  },
  {
    id: "react-02",
    category: "react",
    question:
      "Virtual DOM이 항상 빠른 것은 아닌데, 왜 React는 이를 사용하나요?",
    answer:
      "Virtual DOM 자체가 목적이 아니라, 선언적 UI 작성을 가능하게 하면서도 충분한 성능을 보장하는 수단입니다. 간단한 DOM 조작에서는 Virtual DOM 계산 오버헤드가 오히려 느릴 수 있습니다. React의 강점은 '어떻게 DOM을 변경할지'가 아닌 '상태에 따라 UI가 어떻게 보여야 하는지'를 선언하면 React가 최적화된 DOM 업데이트를 알아서 처리하는 개발자 경험입니다. Svelte처럼 Virtual DOM 없이 컴파일 타임에 최적화하는 방식도 있습니다.",
    isAdvanced: true,
  },

  // ─── React Fiber ────────────────────────────────────────────────────────────
  {
    id: "react-03",
    category: "react",
    question: "React Fiber란 무엇이고, 왜 등장했나요?",
    answer:
      "React Fiber는 React 16에서 도입된 새로운 재조정 엔진입니다. 기존의 재귀적 스택 기반 재조정(Stack Reconciler)은 한 번 시작하면 중단할 수 없어 트리가 깊을수록 메인 스레드를 오래 점유했고, 애니메이션이 끊기거나 입력이 지연됐습니다. Fiber는 렌더링 작업을 작은 단위(Fiber Node)로 분할하여 브라우저의 유휴 시간에 분산 처리하고, 높은 우선순위 작업(사용자 입력 등)이 있으면 작업을 중단하고 양보할 수 있습니다.",
  },
  {
    id: "react-04",
    category: "react",
    question: "Fiber Node의 구조와 더블 버퍼링 방식을 설명해주세요.",
    answer:
      "Fiber Node는 type·key 같은 컴포넌트 정보 외에 child·sibling·return 포인터(트리 탐색용 linked list), pendingProps·memoizedState 같은 상태, Placement·Update·Deletion 같은 flags, 그리고 alternate 포인터를 가집니다. React는 current tree(현재 화면)와 workInProgress tree(작업 중인 트리) 두 개를 alternate 포인터로 연결해 유지하며, 작업 완료 후 current 포인터를 workInProgress로 교체(commit)합니다. 이 더블 버퍼링 덕분에 중간 상태가 화면에 노출되지 않습니다.",
    isAdvanced: true,
  },
  {
    id: "react-05",
    category: "react",
    question: "Fiber linked list 구조가 재귀 방식보다 유리한 이유는?",
    answer:
      "재귀는 콜 스택을 사용하기 때문에 중간에 중단할 수 없습니다. Fiber는 child·sibling·return 포인터로 구성된 linked list로 트리를 표현하여, 현재 처리 중인 Fiber Node의 참조만 변수에 저장하면 언제든 작업을 중단하고 나중에 이어서 진행할 수 있습니다. 이것이 Concurrent Mode에서 렌더링을 일시 중단하고 사용자 입력에 즉시 반응할 수 있는 핵심 기반입니다.",
    isAdvanced: true,
  },
  {
    id: "react-06",
    category: "react",
    question: "React의 Scheduler는 어떻게 작업 우선순위를 관리하나요?",
    answer:
      "Scheduler는 작업을 5가지 우선순위 레인(Lane)으로 분류합니다: Immediate(동기)·UserBlocking(클릭·입력)·Normal(일반 업데이트)·Low(데이터 패칭)·Idle(사용자에게 보이지 않는 작업). requestIdleCallback 폴리필을 사용해 브라우저 렌더링 사이 유휴 시간에 낮은 우선순위 작업을 처리하고, 높은 우선순위 작업이 오면 현재 작업을 중단합니다. 아키텍처는 Scheduler → Reconciler(Fiber) → Renderer 세 레이어로 분리되어 있습니다.",
    isAdvanced: true,
  },

  // ─── JSX 처리 과정 ─────────────────────────────────────────────────────────
  {
    id: "react-07",
    category: "react",
    question: "JSX는 어떻게 처리되나요?",
    answer:
      "JSX는 브라우저가 이해하지 못하므로 Babel이 JS 함수 호출로 변환합니다. React 17 이전(Classic Runtime)에는 React.createElement()로 변환되어 React import가 필수였습니다. React 17 이후(Automatic Runtime)에는 react/jsx-runtime에서 jsx()를 자동 import하여 React를 직접 import할 필요가 없어졌습니다. 이 함수가 반환하는 React Element(순수 JS 객체)를 기반으로 Reconciler가 Fiber Node를 생성하고, Diffing을 통해 실제 DOM에 반영합니다.",
  },
  {
    id: "react-08",
    category: "react",
    question: "React Element의 `$$typeof` 필드가 존재하는 이유는?",
    answer:
      "XSS 방어를 위해서입니다. Symbol은 JSON에 직렬화되지 않으므로, 서버로부터 받은 악성 JSON 데이터가 React Element인 척 렌더링되는 것을 방지합니다. React는 $$typeof가 Symbol(react.element)가 아닌 객체를 Element로 인식하지 않아 악성 JSON 주입 공격을 차단합니다.",
    isAdvanced: true,
  },

  // ─── Reconciliation & Diffing ──────────────────────────────────────────────
  {
    id: "react-09",
    category: "react",
    question: "React의 Diffing 알고리즘을 설명해주세요.",
    answer:
      "완전한 트리 비교 알고리즘은 O(n³) 복잡도지만, React는 두 가지 휴리스틱으로 O(n)을 달성합니다. 첫째, 엘리먼트 타입이 다르면 이전 서브트리 전체를 제거하고 새로 생성합니다(타입이 같으면 변경된 속성만 업데이트). 둘째, 리스트에서는 key prop을 이용해 어떤 항목이 변경·추가·삭제되었는지 효율적으로 파악합니다.",
  },
  {
    id: "react-10",
    category: "react",
    question: "key로 index를 사용하면 안 되는 이유는?",
    answer:
      "리스트 항목의 순서가 변경되거나 중간에 삽입·삭제될 때, index가 key라면 React는 동일한 key(=index)의 컴포넌트가 이전과 같다고 판단합니다. 하지만 실제로는 다른 데이터가 들어온 것이므로 불필요한 업데이트가 발생하거나, input 같은 DOM 상태가 잘못된 항목에 남아 버그가 생깁니다. 고유하고 안정적인 ID를 key로 사용해야 합니다.",
  },
  {
    id: "react-11",
    category: "react",
    question: "key를 이용해 컴포넌트를 강제로 재마운트하는 방법이란?",
    answer:
      "React는 key가 변경되면 같은 타입의 컴포넌트라도 다른 인스턴스로 취급하여 언마운트 후 새로 마운트합니다. 이 특성을 이용해 key={userId}처럼 사용하면 userId가 변경될 때 컴포넌트를 완전히 초기화(state 포함)할 수 있습니다. 복잡한 useEffect 의존성 배열을 관리하는 것보다 의도적으로 key를 변경하는 것이 더 명확한 경우도 있습니다.",
    isAdvanced: true,
  },

  // ─── Render Phase & Commit Phase ───────────────────────────────────────────
  {
    id: "react-12",
    category: "react",
    question:
      "React의 렌더링 과정을 Render Phase와 Commit Phase로 나눠 설명해주세요.",
    answer:
      "Render Phase는 변경사항을 계산하는 순수 계산 단계로 DOM을 건드리지 않으며 중단이 가능합니다. Fiber 트리를 beginWork(하향 탐색)·completeWork(상향 마무리) 방식으로 순회합니다. Commit Phase는 계산된 변경사항을 실제 DOM에 적용하는 단계로 동기적이며 중단 불가합니다. Before Mutation(getSnapshotBeforeUpdate)·Mutation(실제 DOM 조작)·Layout(useLayoutEffect·componentDidMount/Update) 세 서브페이즈로 구성되며, Layout 완료 후 비동기로 useEffect가 실행됩니다.",
  },

  // ─── Hooks 내부 구현 ────────────────────────────────────────────────────────
  {
    id: "react-13",
    category: "react",
    question: "Hooks는 왜 최상위 레벨에서만 호출해야 하나요?",
    answer:
      "각 컴포넌트의 Fiber Node에는 Hook들이 단방향 링크드 리스트(memoizedState → Hook → Hook → null)로 저장됩니다. React는 Hook을 이름이 아닌 호출 순서(리스트 인덱스)로 구분하기 때문에, 조건문이나 반복문 안에서 Hook을 호출하면 렌더링마다 순서가 달라져 이전 렌더링의 상태와 현재 렌더링의 상태가 뒤섞여 버그가 발생합니다.",
  },
  {
    id: "react-14",
    category: "react",
    question: "useState의 setState는 왜 비동기처럼 동작하나요?",
    answer:
      "setState를 호출해도 즉시 상태가 변경되지 않고, Fiber의 업데이트 큐에 등록된 후 다음 렌더링 사이클에서 처리됩니다. React 18의 Automatic Batching으로 이벤트 핸들러·setTimeout·Promise 등 어디서 호출해도 여러 setState가 하나로 배치 처리되어 렌더링이 최소화됩니다. 즉각적인 상태값이 필요하다면 함수형 업데이트(setState(prev => prev + 1))를 사용해야 합니다.",
    isAdvanced: true,
  },

  // ─── useEffect vs useLayoutEffect ──────────────────────────────────────────
  {
    id: "react-15",
    category: "react",
    question: "useEffect와 useLayoutEffect의 차이는?",
    answer:
      "실행 타이밍이 다릅니다. useEffect는 브라우저 Paint 이후 비동기로 실행되어 렌더링을 차단하지 않습니다. useLayoutEffect는 DOM 업데이트 직후·Paint 이전에 동기로 실행되어 브라우저 Paint를 차단합니다. DOM 요소의 크기·위치를 측정한 후 즉시 상태를 업데이트해야 하거나 시각적 깜빡임(툴팁 위치 계산 등)을 방지해야 할 때 useLayoutEffect를 사용하고, 데이터 패칭·이벤트 구독 등 대부분은 useEffect를 사용합니다.",
  },
  {
    id: "react-16",
    category: "react",
    question: "useLayoutEffect가 SSR 환경에서 경고를 발생시키는 이유는?",
    answer:
      "useLayoutEffect는 DOM이 존재하는 환경에서 Paint 이전에 동기로 실행됩니다. SSR 환경에서는 DOM이 없기 때문에 서버에서 useLayoutEffect를 실행할 수 없어 React가 경고를 발생시킵니다. SSR 환경에서 DOM 측정이 필요하다면 useEffect를 사용하거나, 해당 컴포넌트를 dynamic import로 ssr: false 처리하는 것이 올바른 해결책입니다.",
    isAdvanced: true,
  },

  // ─── Concurrent Mode & Time Slicing ────────────────────────────────────────
  {
    id: "react-17",
    category: "react",
    question: "Concurrent Mode란 무엇이고, Time Slicing은 어떻게 동작하나요?",
    answer:
      "Concurrent Mode는 렌더링 작업을 우선순위에 따라 중단·재개·폐기할 수 있게 하여 긴 렌더링 작업이 사용자 입력을 차단하지 않도록 합니다. Time Slicing은 긴 렌더링 작업을 5ms 단위로 분할하여 브라우저에 양보하는 메커니즘입니다. 브라우저가 입력 처리·애니메이션 등을 중간에 처리할 수 있어 UI 반응성이 유지됩니다. React 18에서 createRoot로 활성화됩니다.",
  },
  {
    id: "react-18",
    category: "react",
    question: "startTransition과 useTransition은 어떻게 사용하나요?",
    answer:
      "startTransition은 덜 급한 업데이트를 낮은 우선순위로 표시하는 함수입니다. useTransition은 [isPending, startTransition]을 반환하며 isPending으로 전환 중임을 UI에 표시할 수 있습니다. 예를 들어 검색 입력(높은 우선순위)과 검색 결과 렌더링(낮은 우선순위)을 분리할 때, setSearchResults를 startTransition으로 감싸면 타이핑이 끊기지 않고 결과는 중단 가능한 작업으로 처리됩니다.",
  },
  {
    id: "react-19",
    category: "react",
    question: "startTransition과 useDeferredValue의 차이는?",
    answer:
      "둘 다 낮은 우선순위 업데이트를 표시하지만 사용 방식이 다릅니다. startTransition은 setState 호출을 직접 감싸는 함수 형태로, 어떤 업데이트를 deferred로 처리할지 명확히 표시합니다. useDeferredValue는 값을 받아 이전 값을 유지하는 deferred 버전을 반환하며, setState를 직접 제어할 수 없는 서드파티 컴포넌트나 prop으로 받은 값에 유용합니다.",
    isAdvanced: true,
  },

  // ─── Suspense 내부 동작 ────────────────────────────────────────────────────
  {
    id: "react-20",
    category: "react",
    question: "Suspense의 내부 동작 원리를 설명해주세요.",
    answer:
      "Suspense는 React의 에러 경계와 유사한 메커니즘으로 동작합니다. 데이터가 준비되지 않은 컴포넌트가 Promise를 throw하면, 가장 가까운 Suspense boundary가 이를 캐치하여 fallback을 렌더링합니다. Promise가 resolve되면 Suspense는 해당 컴포넌트의 렌더링을 재시도합니다. React Query·SWR 같은 라이브러리는 캐시에 데이터가 없으면 fetch Promise를 throw하는 방식으로 Suspense와 통합됩니다.",
    isAdvanced: true,
  },
  {
    id: "react-21",
    category: "react",
    question: "Suspense와 ErrorBoundary를 함께 사용하는 이유는?",
    answer:
      "Suspense는 Promise throw(로딩 상태)만 처리하고 에러 throw는 처리하지 않습니다. 데이터 패칭에서 에러가 발생하면 컴포넌트가 Error를 throw하는데, 이를 잡는 것이 ErrorBoundary입니다. ErrorBoundary(fallback에러UI)를 바깥에, Suspense(fallback로딩UI)를 안쪽에 배치하면 로딩 중에는 Spinner를, 에러 발생 시에는 에러 UI를 자연스럽게 처리할 수 있습니다.",
  },

  // ─── Server Component vs Client Component ──────────────────────────────────
  {
    id: "react-22",
    category: "react",
    question: "Server Component와 Client Component의 차이는?",
    answer:
      "Server Component는 서버에서만 실행되어 DB·파일시스템 직접 접근이 가능하고 JS 번들에 포함되지 않아 번들 크기를 줄일 수 있습니다. 대신 useState·useEffect 등 상태와 이벤트 핸들러를 사용할 수 없습니다. Client Component는 'use client' 지시어로 선언하며 브라우저에서 실행되어 인터랙티브한 UI를 구현합니다(초기 HTML은 서버에서도 생성). Next.js App Router에서는 기본적으로 모든 컴포넌트가 Server Component입니다.",
  },
  {
    id: "react-23",
    category: "react",
    question: "RSC Payload란 무엇인가요?",
    answer:
      "서버 컴포넌트는 HTML이 아닌 RSC Payload(JSON-like 직렬화 형식)를 클라이언트로 전송합니다. 클라이언트는 RSC Payload를 받아 Virtual DOM에 병합하여 화면을 구성합니다. 기존 SSR이 모든 컴포넌트 코드를 JS 번들에 포함시킨 것과 달리, 서버 컴포넌트는 JS 번들에 포함되지 않아 번들 크기가 줄어드는 것이 핵심 이점입니다.",
    isAdvanced: true,
  },

  // ─── CSR / SSR / SSG / ISR ─────────────────────────────────────────────────
  {
    id: "react-24",
    category: "react",
    question: "CSR, SSR, SSG, ISR의 차이와 각 전략의 적합한 사용 상황은?",
    answer:
      "CSR은 브라우저에서 JS로 렌더링하여 초기 로딩이 느리고 SEO에 불리하지만 서버가 불필요합니다(대시보드·인증 필요 페이지). SSR은 요청마다 서버에서 HTML을 생성해 항상 최신 데이터를 SEO 친화적으로 제공하지만 서버 부하가 있습니다(뉴스·SNS·개인화 페이지). SSG는 빌드 시 HTML을 미리 생성해 CDN에서 가장 빠르게 서빙하지만 데이터가 빌드 시점에 고정됩니다(블로그·문서). ISR은 SSG 속도를 유지하면서 주기적으로 백그라운드 재생성하여 데이터 신선도를 높입니다(이커머스·커뮤니티).",
  },
  {
    id: "react-25",
    category: "react",
    question: "ISR의 stale-while-revalidate 동작 방식을 설명해주세요.",
    answer:
      "ISR은 stale-while-revalidate 전략을 사용합니다. 빌드 시 HTML을 생성하고, revalidate 시간(예: 60초)이 경과한 후 다음 요청이 오면 일단 stale(이전) HTML로 즉시 응답하고 백그라운드에서 새 HTML을 재생성합니다. 그 다음 요청부터 새 HTML이 응답됩니다. On-demand Revalidation을 사용하면 시간 기반이 아닌 CMS 업데이트 같은 이벤트 발생 시 즉시 특정 페이지만 재생성할 수 있습니다.",
    isAdvanced: true,
  },

  // ─── Hydration ─────────────────────────────────────────────────────────────
  {
    id: "react-26",
    category: "react",
    question: "Hydration이란 무엇인가요?",
    answer:
      "SSR로 생성된 정적 HTML에 이벤트 핸들러와 React 상태를 연결하는 과정입니다. 서버 HTML을 다시 그리지 않고 기존 DOM을 재사용하면서 이벤트 리스너를 연결합니다. 흐름은 '서버 HTML 수신 → 즉시 화면 표시(FCP) → JS 번들 다운로드 → React 초기화 → Virtual DOM과 기존 DOM 매칭 → Hydration 완료(TTI)'입니다. Hydration 전까지는 화면은 보이지만 클릭 등 인터랙션이 동작하지 않습니다.",
  },
  {
    id: "react-27",
    category: "react",
    question: "Hydration Mismatch는 왜 발생하고 어떻게 해결하나요?",
    answer:
      "서버와 클라이언트의 렌더링 결과가 다를 때 발생합니다. 주요 원인은 서버에 없는 window 객체 접근·렌더링 시점마다 다른 Date.now()·Math.random() 사용·브라우저 전용 API 사용입니다. 해결책으로는 클라이언트 전용 로직을 useEffect 내부에서 실행하거나, suppressHydrationWarning prop 사용, Next.js의 dynamic(() => import(...), { ssr: false })으로 클라이언트 전용 컴포넌트 처리가 있습니다.",
    isAdvanced: true,
  },

  // ─── React 18 주요 변경사항 ────────────────────────────────────────────────
  {
    id: "react-28",
    category: "react",
    question: "React 18의 주요 변경사항은?",
    answer:
      "크게 세 가지입니다. 첫째, Automatic Batching으로 React 17까지는 이벤트 핸들러 내부에서만 배치 처리되던 setState가 setTimeout·Promise·네이티브 이벤트 등 어디서나 자동으로 배치 처리됩니다. 둘째, createRoot API 도입으로 Concurrent Mode가 활성화됩니다(기존 ReactDOM.render는 legacy 모드). 셋째, startTransition·useDeferredValue·useId 등 Concurrent 관련 API가 추가됩니다.",
  },
  {
    id: "react-29",
    category: "react",
    question: "React 18의 Automatic Batching이 중요한 이유는?",
    answer:
      "React 17에서는 setTimeout이나 Promise 내부에서 setState를 여러 번 호출하면 호출 횟수만큼 렌더링이 발생했습니다. React 18의 Automatic Batching은 어디서나 여러 setState 호출을 하나의 렌더링으로 묶어 처리합니다. 단, flushSync를 사용하면 즉시 동기적으로 렌더링을 강제할 수 있습니다. 이로 인해 성능이 개선되고, 상태 업데이트 간 불일치로 인한 버그도 줄어듭니다.",
    isAdvanced: true,
  },

  // ─── React.memo / useMemo / useCallback ────────────────────────────────────
  {
    id: "react-30",
    category: "react",
    question: "React.memo, useMemo, useCallback의 차이는?",
    answer:
      "React.memo는 컴포넌트를 메모이제이션하여 props가 변경되지 않으면 리렌더링을 스킵합니다. useMemo는 계산된 값을 메모이제이션하여 의존성이 바뀔 때만 재계산합니다. useCallback은 함수를 메모이제이션하여 의존성이 바뀔 때만 새 함수를 생성합니다(useCallback(fn, deps)는 useMemo(() => fn, deps)와 동일). 주로 useCallback은 React.memo된 자식 컴포넌트에 함수 prop을 전달하거나 useEffect deps에 함수를 포함할 때 사용합니다.",
  },
  {
    id: "react-31",
    category: "react",
    question: "모든 컴포넌트에 React.memo를 사용하면 좋지 않은 이유는?",
    answer:
      "React.memo는 렌더링할 때마다 이전 props와 새 props를 얕은 비교(shallow comparison)하는 비용이 발생합니다. 컴포넌트가 가볍거나 props가 자주 바뀐다면 비교 비용이 렌더링 비용보다 클 수 있습니다. 또한 props에 객체·배열·함수가 있으면 참조가 매번 새로 생성되어 memo가 의미가 없고, 이를 해결하기 위해 useMemo·useCallback까지 추가하면 코드 복잡도가 증가합니다. 실제 성능 문제가 발생한 후 적용하는 것이 원칙입니다.",
    isAdvanced: true,
  },

  // ─── Context API 성능 문제 ─────────────────────────────────────────────────
  {
    id: "react-32",
    category: "react",
    question: "Context API 사용 시 성능 문제가 생기는 이유와 해결책은?",
    answer:
      "Provider의 value가 변경되면 해당 Context를 useContext로 구독하는 모든 컴포넌트가 리렌더링됩니다. 하나의 Context에 여러 상태(user·theme·language)를 묶으면 user만 변경되어도 theme·language만 사용하는 컴포넌트까지 리렌더링됩니다. 해결책은 Context를 목적별로 분리하거나, value를 useMemo로 메모이제이션하는 것입니다. 전역 상태가 복잡하다면 Zustand·Jotai 같은 외부 상태 관리 라이브러리가 필요한 컴포넌트만 구독하여 더 효율적입니다.",
  },
  {
    id: "react-33",
    category: "react",
    question: "Context API와 Zustand 같은 외부 상태 관리 라이브러리의 차이는?",
    answer:
      "Context API는 React 내장 기능으로 별도 라이브러리 불필요하지만, 구독하는 모든 컴포넌트가 value 변경 시 리렌더링되어 세밀한 최적화가 어렵습니다. Zustand 같은 라이브러리는 selector 기반으로 필요한 상태 조각만 구독할 수 있어 불필요한 리렌더링을 방지합니다. 단순한 테마·언어 설정 같은 전역 공유 상태는 Context로 충분하지만, 빈번하게 업데이트되는 복잡한 전역 상태는 외부 라이브러리가 더 적합합니다.",
    isAdvanced: true,
  },
];
