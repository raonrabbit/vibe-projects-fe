import type { QuizQuestion } from "./types";

export const DATA_STRUCTURES_QUESTIONS: QuizQuestion[] = [
  // ─── Array ─────────────────────────────────────────────────────────────────
  {
    id: "ds-01",
    category: "data-structures",
    question: "Array가 무엇인가요? 시간복잡도는?",
    answer:
      "메모리에 원소를 연속으로 저장하는 자료구조입니다. 인덱스로 직접 접근하므로 조회가 O(1)입니다. 삽입·삭제는 뒤의 원소를 이동해야 하여 O(n)입니다. 검색(선형)은 O(n)입니다.",
  },
  {
    id: "ds-02",
    category: "data-structures",
    question: "Array는 왜 빠른가요?",
    answer:
      "연속된 메모리에 저장되어 있어 CPU 캐시 지역성(Cache Locality)이 뛰어나기 때문입니다. 인접한 데이터를 한 번에 캐시 라인에 로드하므로 순차 탐색이 매우 빠릅니다. 또한 인덱스로 바로 주소를 계산하여 접근(O(1))할 수 있습니다.\n\n**부가설명:** CPU는 메모리를 캐시 라인(보통 64바이트) 단위로 읽습니다. 배열의 원소들이 연속으로 있으면 한 번의 캐시 로드로 여러 원소를 읽을 수 있지만, LinkedList는 포인터가 가리키는 메모리가 흩어져 있어 매번 캐시 미스가 발생합니다.",
  },

  // ─── LinkedList ────────────────────────────────────────────────────────────
  {
    id: "ds-03",
    category: "data-structures",
    question: "LinkedList가 무엇인가요? 시간복잡도는?",
    answer:
      "각 노드가 데이터와 다음 노드를 가리키는 포인터(next)를 가지는 자료구조입니다. 맨 앞 삽입·삭제는 O(1)이지만, 특정 위치 접근·검색은 처음부터 순서대로 탐색해야 하여 O(n)입니다.\n\n**부가설명:** 단일 연결 리스트(Singly), 양방향 연결 리스트(Doubly), 원형 연결 리스트(Circular)가 있습니다. Doubly LinkedList는 앞뒤로 탐색이 가능하여 브라우저 방문 기록, LRU 캐시에 활용됩니다.",
  },
  {
    id: "ds-04",
    category: "data-structures",
    question: "LinkedList를 어떻게 구현하나요?",
    answer:
      "Node 클래스(data, next 포인터)와 LinkedList 클래스(head 포인터, length)로 구성합니다. 삽입: head 또는 특정 노드의 next 포인터를 새 노드로 연결합니다. 삭제: 이전 노드의 next를 삭제할 노드의 next로 연결합니다. 탐색: head부터 next를 따라 순서대로 방문합니다.\n\n**부가설명:** 맨 앞 삽입은 O(1)이지만, 맨 뒤 삽입은 tail 포인터 없이는 O(n)입니다. tail 포인터를 유지하면 맨 뒤 삽입도 O(1)로 만들 수 있습니다.",
  },

  // ─── Stack ─────────────────────────────────────────────────────────────────
  {
    id: "ds-05",
    category: "data-structures",
    question: "Stack이 무엇인가요? 시간복잡도는?",
    answer:
      "LIFO(Last In, First Out) 구조의 자료구조입니다. push(삽입)·pop(삭제)·peek(최상단 조회) 모두 O(1)입니다. 배열이나 LinkedList로 구현할 수 있습니다.",
  },
  {
    id: "ds-06",
    category: "data-structures",
    question: "Stack은 어디서 사용하나요?",
    answer:
      "① JS 엔진의 함수 콜 스택: 함수 호출 시 스택에 쌓이고 반환 시 제거됩니다. ② Undo/Redo 기능: 최근 작업을 스택에 저장합니다. ③ DFS(깊이 우선 탐색): 방문할 노드를 스택에 저장합니다. ④ 괄호 유효성 검사: 여는 괄호를 스택에 쌓고 닫는 괄호에서 매칭합니다. ⑤ 수식 계산(후위 표기법).",
  },

  // ─── Queue ─────────────────────────────────────────────────────────────────
  {
    id: "ds-07",
    category: "data-structures",
    question: "Queue가 무엇인가요? 시간복잡도는?",
    answer:
      "FIFO(First In, First Out) 구조의 자료구조입니다. enqueue(뒤에 삽입)·dequeue(앞에서 삭제) 모두 O(1)입니다.\n\n**부가설명:** 배열로 Queue를 구현할 때 Array.shift()는 앞 원소를 꺼내며 나머지를 앞으로 이동하여 O(n)입니다. 실제로는 연결 리스트나 Circular Buffer로 구현해야 합니다.",
  },
  {
    id: "ds-08",
    category: "data-structures",
    question: "Queue는 어디서 사용하나요?",
    answer:
      "① 브라우저 이벤트 루프의 Task Queue·Microtask Queue: 비동기 콜백이 순서대로 처리됩니다. ② BFS(너비 우선 탐색): 방문할 노드를 큐에 저장합니다. ③ 프린터 스풀: 인쇄 요청을 순서대로 처리합니다. ④ CPU 프로세스 스케줄링: 실행 대기 프로세스를 큐로 관리합니다.",
  },

  // ─── Deque ─────────────────────────────────────────────────────────────────
  {
    id: "ds-09",
    category: "data-structures",
    question: "Deque가 무엇인가요? 시간복잡도는?",
    answer:
      "양쪽 끝에서 모두 삽입과 삭제가 O(1)로 가능한 자료구조입니다(Double-Ended Queue). Stack과 Queue의 기능을 합친 형태입니다.",
  },
  {
    id: "ds-10",
    category: "data-structures",
    question: "Deque는 어디서 사용하나요?",
    answer:
      "① 슬라이딩 윈도우 알고리즘: 구간 최댓값·최솟값을 O(n)으로 유지합니다. ② 브라우저 방문 기록: 앞으로/뒤로 가기(양방향 접근). ③ 작업 스케줄러: 높은 우선순위 작업을 앞에, 낮은 우선순위 작업을 뒤에 삽입합니다(Deque 기반 Work Stealing).\n\n**부가설명:** JavaScript에서는 push/pop(뒤), unshift/shift(앞)로 Deque처럼 사용할 수 있지만 unshift/shift는 O(n)이라 성능에 주의해야 합니다.",
  },

  // ─── HashTable ─────────────────────────────────────────────────────────────
  {
    id: "ds-11",
    category: "data-structures",
    question: "HashTable이 무엇인가요? 시간복잡도는?",
    answer:
      "키를 해시 함수로 변환하여 배열의 인덱스(버킷)에 값을 저장하는 자료구조입니다. 조회·삽입·삭제의 평균 시간복잡도는 O(1)입니다. 해시 충돌이 많이 발생하면 최악 O(n)으로 저하될 수 있습니다.",
  },
  {
    id: "ds-12",
    category: "data-structures",
    question: "Hash 충돌은 무엇이고 어떻게 해결하나요?",
    answer:
      "서로 다른 키가 해시 함수에 의해 같은 버킷 인덱스로 매핑될 때 발생합니다. 주요 해결 방법 두 가지: ① Chaining: 같은 인덱스의 항목들을 연결 리스트로 연결합니다. JavaScript 객체와 Java HashMap이 사용합니다. 충돌이 많으면 O(n)으로 저하됩니다. ② Open Addressing: 충돌 시 다른 빈 버킷을 탐색합니다(Linear Probing: 다음 빈 자리, Quadratic Probing: 제곱 간격).\n\n**부가설명:** Java 8+에서는 Chaining 리스트 항목이 8개 이상이 되면 Red-Black Tree로 전환하여 최악의 경우 O(log n)을 보장합니다.",
  },
  {
    id: "ds-13",
    category: "data-structures",
    question: "HashTable은 어디서 사용하나요?",
    answer:
      "키로 값을 O(1)에 찾아야 할 때 모든 상황에 적합합니다. ① 빈도수 세기: 문자나 단어가 등장하는 횟수 카운팅. ② 중복 제거: 이미 방문한 노드 추적. ③ 캐싱: 계산 결과를 키-값으로 저장. ④ 두 배열의 공통 원소 탐색: O(n²)을 O(n)으로 줄입니다.\n\n**부가설명:** 삽입 순서가 중요하면 LinkedHashMap, 키 범위로 탐색해야 하면 TreeMap(BST 기반, O(log n))이 더 적합합니다.",
  },

  // ─── Tree ──────────────────────────────────────────────────────────────────
  {
    id: "ds-14",
    category: "data-structures",
    question: "BST(이진 탐색 트리)가 무엇인가요? 시간복잡도는?",
    answer:
      "왼쪽 서브트리 값은 모두 부모보다 작고, 오른쪽 서브트리 값은 모두 크다는 조건을 만족하는 이진 트리입니다. 검색·삽입·삭제 평균 O(log n), 최악 O(n)입니다.\n\n**부가설명:** 이미 정렬된 데이터(1, 2, 3, 4...)를 순서대로 삽입하면 오른쪽으로만 기울어진 편향 트리가 되어 연결 리스트와 동일한 O(n)이 됩니다. 이를 해결하기 위해 자가 균형 트리(AVL, Red-Black Tree)가 필요합니다.",
  },
  {
    id: "ds-15",
    category: "data-structures",
    question: "AVL 트리가 무엇인가요? 시간복잡도는?",
    answer:
      "모든 노드에서 좌우 서브트리의 높이 차이(Balance Factor)를 -1, 0, 1로 유지하는 자가 균형 이진 탐색 트리입니다. 검색·삽입·삭제 모두 O(log n)을 보장합니다. 삽입·삭제 시 불균형이 생기면 회전(LL, RR, LR, RL)으로 균형을 맞춥니다.\n\n**부가설명:** 엄격한 균형 조건 덕분에 Red-Black Tree보다 검색이 빠르지만, 삽입·삭제 시 회전 횟수가 더 많아 쓰기 성능이 낮습니다. 검색이 빈번한 경우에 유리합니다.",
  },
  {
    id: "ds-16",
    category: "data-structures",
    question: "Red-Black 트리가 무엇인가요? 시간복잡도는?",
    answer:
      "각 노드에 Red·Black 색상을 부여하는 5가지 속성(루트는 Black, Red 노드의 자식은 Black 등)으로 느슨한 균형을 유지하는 자가 균형 BST입니다. 검색·삽입·삭제 모두 O(log n)을 보장합니다.\n\n**부가설명:** AVL 트리보다 균형 조건이 느슨하여 삽입·삭제 시 회전이 적습니다. 쓰기가 많은 경우에 AVL보다 유리합니다. Java TreeMap, C++ std::map, Linux CFS 스케줄러, JavaScript 엔진의 일부 내부 구조에서 사용합니다.",
  },

  // ─── Heap ──────────────────────────────────────────────────────────────────
  {
    id: "ds-17",
    category: "data-structures",
    question: "Heap이 무엇인가요? 시간복잡도는?",
    answer:
      "완전 이진 트리이면서 부모가 항상 자식보다 크거나(Max Heap) 작은(Min Heap) 조건을 만족하는 자료구조입니다. 최솟값·최댓값 조회는 O(1), 삽입은 O(log n)(Heapify Up), 삭제는 O(log n)(Heapify Down)입니다.\n\n**부가설명:** 배열로 구현할 때 인덱스 i의 왼쪽 자식은 2i+1, 오른쪽 자식은 2i+2, 부모는 floor((i-1)/2)입니다. 우선순위 큐의 핵심 구현체이며, React Scheduler도 내부적으로 Min Heap으로 작업 우선순위를 관리합니다.",
  },

  // ─── BFS / DFS ─────────────────────────────────────────────────────────────
  {
    id: "ds-18",
    category: "data-structures",
    question: "BFS와 DFS가 무엇인가요?",
    answer:
      "BFS(너비 우선 탐색)는 큐를 사용하여 시작 노드에서 가까운 노드부터 레벨 순서로 탐색합니다. 가중치 없는 그래프에서 최단 경로를 보장합니다. DFS(깊이 우선 탐색)는 스택(또는 재귀)을 사용하여 한 방향으로 끝까지 탐색하고 막히면 되돌아옵니다. 둘 다 시간복잡도는 O(V+E)입니다.\n\n**부가설명:** 최단 경로가 필요하면 BFS, 경로 존재 여부·위상 정렬·사이클 감지에는 DFS가 적합합니다. BFS는 모든 이웃 노드를 큐에 저장해야 해서 메모리 사용이 더 많을 수 있습니다.",
  },

  // ─── Graph ─────────────────────────────────────────────────────────────────
  {
    id: "ds-19",
    category: "data-structures",
    question: "Graph가 무엇인가요? (정점, 간선, 방향/무방향)",
    answer:
      "정점(Vertex)과 간선(Edge)으로 구성된 자료구조입니다. 방향 그래프(Directed)는 간선에 방향이 있고, 무방향 그래프(Undirected)는 양방향입니다. 가중치 그래프는 간선에 비용이 있습니다. 트리는 사이클이 없는 방향 그래프의 특수한 경우입니다.\n\n**부가설명:** 그래프는 SNS 친구 관계, 지도 경로 탐색, 패키지 의존성처럼 다대다 관계를 표현합니다. '두 노드 간 경로', '최단 경로', '사이클 존재 여부'를 묻는 문제는 대부분 그래프로 모델링합니다.",
  },
  {
    id: "ds-20",
    category: "data-structures",
    question: "인접 행렬 vs 인접 리스트의 차이와 장단점은?",
    answer:
      "인접 행렬은 V×V 크기의 2차원 배열로 두 정점 간 간선 존재 확인이 O(1)이지만, 공간이 O(V²)으로 희소 그래프에서는 메모리 낭비가 큽니다. 인접 리스트는 각 정점의 이웃 목록만 저장하여 공간이 O(V+E)로 효율적이지만, 특정 두 정점 간 간선 존재 확인이 O(degree(V))입니다.\n\n**부가설명:** 간선이 적은 희소 그래프(대부분의 실제 그래프)에는 인접 리스트, 간선이 많은 밀집 그래프에는 인접 행렬이 적합합니다.",
  },
  {
    id: "ds-21",
    category: "data-structures",
    question: "다익스트라 알고리즘이 무엇인가요? 시간복잡도는?",
    answer:
      "가중치가 양수인 그래프에서 단일 출발 노드로부터 모든 노드까지의 최단 경로를 구하는 알고리즘입니다. 우선순위 큐(Min Heap)를 사용하여 아직 방문하지 않은 노드 중 거리가 가장 짧은 노드를 선택하며 이완(relaxation)합니다. 우선순위 큐 사용 시 O((V+E) log V)입니다.\n\n**부가설명:** 음수 간선이 있으면 다익스트라를 사용할 수 없습니다(벨만-포드 알고리즘 사용). 우선순위 큐 없이 단순 배열을 사용하면 O(V²)이 됩니다.",
    isAdvanced: true,
  },

  // ─── Trie ──────────────────────────────────────────────────────────────────
  {
    id: "ds-22",
    category: "data-structures",
    question: "Trie가 무엇이고 어디서 사용하나요?",
    answer:
      "문자열을 문자 단위로 분해하여 트리 형태로 저장하는 자료구조입니다. 공통 접두사를 가진 문자열들이 노드를 공유합니다. 자동완성·맞춤법 검사·검색어 추천·IP 라우팅 테이블에 사용합니다.\n\n**부가설명:** 해시맵으로도 문자열 검색이 O(m)이지만, Trie는 접두사 기반 탐색(startsWith)이 O(m)으로 효율적입니다. 단점은 문자 종류가 많으면 각 노드의 자식 배열이 커져 메모리 사용량이 증가합니다.",
  },
  {
    id: "ds-23",
    category: "data-structures",
    question: "Trie의 시간복잡도는?",
    answer:
      "삽입·검색·삭제 모두 문자열 길이 m에 대해 O(m)입니다. 해시맵도 O(m)이지만 Trie는 접두사 검색(startsWith)이 O(m)으로 매우 효율적이어서 자동완성에 특히 유리합니다.",
  },

  // ─── 자료구조 비교 ─────────────────────────────────────────────────────────
  {
    id: "ds-24",
    category: "data-structures",
    question: "Array vs LinkedList — 언제 무엇을 선택하나요?",
    answer:
      "랜덤 접근이 자주 필요하거나 순차 탐색이 많은 경우 Array를 선택합니다. CPU 캐시 효율이 좋아 실제 성능이 더 좋습니다. 맨 앞이나 중간에 삽입·삭제가 빈번하고 크기가 가변적인 경우 LinkedList를 선택합니다.\n\n**부가설명:** 실무에서는 배열의 캐시 지역성이 훨씬 좋아 LinkedList를 직접 사용하는 경우는 드뭅니다. LRU 캐시처럼 특정 상황에서만 LinkedList가 유리합니다.",
  },
  {
    id: "ds-25",
    category: "data-structures",
    question: "Stack 구현 시 Array vs LinkedList 중 무엇이 나은가요?",
    answer:
      "일반적으로 Array가 더 나은 선택입니다. push/pop이 배열 끝에서 일어나면 O(1)이고, 메모리가 연속 배치되어 캐시 효율이 좋습니다. LinkedList는 push/pop이 O(1)이지만 각 노드마다 포인터 공간이 추가로 필요하고 캐시 효율이 낮습니다.\n\n**부가설명:** 스택의 크기가 매우 유동적이라면 LinkedList가 동적 할당에서 유리할 수 있습니다. 그러나 대부분의 언어 표준 라이브러리는 동적 배열 기반으로 스택을 구현합니다.",
  },
  {
    id: "ds-26",
    category: "data-structures",
    question: "Priority Queue와 Heap의 관계를 설명해보세요.",
    answer:
      "Priority Queue는 가장 우선순위가 높은 원소를 O(1)에 조회하고 O(log n)에 삽입·삭제하는 추상 자료형(ADT)입니다. Heap은 Priority Queue를 효율적으로 구현하는 구체적인 자료구조입니다. 즉, Priority Queue라는 개념을 Heap으로 구현합니다.\n\n**부가설명:** 배열로도 Priority Queue를 구현할 수 있지만(최솟값 탐색 O(n)), Heap을 사용하면 O(log n)으로 효율적으로 처리합니다. Dijkstra, Huffman 인코딩, 이벤트 스케줄링에서 Priority Queue가 핵심적으로 사용됩니다.",
  },
];
