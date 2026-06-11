import type { QuizQuestion } from "./types";

export const DATA_STRUCTURES_QUESTIONS: QuizQuestion[] = [
  {
    id: "ds-01",
    category: "data-structures",
    question: "Array와 LinkedList의 차이는?",
    answer:
      "Array는 연속된 메모리를 사용해 인덱스로 O(1) 랜덤 접근이 가능하지만, 삽입/삭제 시 원소 이동이 필요하여 O(n)입니다. LinkedList는 노드가 포인터로 연결되어 맨 앞 삽입/삭제가 O(1)이지만, 특정 위치 접근이 O(n)입니다. Array는 연속 메모리 덕분에 CPU 캐시 지역성이 좋아 순차 탐색이 빠르고, LinkedList는 동적 크기 조절이 용이하지만 포인터 오버헤드가 있습니다.",
  },
  {
    id: "ds-02",
    category: "data-structures",
    question: "Dynamic Array(동적 배열)의 Amortized O(1)이란?",
    answer:
      "동적 배열은 크기가 부족하면 새 배열을 2배 크기로 생성하고 기존 데이터를 복사합니다. 이 복사 연산은 O(n)이지만, 2배씩 늘어나기 때문에 n번의 삽입에서 복사가 일어나는 횟수는 log₂n 정도입니다. 총 비용을 삽입 횟수로 나누면 평균적으로 O(1)이 됩니다. 이를 분할 상환 분석(Amortized Analysis)이라 하며, JavaScript의 Array, Java의 ArrayList, Python의 list가 이 방식으로 동작합니다.",
  },
  {
    id: "ds-03",
    category: "data-structures",
    question: "JavaScript의 Array는 실제로 어떻게 구현되어 있나요?",
    answer:
      "V8 엔진은 배열 내용에 따라 내부 표현을 최적화합니다. 동일 타입의 정수만 담긴 밀집 배열은 C++ 배열처럼 연속 메모리로 처리합니다(SMI Array). 부동소수점이 섞이면 Double Array, 객체가 섞이면 일반 배열로 전환됩니다. 반면 `arr[1000] = 1`처럼 인덱스가 듬성듬성한 희소(sparse) 배열은 해시맵으로 처리합니다. 희소 배열 생성이나 타입 혼합은 내부 구조 전환을 유발해 성능이 급격히 저하될 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "ds-04",
    category: "data-structures",
    question: "Stack과 Queue를 설명하고 각각의 활용 사례를 말해주세요.",
    answer:
      "Stack은 LIFO(Last In, First Out) 구조로 push/pop/peek 모두 O(1)입니다. JS 엔진의 함수 콜 스택, Undo 기능, DFS, 괄호 검사에 활용됩니다. Queue는 FIFO(First In, First Out) 구조로 enqueue/dequeue가 O(1)입니다. 브라우저 이벤트 루프 Task Queue, BFS, 프린터 스풀에 활용됩니다. 배열로 Queue를 구현할 때 Array.shift()는 O(n)이므로 실제로는 Circular Buffer나 LinkedList를 사용해야 합니다.",
  },
  {
    id: "ds-05",
    category: "data-structures",
    question: "Deque(Double-Ended Queue)란 무엇이며 어떤 상황에 유용한가요?",
    answer:
      "Deque는 양쪽 끝에서 모두 삽입과 삭제가 O(1)로 가능한 자료구조입니다. Stack과 Queue의 기능을 합친 형태입니다. 슬라이딩 윈도우 알고리즘(구간 최댓값/최솟값 유지), 브라우저 방문 기록(앞으로/뒤로), 작업 스케줄링에서 높은 우선순위 작업을 앞에 삽입해야 할 때 유용합니다. JavaScript에서는 배열의 push/pop/shift/unshift로 흉내낼 수 있지만, 성능을 위해서는 LinkedList 기반 구현이 필요합니다.",
  },
  {
    id: "ds-06",
    category: "data-structures",
    question: "해시 충돌(Hash Collision)이란 무엇이고 어떻게 해결하나요?",
    answer:
      "서로 다른 키가 해시 함수에 의해 같은 버킷 인덱스로 매핑될 때 발생합니다. 주요 해결 방법은 두 가지입니다. Chaining은 같은 인덱스의 항목들을 연결 리스트로 연결하는 방식으로 JavaScript 객체와 Java HashMap이 사용합니다. 충돌이 많으면 O(n)으로 저하됩니다. Open Addressing은 충돌 시 Linear Probing(다음 빈 버킷), Quadratic Probing(제곱 간격), Double Hashing(두 번째 해시 함수) 방법으로 빈 버킷을 탐색합니다. 충돌 최소화를 위해 좋은 해시 함수와 적절한 load factor 유지가 중요합니다.",
  },
  {
    id: "ds-07",
    category: "data-structures",
    question:
      "Load Factor(적재율)란 무엇이며 해시 테이블 성능에 어떤 영향을 주나요?",
    answer:
      "Load Factor = 저장된 항목 수 / 전체 버킷 수입니다. 적재율이 높아질수록 충돌 확률이 증가하여 성능이 O(1)에서 멀어집니다. 일반적으로 0.7~0.75를 임계값으로 설정하고, 이를 초과하면 리해싱(rehashing)을 수행합니다. 리해싱은 버킷 크기를 2배로 늘리고 모든 항목을 새 버킷에 재배치하는 작업으로 O(n) 비용이 발생하지만, 동적 배열의 Amortized 분석처럼 전체 삽입 비용의 평균은 O(1)로 유지됩니다.",
    isAdvanced: true,
  },
  {
    id: "ds-08",
    category: "data-structures",
    question: "해시 테이블의 최악의 경우 시간 복잡도는? Hash DoS란?",
    answer:
      "모든 키가 동일한 해시 값으로 매핑되면 하나의 버킷에 모든 항목이 쌓여 조회·삽입·삭제가 O(n)으로 저하됩니다. Hash DoS 공격은 공격자가 의도적으로 충돌을 유발하는 입력값을 서버에 보내 해시 테이블을 O(n)으로 만드는 서비스 거부 공격입니다. 이를 방지하기 위해 Java 8+에서는 Chaining 연결 리스트 항목이 8개 이상이 되면 레드-블랙 트리로 전환하여 최악의 경우 O(log n)을 보장합니다. 또한 해시 함수에 무작위 시드를 추가하는 방법도 사용됩니다.",
    isAdvanced: true,
  },
  {
    id: "ds-09",
    category: "data-structures",
    question: "JavaScript의 Map과 일반 객체({})의 차이는?",
    answer:
      "Map은 모든 타입(객체, 함수 등)을 키로 사용할 수 있지만, 객체는 문자열과 Symbol만 가능합니다. Map은 삽입 순서가 완전히 보장되고 .size로 크기를 O(1)에 얻을 수 있습니다. 객체는 프로토타입 체인 때문에 constructor, toString 같은 의도치 않은 키가 존재할 수 있어 프로토타입 오염 위험이 있습니다. 빈번한 추가·삭제 연산에서 Map이 내부적으로 최적화되어 성능이 우수합니다. JSON 직렬화가 필요하거나 단순 정적 레코드에는 객체, 동적 키-값 저장에는 Map이 적합합니다.",
  },
  {
    id: "ds-10",
    category: "data-structures",
    question: "이진 트리(Binary Tree)의 순회 방법 3가지를 설명해주세요.",
    answer:
      "전위 순회(Pre-order)는 루트 → 왼쪽 → 오른쪽 순서로 방문합니다. 트리 복사나 직렬화에 활용됩니다. 중위 순회(In-order)는 왼쪽 → 루트 → 오른쪽 순서로, BST에서 중위 순회를 하면 오름차순 정렬된 결과를 얻을 수 있습니다. 후위 순회(Post-order)는 왼쪽 → 오른쪽 → 루트 순서로, 트리 삭제나 디렉토리 크기 계산에 활용됩니다. 세 방법 모두 시간 복잡도는 O(n)입니다.",
  },
  {
    id: "ds-11",
    category: "data-structures",
    question: "BST(이진 탐색 트리)란 무엇이며 편향 트리 문제란?",
    answer:
      "BST는 각 노드의 왼쪽 서브트리 값이 모두 부모보다 작고 오른쪽은 모두 크다는 조건을 만족하는 이진 트리입니다. 이 조건 덕분에 이진 탐색이 가능하여 검색·삽입·삭제가 평균 O(log n)입니다. 단, 1, 2, 3, 4처럼 이미 정렬된 데이터를 순서대로 삽입하면 오른쪽 자식만 계속 생기는 편향 트리(Skewed Tree)가 되어 연결 리스트와 동일하게 모든 연산이 O(n)으로 저하됩니다. 이를 해결하기 위해 자가 균형 트리(AVL, Red-Black Tree)가 고안되었습니다.",
  },
  {
    id: "ds-12",
    category: "data-structures",
    question: "AVL Tree와 Red-Black Tree의 차이는? 각각 언제 사용하나요?",
    answer:
      "AVL Tree는 모든 노드에서 좌우 서브트리 높이 차이(Balance Factor)를 1 이하로 유지하는 엄격한 균형 조건을 가집니다. 항상 O(log n) 검색이 보장되지만, 삽입·삭제 시 LL/RR/LR/RL 등 빈번한 회전이 발생하여 쓰기 성능이 낮습니다. Red-Black Tree는 노드에 Red/Black 색상을 부여하는 5가지 속성으로 더 느슨한 균형을 유지합니다. 삽입·삭제 시 회전 횟수가 AVL보다 적어 쓰기 성능이 우수합니다. 검색이 많은 경우 AVL Tree, 삽입·삭제가 많은 경우 Red-Black Tree가 유리하며, Java TreeMap, C++ std::map, Linux CFS 스케줄러 등이 Red-Black Tree를 사용합니다.",
  },
  {
    id: "ds-13",
    category: "data-structures",
    question: "Heap(힙)이란 무엇이고 어떻게 동작하나요?",
    answer:
      "Heap은 완전 이진 트리 형태를 유지하면서 부모가 자식보다 항상 크거나(Max Heap) 작은(Min Heap) 조건을 만족하는 자료구조입니다. 배열로 구현할 때 인덱스 i의 왼쪽 자식은 2i+1, 오른쪽 자식은 2i+2, 부모는 floor((i-1)/2)입니다. 삽입 시 마지막에 추가 후 부모와 비교하며 위로 이동(Heapify Up)하여 O(log n)이고, 최솟값/최댓값 추출 시 루트를 꺼내고 마지막 원소를 루트로 올린 후 자식과 비교하며 내려가(Heapify Down) O(log n)입니다. 최솟값/최댓값 조회는 O(1)입니다.",
  },
  {
    id: "ds-14",
    category: "data-structures",
    question:
      "Heap이 실무에서 어떻게 활용되나요? React Scheduler와의 연관성은?",
    answer:
      "Heap은 우선순위 큐 구현에 핵심적으로 사용됩니다. Dijkstra 최단 경로 알고리즘에서 가장 가까운 노드를 O(log n)에 꺼내오고, Heap Sort에서는 O(n log n) 정렬을 수행합니다. React Scheduler는 컴포넌트 렌더링 작업의 우선순위를 Min Heap으로 관리합니다. 만료 시간이 가장 이른(우선순위가 높은) 작업을 O(log n)에 꺼내 실행하며, 이를 통해 긴급한 사용자 인터랙션을 먼저 처리하는 동시성 렌더링(Concurrent Rendering)을 구현합니다.",
    isAdvanced: true,
  },
  {
    id: "ds-15",
    category: "data-structures",
    question: "그래프의 인접 행렬과 인접 리스트 표현의 차이는?",
    answer:
      "인접 행렬은 V×V 크기의 2차원 배열로 두 정점 간 간선 존재 여부를 O(1)에 확인할 수 있습니다. 단, 공간이 O(V²)이어서 간선이 적은 희소 그래프에서는 메모리 낭비가 큽니다. 인접 리스트는 각 정점의 이웃 목록만 저장하여 공간이 O(V+E)로 효율적이며 인접 정점 순회가 빠릅니다. 단, 특정 두 정점 간 간선 존재 확인이 O(degree(V))입니다. 정점 수에 비해 간선이 많은 밀집 그래프에는 인접 행렬, 대부분의 실제 그래프처럼 간선이 적은 희소 그래프에는 인접 리스트가 적합합니다.",
  },
  {
    id: "ds-16",
    category: "data-structures",
    question: "DFS와 BFS의 차이는? 각각 어떤 상황에 적합한가요?",
    answer:
      "DFS(깊이 우선 탐색)는 스택(또는 재귀)을 사용해 한 방향으로 끝까지 탐색하고 막히면 되돌아옵니다. 시간 O(V+E), 공간 O(V)입니다. 경로 존재 여부 확인, 위상 정렬, 사이클 감지, 미로 탐색에 적합합니다. BFS(너비 우선 탐색)는 큐를 사용해 시작점에서 가까운 노드부터 레벨 순서로 탐색합니다. 시간 O(V+E), 공간 O(V)이지만 한 레벨의 노드를 큐에 보관해야 해 메모리 사용이 더 클 수 있습니다. 가중치 없는 그래프에서 최단 경로, 소셜 네트워크 친구 추천(N촌 관계)에 적합합니다.",
  },
  {
    id: "ds-17",
    category: "data-structures",
    question: "Trie란 무엇이고 어떤 상황에서 사용하나요?",
    answer:
      "Trie는 문자열을 문자 단위로 분해하여 트리 형태로 저장하는 자료구조입니다. 공통 접두사를 공유하는 노드로 묶어 메모리를 절약합니다. 삽입·검색·삭제 모두 문자열 길이 m에 대해 O(m)으로 동작합니다. 해시맵으로도 O(m) 검색이 가능하지만, Trie는 접두사 기반 탐색(startsWith)이 O(m)으로 매우 효율적이어서 자동완성, 맞춤법 검사, 검색어 추천, IP 라우팅 테이블에 활용됩니다. 단점은 문자 종류가 많은 경우(유니코드 등) 각 노드의 자식 배열이 커져 메모리 사용량이 증가한다는 점입니다.",
  },
  {
    id: "ds-18",
    category: "data-structures",
    question: "HashMap(해시 테이블)은 언제 사용하나요?",
    answer:
      "특정 키로 값을 O(1)에 찾아야 할 때 사용합니다. 빈도수 세기, 중복 제거, 캐싱, 두 배열에서 공통 원소 찾기처럼 '값을 넣고 빠르게 꺼내야 하는' 상황 전반에 적합합니다. 배열로 이중 루프(O(n²))를 돌릴 수 있는 문제를 HashMap 하나로 O(n)에 해결하는 경우가 많아, 시간복잡도를 줄이는 첫 번째 선택지가 됩니다. 단, 삽입 순서가 중요하면 LinkedHashMap, 키 범위로 탐색(10 이상 20 이하)해야 하면 BST 기반의 TreeMap이 더 적합합니다.",
  },
  {
    id: "ds-19",
    category: "data-structures",
    question: "우선순위 큐(Priority Queue)는 언제 사용하나요?",
    answer:
      "가장 작거나 가장 큰 값을 반복적으로 빠르게 꺼내야 할 때 사용합니다. 전체를 정렬하면 O(n log n)이지만, 우선순위 큐는 삽입마다 O(log n)으로 순서를 유지하기 때문에 데이터가 계속 들어오는 상황에서 훨씬 효율적입니다. Top K 문제(N개 중 가장 큰 K개 유지), Dijkstra 최단 경로에서 가장 가까운 노드 꺼내기, 작업 스케줄링이 대표적입니다.",
  },
  {
    id: "ds-20",
    category: "data-structures",
    question: "그래프(Graph)는 언제 사용하나요?",
    answer:
      "노드 간 다대다 관계나 경로를 표현해야 할 때 사용합니다. 트리가 부모-자식 계층 구조를 표현한다면, 그래프는 SNS 친구 관계, 지도 경로 탐색, 패키지 의존성처럼 더 자유로운 관계를 표현합니다. '두 노드 간 경로가 존재하는가', '최단 경로는 무엇인가', '순환 의존성이 있는가'를 묻는 문제는 대부분 그래프로 모델링합니다.",
  },
  {
    id: "ds-21",
    category: "data-structures",
    question: "LinkedList를 실제로 선택하는 경우는?",
    answer:
      "맨 앞이나 중간에 삽입·삭제가 빈번할 때 사용합니다. 배열은 중간 삽입 시 뒤의 원소를 모두 밀어야 해 O(n)이지만, LinkedList는 포인터만 바꾸면 O(1)입니다. LRU 캐시처럼 가장 오래된 항목을 제거하고 새 항목을 앞에 추가하는 구조가 대표적입니다. 단, 현실에서는 랜덤 접근이 자주 필요하고 배열의 캐시 지역성이 훨씬 좋아 LinkedList를 직접 선택하는 경우는 드뭅니다.",
  },
];
