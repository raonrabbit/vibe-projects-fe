import type { QuizQuestion } from "./types";

export const STATE_MANAGEMENT_QUESTIONS: QuizQuestion[] = [
  // ─── 라이브러리 비교 ────────────────────────────────────────────────────────
  {
    id: "sm-01",
    category: "state-management",
    question: "Redux, Zustand, Jotai, Recoil의 차이는?",
    answer:
      "Redux는 단일 스토어에 모든 상태를 저장하고 Action→Reducer→Store 단방향 흐름이 엄격합니다. 예측 가능성이 높고 DevTools가 강력하지만 보일러플레이트가 많습니다. Zustand는 훅 기반으로 설정 없이 바로 사용 가능하며, selector로 필요한 상태만 구독하여 불필요한 리렌더링을 방지합니다. Redux보다 훨씬 간결합니다. Jotai는 atom 단위로 상태를 관리하는 Bottom-up 방식으로 각 atom이 독립적으로 구독·갱신됩니다. Recoil도 atom 기반이지만 React와 긴밀하게 통합되어 있고, Jotai에 비해 API가 다소 복잡합니다.\n\n**부가설명:** 현재 트렌드는 서버 상태(API 데이터)는 React Query로, 클라이언트 상태는 Zustand나 Jotai로 관리하는 방식입니다. Redux는 대규모 팀에서 엄격한 패턴이 필요할 때 여전히 유효합니다.",
  },
  {
    id: "sm-02",
    category: "state-management",
    question: "언제 전역 상태관리 라이브러리를 사용해야 하나요?",
    answer:
      "Prop Drilling(여러 레벨을 거쳐 props를 전달)이 3단계 이상 깊어지거나, 서로 관련 없는 컴포넌트들이 같은 데이터를 공유해야 할 때 고려합니다. 단순한 공유 상태(테마·언어)는 Context API로 충분합니다. 빈번하게 업데이트되거나 많은 컴포넌트가 구독하는 복잡한 상태라면 Zustand·Jotai가 Context보다 리렌더링 측면에서 효율적입니다. 서버 데이터(API 응답)는 전역 상태가 아닌 React Query/SWR로 관리하는 것이 더 적합합니다.\n\n**부가설명:** 상태를 전역으로 올리기 전에 컴포넌트 합성(Composition)이나 children prop으로 Prop Drilling을 해결할 수 있는지 먼저 검토합니다.",
  },
  {
    id: "sm-03",
    category: "state-management",
    question: "Redux의 동작 원리를 설명해주세요. (Action, Reducer, Store)",
    answer:
      "Action은 '어떤 일이 일어났는가'를 설명하는 순수 객체입니다. { type: 'counter/increment', payload: 1 } 형태입니다. Reducer는 현재 상태와 Action을 받아 새로운 상태를 반환하는 순수 함수로, 상태를 직접 수정하지 않습니다. Store는 Reducer로 관리되는 단일 상태 트리입니다. 컴포넌트가 dispatch(action)을 호출 → Reducer가 새 상태 계산 → subscribe된 컴포넌트들이 리렌더링되는 흐름입니다. Redux Toolkit은 createSlice로 Reducer와 Action을 함께 정의하여 보일러플레이트를 크게 줄였습니다.\n\n**부가설명:** Redux의 핵심 원칙 3가지: 단일 진실의 원천(Single source of truth), 상태는 읽기 전용(State is read-only), 순수 함수로만 변경(Changes are made with pure functions). 이 원칙이 예측 가능성과 디버깅을 쉽게 만들어줍니다.",
  },
  {
    id: "sm-04",
    category: "state-management",
    question: "Zustand가 Redux보다 나은 점은?",
    answer:
      "① 보일러플레이트 없음: Action 타입·Action 생성자·Reducer를 따로 만들 필요 없이 create 함수 하나로 스토어와 업데이트 함수를 동시에 정의합니다. ② Provider 불필요: 앱 최상단을 Provider로 감쌀 필요가 없습니다. ③ 외부에서도 접근 가능: useStore 훅 외에 스토어 인스턴스로 직접 상태를 읽고 업데이트할 수 있어 이벤트 핸들러나 서드파티에서도 접근이 쉽습니다. ④ 번들 크기가 매우 작습니다(~1KB). 단, 복잡한 미들웨어나 타임트래블 디버깅이 필요하면 Redux가 더 풍부한 에코시스템을 제공합니다.",
    isAdvanced: true,
  },

  // ─── 서버 상태관리 ─────────────────────────────────────────────────────────
  {
    id: "sm-05",
    category: "state-management",
    question: "React Query(TanStack Query)가 무엇인가요?",
    answer:
      "서버 상태(API 데이터)를 관리하는 라이브러리입니다. 자동 캐싱·백그라운드 refetch·로딩/에러 상태·중복 요청 제거·페이지네이션·낙관적 업데이트 등을 내장합니다. useQuery는 데이터 조회, useMutation은 데이터 변경에 사용합니다. 같은 queryKey의 데이터는 캐시에서 공유하기 때문에 여러 컴포넌트에서 같은 API를 useQuery로 호출해도 네트워크 요청은 한 번만 발생합니다. Redux에서 API 응답을 저장하던 패턴을 대체하여 전역 상태를 순수한 클라이언트 UI 상태로만 한정할 수 있습니다.\n\n**부가설명:** queryKey 배열이 변경되면 자동으로 새 데이터를 fetching합니다. 예를 들어 useQuery({ queryKey: ['user', userId] })에서 userId가 바뀌면 자동으로 새 유저 데이터를 가져옵니다.",
  },
  {
    id: "sm-06",
    category: "state-management",
    question: "SWR과 React Query의 차이는?",
    answer:
      "SWR은 Vercel이 만든 가볍고 단순한 서버 상태 라이브러리입니다. stale-while-revalidate 전략을 이름에서 드러내듯 캐시→재검증을 기본으로 합니다. API가 직관적이고 번들 크기가 작습니다. React Query(TanStack Query)는 더 많은 기능을 제공합니다. 낙관적 업데이트·오프라인 지원·쿼리 취소·Infinite Query·DevTools·세밀한 캐시 제어 등이 내장되어 있습니다. 단순한 데이터 패칭이라면 SWR, 복잡한 서버 상태 관리(뮤테이션 후 쿼리 무효화·낙관적 업데이트)가 필요하면 React Query가 더 적합합니다.",
    isAdvanced: true,
  },
  {
    id: "sm-07",
    category: "state-management",
    question: "서버 상태와 클라이언트 상태의 차이는?",
    answer:
      "서버 상태는 서버에서 가져오는 비동기 데이터로 캐싱·동기화·만료를 고려해야 합니다(사용자 목록·게시글 등). 클라이언트 상태는 브라우저에서만 존재하는 UI 상태입니다(모달 열림 여부·선택된 탭·다크모드 설정 등). 많은 프로젝트에서 두 종류를 Redux 단일 스토어에 섞어 관리했는데, 이는 API 로딩·에러·캐시 로직을 직접 구현해야 해서 복잡해집니다. React Query로 서버 상태를 전담하고 Zustand·Context로 클라이언트 상태만 관리하면 관심사가 명확히 분리됩니다.\n\n**부가설명:** 서버 상태의 특징: ①  내가 소유하지 않는 데이터(서버가 진짜 주인), ② 비동기 API로만 접근 가능, ③ 다른 사용자가 변경할 수 있어 outdated가 될 수 있음. 이 특성 때문에 단순 전역 상태와 다른 관리가 필요합니다.",
  },
  {
    id: "sm-08",
    category: "state-management",
    question: "React Query의 staleTime과 gcTime(cacheTime)의 차이는?",
    answer:
      "staleTime은 데이터가 'fresh(신선)'한 상태로 유지되는 시간입니다. staleTime 이내에는 같은 쿼리를 다시 마운트해도 네트워크 요청이 발생하지 않고 캐시 값을 즉시 사용합니다. staleTime이 지나면 데이터는 'stale(오래된)' 상태가 되고, 쿼리가 마운트되거나 창이 포커스될 때 백그라운드에서 새 데이터를 가져옵니다(기존 데이터는 즉시 보여주면서). gcTime(이전 cacheTime)은 쿼리 구독이 없어진(언마운트) 후 캐시를 메모리에서 제거하기까지의 시간입니다.\n\n**부가설명:** 기본값: staleTime=0(항상 stale), gcTime=5분. staleTime을 늘리면 네트워크 요청이 줄어듭니다. staleTime ≤ gcTime으로 설정하는 것이 일반적입니다. staleTime=Infinity로 설정하면 해당 쿼리를 한 번만 가져옵니다.",
    isAdvanced: true,
  },
];
