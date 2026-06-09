export type QuizCategory =
  | "cs-basics"
  | "algorithms"
  | "data-structures"
  | "network"
  | "javascript"
  | "react";

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  answer: string;
  isAdvanced?: boolean;
}

export const CATEGORY_LABELS: Record<QuizCategory, string> = {
  "cs-basics": "CS 기초",
  algorithms: "알고리즘",
  "data-structures": "자료구조",
  network: "네트워크",
  javascript: "JavaScript",
  react: "React",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ── CS 기초 ──────────────────────────────────────────────────────────────
  {
    id: "cs-01",
    category: "cs-basics",
    question: "프로세스와 스레드의 차이는?",
    answer:
      "프로세스는 OS로부터 독립적인 메모리 공간을 할당받은 실행 단위입니다. 스레드는 프로세스 내의 실행 흐름으로, 같은 프로세스의 Code·Data·Heap을 공유하고 Stack만 독립적입니다. 스레드는 메모리를 공유하므로 통신이 빠르지만 동기화 문제(Race Condition, Deadlock)가 발생할 수 있습니다.",
  },
  {
    id: "cs-02",
    category: "cs-basics",
    question: "JavaScript는 싱글 스레드인데 멀티 코어 CPU를 어떻게 활용하나요?",
    answer:
      "메인 스레드는 단일 스레드로 동작하지만, Web Workers API를 통해 별도 스레드에서 CPU 집약적 작업을 실행할 수 있습니다. Node.js에서는 Worker Threads와 Cluster 모듈을 사용합니다. 또한 브라우저와 Node.js 런타임 자체는 멀티스레드로 구현되어 있어 I/O 작업을 백그라운드 스레드에서 처리하고 완료 시 이벤트 루프에 콜백을 전달합니다.",
    isAdvanced: true,
  },
  {
    id: "cs-03",
    category: "cs-basics",
    question: "스택(Stack)과 힙(Heap) 메모리의 차이는?",
    answer:
      "스택은 함수 호출 시 자동으로 할당·해제되며 빠르지만 크기가 제한적입니다. 지역 변수와 함수 호출 정보가 저장됩니다. 힙은 동적으로 할당되며 GC나 명시적 해제가 필요합니다. 객체·배열 같은 참조 타입이 저장됩니다. 스택은 LIFO로 순차적이어서 캐시 효율이 좋고, 힙은 임의 접근이 가능하지만 관리 오버헤드가 있습니다.",
  },
  {
    id: "cs-04",
    category: "cs-basics",
    question:
      "동기(Synchronous)와 비동기(Asynchronous), 블로킹(Blocking)과 논블로킹(Non-blocking)의 차이는?",
    answer:
      "동기/비동기는 작업 완료를 기다리는지 여부입니다. 동기는 작업이 끝날 때까지 기다리고, 비동기는 완료 여부와 상관없이 다음 코드를 실행합니다. 블로킹/논블로킹은 제어권을 넘기는지 여부입니다. 블로킹은 작업이 완료될 때까지 제어권을 넘겨 스레드를 정지시키고, 논블로킹은 즉시 제어권을 반환합니다.",
  },
  {
    id: "cs-05",
    category: "cs-basics",
    question: "JavaScript는 컴파일 언어인가요, 인터프리터 언어인가요?",
    answer:
      "전통적으로 인터프리터 언어로 분류되지만, 현대 JS 엔진(V8)은 JIT 컴파일을 사용합니다. 처음에는 Ignition 인터프리터로 바이트코드를 실행하고, 자주 실행되는 코드(Hot Path)를 Turbofan으로 기계어로 컴파일합니다. 타입이 변경되면 최적화를 취소(Deoptimization)하므로, 일관된 타입을 유지하는 것이 성능에 중요합니다.",
  },
  {
    id: "cs-06",
    category: "cs-basics",
    question: "가상 메모리(Virtual Memory)란 무엇이고 왜 사용하나요?",
    answer:
      "각 프로세스에게 독립적인 연속된 주소 공간이 있는 것처럼 보이게 하는 추상화입니다. 실제 물리 메모리는 페이지 단위로 관리되며, 부족하면 디스크(스왑)를 사용합니다. 이점은 프로세스 간 메모리 격리(보안), 실제 물리 메모리보다 큰 메모리 사용, 메모리 단편화 해결입니다.",
  },
  {
    id: "cs-07",
    category: "cs-basics",
    question: "Reflow와 Repaint의 차이는?",
    answer:
      "Reflow는 DOM 변경으로 요소의 크기나 위치가 바뀔 때 발생하며, Layout 단계부터 Paint·Composite 전체를 재실행합니다. Repaint는 색상처럼 레이아웃은 변하지 않고 시각적 스타일만 바뀔 때 발생하여 Layout을 건너뜁니다. `transform`과 `opacity`는 GPU에서 Composite 단계만 처리하므로 Reflow/Repaint를 유발하지 않아 애니메이션에 최적입니다.",
  },
  {
    id: "cs-08",
    category: "cs-basics",
    question: "브라우저는 Reflow를 어떻게 최소화하나요?",
    answer:
      "브라우저는 레이아웃 변경을 즉시 처리하지 않고 배치(queue)에 모아 한 번에 처리합니다. 하지만 `offsetWidth`, `scrollTop`, `getComputedStyle` 같은 레이아웃 속성을 읽으면 큐가 강제로 플러시되어 동기적 Reflow(Forced Synchronous Layout)가 발생합니다. 레이아웃 읽기와 쓰기를 분리하거나 `requestAnimationFrame`을 활용해야 합니다.",
    isAdvanced: true,
  },
  {
    id: "cs-09",
    category: "cs-basics",
    question: "XSS와 CSRF의 차이는?",
    answer:
      "XSS는 공격자가 악성 스크립트를 웹 페이지에 주입하여 사용자 브라우저에서 실행시키는 공격으로, 쿠키 탈취·키로깅 등이 가능합니다. CSRF는 인증된 사용자가 의도하지 않은 요청을 특정 서버에 전송하도록 유도하는 공격입니다. XSS는 사용자를 공격하고, CSRF는 서버를 속이는 데 초점이 있습니다.",
  },
  {
    id: "cs-10",
    category: "cs-basics",
    question: "프론트엔드 성능 최적화 방법을 아는 대로 설명해주세요.",
    answer:
      "크게 네트워크·렌더링·JavaScript 세 측면에서 접근합니다. 네트워크는 이미지 최적화(WebP, lazy loading)·CDN·HTTP/2·리소스 압축으로 개선합니다. 렌더링은 Critical CSS 인라인화, transform/opacity로 Reflow 최소화, will-change로 레이어 승격을 활용합니다. JavaScript는 코드 스플리팅·Tree Shaking으로 번들 크기를 줄이고, 긴 목록은 가상화(virtualization)로 처리합니다.",
  },
  {
    id: "cs-11",
    category: "cs-basics",
    question: "CPU 스케줄링 알고리즘의 종류와 특징을 설명하세요.",
    answer:
      "FCFS(First Come First Served)는 먼저 온 순서대로 처리하지만, 긴 작업이 짧은 작업을 막는 Convoy Effect가 발생합니다. SJF(Shortest Job First)는 짧은 작업을 먼저 처리해 평균 대기 시간이 최소지만, 긴 작업의 무기한 대기(Starvation)가 문제입니다. Round Robin은 Time Quantum만큼 돌아가며 처리해 응답성이 좋지만 컨텍스트 스위칭 오버헤드가 있습니다. Priority Scheduling은 우선순위대로 처리하며 Aging(대기 시간에 따라 우선순위 상승)으로 Starvation을 해결합니다.",
  },
  {
    id: "cs-12",
    category: "cs-basics",
    question: "컨텍스트 스위칭이란 무엇이고 어떤 오버헤드가 있나요?",
    answer:
      "CPU가 실행 중인 프로세스/스레드를 전환할 때, 현재 상태(레지스터, PC, 스택 포인터 등 PCB 정보)를 저장하고 다음 프로세스의 상태를 복원하는 과정입니다. 오버헤드로는 PCB 저장·복원 비용, 캐시 플러시로 인한 캐시 미스, TLB(Translation Lookaside Buffer) 무효화가 있습니다. 프로세스 전환은 주소 공간까지 전환하므로 스레드 전환보다 훨씬 무겁습니다. 이것이 스레드 기반 동시성의 이점 중 하나입니다.",
  },
  {
    id: "cs-13",
    category: "cs-basics",
    question: "Race Condition이란 무엇이고 어떻게 해결하나요?",
    answer:
      "두 개 이상의 스레드가 공유 자원에 동시에 접근할 때, 실행 순서에 따라 결과가 달라지는 문제입니다. 예를 들어 두 스레드가 동시에 count++를 실행하면 read→increment→write 사이에 끼어들어 최종값이 2가 아닌 1이 될 수 있습니다. 해결 방법: Mutex는 한 번에 하나의 스레드만 임계 구역에 진입하도록 잠금을 사용합니다. Semaphore는 N개 스레드까지 동시 접근을 허용합니다. JavaScript는 싱글 스레드이므로 기본적으로 Race Condition이 발생하지 않습니다.",
  },
  {
    id: "cs-14",
    category: "cs-basics",
    question: "Core Web Vitals 지표들을 설명해주세요.",
    answer:
      "LCP(Largest Contentful Paint)는 가장 큰 콘텐츠 요소가 렌더링되는 시간(≤2.5초 권장)으로 로딩 성능을 측정합니다. FID(First Input Delay)는 첫 번째 사용자 입력에 대한 응답 지연(≤100ms)으로 반응성을 측정합니다. CLS(Cumulative Layout Shift)는 예기치 않은 레이아웃 이동의 누적 점수(≤0.1)로 시각적 안정성을 측정합니다. FID를 대체하는 INP(Interaction to Next Paint)는 모든 상호작용의 응답성(≤200ms)을 종합적으로 측정합니다.",
  },
  {
    id: "cs-15",
    category: "cs-basics",
    question: "`<script>` 태그의 async와 defer 속성의 차이는?",
    answer:
      "둘 다 HTML 파싱을 중단하지 않고 스크립트를 병렬로 다운로드합니다. async는 다운로드 완료 즉시 파싱을 중단하고 스크립트를 실행하므로 선언 순서가 보장되지 않습니다. defer는 HTML 파싱이 완료된 후 DOMContentLoaded 이벤트 전에 선언 순서대로 실행됩니다. 서로 의존성 없는 독립 스크립트(분석 도구 등)에는 async, DOM이나 다른 스크립트에 의존하는 경우에는 defer를 사용합니다.",
  },

  // ── 알고리즘 ──────────────────────────────────────────────────────────────
  {
    id: "algo-01",
    category: "algorithms",
    question: "Big O 표기법이란 무엇인가요?",
    answer:
      "알고리즘의 시간/공간 복잡도를 입력 크기 n에 대해 표현하는 점근 표기법입니다. 최악의 경우를 기준으로 하며, 상수 계수와 낮은 차수 항을 제외하여 알고리즘의 스케일링 특성을 나타냅니다. O(n²) 알고리즘은 입력이 2배가 되면 시간이 4배, O(n log n)은 약 2배 조금 넘게 증가합니다.",
  },
  {
    id: "algo-02",
    category: "algorithms",
    question: "퀵정렬과 병합정렬의 차이는?",
    answer:
      "퀵정렬은 In-place로 O(log n) 공간만 사용하고 캐시 효율이 좋아 실제로 빠릅니다. 하지만 피벗 선택에 따라 최악 O(n²)이 될 수 있고 불안정 정렬입니다. 병합정렬은 O(n log n)을 항상 보장하고 안정 정렬이지만 O(n) 추가 공간이 필요합니다. 실무에서는 Timsort처럼 둘을 결합해 사용합니다.",
  },
  {
    id: "algo-03",
    category: "algorithms",
    question: "퀵정렬의 최악의 경우를 어떻게 방지하나요?",
    answer:
      "이미 정렬된 배열에서 첫 번째 또는 마지막 원소를 피벗으로 선택하면 분할이 항상 (0, n-1)로 불균형하게 되어 O(n²)이 됩니다. 방지 방법: 랜덤 피벗 선택, 세 원소(첫·중간·끝)의 중앙값을 피벗으로 선택(Median of Three), 또는 Introsort(퀵정렬 + 깊이 초과 시 힙정렬로 전환)를 사용합니다.",
    isAdvanced: true,
  },
  {
    id: "algo-04",
    category: "algorithms",
    question: "이진 탐색의 시간 복잡도와 사용 조건은?",
    answer:
      "정렬된 배열에서 탐색 범위를 매 단계 절반으로 줄이므로 O(log n)입니다. 반드시 정렬된 배열이어야 합니다. 정렬되지 않은 배열이라면 먼저 정렬(O(n log n)) 후 이진 탐색하거나, 탐색이 빈번하면 BST를 사용하는 것이 낫습니다.",
  },
  {
    id: "algo-05",
    category: "algorithms",
    question: "동적 프로그래밍(DP)이란?",
    answer:
      "큰 문제를 작은 부분 문제로 분해하고, 부분 문제의 결과를 저장(메모이제이션 또는 테이블)하여 중복 계산을 방지하는 최적화 기법입니다. 최적 부분 구조(전체의 최적해가 부분의 최적해로 구성)와 중복 부분 문제 특성이 있을 때 적용합니다. 탑다운(재귀+캐시)과 바텀업(반복문) 방식이 있습니다.",
  },
  {
    id: "algo-06",
    category: "algorithms",
    question: "DP와 분할 정복의 차이는?",
    answer:
      "둘 다 문제를 부분 문제로 분해합니다. 분할 정복(병합정렬, 퀵정렬)은 부분 문제들이 서로 독립적이어서 중복이 없습니다. DP는 부분 문제들이 중복되므로 계산 결과를 저장하여 재사용합니다. 피보나치는 중복 부분 문제가 있어 DP, 병합정렬은 독립적이어서 분할 정복입니다.",
    isAdvanced: true,
  },
  {
    id: "algo-07",
    category: "algorithms",
    question: "그리디 알고리즘이란?",
    answer:
      "매 단계에서 가장 좋아 보이는 선택을 하여 최종 해를 구하는 방식입니다. 구현이 간단하고 빠르지만, 그리디 선택이 전체 최적해를 보장하는지 반드시 증명해야 합니다. 동전 거스름돈(배수 관계), 활동 선택 문제, Dijkstra 등에서 올바르게 작동합니다.",
  },
  {
    id: "algo-08",
    category: "algorithms",
    question: "슬라이딩 윈도우 기법은 언제 사용하나요?",
    answer:
      "연속된 부분 배열(서브스트링)에서 최대/최소/평균 등을 구하거나 조건을 만족하는 구간을 찾을 때 사용합니다. 윈도우를 이동할 때 이전 계산 결과를 재활용하여 O(n²)을 O(n)으로 줄입니다. 특히 '연속 k개 원소의 합', '조건을 만족하는 가장 긴/짧은 부분 문자열' 유형에 적합합니다.",
  },
  {
    id: "algo-09",
    category: "algorithms",
    question: "안정 정렬(Stable Sort)이란 무엇인가요?",
    answer:
      "동일한 값을 가진 원소들의 원래 순서가 정렬 후에도 유지되는 정렬입니다. 예를 들어 [(2,'a'), (1,'b'), (2,'c')] 정렬 시 안정 정렬은 2끼리 a, c 순서를 유지합니다. 병합정렬·삽입정렬·Timsort는 안정 정렬이고, 퀵정렬·힙정렬·선택정렬은 불안정 정렬입니다.",
  },

  // ── 자료구조 ──────────────────────────────────────────────────────────────
  {
    id: "algo-01b",
    category: "algorithms",
    question:
      "O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ) 각각에 해당하는 대표 알고리즘 예시를 설명하세요.",
    answer:
      "O(1): 배열 인덱스 접근·해시맵 조회. O(log n): 이진 탐색·균형 BST 탐색. O(n): 선형 탐색·배열 순회. O(n log n): 퀵정렬(평균)·병합정렬·힙정렬. O(n²): 버블·선택·삽입 정렬·이중 루프. O(2ⁿ): 피보나치 순수 재귀·부분집합 탐색. O(n!): 순열 생성. n=1000 기준 O(log n)≈10, O(n log n)≈10000, O(n²)=1,000,000임을 감각으로 익혀두면 좋습니다.",
  },
  {
    id: "algo-02b",
    category: "algorithms",
    question: "버블·선택·삽입 정렬의 시간복잡도와 특징을 각각 설명하세요.",
    answer:
      "버블 정렬은 인접 원소를 비교·교환하며 시간 O(n²), 공간 O(1), 안정 정렬입니다. 선택 정렬은 매 패스에서 최솟값을 찾아 맨 앞으로 이동하며 시간 O(n²), 공간 O(1), 불안정 정렬이나 교환 횟수가 O(n)으로 적어 쓰기 비용이 높은 경우 유리합니다. 삽입 정렬은 정렬된 부분에 현재 원소를 삽입하며 평균·최악 O(n²), 최선 O(n)(이미 정렬된 경우), 공간 O(1), 안정 정렬입니다. 소규모·거의 정렬된 데이터에 효율적이며 Timsort 내부에서 사용합니다.",
  },
  {
    id: "algo-02c",
    category: "algorithms",
    question: "힙 정렬의 복잡도와 특징, 퀵 정렬보다 실제로 느린 이유는?",
    answer:
      "힙 정렬은 Max Heap을 구성한 후 루트를 뒤로 보내며 정렬합니다. 시간 O(n log n)이 항상 보장되고 공간 O(1)인 In-place이나 불안정 정렬입니다. 퀵 정렬보다 실제로 느린 이유는 캐시 효율입니다. 힙은 2i+1, 2i+2 인덱스로 비연속 접근하여 캐시 미스가 자주 발생하는 반면, 퀵 정렬은 연속 메모리를 순차 접근하여 캐시 효율이 좋습니다.",
    isAdvanced: true,
  },
  {
    id: "algo-02d",
    category: "algorithms",
    question: "Timsort란 무엇이고 왜 실제 언어에서 사용되나요?",
    answer:
      "Timsort는 삽입 정렬과 병합 정렬을 결합한 하이브리드 정렬입니다. 배열을 run이라는 작은 구간으로 나누어 삽입 정렬로 처리한 뒤 병합 정렬로 합칩니다. 실제 데이터는 부분 정렬된 경우가 많아 run을 활용하면 효율적입니다. 최선 O(n), 평균·최악 O(n log n), 공간 O(n), 안정 정렬이며 Python·Java·JavaScript(Array.prototype.sort)의 표준 정렬 구현입니다.",
  },
  {
    id: "algo-10",
    category: "algorithms",
    question: "투 포인터 기법이란 무엇이고 슬라이딩 윈도우와 어떻게 다른가요?",
    answer:
      "투 포인터는 배열의 양 끝 또는 같은 방향에 두 포인터를 배치하고 조건에 따라 이동시켜 탐색하는 기법입니다. 정렬된 배열에서 두 수의 합이 target인 쌍 찾기처럼 이중 루프 O(n²)를 O(n)으로 줄입니다. 슬라이딩 윈도우가 '연속된 구간'의 최대·최소를 구하는 데 특화된 반면, 투 포인터는 정렬된 배열에서 특정 조건을 만족하는 두 원소의 관계를 탐색하는 데 적합합니다.",
  },
  {
    id: "ds-01",
    category: "data-structures",
    question: "Array와 LinkedList의 차이는?",
    answer:
      "Array는 연속된 메모리를 사용해 인덱스로 O(1) 랜덤 접근이 가능하지만, 삽입/삭제 시 원소 이동이 필요합니다. LinkedList는 노드가 포인터로 연결되어 삽입/삭제가 O(1)이지만, 특정 위치 접근이 O(n)입니다. Array는 CPU 캐시 지역성이 좋아 순차 탐색이 빠르고, LinkedList는 동적 크기 조절이 용이합니다.",
  },
  {
    id: "ds-02",
    category: "data-structures",
    question: "JavaScript의 Array는 실제로 어떻게 구현되어 있나요?",
    answer:
      "V8 엔진은 배열 내용에 따라 최적화합니다. 동일한 타입의 값으로 채워진 밀집 배열은 C++ 배열처럼 연속 메모리로 처리합니다(SMI Array, Double Array). 타입이 혼합되거나 중간에 빈 자리가 있는 희소 배열은 해시맵으로 처리합니다. 따라서 희소 배열을 만들거나 타입이 섞이면 성능이 급격히 저하될 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "ds-03",
    category: "data-structures",
    question: "Stack과 Queue를 설명하고 활용 사례를 말해주세요.",
    answer:
      "Stack은 LIFO 구조로, 가장 최근에 넣은 것을 먼저 꺼냅니다. 함수 호출 스택·Undo 기능·DFS에 활용됩니다. Queue는 FIFO 구조로, 먼저 넣은 것을 먼저 꺼냅니다. 이벤트 처리·BFS·프린터 스풀에 활용됩니다.",
  },
  {
    id: "ds-04",
    category: "data-structures",
    question: "해시 충돌이 무엇이고 어떻게 해결하나요?",
    answer:
      "서로 다른 키가 해시 함수에 의해 같은 인덱스로 매핑될 때 발생합니다. 주요 해결 방법은 두 가지입니다. Chaining은 같은 인덱스의 항목들을 연결 리스트로 연결하고, Open Addressing은 충돌 시 다른 빈 버킷을 탐색합니다. 충돌을 최소화하려면 좋은 해시 함수와 적절한 load factor 유지가 중요합니다.",
  },
  {
    id: "ds-05",
    category: "data-structures",
    question: "해시 테이블의 최악의 경우 시간 복잡도는?",
    answer:
      "모든 키가 같은 버킷에 매핑되면 O(n)이 됩니다. 악의적인 입력으로 의도적으로 충돌을 유발하는 Hash DoS 공격이 있습니다. 이를 방지하기 위해 Java 8 이상에서는 Chaining 연결 리스트가 8개 이상이 되면 레드-블랙 트리로 전환하여 최악의 경우 O(log n)을 보장합니다.",
    isAdvanced: true,
  },
  {
    id: "ds-06",
    category: "data-structures",
    question: "BST와 일반 이진 트리의 차이는?",
    answer:
      "일반 이진 트리는 각 노드가 최대 2개의 자식을 가지는 트리입니다. BST는 여기에 추가로 왼쪽 서브트리의 모든 값이 노드보다 작고, 오른쪽은 크다는 조건을 만족합니다. 이 특성으로 인해 이진 탐색이 가능하여 평균 O(log n)에 검색이 가능합니다. 단, 편향 트리가 되면 최악 O(n)이 됩니다.",
  },
  {
    id: "ds-07",
    category: "data-structures",
    question: "AVL Tree와 Red-Black Tree의 차이는?",
    answer:
      "AVL Tree는 좌우 서브트리 높이 차이를 1 이하로 유지하는 엄격한 균형 조건을 가집니다. 검색이 빠르지만 삽입/삭제 시 빈번한 회전이 발생합니다. Red-Black Tree는 노드 색상으로 더 느슨한 균형을 유지하여 삽입/삭제 시 회전이 적어 쓰기 성능이 우수합니다. 검색이 많으면 AVL, 삽입/삭제가 많으면 Red-Black Tree가 유리합니다.",
  },
  {
    id: "ds-08",
    category: "data-structures",
    question: "Heap은 어떻게 동작하나요?",
    answer:
      "Heap은 완전 이진 트리 형태로 부모가 자식보다 항상 크거나(Max Heap) 작은(Min Heap) 조건을 만족합니다. 배열로 구현하며 삽입 시 마지막에 추가 후 부모와 비교하며 올라가고(O(log n)), 최솟값/최댓값 추출 시 루트를 꺼내고 마지막 원소를 루트로 올린 후 내려가며 재정렬합니다(O(log n)). 우선순위 큐 구현에 적합합니다.",
  },
  {
    id: "ds-09",
    category: "data-structures",
    question: "DFS와 BFS의 차이는?",
    answer:
      "DFS는 스택(재귀)을 사용해 한 방향으로 최대한 깊이 탐색하고 막히면 되돌아옵니다. 경로 탐색·위상 정렬에 적합합니다. BFS는 큐를 사용해 시작점에서 가까운 노드부터 탐색합니다. 가중치 없는 그래프에서 최단 경로 탐색에 적합합니다. 시간 복잡도는 둘 다 O(V+E)이지만, BFS는 큐에 한 레벨의 노드를 저장해 메모리가 더 많이 필요할 수 있습니다.",
  },
  {
    id: "ds-10",
    category: "data-structures",
    question: "Trie란 무엇이고 어떤 상황에서 사용하나요?",
    answer:
      "Trie는 문자열을 문자 단위로 분해하여 트리에 저장하는 자료구조입니다. 공통 접두사를 공유하여 메모리를 절약하고, 문자열 길이 m에 대해 O(m)으로 삽입/검색/접두사 탐색이 가능합니다. 자동완성·맞춤법 검사·검색어 추천처럼 접두사 기반 탐색이 필요한 경우에 해시맵보다 효율적입니다.",
  },

  // ── 네트워크 ──────────────────────────────────────────────────────────────
  {
    id: "ds-11",
    category: "data-structures",
    question: "그래프를 인접 행렬과 인접 리스트로 표현할 때의 차이는?",
    answer:
      "인접 행렬은 V×V 2차원 배열로 두 정점 간 간선 존재 여부를 O(1)에 확인할 수 있습니다. 단, 공간이 O(V²)이어서 간선이 적은 희소 그래프에서 낭비가 큽니다. 인접 리스트는 각 정점의 이웃을 리스트로 저장하여 공간이 O(V+E)로 효율적이고 인접 정점 순회가 빠릅니다. 단, 두 정점 간 간선 확인이 O(V)입니다. 일반적으로 희소 그래프에는 인접 리스트, 밀집 그래프에는 인접 행렬이 적합합니다.",
  },
  {
    id: "ds-12",
    category: "data-structures",
    question: "JavaScript의 Map과 일반 객체({})의 차이는?",
    answer:
      "Map은 모든 타입의 값을 키로 사용할 수 있지만, 객체는 문자열과 Symbol만 가능합니다. Map은 삽입 순서가 보장되고 .size로 크기를 바로 얻을 수 있습니다. 객체는 프로토타입 체인으로 의도치 않은 키가 존재할 수 있어 프로토타입 오염 위험이 있지만, Map은 이런 문제가 없습니다. 빈번한 추가·삭제 시 Map이 성능상 유리하며, JSON 직렬화가 필요하거나 단순 정적 레코드에는 객체가 적합합니다.",
  },
  {
    id: "net-01",
    category: "network",
    question: "HTTP와 HTTPS의 차이는?",
    answer:
      "HTTPS는 HTTP에 TLS 레이어를 추가한 프로토콜입니다. 데이터를 암호화하여 도청을 방지하고, 메시지 인증 코드로 데이터 무결성을 보장하며, 디지털 인증서로 서버의 신원을 인증합니다. TLS 핸드셰이크 과정에서 비대칭키로 대칭키를 안전하게 교환하고, 이후 데이터는 대칭키로 빠르게 암호화하여 전송합니다.",
  },
  {
    id: "net-02",
    category: "network",
    question: "HTTP/1.1과 HTTP/2의 주요 차이는?",
    answer:
      "HTTP/2는 Multiplexing을 통해 하나의 TCP 연결에서 여러 요청/응답을 동시에 처리할 수 있습니다. HTTP/1.1의 Pipelining은 요청 순서대로 응답을 기다려야 하는 HOL Blocking 문제가 있었지만, HTTP/2는 요청을 독립적인 스트림으로 처리하여 이를 해결했습니다. 또한 헤더 압축(HPACK)과 Binary 프로토콜로 오버헤드를 줄였습니다.",
  },
  {
    id: "net-03",
    category: "network",
    question: "HTTP/3가 UDP를 사용하는 이유는?",
    answer:
      "HTTP/2가 TCP 레벨의 HOL Blocking을 여전히 겪었기 때문입니다. TCP는 패킷 손실 시 해당 패킷이 재전송될 때까지 모든 스트림이 대기합니다. HTTP/3는 UDP + QUIC을 사용하여 스트림별로 독립적인 흐름 제어를 구현해 이 문제를 완전히 해결했습니다. QUIC은 UDP 위에서 TCP의 신뢰성, TLS의 보안을 직접 구현합니다.",
    isAdvanced: true,
  },
  {
    id: "net-04",
    category: "network",
    question: "TCP와 UDP의 차이는? 각각 언제 사용하나요?",
    answer:
      "TCP는 연결 지향 프로토콜로 3-way handshake로 연결을 맺고 신뢰성 있는 데이터 전송을 보장합니다. 순서 보장·손실 재전송이 있어 HTTP·파일 전송에 적합합니다. UDP는 비연결 프로토콜로 신뢰성 보장 없이 빠르게 전송합니다. 실시간성이 중요하고 일부 손실을 허용할 수 있는 스트리밍·VoIP·게임에 적합합니다.",
  },
  {
    id: "net-05",
    category: "network",
    question: "TCP 3-way handshake를 설명해주세요.",
    answer:
      "클라이언트가 SYN 패킷을 보내면(1), 서버가 SYN+ACK로 응답하고(2), 클라이언트가 ACK를 보내면(3) 연결이 수립됩니다. 이 과정에서 양측의 초기 시퀀스 번호를 교환하고, 서로 데이터 수신 준비가 됐음을 확인합니다. 3번의 패킷 교환으로 양방향 통신 가능 여부를 최소 비용으로 확인할 수 있습니다.",
  },
  {
    id: "net-06",
    category: "network",
    question: "4-way handshake에서 TIME_WAIT가 존재하는 이유는?",
    answer:
      "두 가지 이유입니다. 첫째, 클라이언트가 보낸 마지막 ACK가 손실될 경우 서버가 FIN을 재전송하는데, TIME_WAIT 동안 대기하며 이를 처리할 수 있습니다. 둘째, 이전 연결에서 지연된 패킷이 새 연결(같은 포트)에 도달하는 것을 방지합니다. MSL(최대 세그먼트 수명)의 2배 동안 대기하여 이전 연결의 모든 패킷이 소멸했음을 보장합니다.",
    isAdvanced: true,
  },
  {
    id: "net-07",
    category: "network",
    question: "HTTPS에서 TLS 핸드셰이크가 어떻게 이루어지나요?",
    answer:
      "TLS 1.3 기준으로, 클라이언트가 지원하는 암호 스위트와 DH 키 교환 파라미터를 보내면, 서버가 선택한 암호 스위트와 인증서·DH 파라미터를 응답합니다. 양측이 DH를 통해 공유 비밀(대칭키)을 생성하고 이후 통신을 암호화합니다. TLS 1.3은 기존 1.2의 2-RTT를 1-RTT로 줄였습니다.",
    isAdvanced: true,
  },
  {
    id: "net-08",
    category: "network",
    question: "REST API란?",
    answer:
      "REST는 HTTP 프로토콜을 기반으로 자원을 URI로 표현하고 HTTP 메서드(GET·POST·PUT·DELETE)로 자원에 대한 행위를 정의하는 아키텍처 스타일입니다. Stateless(무상태성)·Client-Server 분리·Cacheable·Uniform Interface 등의 제약 조건을 따릅니다.",
  },
  {
    id: "net-09",
    category: "network",
    question: "PUT과 PATCH의 차이는?",
    answer:
      "PUT은 리소스 전체를 대체합니다. 보내지 않은 필드는 null이나 기본값으로 초기화됩니다. PATCH는 리소스의 일부만 수정합니다. 보낸 필드만 변경됩니다. PUT은 멱등성을 보장하지만 PATCH는 구현에 따라 다릅니다.",
  },
  {
    id: "net-10",
    category: "network",
    question: "CORS란 무엇인가요?",
    answer:
      "CORS(Cross-Origin Resource Sharing)는 브라우저의 Same-Origin Policy를 완화하여 다른 출처의 리소스를 요청할 수 있도록 서버가 허용 여부를 선언하는 메커니즘입니다. 브라우저는 다른 출처로 요청 시 Origin 헤더를 포함하고, 서버의 Access-Control-Allow-Origin 응답 헤더를 확인하여 허용 여부를 결정합니다. Preflight Request를 통해 실제 요청 전 사전 허가를 받습니다.",
  },
  {
    id: "net-11",
    category: "network",
    question: "CORS는 보안 문제를 완전히 해결하나요?",
    answer:
      "아니오. CORS는 브라우저 레벨의 정책으로, 브라우저가 없는 환경(curl·Postman·서버 간 통신)에서는 적용되지 않습니다. CORS를 우회하는 CSRF 같은 공격도 존재합니다. 완전한 보안을 위해서는 CORS 외에도 CSRF 토큰·SameSite 쿠키·CSP(Content Security Policy) 등을 함께 사용해야 합니다.",
    isAdvanced: true,
  },
  {
    id: "net-12",
    category: "network",
    question: "쿠키와 세션의 차이는?",
    answer:
      "쿠키는 브라우저에, 세션은 서버에 데이터를 저장합니다. 세션 기반 인증에서 쿠키는 서버의 세션 ID를 저장하는 역할만 합니다. 쿠키는 클라이언트에 저장되어 보안에 취약할 수 있지만, HttpOnly와 Secure 속성으로 보완합니다. 세션은 서버 메모리를 사용하므로 확장성 문제가 있을 수 있습니다.",
  },
  {
    id: "net-13",
    category: "network",
    question: "JWT의 장단점은?",
    answer:
      "장점: 서버에 상태를 저장하지 않아 수평 확장이 쉽고, 토큰 자체에 사용자 정보가 담겨 DB 조회 없이 인증이 가능합니다. 단점: 토큰이 탈취되면 만료 전까지 무효화할 수 없습니다. Payload는 Base64 인코딩만 되어 있어 암호화가 아니므로 민감한 정보를 담으면 안 됩니다. 이를 위해 짧은 수명의 Access Token과 Refresh Token을 함께 사용하는 전략을 씁니다.",
  },
  {
    id: "net-14",
    category: "network",
    question: "브라우저에서 DNS 조회는 어떻게 이루어지나요?",
    answer:
      "브라우저 캐시 → OS 캐시 → hosts 파일 → ISP의 재귀 DNS 리졸버 순으로 확인합니다. 재귀 리졸버는 루트 네임서버 → TLD 서버(.com) → 권한 네임서버 순으로 질의하여 최종 IP 주소를 얻습니다. 결과는 TTL 동안 캐시되며, 이 과정이 첫 연결의 지연 원인 중 하나입니다.",
  },
  {
    id: "net-15",
    category: "network",
    question: "브라우저 주소창에 URL을 입력하면 어떤 일이 일어나나요?",
    answer:
      "URL 파싱 후 DNS로 IP를 조회하고, TCP 연결과 TLS 핸드셰이크를 거쳐 서버에 HTTP 요청을 보냅니다. 서버로부터 HTML을 받으면 파싱하여 DOM 트리를, CSS를 파싱하여 CSSOM 트리를 만듭니다. 두 트리를 합쳐 Render Tree를 구성하고, Layout → Paint → Composite 단계를 거쳐 화면에 렌더링됩니다.",
  },
  {
    id: "net-16",
    category: "network",
    question: "HTTP 캐싱의 ETag는 어떻게 동작하나요?",
    answer:
      "서버는 응답에 ETag 헤더로 리소스의 버전 식별자(보통 컨텐츠 해시)를 보냅니다. 이후 클라이언트가 같은 리소스를 요청할 때 If-None-Match 헤더에 저장된 ETag를 포함합니다. 서버는 현재 리소스의 ETag와 비교하여 변경이 없으면 304 Not Modified를 응답(본문 없음)하고, 변경됐으면 200 OK와 새 ETag를 응답합니다.",
  },
  {
    id: "net-18",
    category: "network",
    question: "XSS 공격이란? 어떻게 방어하나요?",
    answer:
      "XSS(Cross-Site Scripting)는 공격자가 악성 스크립트를 웹 페이지에 삽입하여 다른 사용자의 브라우저에서 실행되게 하는 공격입니다. 방어 방법: 사용자 입력을 HTML 인코딩하여 출력, Content Security Policy(CSP) 헤더로 스크립트 실행 출처 제한, HttpOnly 쿠키로 JS에서 쿠키 접근 차단, innerHTML 대신 textContent 사용이 있습니다.",
  },
  {
    id: "net-17",
    category: "network",
    question: "웹소켓(WebSocket)·SSE·Long Polling의 차이는?",
    answer:
      "Long Polling은 서버가 데이터가 있을 때까지 응답을 보류하는 방식으로 HTTP 기반 단방향이며 오버헤드가 큽니다. SSE는 HTTP 기반 서버→클라이언트 단방향 스트리밍으로 자동 재연결을 지원합니다. WebSocket은 클라이언트↔서버 양방향 실시간 통신으로 연결 수립 후 낮은 오버헤드로 프레임만 전송합니다. 채팅·실시간 게임에는 WebSocket, 알림·피드에는 SSE가 적합합니다.",
  },

  // ── JavaScript ────────────────────────────────────────────────────────────
  {
    id: "net-19",
    category: "network",
    question: "주요 HTTP 상태 코드를 설명해주세요.",
    answer:
      "2xx(성공): 200 OK, 201 Created(리소스 생성), 204 No Content(응답 본문 없음). 3xx(리다이렉트): 301 Moved Permanently(영구), 302 Found(임시), 304 Not Modified(캐시 유효). 4xx(클라이언트 오류): 400 Bad Request, 401 Unauthorized(인증 필요), 403 Forbidden(권한 없음), 404 Not Found, 429 Too Many Requests. 5xx(서버 오류): 500 Internal Server Error, 502 Bad Gateway. 401은 인증(로그인 여부), 403은 인가(권한) 문제로 구분하는 것이 중요합니다.",
  },
  {
    id: "net-20",
    category: "network",
    question:
      "HTTP 메서드의 멱등성(Idempotency)과 안전성(Safety)을 비교하세요.",
    answer:
      "안전성은 리소스를 변경하지 않음을 의미하고, 멱등성은 동일한 요청을 여러 번 보내도 결과가 같음을 의미합니다. GET은 안전·멱등, POST는 비안전·비멱등(매번 새 리소스 생성 가능), PUT은 비안전·멱등(전체 교체, 반복해도 같은 결과), PATCH는 비안전·비멱등(구현에 따라 다름), DELETE는 비안전·멱등(이미 삭제된 자원을 다시 삭제해도 결과 동일)입니다.",
  },
  {
    id: "net-21",
    category: "network",
    question: "CDN이란 무엇이고 어떤 이점이 있나요?",
    answer:
      "CDN(Content Delivery Network)은 전 세계에 분산된 엣지 서버로 정적 콘텐츠를 사용자와 가까운 위치에서 제공하는 인프라입니다. DNS 기반으로 가장 가까운 엣지 서버로 라우팅되며, 캐시 히트 시 즉시 응답하고 미스 시 Origin 서버에서 가져와 캐싱합니다. 이점: 사용자와 물리적으로 가까워 지연 감소, Origin 서버 부하 감소, 분산 네트워크로 DDoS 공격 흡수, 여러 엣지 서버로 가용성 향상.",
  },
  {
    id: "net-22",
    category: "network",
    question:
      "CSP(Content Security Policy)란 무엇이고 XSS를 어떻게 방어하나요?",
    answer:
      "CSP는 HTTP 응답 헤더(Content-Security-Policy)를 통해 브라우저가 허용된 출처의 리소스만 로드·실행하도록 지시하는 보안 정책입니다. `script-src 'self'`와 같이 설정하면 인라인 스크립트와 외부 출처 스크립트를 차단하여, 공격자가 악성 스크립트를 주입해도 브라우저가 실행을 거부합니다. 입력 검증·출력 인코딩에 이은 마지막 방어선 역할을 하며, nonce나 hash를 이용해 허용된 인라인 스크립트만 실행할 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "js-01",
    category: "javascript",
    question: "실행 컨텍스트(Execution Context)란 무엇인가요?",
    answer:
      "자바스크립트 코드가 실행되는 환경을 나타내는 추상적인 개념입니다. 변수·함수 선언·this 바인딩 등의 정보를 담고 있으며, 코드 실행 시 콜 스택에 쌓이고 실행이 완료되면 제거됩니다. 전역 컨텍스트·함수 컨텍스트·eval 컨텍스트 세 종류가 있습니다.",
  },
  {
    id: "js-02",
    category: "javascript",
    question: "렉시컬 스코프(Lexical Scope)란?",
    answer:
      "함수가 호출된 위치가 아닌, 정의된 위치에 따라 상위 스코프가 결정되는 방식입니다. JS는 렉시컬 스코프를 따르기 때문에 함수를 어디서 호출하든 스코프 체인은 항상 함수가 작성된 위치 기준으로 동작합니다.",
  },
  {
    id: "js-03",
    category: "javascript",
    question:
      "`var`와 `let`의 스코프 차이를 실행 컨텍스트 관점에서 설명하세요.",
    answer:
      "`var`는 VariableEnvironment에 등록되어 함수 스코프를 가집니다. `let`/`const`는 LexicalEnvironment에 등록되어 블록 스코프를 가집니다. 또한 `var`는 Creation Phase에서 `undefined`로 초기화되어 호이스팅이 일어나지만, `let`/`const`는 TDZ 상태로 선언만 되고 초기화되지 않아 선언 전 접근 시 ReferenceError가 발생합니다.",
    isAdvanced: true,
  },
  {
    id: "js-04",
    category: "javascript",
    question: "클로저(Closure)란 무엇인가요?",
    answer:
      "클로저는 함수가 자신이 선언된 렉시컬 환경을 기억하여, 외부 함수의 실행이 끝난 후에도 외부 스코프의 변수에 접근할 수 있는 함수입니다. 내부 함수가 외부 함수의 변수를 참조하고 있으면, 외부 함수의 실행 컨텍스트가 콜 스택에서 제거되어도 해당 변수는 GC되지 않습니다.",
  },
  {
    id: "js-05",
    category: "javascript",
    question: "클로저로 인한 메모리 누수는 어떻게 발생하고 방지하나요?",
    answer:
      "클로저가 더 이상 필요하지 않은데도 외부 변수를 계속 참조하면 GC가 해당 변수를 수거하지 못해 메모리 누수가 발생합니다. 이벤트 리스너나 타이머에서 클로저를 사용할 때 특히 주의해야 하며, 더 이상 필요하지 않은 경우 `removeEventListener`로 리스너를 제거하거나, 변수에 `null`을 할당해 참조를 끊어야 합니다.",
    isAdvanced: true,
  },
  {
    id: "js-06",
    category: "javascript",
    question: "호이스팅(Hoisting)이란?",
    answer:
      "JS 엔진이 코드 실행 전 Creation Phase에서 변수와 함수 선언을 먼저 메모리에 등록하는 동작입니다. `var`는 `undefined`로 초기화되고, `let`/`const`는 TDZ 상태로 있어 선언 전 접근 시 ReferenceError가 발생합니다. 함수 선언문은 함수 객체 전체가 호이스팅됩니다.",
  },
  {
    id: "js-07",
    category: "javascript",
    question: "TDZ(Temporal Dead Zone)가 존재하는 이유는?",
    answer:
      "`var`의 호이스팅은 예측하기 어려운 버그를 유발합니다. `let`/`const`에 TDZ를 도입함으로써 선언 전 변수 사용을 런타임 에러로 잡아내어 코드의 예측 가능성을 높입니다. 또한 `const`의 경우 선언과 동시에 반드시 초기화해야 한다는 의미론을 강화합니다.",
    isAdvanced: true,
  },
  {
    id: "js-08",
    category: "javascript",
    question: "자바스크립트가 싱글 스레드임에도 비동기 처리가 가능한 이유는?",
    answer:
      "JS 엔진 자체는 싱글 스레드이지만, 브라우저나 Node.js 런타임이 Web APIs / libuv 같은 별도의 스레드 풀을 제공합니다. 비동기 작업은 런타임에 위임되고, 완료되면 콜백이 Task Queue나 Microtask Queue에 추가됩니다. 이벤트 루프가 콜 스택이 비어있을 때 큐에서 콜백을 꺼내 실행하는 방식으로 비동기를 처리합니다.",
  },
  {
    id: "js-09",
    category: "javascript",
    question: "Microtask와 Macrotask의 차이는?",
    answer:
      "Microtask(Promise.then, queueMicrotask)는 현재 작업이 끝난 직후 렌더링 전에 모두 처리됩니다. Macrotask(setTimeout, setInterval)는 Microtask Queue가 완전히 비워진 후 한 번에 하나씩 처리됩니다. 따라서 Microtask가 항상 Macrotask보다 먼저 실행됩니다.",
  },
  {
    id: "js-10",
    category: "javascript",
    question: "`setTimeout(fn, 0)`이 즉시 실행되지 않는 이유는?",
    answer:
      "setTimeout은 최소 지연 시간을 보장하지만, 실제 실행은 이벤트 루프의 Task Queue 순서에 따릅니다. 현재 콜 스택이 모두 비워지고 Microtask Queue까지 처리된 후에야 Task Queue에서 꺼내 실행됩니다. 또한 브라우저 스펙상 최소 1ms(중첩 시 4ms)의 딜레이가 강제됩니다.",
    isAdvanced: true,
  },
  {
    id: "js-11",
    category: "javascript",
    question: "async/await와 Promise의 차이는?",
    answer:
      "async/await은 Promise 기반의 문법적 설탕입니다. Promise 체이닝을 동기 코드처럼 읽히게 해주어 가독성이 좋고, try/catch로 에러 처리가 가능합니다. 내부적으로 async 함수는 항상 Promise를 반환하고, await은 Promise가 settled될 때까지 해당 함수의 실행을 일시 중단합니다.",
  },
  {
    id: "js-11b",
    category: "javascript",
    question: "Promise와 콜백의 차이는? Promise가 해결하는 문제는?",
    answer:
      "콜백 방식은 중첩이 깊어질수록 '콜백 지옥'이 발생하고 에러 처리가 분산되는 문제가 있습니다. Promise는 체이닝으로 비동기 흐름을 선형으로 표현하고, catch로 에러를 한 곳에서 처리할 수 있습니다. 또한 Promise는 한 번 settled되면 상태가 변하지 않는(immutable) 특성으로 신뢰성이 높습니다.",
    isAdvanced: true,
  },
  {
    id: "js-12",
    category: "javascript",
    question: "`await Promise.all([...])`과 순차 `await`의 성능 차이는?",
    answer:
      "순차 `await`은 각 비동기 작업이 완료된 후 다음 작업을 시작하므로 총 시간이 각 작업 시간의 합입니다. `Promise.all`은 모든 작업을 동시에 시작하므로 총 시간이 가장 오래 걸리는 작업 하나의 시간입니다. 독립적인 비동기 작업은 항상 `Promise.all`로 병렬 처리해야 합니다.",
    isAdvanced: true,
  },
  {
    id: "js-13",
    category: "javascript",
    question: "프로토타입 체인이란?",
    answer:
      "객체에서 프로퍼티나 메서드를 찾을 때 현재 객체에 없으면 [[Prototype]] 링크를 따라 상위 프로토타입에서 찾고, 없으면 계속 올라가 Object.prototype까지 탐색하는 메커니즘입니다. 최상위인 Object.prototype의 [[Prototype]]은 null입니다.",
  },
  {
    id: "js-13b",
    category: "javascript",
    question: "`Object.create(null)`로 만든 객체의 특징은?",
    answer:
      "`Object.create(null)`은 프로토타입이 null인 객체를 만듭니다. Object.prototype의 메서드(toString, hasOwnProperty 등)가 없어서 순수한 해시맵으로 사용하기 적합합니다. 프로토타입 오염 공격(Prototype Pollution)을 방지하는 데도 사용됩니다.",
    isAdvanced: true,
  },
  {
    id: "js-14",
    category: "javascript",
    question: "화살표 함수와 일반 함수의 `this` 차이는?",
    answer:
      "일반 함수는 호출 방식에 따라 this가 동적으로 결정됩니다. 화살표 함수는 자체 this 바인딩이 없고, 선언된 위치의 외부 스코프 this를 렉시컬하게 캡처합니다. 따라서 화살표 함수는 call/apply/bind로 this를 변경할 수 없습니다.",
  },
  {
    id: "js-15",
    category: "javascript",
    question: "자바스크립트 메모리 누수를 어떻게 감지하고 해결하나요?",
    answer:
      "Chrome DevTools의 Memory 탭에서 힙 스냅샷을 찍거나 Allocation Timeline을 통해 메모리 증가를 추적할 수 있습니다. 주요 원인은 이벤트 리스너 미제거·해제되지 않은 타이머·클로저에 의한 과도한 참조입니다. 해결책은 불필요한 이벤트 리스너 제거·타이머 정리·WeakMap/WeakRef 사용입니다.",
    isAdvanced: true,
  },
  {
    id: "js-16",
    category: "javascript",
    question: "CommonJS(CJS)와 ES Modules(ESM)의 차이는?",
    answer:
      "CJS는 Node.js에서 사용하는 동기적 모듈 시스템으로, 런타임에 동적으로 로드합니다. ESM은 브라우저 표준으로, 파싱 단계에서 정적으로 분석되어 트리 쉐이킹과 코드 최적화가 가능합니다. ESM은 Live Binding을 지원하여 export된 값이 변경되면 import한 쪽에도 반영됩니다.",
  },
  {
    id: "js-17",
    category: "javascript",
    question: "`==`와 `===`의 차이는?",
    answer:
      "`==`는 타입이 다를 경우 암묵적 타입 변환을 수행한 후 비교하는 느슨한 동등 연산자입니다. `===`는 타입 변환 없이 값과 타입이 모두 같아야 true를 반환하는 엄격한 동등 연산자입니다. 예측 불가능한 버그를 방지하기 위해 항상 `===` 사용을 권장합니다.",
  },
  {
    id: "js-18",
    category: "javascript",
    question: "Map과 WeakMap의 차이는?",
    answer:
      "Map은 키를 강한 참조로 유지하여 GC되지 않지만, WeakMap은 키 객체를 약한 참조로 유지하여 다른 참조가 없으면 GC될 수 있습니다. WeakMap은 이터러블이 아니라 열거할 수 없으며, 키는 반드시 객체여야 합니다. DOM 노드나 외부 라이브러리 객체에 부가 데이터를 연결할 때 메모리 누수 없이 사용할 수 있습니다.",
  },
  {
    id: "js-19",
    category: "javascript",
    question: "Generator가 async/await의 기반이 되는 이유는?",
    answer:
      "Generator는 yield로 실행을 중단하고 외부에서 값을 주입받아 재개할 수 있습니다. 비동기 작업의 완료를 기다리는 동안 실행을 멈추고, 완료 후 결과값을 주입받아 재개하는 async/await의 동작과 동일한 원리입니다. Babel은 async/await을 Generator 기반으로 트랜스파일합니다.",
    isAdvanced: true,
  },
  {
    id: "js-20",
    category: "javascript",
    question: "Proxy와 Object.defineProperty의 차이는?",
    answer:
      "Object.defineProperty는 특정 프로퍼티 하나에만 getter/setter를 정의할 수 있어, 동적으로 추가된 프로퍼티나 배열 인덱스 변경을 감지할 수 없습니다. Proxy는 객체 전체를 가로채는 트랩을 설정하므로 모든 프로퍼티 접근을 감지하고, 13가지 트랩을 통해 다양한 동작을 커스터마이징할 수 있습니다. Vue 3·MobX 등이 Proxy 기반 반응성 시스템으로 마이그레이션한 이유입니다.",
    isAdvanced: true,
  },

  // ── React ─────────────────────────────────────────────────────────────────
  {
    id: "js-21",
    category: "javascript",
    question: "V8의 가비지 컬렉션 방식을 설명해주세요.",
    answer:
      "V8은 세대별 GC를 사용합니다. Young Generation(New Space)은 새로 생성된 객체를 관리하며 Scavenger 알고리즘(살아남은 객체를 To Space로 복사)으로 빈번하게 수거합니다. 여러 번 살아남은 객체는 Old Generation으로 승격됩니다. Old Generation은 Mark & Sweep + Compact로 처리합니다. Mark 단계에서 GC 루트에서 도달 가능한 객체를 마킹하고, Sweep에서 마킹되지 않은 객체를 해제하며, Compact에서 단편화를 줄입니다. 짧게 사는 객체가 많다는 세대 가설을 활용한 최적화입니다.",
    isAdvanced: true,
  },
  {
    id: "js-22",
    category: "javascript",
    question:
      "Promise.all, Promise.allSettled, Promise.race, Promise.any의 차이는?",
    answer:
      "Promise.all은 모든 Promise가 fulfilled되면 resolve, 하나라도 reject되면 즉시 reject합니다. 모두 성공해야 할 때 사용합니다. Promise.allSettled는 성공·실패 무관하게 모두 완료될 때까지 기다리며 {status, value/reason} 배열을 반환합니다. Promise.race는 가장 먼저 settled(성공·실패 무관)되는 결과를 반환하며 타임아웃 구현에 활용합니다. Promise.any는 가장 먼저 fulfilled되는 결과를 반환하며, 모두 reject되면 AggregateError를 throw합니다.",
  },
  {
    id: "react-01",
    category: "react",
    question: "Virtual DOM이란 무엇이고, 왜 사용하나요?",
    answer:
      "Virtual DOM은 실제 DOM 트리를 메모리에 복사한 JS 객체 트리입니다. React는 상태 변경 시 새 Virtual DOM을 생성하고, 이전 Virtual DOM과 Diffing 알고리즘으로 비교하여 변경된 부분만 실제 DOM에 적용합니다. 이를 통해 불필요한 DOM 조작을 최소화하고 성능을 최적화합니다.",
  },
  {
    id: "react-02",
    category: "react",
    question:
      "Virtual DOM이 항상 빠른 것은 아닌데, 왜 React는 이를 사용하나요?",
    answer:
      "Virtual DOM 자체가 목적이 아니라, 선언적 UI 작성을 가능하게 하면서도 충분한 성능을 보장하는 수단입니다. 개발자가 '어떻게 DOM을 변경할지'가 아닌 '상태에 따라 UI가 어떻게 보여야 하는지'를 선언하면, React가 최적화된 DOM 업데이트를 알아서 처리합니다. Svelte처럼 Virtual DOM 없이 컴파일 타임에 최적화하는 방식도 있습니다.",
    isAdvanced: true,
  },
  {
    id: "react-03",
    category: "react",
    question: "React Fiber란 무엇인가요?",
    answer:
      "React Fiber는 React 16에서 도입된 새로운 재조정 엔진입니다. 기존의 재귀적 스택 기반 재조정은 중단이 불가능해 복잡한 UI에서 프레임 드롭이 발생했습니다. Fiber는 렌더링 작업을 작은 단위(Fiber Node)로 분할하여, 브라우저의 유휴 시간에 분산 처리하고 높은 우선순위 작업(사용자 입력 등)이 있으면 작업을 중단하고 양보할 수 있습니다.",
  },
  {
    id: "react-04",
    category: "react",
    question: "Fiber 트리의 linked list 구조가 왜 재귀보다 유리한가요?",
    answer:
      "재귀는 콜 스택을 사용하기 때문에 중간에 중단할 수 없습니다. Fiber는 child/sibling/return 포인터로 구성된 linked list로 트리를 표현하여, 현재 처리 중인 Fiber Node의 참조만 변수에 저장하면 언제든 작업을 중단하고 나중에 이어서 진행할 수 있습니다. 이것이 Concurrent Mode의 핵심 기반입니다.",
    isAdvanced: true,
  },
  {
    id: "react-04b",
    category: "react",
    question: "React의 Scheduler는 어떻게 작업 우선순위를 관리하나요?",
    answer:
      "Scheduler는 작업을 5가지 우선순위 레인(Lane)으로 분류합니다: Immediate(동기)·UserBlocking(클릭·입력)·Normal(일반 업데이트)·Low(데이터 패칭)·Idle(사용자에게 보이지 않는 작업). requestIdleCallback 폴리필을 사용해 브라우저 렌더링 사이 유휴 시간에 낮은 우선순위 작업을 처리하고, 높은 우선순위 작업이 오면 현재 작업을 중단합니다.",
    isAdvanced: true,
  },
  {
    id: "react-05",
    category: "react",
    question: "JSX는 어떻게 처리되나요?",
    answer:
      "JSX는 Babel에 의해 `React.createElement()` 호출(또는 React 17+에서는 `jsx()`)로 변환됩니다. 이 함수는 React Element라는 순수 JS 객체를 반환합니다. 이후 React의 Reconciler가 이 객체를 기반으로 Fiber Node를 생성하고, Diffing을 통해 변경된 부분을 실제 DOM에 반영합니다.",
  },
  {
    id: "react-05b",
    category: "react",
    question: "React Element의 `$$typeof` 필드가 존재하는 이유는?",
    answer:
      "XSS 방어를 위해서입니다. Symbol은 JSON에 직렬화되지 않으므로, 서버로부터 받은 악성 JSON 데이터가 React Element인 척 렌더링되는 것을 방지합니다. React는 `$$typeof`가 `Symbol(react.element)`가 아닌 객체를 Element로 인식하지 않습니다.",
    isAdvanced: true,
  },
  {
    id: "react-06",
    category: "react",
    question: "React의 Diffing 알고리즘을 설명해주세요.",
    answer:
      "React의 Reconciliation은 두 가지 휴리스틱으로 O(n) 성능을 달성합니다. 첫째, 엘리먼트 타입이 다르면 이전 서브트리 전체를 제거하고 새로 생성합니다. 둘째, 같은 타입이면 변경된 속성만 업데이트합니다. 리스트에서는 key prop을 이용해 어떤 항목이 변경/추가/삭제되었는지 효율적으로 파악합니다.",
  },
  {
    id: "react-07",
    category: "react",
    question: "key로 index를 사용하면 안 되는 이유는?",
    answer:
      "리스트 항목의 순서가 변경되거나 중간에 삽입/삭제 시, index가 key라면 React는 동일한 key(=index)의 컴포넌트가 이전과 같다고 판단합니다. 하지만 실제로는 다른 데이터가 들어온 것이므로 불필요한 업데이트가 발생하거나, input 같은 DOM 상태가 잘못된 항목에 남아 버그가 생깁니다. 고유하고 안정적인 ID를 key로 사용해야 합니다.",
  },
  {
    id: "react-07b",
    category: "react",
    question:
      "key가 컴포넌트를 강제로 재마운트시키는 방법으로 사용될 수 있는 이유는?",
    answer:
      "React는 key가 변경되면 같은 타입의 컴포넌트라도 다른 인스턴스로 취급하여 언마운트 후 새로 마운트합니다. 이 특성을 이용해 `key={userId}` 처럼 사용하면 userId가 변경될 때 컴포넌트를 완전히 초기화(state 포함)할 수 있습니다. 불필요한 useEffect 의존성 배열을 복잡하게 관리하는 것보다 의도적으로 key를 변경하는 것이 더 명확한 경우도 있습니다.",
    isAdvanced: true,
  },
  {
    id: "react-08",
    category: "react",
    question:
      "React의 렌더링 과정을 단계별로 설명해주세요. (Render Phase & Commit Phase)",
    answer:
      "React 렌더링은 크게 Render Phase와 Commit Phase로 나뉩니다. Render Phase는 변경사항을 계산하는 순수 계산 단계로 DOM을 건드리지 않고 중단이 가능합니다. Commit Phase는 계산된 변경사항을 실제 DOM에 적용하는 단계로 동기적으로 처리됩니다. Commit Phase는 Before Mutation·Mutation·Layout 세 서브페이즈로 구성됩니다.",
  },
  {
    id: "react-09",
    category: "react",
    question: "Hooks는 왜 최상위 레벨에서만 호출해야 하나요?",
    answer:
      "React는 Hook을 이름이 아닌 호출 순서(링크드 리스트 인덱스)로 관리합니다. 조건문이나 반복문 안에서 Hook을 호출하면 렌더링마다 순서가 달라져 이전 렌더링의 상태와 현재 렌더링의 상태가 뒤섞여 버그가 발생합니다.",
  },
  {
    id: "react-10",
    category: "react",
    question: "useState의 setState는 왜 비동기처럼 동작하나요?",
    answer:
      "setState를 호출해도 즉시 상태가 변경되지 않고, Fiber의 업데이트 큐에 등록된 후 다음 렌더링 사이클에서 처리됩니다. React 18의 Automatic Batching으로 이벤트 핸들러·setTimeout·Promise 등 어디서 호출해도 여러 setState가 하나로 배치 처리됩니다. 즉각적인 상태값이 필요하다면 함수형 업데이트(`setState(prev => prev + 1)`)를 사용해야 합니다.",
    isAdvanced: true,
  },
  {
    id: "react-11",
    category: "react",
    question: "useEffect와 useLayoutEffect의 차이는?",
    answer:
      "useEffect는 브라우저가 Paint한 후 비동기로 실행되어 렌더링을 차단하지 않습니다. useLayoutEffect는 DOM 업데이트 직후 Paint 이전에 동기로 실행됩니다. DOM 측정이 필요하거나 시각적 깜빡임을 방지해야 할 때 useLayoutEffect를 사용하고, 그 외 대부분은 useEffect를 사용합니다.",
  },
  {
    id: "react-12",
    category: "react",
    question: "Concurrent Mode란 무엇인가요?",
    answer:
      "Concurrent Mode는 React 18에서 도입된 렌더링 모드로, 렌더링 작업을 중단하고 우선순위 높은 작업(사용자 입력·애니메이션)을 먼저 처리할 수 있게 합니다. startTransition으로 덜 급한 업데이트를 표시하면 React가 이를 중단 가능한 작업으로 처리하여 UI 반응성을 유지합니다.",
  },
  {
    id: "react-13",
    category: "react",
    question: "Suspense의 내부 동작 원리를 설명해주세요.",
    answer:
      "Suspense는 React의 에러 경계(Error Boundary)와 유사한 메커니즘으로 동작합니다. 데이터가 준비되지 않은 컴포넌트가 Promise를 throw하면, 가장 가까운 Suspense boundary가 이를 캐치하여 fallback을 렌더링합니다. Promise가 resolve되면 Suspense는 해당 컴포넌트의 렌더링을 재시도합니다.",
    isAdvanced: true,
  },
  {
    id: "react-14",
    category: "react",
    question: "Server Component와 Client Component의 차이는?",
    answer:
      "Server Component는 서버에서만 실행되어 DB 직접 접근이 가능하고 JS 번들에 포함되지 않아 번들 크기를 줄일 수 있습니다. 대신 상태관리와 이벤트 핸들러를 사용할 수 없습니다. Client Component는 'use client' 지시어로 선언하며 브라우저에서 실행되어 인터랙티브한 UI를 구현합니다. Next.js App Router에서는 기본적으로 모든 컴포넌트가 Server Component입니다.",
  },
  {
    id: "react-15",
    category: "react",
    question: "Hydration이란 무엇인가요?",
    answer:
      "SSR로 생성된 정적 HTML에 이벤트 핸들러와 동적 기능을 연결하는 과정입니다. 클라이언트에서 React가 초기화될 때, 서버에서 받은 HTML과 Virtual DOM을 비교하여 기존 DOM 노드를 재사용하면서 이벤트 리스너를 연결합니다. 이를 통해 초기 페이지 표시는 빠르게 하면서 인터랙션도 가능하게 합니다.",
  },
  {
    id: "react-16",
    category: "react",
    question: "Hydration Mismatch는 왜 발생하고 어떻게 해결하나요?",
    answer:
      "서버와 클라이언트의 렌더링 결과가 다를 때 발생합니다. 주요 원인은 서버에서 undefined인 `window` 객체 접근·시간/랜덤 값 사용·브라우저 쿠키 기반 조건부 렌더링입니다. 해결책으로는 `useEffect` 내에서 클라이언트 전용 로직 실행, `suppressHydrationWarning` prop 사용, `dynamic(() => import(...), { ssr: false })`로 클라이언트 전용 컴포넌트 처리가 있습니다.",
    isAdvanced: true,
  },
  {
    id: "react-17",
    category: "react",
    question: "React 18의 주요 변경사항은?",
    answer:
      "주요 변경사항은 세 가지입니다. 첫째, Automatic Batching으로 이벤트 핸들러 밖(setTimeout·Promise)에서도 setState가 배치 처리됩니다. 둘째, createRoot API 도입으로 Concurrent Mode가 활성화됩니다. 셋째, startTransition·useDeferredValue·useId 등 Concurrent 관련 API가 추가되어 UI 반응성을 세밀하게 제어할 수 있습니다.",
  },
  {
    id: "react-18",
    category: "react",
    question: "useMemo와 useCallback의 차이는?",
    answer:
      "useMemo는 계산된 값을 메모이제이션하고, useCallback은 함수를 메모이제이션합니다. useCallback(fn, deps)은 useMemo(() => fn, deps)와 동일합니다. 주로 useCallback은 자식 컴포넌트에 함수를 prop으로 전달할 때 불필요한 리렌더링을 막기 위해 사용합니다.",
  },
  {
    id: "react-19",
    category: "react",
    question: "모든 컴포넌트에 React.memo를 사용하면 좋지 않은 이유는?",
    answer:
      "React.memo는 props 비교 비용이 발생합니다. 컴포넌트가 가볍거나 props가 자주 바뀐다면 비교 비용이 렌더링 비용보다 클 수 있습니다. 또한 props에 객체/배열이 있으면 참조가 매번 새로 생성되어 memo가 효과가 없고, 이를 위해 useMemo/useCallback까지 추가하면 코드 복잡도가 증가합니다. 실제로 성능 문제가 생긴 후 적용하는 것이 원칙입니다.",
    isAdvanced: true,
  },
  {
    id: "react-20",
    category: "react",
    question: "Context API 사용 시 성능 문제가 생기는 이유와 해결책은?",
    answer:
      "Provider의 value가 변경되면 해당 Context를 구독하는 모든 컴포넌트가 리렌더링됩니다. 하나의 Context에 여러 상태를 묶으면 관련 없는 상태 변경에도 모든 구독자가 리렌더링됩니다. 해결책은 Context를 목적별로 분리하거나, value를 useMemo로 메모이제이션하는 것입니다. 전역 상태가 복잡하다면 Zustand·Jotai 같은 외부 상태 관리 라이브러리가 더 효율적입니다.",
  },
  {
    id: "react-21",
    category: "react",
    question: "CSR, SSR, SSG, ISR의 차이와 각각의 적합한 상황은?",
    answer:
      "CSR(Client-Side Rendering)은 브라우저에서 렌더링하여 초기 로딩이 느리고 SEO에 불리하지만 인터랙티브 앱에 유리합니다. SSR(Server-Side Rendering)은 요청마다 서버에서 렌더링하여 초기 로딩이 빠르고 SEO에 유리하지만 서버 부하가 있습니다. SSG(Static Site Generation)는 빌드 시 HTML을 미리 생성하여 가장 빠르지만 데이터 신선도가 낮습니다. ISR(Incremental Static Regeneration)은 SSG에 주기적 재생성을 추가해 빌드 시 생성하되 특정 시간마다 백그라운드에서 갱신합니다. 마케팅 페이지는 SSG, 실시간 대시보드는 SSR, 블로그는 ISR이 적합합니다.",
  },
  {
    id: "react-22",
    category: "react",
    question: "startTransition과 useDeferredValue의 차이는?",
    answer:
      "둘 다 낮은 우선순위 업데이트를 표시하지만 사용 방식이 다릅니다. startTransition은 setState 호출을 직접 감싸는 함수 형태로, 어떤 업데이트를 deferred로 처리할지 명확히 표시합니다. useDeferredValue는 값을 받아 이전 값을 유지하는 deferred 버전을 반환하며, setState를 직접 제어할 수 없는 서드파티 컴포넌트나 prop으로 받은 값에 유용합니다. startTransition은 이 업데이트는 급하지 않다는 시작 시점의 표시이고, useDeferredValue는 이 값의 이전 버전을 잠시 유지해도 된다는 값 레벨의 지연입니다.",
    isAdvanced: true,
  },
];
