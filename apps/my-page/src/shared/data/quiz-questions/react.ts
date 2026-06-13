import type { QuizQuestion } from "./types";

export const REACT_QUESTIONS: QuizQuestion[] = [
  // ─── Virtual DOM ──────────────────────────────────────────────────────────
  {
    id: "react-01",
    category: "react",
    question: "Virtual DOM이 뭔가요?",
    answer:
      "실제 DOM의 가벼운 JS 객체 복사본입니다. React는 상태가 변경될 때 실제 DOM을 직접 수정하지 않고 Virtual DOM을 먼저 업데이트합니다. 이전 Virtual DOM과 새 Virtual DOM을 비교(Diffing)하여 실제로 변경된 부분만 찾아낸 뒤, 그 차이(Diff)만 실제 DOM에 적용합니다(Reconciliation).\n\n**부가설명:** JS 객체 연산은 DOM 조작보다 훨씬 빠릅니다. React의 핵심 아이디어는 '무엇이 변했는가'를 선언적으로 표현하면 React가 최소한의 DOM 조작으로 처리해준다는 것입니다.",
  },
  {
    id: "react-02",
    category: "react",
    question: "왜 Virtual DOM을 사용하나요?",
    answer:
      "DOM 조작은 레이아웃 계산·Paint·Composite를 포함하는 무거운 작업입니다. 상태가 자주 변하는 앱에서 직접 DOM을 수정하면 불필요한 리렌더링이 발생합니다. Virtual DOM은 변경 사항을 메모리에서 먼저 계산하고 최소한의 DOM 조작만 수행하여 성능을 최적화합니다. 또한 개발자가 '어떻게' 수정할지 고민하지 않고 '어떤 상태일 때 어떻게 보여야 하는가'만 선언하면 되는 추상화를 제공합니다.",
  },
  {
    id: "react-03",
    category: "react",
    question: "Virtual DOM이 항상 빠른가요?",
    answer:
      "아닙니다. Virtual DOM 자체는 오버헤드입니다. 변경을 JS 객체로 표현하고, 두 트리를 비교하는 Diffing 비용이 추가됩니다. 변경이 매우 단순하거나 빈번하지 않다면 직접 DOM 조작이 더 빠를 수 있습니다. Virtual DOM이 빛나는 상황은 변경이 복잡하고 빈번할 때입니다. 이때 Batching(여러 변경을 묶어 한 번에 적용)과 최소 DOM 조작이 직접 조작보다 유리합니다.\n\n**부가설명:** Svelte 같은 프레임워크는 Virtual DOM 없이 컴파일 타임에 최적의 DOM 조작 코드를 생성하는 방식으로도 높은 성능을 달성합니다.",
  },

  // ─── React Fiber ──────────────────────────────────────────────────────────
  {
    id: "react-04",
    category: "react",
    question: "React Fiber란 무엇인가요?",
    answer:
      "React 16에서 도입된 새로운 재조정(Reconciliation) 엔진입니다. 기존 React는 재귀적으로 컴포넌트 트리를 동기적으로 처리하여 중단할 수 없었습니다. Fiber는 렌더링 작업을 작은 단위(Fiber Node)로 쪼개어 우선순위를 부여하고, 필요에 따라 중단·재개·폐기할 수 있는 비동기 렌더링 아키텍처입니다. Concurrent Mode, Suspense, Transitions 등 React 18 기능의 기반이 됩니다.",
  },
  {
    id: "react-05",
    category: "react",
    question: "Fiber Node는 어떤 구조로 되어있나요?",
    answer:
      "각 React 컴포넌트·DOM 요소마다 하나의 Fiber Node가 존재합니다. Fiber Node의 주요 필드: type(컴포넌트 함수 또는 태그), stateNode(실제 DOM 노드 또는 클래스 인스턴스), child(첫 번째 자식 Fiber), sibling(다음 형제 Fiber), return(부모 Fiber), pendingProps·memoizedProps(이전·현재 props), memoizedState(훅 상태의 연결 리스트), alternate(현재/작업 중인 트리의 대응 Fiber).\n\n**부가설명:** React는 current 트리(화면에 표시 중)와 workInProgress 트리(작업 중)를 교대로 사용하는 Double Buffering 방식을 씁니다.",
    isAdvanced: true,
  },
  {
    id: "react-06",
    category: "react",
    question: "React는 상태가 변경되면 어떻게 렌더링되나요?",
    answer:
      "setState 호출 → 해당 Fiber에 업데이트 예약 → React 스케줄러가 우선순위를 결정하여 Render Phase 시작 → workInProgress 트리를 생성하며 변경된 컴포넌트부터 재귀적으로 재렌더링 → Diffing으로 변경된 Fiber에 Effect 태그 부여 → Commit Phase에서 Effect 목록을 DOM에 반영.",
  },
  {
    id: "react-07",
    category: "react",
    question: "React는 왜 렌더링을 중간에 멈출 수 있나요?",
    answer:
      "Fiber가 렌더링 작업을 작은 단위로 쪼개었기 때문입니다. Fiber의 작업 루프는 각 Fiber를 처리한 뒤 '남은 시간이 있는가?(requestIdleCallback 유사)'를 확인합니다. 남은 시간이 없으면 작업을 멈추고 브라우저에게 제어권을 넘겨 사용자 입력이나 애니메이션이 처리될 수 있게 합니다. 이것이 Concurrent Rendering의 핵심이며, 고우선순위 업데이트(사용자 입력)가 저우선순위 업데이트(데이터 로딩)를 중단하고 먼저 처리될 수 있는 이유입니다.",
    isAdvanced: true,
  },

  // ─── JSX ──────────────────────────────────────────────────────────────────
  {
    id: "react-08",
    category: "react",
    question: "JSX가 뭔가요?",
    answer:
      "JavaScript XML의 약자로, JS 안에서 HTML과 유사한 문법으로 UI를 표현할 수 있는 구문 확장입니다. 브라우저는 JSX를 직접 이해하지 못하므로 Babel이 JSX를 React.createElement() 호출로 변환합니다. 선언적으로 UI 구조를 표현할 수 있어 가독성이 높습니다.\n\n**부가설명:** React 17+에서는 새로운 JSX 변환 방식(react/jsx-runtime)으로 파일 상단에 import React from 'react'를 작성하지 않아도 됩니다.",
  },
  {
    id: "react-09",
    category: "react",
    question: "JSX는 실제로 어떤 코드로 변환되나요?",
    answer:
      "<MyButton color='blue'>Click</MyButton>은 React.createElement(MyButton, { color: 'blue' }, 'Click')으로 변환됩니다. 새 JSX 변환에서는 _jsx(MyButton, { color: 'blue', children: 'Click' })으로 변환됩니다. 결과적으로 컴포넌트 함수가 호출되어 React 엘리먼트 객체 { type, props, key, ref }를 반환합니다.",
  },
  {
    id: "react-10",
    category: "react",
    question: "React.createElement는 무엇을 반환하나요?",
    answer:
      "React 엘리먼트 객체를 반환합니다. { type: 'div' | ComponentFunction, key: null, ref: null, props: { children, ...otherProps }, _owner, _store } 형태의 평범한 JS 객체입니다. 이 객체가 Virtual DOM의 단위입니다. React는 이 객체 트리를 통해 실제 Fiber 트리와 DOM을 구성합니다.\n\n**부가설명:** 엘리먼트는 컴포넌트 인스턴스나 DOM 노드가 아닌 '어떤 것을 렌더링해야 하는가'를 표현하는 불변 객체입니다.",
    isAdvanced: true,
  },

  // ─── Reconciliation & Diffing ─────────────────────────────────────────────
  {
    id: "react-11",
    category: "react",
    question: "Reconciliation이란 무엇인가요?",
    answer:
      "상태 변경 후 새로운 React 엘리먼트 트리를 이전 트리와 비교하여 실제 DOM에 반영할 최소한의 변경 목록을 계산하는 과정입니다. React는 두 가지 가정으로 O(n³)에서 O(n)으로 최적화합니다. ① 다른 타입의 컴포넌트는 다른 트리를 생성한다(이전 트리 파괴 후 재생성). ② key props로 리스트 항목을 식별한다.",
  },
  {
    id: "react-12",
    category: "react",
    question: "디핑 알고리즘이 뭔가요?",
    answer:
      "두 Virtual DOM 트리를 비교하여 변경점을 찾는 React의 알고리즘입니다. ① 루트 노드의 타입이 다르면 이전 트리 전체를 파괴하고 새로 생성합니다. ② 타입이 같으면 props만 비교하여 변경된 props만 업데이트합니다. ③ 리스트는 key로 항목을 식별하여 이동·추가·삭제를 최소화합니다. ④ 재귀적으로 자식 노드를 비교하여 전체 트리를 순회합니다.",
  },
  {
    id: "react-13",
    category: "react",
    question: "key로 index를 사용하면 안 되는 이유는 무엇인가요?",
    answer:
      "항목의 순서가 바뀌거나 중간에 추가·삭제될 때 index가 바뀌면서 React가 다른 컴포넌트라고 판단하지 못하게 됩니다. 기존 컴포넌트 상태가 잘못된 항목으로 이어지거나, 불필요하게 모든 항목을 재마운트하여 성능이 저하됩니다. key는 항목마다 안정적·고유한 ID(서버에서 온 ID, 고유한 값)를 사용해야 합니다.\n\n**부가설명:** 순서가 변경되지 않고 추가만 되는 경우에는 index 사용이 문제가 없습니다. 하지만 예측하기 어려우므로 항목 고유 ID를 기본값으로 사용하는 것이 안전합니다.",
  },

  // ─── Render Phase / Commit Phase ──────────────────────────────────────────
  {
    id: "react-14",
    category: "react",
    question: "React 렌더링 과정에 대해 설명해주세요.",
    answer:
      "크게 두 단계로 나뉩니다. Render Phase(렌더 단계): 컴포넌트 함수를 호출하여 새 React 엘리먼트 트리를 생성하고, 이전 Fiber 트리와 Diffing하여 변경사항(Effect 태그)을 계산합니다. 순수 계산 작업으로 DOM 접근이 없고 중단 가능합니다. Commit Phase(커밋 단계): Render Phase가 계산한 Effect를 실제 DOM에 적용합니다. beforeMutation→mutation→layout 세 하위 단계로 구성되며 중단 불가능합니다.",
  },
  {
    id: "react-15",
    category: "react",
    question: "Render Phase에서는 무슨 일이 일어나나요?",
    answer:
      "컴포넌트 함수를 호출(또는 클래스 render 메서드 실행)하여 새 React 엘리먼트를 얻습니다. 이를 기반으로 workInProgress Fiber 트리를 구성하고 기존 current 트리와 비교(Diffing)합니다. 변경이 필요한 Fiber에 Placement(삽입)·Update(업데이트)·Deletion(삭제) 등의 Effect 태그를 표시합니다. 이 단계는 사이드 이펙트(DOM 접근·데이터 패칭)가 없는 순수 계산이라 여러 번 실행돼도 안전합니다.",
  },
  {
    id: "react-16",
    category: "react",
    question: "Commit Phase에서는 무슨 일이 일어나나요?",
    answer:
      "Effect 목록을 순서대로 실제 DOM에 적용합니다. beforeMutation: DOM 수정 전, getSnapshotBeforeUpdate 호출. mutation: 실제 DOM 노드를 삽입·수정·삭제합니다. layout: DOM 반영 후 동기적으로 useLayoutEffect 콜백을 실행합니다. Commit Phase 완료 후 current 포인터가 workInProgress 트리로 교체되고, 비동기적으로 useEffect 콜백이 실행됩니다.",
  },
  {
    id: "react-17",
    category: "react",
    question:
      "Render Phase는 중단 가능하지만 Commit Phase는 중단 불가능한 이유는?",
    answer:
      "Render Phase는 DOM에 접근하지 않는 순수 계산이므로 중단해도 사용자가 알 수 없고 결과물이 없습니다. 중단 후 재시작해도 같은 결과를 낼 수 있습니다. 반면 Commit Phase는 DOM을 직접 변경합니다. 절반만 DOM을 변경한 상태에서 중단하면 UI가 불일치하거나 깨진 상태가 됩니다. 사용자가 이를 볼 수 있기 때문에 한 번 시작하면 반드시 완료해야 합니다.",
    isAdvanced: true,
  },

  // ─── Hooks ────────────────────────────────────────────────────────────────
  {
    id: "react-18",
    category: "react",
    question: "Hook이 뭔가요?",
    answer:
      "함수 컴포넌트에서 React의 상태·라이프사이클·기타 기능을 사용할 수 있게 해주는 함수입니다. React 16.8에서 도입되어 클래스 컴포넌트 없이도 상태와 사이드 이펙트를 관리할 수 있게 됐습니다. useState(상태), useEffect(사이드 이펙트), useContext(컨텍스트), useRef(DOM 접근·값 유지), useMemo·useCallback(메모이제이션)이 대표적입니다.\n\n**부가설명:** Hook의 등장으로 로직 재사용이 훨씬 쉬워졌습니다. Custom Hook으로 상태 로직을 함수로 추출하여 여러 컴포넌트에서 공유할 수 있습니다.",
  },
  {
    id: "react-19",
    category: "react",
    question: "Hook을 조건문 안에서 호출하면 왜 안 되나요?",
    answer:
      "React는 훅의 실행 순서로 각 훅 상태를 식별합니다. 컴포넌트 함수가 실행될 때마다 Fiber의 훅 상태 연결 리스트를 순서대로 매핑합니다. 조건문 안에 훅이 있으면 조건에 따라 호출 순서가 달라지고, React가 이전 렌더링의 훅과 현재 훅을 잘못 매핑하여 상태가 섞이거나 오류가 발생합니다. 훅은 항상 컴포넌트 최상위 레벨에서 동일한 순서로 호출되어야 합니다.",
  },
  {
    id: "react-20",
    category: "react",
    question: "왜 useState의 값을 직접 수정하면 안 되나요?",
    answer:
      "React는 setState를 호출해야 상태 변경을 감지하고 리렌더링을 예약합니다. 상태를 직접 수정하면 React가 변경 사실을 모르기 때문에 리렌더링이 발생하지 않아 UI가 업데이트되지 않습니다. 또한 불변성을 유지해야 이전 상태와 현재 상태를 비교하여 변경 여부를 빠르게 판단할 수 있습니다. 특히 배열·객체 상태는 직접 push·수정하지 않고 스프레드·map·filter로 새 참조를 만들어야 합니다.",
  },
  {
    id: "react-21",
    category: "react",
    question: "useEffect와 useLayoutEffect의 차이는?",
    answer:
      "useEffect는 브라우저가 화면에 페인트를 완료한 후 비동기적으로 실행됩니다. 대부분의 사이드 이펙트(데이터 패칭·구독·이벤트 등록)에 사용합니다. useLayoutEffect는 DOM 변경 직후, 브라우저가 페인트하기 전에 동기적으로 실행됩니다. DOM 크기·위치를 측정하여 레이아웃을 조정할 때 사용합니다. useLayoutEffect는 페인트를 막기 때문에 무거운 작업을 하면 화면이 늦게 나타납니다.\n\n**부가설명:** SSR에서 useLayoutEffect는 서버에서 실행되지 않아 경고가 발생합니다. SSR 환경에서는 useEffect를 사용하거나 클라이언트에서만 실행되도록 조건 처리가 필요합니다.",
  },
  {
    id: "react-22",
    category: "react",
    question: "useEffect는 정확히 언제 실행되나요? useLayoutEffect는?",
    answer:
      "useEffect: Commit Phase → 브라우저 페인트 완료 → useEffect 콜백 비동기 실행. 클린업 함수는 다음 effect 실행 전 또는 언마운트 시 실행됩니다. useLayoutEffect: Commit Phase의 layout 단계 → DOM 변경 직후·페인트 전 → useLayoutEffect 콜백 동기 실행. 둘 다 deps 배열이 변경될 때 재실행되고, 빈 배열([])이면 마운트·언마운트 시에만 실행됩니다.",
  },

  // ─── Concurrent Rendering ─────────────────────────────────────────────────
  {
    id: "react-23",
    category: "react",
    question: "Concurrent Rendering이 무엇인가요?",
    answer:
      "React 18에서 도입된 렌더링 모드로, 여러 렌더링 작업을 우선순위에 따라 병행 처리할 수 있는 기능입니다. 기존에는 한 번 렌더링을 시작하면 완료까지 중단할 수 없었습니다. Concurrent Mode에서는 낮은 우선순위의 렌더링을 중단하고 높은 우선순위 업데이트(사용자 입력)를 먼저 처리할 수 있습니다. useTransition·useDeferredValue가 이를 활용하는 API입니다.\n\n**부가설명:** createRoot()를 사용하면 자동으로 Concurrent 모드로 동작합니다. React 17의 render()는 Legacy 모드(동기 렌더링)입니다.",
  },

  // ─── Suspense ─────────────────────────────────────────────────────────────
  {
    id: "react-24",
    category: "react",
    question: "Suspense는 뭔가요?",
    answer:
      "자식 컴포넌트가 준비될 때까지 fallback UI를 보여주는 React 컴포넌트입니다. React.lazy와 함께 코드 스플리팅 시 로딩 상태를 처리하거나, 데이터 패칭 라이브러리(React Query, SWR)가 데이터 로딩 중 fallback을 보여주는 데 활용됩니다. Next.js의 Streaming SSR도 Suspense를 기반으로 부분적으로 페이지를 스트리밍합니다.",
  },
  {
    id: "react-25",
    category: "react",
    question: "Suspense는 내부적으로 어떻게 동작하나요?",
    answer:
      "자식 컴포넌트가 아직 준비되지 않았음을 Promise를 throw하는 방식으로 React에 알립니다. React는 이 throw를 감지하면 가장 가까운 Suspense 경계의 fallback을 렌더링합니다. Promise가 resolve되면 Suspense가 자식을 다시 렌더링 시도합니다. React.lazy는 동적 import의 Promise를 던지고, React Query는 이 패턴을 suspense: true 옵션으로 지원합니다.\n\n**부가설명:** 이 패턴을 'Suspend by throwing a Promise'라고 부릅니다. 컴포넌트가 데이터가 없으면 Promise를 던지고, 데이터가 오면 다시 렌더링되는 방식으로 async/await처럼 동기적인 형태로 비동기 데이터를 사용할 수 있습니다.",
    isAdvanced: true,
  },

  // ─── Server Component ─────────────────────────────────────────────────────
  {
    id: "react-26",
    category: "react",
    question: "Server Component란 무엇인가요?",
    answer:
      "서버에서만 실행되는 React 컴포넌트입니다. 서버에서 렌더링된 결과(RSC Payload)를 클라이언트로 전송합니다. 클라이언트 JS 번들에 포함되지 않아 번들 크기가 줄어들고, 서버에서 DB·파일 시스템에 직접 접근할 수 있습니다. Next.js 13+ App Router에서 기본적으로 모든 컴포넌트는 Server Component입니다. 'use client' 지시어로 클라이언트 컴포넌트로 전환합니다.",
  },
  {
    id: "react-27",
    category: "react",
    question: "Server Component에서 useState를 사용할 수 없는 이유는?",
    answer:
      "useState는 클라이언트 브라우저에서 상태를 유지하고 변경에 따라 리렌더링을 트리거하는 훅입니다. Server Component는 서버에서 한 번만 실행되고 결과가 클라이언트로 전송됩니다. 서버에는 상태를 유지하거나 컴포넌트를 다시 렌더링하는 메커니즘이 없습니다. 브라우저 API(window·document)도 서버에 없으므로 사용할 수 없습니다. 상호작용이 필요한 부분은 'use client'로 분리해야 합니다.",
  },
  {
    id: "react-28",
    category: "react",
    question: "Server Component가 번들 크기를 줄이는 이유는?",
    answer:
      "Server Component는 서버에서 실행되고 결과(HTML·RSC Payload)만 클라이언트로 전송됩니다. Server Component 자체의 코드와 서버에서만 사용하는 의존성(예: heavy 파싱 라이브러리)이 클라이언트 JS 번들에 포함되지 않습니다. 예를 들어 마크다운 파서를 Server Component에서 사용하면 해당 라이브러리(수백 KB)가 클라이언트에 내려가지 않습니다.\n\n**부가설명:** RSC 이전에는 라이브러리가 서버에서만 필요해도 클라이언트 번들에 포함됐습니다. RSC는 이 경계를 명시적으로 분리합니다.",
  },
  {
    id: "react-29",
    category: "react",
    question: "Server Component와 SSR의 차이는 무엇인가요?",
    answer:
      "SSR은 전체 페이지를 서버에서 HTML로 렌더링하여 전송하고, 클라이언트에서 동일한 컴포넌트를 재실행하여 Hydration합니다. 따라서 클라이언트 번들에 모든 컴포넌트 코드가 포함됩니다. Server Component는 해당 컴포넌트 코드가 서버에만 존재하며 클라이언트 번들에 포함되지 않습니다. RSC Payload(JSON 형식)로 상태를 전달받고 클라이언트에서 재실행(Hydration)이 없습니다. SSR과 RSC는 함께 사용할 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "react-30",
    category: "react",
    question: "Client Component가 Server Component를 import할 수 있나요?",
    answer:
      "직접 import는 불가능합니다. Client Component에서 Server Component를 import하면 해당 Server Component가 클라이언트 번들에 포함되어 Server Component의 이점이 사라집니다. 대신 children이나 props를 통해 구성(Composition) 패턴을 사용합니다. Server Component에서 Client Component를 감싸고 Server Component를 children으로 전달하는 방식입니다.\n\n**부가설명:** 패턴: ServerComponent → ClientWrapper에 children으로 → ServerComponent의 자식을 렌더링. 이렇게 하면 ClientWrapper는 클라이언트로, 그 안의 children은 서버에서 처리됩니다.",
    isAdvanced: true,
  },
  {
    id: "react-31",
    category: "react",
    question: "RSC Payload란 무엇인가요?",
    answer:
      "React Server Component의 렌더링 결과를 클라이언트로 전달하는 특별한 형식의 데이터입니다. HTML 문자열이 아닌 React의 컴포넌트 트리 구조를 표현하는 직렬화된 형식입니다. 클라이언트 컴포넌트의 위치·props 정보와 서버 컴포넌트의 렌더링 결과를 포함합니다. 클라이언트 React가 이를 받아 DOM을 구성하며, 이후 Client Component만 Hydration합니다.",
    isAdvanced: true,
  },

  // ─── SSR / Hydration ──────────────────────────────────────────────────────
  {
    id: "react-32",
    category: "react",
    question: "CSR / SSR 차이를 설명해주세요.",
    answer:
      "CSR(Client-Side Rendering): 서버가 빈 HTML과 JS 번들을 전송하고 브라우저에서 JS가 실행되어 화면을 렌더링합니다. 초기 로딩이 느리고 SEO가 불리하지만 이후 페이지 전환이 빠릅니다. SSR(Server-Side Rendering): 서버에서 HTML을 완전히 렌더링하여 전송합니다. 첫 화면을 빠르게 볼 수 있고 SEO에 유리하지만, 서버 부하가 크고 페이지 전환 시 서버 요청이 필요합니다.\n\n**부가설명:** 현대적인 SSR(Next.js)은 서버에서 HTML을 렌더링하고 클라이언트에서 Hydration하여 CSR의 상호작용성과 SSR의 SEO·성능 이점을 결합합니다.",
  },
  {
    id: "react-33",
    category: "react",
    question: "SSG와 ISR 차이를 설명해주세요.",
    answer:
      "SSG(Static Site Generation): 빌드 타임에 HTML을 미리 생성합니다. 매우 빠르고 CDN 캐싱이 용이하지만 데이터가 변경되면 재빌드가 필요합니다. 변경이 드문 콘텐츠(문서·마케팅 페이지)에 적합합니다. ISR(Incremental Static Regeneration): SSG처럼 미리 생성하되 revalidate 주기로 백그라운드에서 재생성합니다. 정적 페이지의 성능을 유지하면서 일정 주기로 최신 데이터를 반영합니다. 블로그·상품 페이지처럼 주기적 갱신이 필요한 경우에 적합합니다.",
  },
  {
    id: "react-34",
    category: "react",
    question: "Hydration이란 무엇인가요?",
    answer:
      "서버에서 렌더링된 HTML에 클라이언트 JS의 이벤트 리스너와 상태를 연결하는 과정입니다. SSR로 사용자가 HTML을 빠르게 볼 수 있지만 JS 로드 전에는 상호작용이 불가합니다. JS 번들이 로드되면 React가 서버 HTML을 재사용하면서 이벤트 리스너를 붙여 상호작용 가능한 상태로 만드는 것이 Hydration입니다.\n\n**부가설명:** React 18의 Selective Hydration은 Suspense 경계를 기준으로 부분적·우선순위별 Hydration을 지원합니다. 사용자가 클릭한 영역을 먼저 Hydrate하는 것도 가능합니다.",
  },
  {
    id: "react-35",
    category: "react",
    question: "Hydration Mismatch는 뭐고 왜 발생하나요?",
    answer:
      "서버에서 렌더링한 HTML과 클라이언트에서 Hydration 시 생성한 React 트리가 다를 때 발생하는 오류입니다. 주요 원인: ① Date.now()·Math.random() 같은 실행 시점에 따라 다른 값, ② window·navigator 같은 브라우저 전용 API 사용, ③ 쿠키·localStorage 기반의 조건부 렌더링. 해결: suppressHydrationWarning 속성 사용, useEffect 안에서 클라이언트 전용 렌더링, Next.js의 dynamic({ ssr: false }) 사용.",
    isAdvanced: true,
  },
  {
    id: "react-36",
    category: "react",
    question: "CSR, SSR, SSG, ISR을 정하는 본인만의 기준이 있나요?",
    answer:
      "데이터 변경 빈도와 SEO 필요 여부를 기준으로 선택합니다. 자주 변경되고 개인화된 데이터(마이페이지·대시보드) → CSR. 요청마다 최신 데이터가 필요하고 SEO 중요(커머스 검색·SNS 피드) → SSR. 데이터가 드물게 변경되고 SEO 중요(마케팅 페이지·문서) → SSG. 주기적 업데이트가 필요하고 빌드 비용을 줄이고 싶을 때(블로그·상품 상세) → ISR.\n\n**부가설명:** Next.js App Router에서는 fetch 옵션으로 세밀하게 제어합니다. cache:'no-store'(SSR), cache:'force-cache'(SSG), next:{revalidate: N}(ISR).",
  },

  // ─── Memoization ──────────────────────────────────────────────────────────
  {
    id: "react-37",
    category: "react",
    question: "React.memo는 무엇인가요?",
    answer:
      "고차 컴포넌트(HOC)로, 컴포넌트를 감싸면 부모가 리렌더링될 때 props가 변경되지 않으면 자식 컴포넌트의 리렌더링을 건너뜁니다. 얕은 비교(Shallow Compare)로 props를 비교합니다. 부모가 자주 리렌더링되지만 자식 컴포넌트의 props는 변경되지 않는 경우에 효과적입니다.\n\n**부가설명:** props로 객체나 함수를 전달할 때 매번 새 참조가 생성되면 React.memo가 무의미해집니다. useMemo·useCallback으로 안정적인 참조를 제공해야 합니다.",
  },
  {
    id: "react-38",
    category: "react",
    question: "useMemo와 useCallback의 차이는?",
    answer:
      "useMemo는 값을 메모이제이션합니다. 의존성 배열이 변경될 때만 함수를 재실행하여 그 결과값을 캐시합니다. 계산 비용이 큰 연산 결과를 저장하는 데 사용합니다. useCallback은 함수 자체를 메모이제이션합니다. 의존성 배열이 변경될 때만 새 함수를 생성합니다. 자식에게 콜백을 props로 전달할 때 불필요한 리렌더링을 방지하는 데 사용합니다.\n\n**부가설명:** useCallback(fn, deps)은 useMemo(() => fn, deps)와 동일합니다. 함수가 자체적으로 비싼 게 아니라 '동일한 참조를 유지'하는 것이 목적입니다.",
  },
  {
    id: "react-39",
    category: "react",
    question: "React.memo를 남발하면 안 되는 이유는?",
    answer:
      "React.memo는 렌더링마다 props를 얕은 비교하는 비용이 발생합니다. 컴포넌트가 어차피 자주 리렌더링되거나 props가 매번 달라진다면 비교 비용만 낭비됩니다. 코드도 복잡해집니다. 메모이제이션의 이득이 비교 비용보다 클 때만 적용해야 합니다. React 개발자 도구나 Profiler로 실제 병목을 확인한 후 적용하는 것이 좋습니다.",
  },
  {
    id: "react-40",
    category: "react",
    question: "useMemo를 남발하면 안 되는 이유는?",
    answer:
      "useMemo는 이전 결과를 메모리에 저장합니다. 캐시 유지 비용(메모리)과 의존성 비교 비용이 발생합니다. 단순한 연산이라면 메모이제이션 없이 매번 계산하는 것이 더 빠릅니다. 의존성 배열을 잘못 관리하면 오래된 값을 참조하는 버그가 생깁니다. 복잡한 계산이나 참조 안정성이 필요한 경우에만 사용하고, React Compiler(React 19)가 도입되면 자동으로 최적화되어 수동 useMemo 필요성이 줄어들 것입니다.",
    isAdvanced: true,
  },

  // ─── Context API ──────────────────────────────────────────────────────────
  {
    id: "react-41",
    category: "react",
    question: "Context API는 무엇인가요?",
    answer:
      "컴포넌트 트리에서 Prop Drilling 없이 데이터를 전역으로 공유하는 React 내장 기능입니다. createContext로 컨텍스트를 생성하고, Provider로 값을 제공하면 하위의 어떤 컴포넌트든 useContext 훅으로 값을 소비할 수 있습니다. 테마·언어·인증 정보처럼 많은 컴포넌트에서 공유하는 비교적 정적인 데이터에 적합합니다.",
  },
  {
    id: "react-42",
    category: "react",
    question: "Context API의 단점은 무엇인가요?",
    answer:
      "Provider의 value가 변경되면 해당 Context를 구독하는 모든 컴포넌트가 리렌더링됩니다. 변경된 값을 실제로 사용하지 않아도 리렌더링이 발생합니다. 이를 방지하려면 Context를 여러 개로 분리하거나 React.memo를 조합해야 합니다. 빈번하게 변경되는 상태를 Context로 관리하면 성능 문제가 발생할 수 있어, 이런 경우엔 Zustand·Jotai 같은 선택적 구독이 가능한 라이브러리가 적합합니다.",
  },

  // ─── useRef ───────────────────────────────────────────────────────────────
  {
    id: "react-43",
    category: "react",
    question: "useRef vs useState 차이는?",
    answer:
      "useState는 값이 변경되면 컴포넌트를 리렌더링합니다. 화면에 반영되어야 하는 상태에 사용합니다. useRef는 .current 값이 변경돼도 리렌더링이 발생하지 않습니다. 렌더링 사이에 값을 유지하지만 화면에 직접 영향 없는 값(이전 값 참조·타이머 ID·인터벌 ID)이나 DOM 노드에 대한 참조에 사용합니다.\n\n**부가설명:** 렌더링에 영향 없는 가변 값을 컴포넌트 외부 변수로 선언하면 컴포넌트 인스턴스 간에 공유됩니다. useRef를 사용하면 인스턴스별 독립적인 가변 값을 유지할 수 있습니다.",
  },
  {
    id: "react-44",
    category: "react",
    question: "useRef는 어디서 사용하나요?",
    answer:
      "① DOM 접근: ref={inputRef}로 DOM 요소에 연결하여 inputRef.current.focus() 등 직접 제어합니다. ② 이전 값 저장: 이전 렌더링의 props·state를 저장합니다. ③ 타이머·인터벌 ID 저장: setTimeout/setInterval의 ID를 저장하여 클린업에 사용합니다. ④ 외부 라이브러리(Canvas·Video 플레이어·지도)와 연동할 때 DOM 노드에 접근합니다.",
  },
  {
    id: "react-45",
    category: "react",
    question: "forwardRef가 무엇인가요?",
    answer:
      "부모 컴포넌트가 자식 컴포넌트 내부의 DOM 노드에 ref를 전달할 수 있게 해주는 React API입니다. 일반적으로 ref는 props로 전달되지 않습니다. forwardRef로 감싼 컴포넌트는 두 번째 인자로 ref를 받아 내부 DOM 요소에 연결합니다. 재사용 가능한 Input·Button 같은 UI 컴포넌트에서 외부에서 포커스·스크롤을 제어해야 할 때 사용합니다.\n\n**부가설명:** React 19에서는 forwardRef 없이 props로 ref를 직접 전달할 수 있도록 개선됩니다.",
  },

  // ─── Error Boundary ───────────────────────────────────────────────────────
  {
    id: "react-46",
    category: "react",
    question: "Error Boundary가 무엇인가요?",
    answer:
      "자식 컴포넌트 트리에서 발생하는 JS 오류를 감지하여 오류 메시지 대신 fallback UI를 렌더링하는 React 컴포넌트입니다. componentDidCatch와 getDerivedStateFromError 생명주기를 사용하며 현재는 클래스 컴포넌트로만 구현 가능합니다(react-error-boundary 라이브러리로 함수형 패턴도 사용 가능). 앱 전체가 흰 화면이 되는 대신 오류 발생 부분만 fallback UI로 대체할 수 있습니다.",
  },
  {
    id: "react-47",
    category: "react",
    question: "Error Boundary는 어떤 에러를 잡지 못하나요?",
    answer:
      "① 이벤트 핸들러 내부 오류(onClick 등): try-catch로 직접 처리해야 합니다. ② 비동기 코드 오류(setTimeout·Promise rejection): Error Boundary는 렌더링 중 동기적 오류만 캐치합니다. ③ 서버 사이드 렌더링 오류. ④ Error Boundary 컴포넌트 자체에서 발생한 오류. ⑤ 에러가 Error Boundary 외부에서 발생한 경우. 결국 Render/Commit Phase 중 발생한 컴포넌트 렌더링 오류만 잡습니다.",
  },

  // ─── Code Splitting ───────────────────────────────────────────────────────
  {
    id: "react-48",
    category: "react",
    question: "React.lazy와 Code Splitting이 무엇인가요?",
    answer:
      "Code Splitting은 번들 파일을 여러 청크로 분리하여 필요할 때만 로드하는 기법입니다. 초기 번들 크기를 줄여 첫 로딩 속도를 개선합니다. React.lazy는 동적 import를 사용하여 컴포넌트를 지연 로드합니다. const LazyComp = React.lazy(() => import('./MyComp')). 해당 컴포넌트가 처음 렌더링될 때 JS 청크를 네트워크에서 로드합니다. Suspense로 로딩 중 fallback UI를 제공해야 합니다.",
  },
  {
    id: "react-49",
    category: "react",
    question: "Suspense와 React.lazy를 함께 사용하는 이유는?",
    answer:
      "React.lazy로 컴포넌트를 지연 로드할 때, 청크가 로드되기 전 렌더링을 시도하면 Promise를 throw합니다. React는 이 Promise를 감지하여 가장 가까운 Suspense의 fallback UI(로딩 스피너 등)를 보여줍니다. 청크 로드가 완료되면 Suspense가 실제 컴포넌트로 교체합니다. Suspense 없이 React.lazy를 사용하면 로딩 상태를 처리할 수 없어 오류가 발생합니다.",
  },

  // ─── Custom Hook ──────────────────────────────────────────────────────────
  {
    id: "react-56",
    category: "react",
    question: "Custom Hook을 언제 만드나요?",
    answer:
      "① 여러 컴포넌트에서 동일한 상태 로직이 반복될 때 추출합니다. ② 하나의 컴포넌트에 상태 로직이 너무 많아져 관심사를 분리하고 싶을 때 만듭니다. ③ 복잡한 라이브러리·Web API(fetch·IntersectionObserver·resize 이벤트)를 단순한 인터페이스로 추상화할 때 사용합니다. 이름이 반드시 use로 시작해야 React가 훅 규칙을 검사합니다.",
  },
  {
    id: "react-57",
    category: "react",
    question: "Custom Hook과 일반 함수의 차이는?",
    answer:
      "Custom Hook은 내부에서 다른 훅(useState·useEffect 등)을 호출할 수 있습니다. 반드시 함수형 컴포넌트나 다른 Custom Hook 내부에서만 호출되어야 합니다. 일반 함수는 훅을 호출할 수 없습니다. use로 시작하는 이름 규칙이 없으면 React는 훅 규칙 위반을 감지하지 못합니다. Custom Hook은 훅 규칙을 준수하므로 호출될 때마다 독립적인 상태를 가집니다. 같은 Custom Hook을 두 컴포넌트에서 사용해도 상태는 공유되지 않습니다.\n\n**부가설명:** 상태 공유가 필요하면 Custom Hook이 아닌 전역 상태관리(Zustand·Context)를 사용해야 합니다.",
  },
];
