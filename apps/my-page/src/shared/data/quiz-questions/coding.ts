import type { QuizQuestion } from "./types";

export const CODING_QUESTIONS: QuizQuestion[] = [
  // ─── 리팩토링 ────────────────────────────────────────────────────────────────
  {
    id: "coding-01",
    category: "coding",
    question: `[리팩토링] 아래 코드의 문제점을 찾고 개선하세요.

\`\`\`jsx
function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => { setUser(data); setIsLoading(false); })
      .catch(() => { setIsError(true); setIsLoading(false); });
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;
  return <div>{user?.name}</div>;
}
\`\`\``,
    answer: `문제점:
1. fetch 로직이 컴포넌트에 직접 섞여 있어 재사용 불가
2. isLoading/isError/user를 별도 state로 관리 → 불일치 상태 위험 (ex. isLoading=true이면서 isError=true)
3. cleanup 없어 언마운트 후 setState 호출 가능

개선:
\`\`\`jsx
function useUser(userId) {
  const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null });

  useEffect(() => {
    const controller = new AbortController();
    dispatch({ type: 'LOADING' });
    fetch(\`/api/users/\${userId}\`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => dispatch({ type: 'SUCCESS', data }))
      .catch(err => { if (err.name !== 'AbortError') dispatch({ type: 'ERROR' }); });
    return () => controller.abort();
  }, [userId]);

  return state;
}

function UserCard({ userId }) {
  const { status, data } = useUser(userId);
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'error') return <div>Error!</div>;
  return <div>{data?.name}</div>;
}
\`\`\`
핵심: 커스텀 훅 분리 + useReducer로 상태 일관성 보장 + AbortController로 cleanup`,
  },
  {
    id: "coding-02",
    category: "coding",
    question: `[리팩토링] 아래 코드의 문제점을 찾고 개선하세요.

\`\`\`jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [todoCount, setTodoCount] = useState(0);

  const addTodo = () => {
    const newTodo = { id: Date.now(), text: inputValue, done: false };
    setTodos([...todos, newTodo]);
    setTodoCount(todoCount + 1);
    setInputValue('');
  };

  return (
    <div>
      <span>총 {todoCount}개</span>
      <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button onClick={addTodo}>추가</button>
    </div>
  );
}
\`\`\``,
    answer: `문제점:
- todoCount는 todos.length로 파생 가능한 값인데 별도 state로 관리 → todos와 불일치 위험

개선:
\`\`\`jsx
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    setTodos(prev => [...prev, { id: Date.now(), text: inputValue, done: false }]);
    setInputValue('');
  };

  return (
    <div>
      <span>총 {todos.length}개</span>
      <input value={inputValue} onChange={e => setInputValue(e.target.value)} />
      <button onClick={addTodo}>추가</button>
    </div>
  );
}
\`\`\`
핵심: 파생 가능한 값은 state로 만들지 않는다. setState에 함수형 업데이트 사용으로 stale closure 방지.`,
  },
  {
    id: "coding-03",
    category: "coding",
    question: `[리팩토링] 아래 버튼 리스트 코드의 성능 문제를 찾고 개선하세요.

\`\`\`jsx
function ButtonList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <button onClick={() => console.log(item.id)}>
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
\`\`\``,
    answer: `문제점:
- items 수가 많을 때 버튼마다 개별 이벤트 리스너 부착 → 메모리 낭비
- 리렌더링마다 화살표 함수 새로 생성

이벤트 위임(Event Delegation)으로 개선:
\`\`\`jsx
function ButtonList({ items }) {
  const handleClick = (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const id = button.dataset.id;
    console.log(id);
  };

  return (
    <ul onClick={handleClick}>
      {items.map(item => (
        <li key={item.id}>
          <button data-id={item.id}>{item.name}</button>
        </li>
      ))}
    </ul>
  );
}
\`\`\`
핵심: 부모 하나에 리스너 등록 후 e.target으로 출처 판별. React는 이미 루트에 위임하지만, 직접 DOM 핸들링 시나리오에서도 이 패턴을 알아야 한다.`,
    isAdvanced: true,
  },

  // ─── 구현 문제 ───────────────────────────────────────────────────────────────
  {
    id: "coding-04",
    category: "coding",
    question: `[구현] debounce 함수를 직접 구현하세요.

사용 예시:
\`\`\`js
const debouncedSearch = debounce((query) => fetchSearch(query), 300);
input.addEventListener('input', e => debouncedSearch(e.target.value));
\`\`\``,
    answer: `\`\`\`js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
\`\`\`
동작 원리: 연속 호출 시 이전 타이머를 취소하고 새 타이머 등록. delay 동안 호출이 없으면 fn 실행.
활용: 검색 입력, resize 이벤트 등 "마지막 입력 후 N ms 뒤 실행"이 필요한 곳.`,
  },
  {
    id: "coding-05",
    category: "coding",
    question: `[구현] throttle 함수를 직접 구현하세요.

debounce와의 차이점도 설명하세요.`,
    answer: `\`\`\`js
function throttle(fn, interval) {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
\`\`\`
debounce vs throttle:
- debounce: 마지막 호출 후 N ms 뒤 1회 실행 (입력이 멈춰야 실행됨)
- throttle: N ms마다 최대 1회 실행 (실행 보장, 빈도 제한)

활용: throttle → 스크롤 이벤트, 게임 키 입력 / debounce → 검색어 자동완성, 창 리사이즈`,
  },
  {
    id: "coding-06",
    category: "coding",
    question: `[구현] 아래 요구사항으로 커스텀 훅 useIntersectionObserver를 구현하세요.

요구사항:
- ref를 반환하고, 해당 ref가 연결된 요소가 viewport에 진입하면 콜백 실행
- 한 번 진입 후 더 이상 observe하지 않아야 함 (무한 스크롤의 트리거 용도)

사용 예시:
\`\`\`jsx
const { ref } = useIntersectionObserver(() => fetchNextPage());
return <div ref={ref}>더 불러오기</div>;
\`\`\``,
    answer: `\`\`\`js
function useIntersectionObserver(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        callback();
        observer.unobserve(element);
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback]);

  return { ref };
}
\`\`\`
핵심 포인트:
- callback이 매 렌더마다 바뀌면 effect 재실행 → 호출부에서 useCallback 감싸거나, useRef로 callback 저장
- unobserve로 중복 실행 방지
- cleanup에서 disconnect`,
    isAdvanced: true,
  },
  {
    id: "coding-07",
    category: "coding",
    question: `[구현] 여러 API를 병렬로 호출한 뒤 결과를 합쳐서 반환하는 함수를 작성하세요.

\`\`\`js
// userId를 받아 user 정보와 posts 목록을 동시에 가져와 합쳐서 반환
async function getUserWithPosts(userId) {
  // 구현
}
\`\`\``,
    answer: `\`\`\`js
async function getUserWithPosts(userId) {
  const [user, posts] = await Promise.all([
    fetch(\`/api/users/\${userId}\`).then(res => res.json()),
    fetch(\`/api/users/\${userId}/posts\`).then(res => res.json()),
  ]);
  return { ...user, posts };
}
\`\`\`
Promise.all vs 순차 await:
- 순차 await: user 응답 후 posts 요청 → 총 대기시간 = A + B
- Promise.all: 동시 요청 → 총 대기시간 = max(A, B)

주의: 하나라도 reject되면 전체 실패. 실패해도 계속 진행하려면 Promise.allSettled 사용.`,
  },
  {
    id: "coding-08",
    category: "coding",
    question: `[구현] 아래 요구사항으로 useLocalStorage 커스텀 훅을 구현하세요.

요구사항:
- useState처럼 [value, setValue] 형태로 반환
- 초기값 설정 가능, localStorage에 없으면 초기값 사용
- setValue 호출 시 localStorage도 함께 업데이트`,
    answer: `\`\`\`js
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(\`useLocalStorage: \${key} 저장 실패\`, error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`
포인트:
- useState 초기화를 lazy initializer(함수)로 → 마운트 1회만 localStorage 읽음
- 함수형 업데이트 지원 (value instanceof Function)
- try-catch: SSR 환경이나 시크릿 모드에서 localStorage 접근 실패 대비`,
  },

  // ─── 타이머 / 스톱워치 ──────────────────────────────────────────────────────
  {
    id: "coding-09",
    category: "coding",
    question: `[구현] useInterval 커스텀 훅을 구현하세요.

아래처럼 사용 가능해야 하며, delay가 null이면 멈춰야 합니다.

\`\`\`jsx
useInterval(() => setCount(c => c + 1), 1000); // 1초마다 실행
useInterval(() => tick(), isRunning ? 100 : null); // null이면 정지
\`\`\``,
    answer: `\`\`\`js
function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
\`\`\`
핵심 포인트:
- setInterval 안에서 callback을 직접 참조하면 stale closure → callback이 바뀌어도 옛날 값 사용
- useRef로 최신 callback을 저장해두면 interval은 재설정 없이 항상 최신 함수 호출
- delay가 null이면 effect 자체를 실행 안 함 (정지 기능)
- delay가 바뀌면 interval 재설정 (속도 변경 가능)`,
  },
  {
    id: "coding-10",
    category: "coding",
    question: `[구현] useCountdown 훅을 구현하세요.

요구사항:
- 초(seconds)를 받아 카운트다운
- { count, start, reset, isRunning } 반환
- 0이 되면 자동 정지`,
    answer: `\`\`\`js
function useCountdown(initialSeconds) {
  const [count, setCount] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(
    () => {
      setCount(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    },
    isRunning ? 1000 : null
  );

  const start = () => { if (count > 0) setIsRunning(true); };
  const reset = () => { setIsRunning(false); setCount(initialSeconds); };

  return { count, start, reset, isRunning };
}
\`\`\`
포인트:
- useInterval에 null 전달로 정지 제어
- count가 0이 되는 시점에 setIsRunning(false) → 다음 tick에서 delay가 null이 됨
- start 시 count > 0 조건으로 이미 0인 상태에서 시작 방지`,
  },
  {
    id: "coding-11",
    category: "coding",
    question: `[구현] useStopwatch 훅을 구현하세요.

요구사항:
- { time, start, stop, reset } 반환 (time은 ms 단위)
- 시작/정지/리셋 가능`,
    answer: `\`\`\`js
function useStopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => setTime(prev => prev + 10), isRunning ? 10 : null);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = () => { setIsRunning(false); setTime(0); };

  return { time, start, stop, reset };
}
\`\`\`
사용 예:
\`\`\`jsx
const { time, start, stop, reset } = useStopwatch();
const minutes = Math.floor(time / 60000);
const seconds = Math.floor((time % 60000) / 1000);
const ms = Math.floor((time % 1000) / 10);
\`\`\`
포인트: useInterval 재사용. 10ms 간격으로 갱신하면 센티초 단위 표시 가능.`,
  },

  // ─── Hook 설계 ──────────────────────────────────────────────────────────────
  {
    id: "coding-12",
    category: "coding",
    question: `[구현] usePrevious 훅을 구현하세요.

\`\`\`jsx
const prevCount = usePrevious(count);
// count가 5 → 7로 바뀌면 prevCount는 5
\`\`\``,
    answer: `\`\`\`js
function usePrevious(value) {
  const ref = useRef(undefined);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
\`\`\`
동작 원리:
- useEffect는 렌더 후 실행 → 이번 렌더에서는 ref.current가 아직 이전 값
- 렌더가 끝나면 ref.current를 현재 값으로 업데이트
- 다음 렌더에서 ref.current가 "이전 값"이 됨
- 의존성 배열 생략 → 매 렌더 후 실행 (의도적)`,
  },
  {
    id: "coding-13",
    category: "coding",
    question: `[구현] useToggle 훅을 구현하세요.

\`\`\`jsx
const [isOpen, toggle] = useToggle(false);
toggle();       // true
toggle();       // false
toggle(true);   // 강제로 true 설정도 가능
\`\`\``,
    answer: `\`\`\`js
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback((newValue) => {
    setValue(prev =>
      typeof newValue === 'boolean' ? newValue : !prev
    );
  }, []);

  return [value, toggle];
}
\`\`\`
포인트:
- toggle에 boolean을 직접 전달하면 강제 설정, 아니면 반전
- useCallback으로 toggle 함수 안정화 → 자식에게 props로 내려도 불필요한 리렌더 없음`,
  },
  {
    id: "coding-14",
    category: "coding",
    question: `[구현] useClickOutside 훅을 구현하세요.

요구사항:
- ref가 연결된 요소 바깥을 클릭하면 callback 실행
- 모달, 드롭다운 닫기에 사용

\`\`\`jsx
const ref = useClickOutside(() => setIsOpen(false));
return <div ref={ref}>...</div>;
\`\`\``,
    answer: `\`\`\`js
function useClickOutside(callback) {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [callback]);

  return ref;
}
\`\`\`
포인트:
- contains(e.target)으로 클릭이 내부인지 외부인지 판별
- mousedown 사용 (click보다 먼저 발생, 드래그 이슈 방지)
- callback이 바뀌면 effect 재실행 → 호출부에서 useCallback 감싸는 것 권장`,
  },

  // ─── 최적화 ─────────────────────────────────────────────────────────────────
  {
    id: "coding-15",
    category: "coding",
    question: `[리팩토링] 아래 코드의 최적화 문제를 찾고 개선하세요.

\`\`\`jsx
function ProductList({ products, onBuy }) {
  const expensiveTotal = useMemo(
    () => products.reduce((sum, p) => sum + p.price, 0),
    [products]
  );

  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return (
    <div>
      <span>합계: {expensiveTotal}</span>
      {products.map(p => (
        <div key={p.id} onClick={handleClick}>{p.name}</div>
      ))}
    </div>
  );
}
\`\`\``,
    answer: `문제점:
1. useMemo — reduce 자체는 가벼운 연산. useMemo 오버헤드(메모이제이션 비교 비용)가 오히려 클 수 있음
2. useCallback(() => console.log('clicked'), []) — 의존성이 없는 단순 함수에 useCallback은 불필요. 최적화 효과 없이 코드만 복잡해짐

실제로 메모이제이션이 유효한 경우:
- useMemo: 복잡한 계산 (정렬, 필터, 집계 등) + 렌더가 자주 일어나는 컴포넌트
- useCallback: React.memo로 감싼 자식에게 함수를 props로 전달할 때

개선:
\`\`\`jsx
function ProductList({ products }) {
  const total = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <span>합계: {total}</span>
      {products.map(p => (
        <div key={p.id} onClick={() => console.log('clicked')}>{p.name}</div>
      ))}
    </div>
  );
}
\`\`\`
원칙: 성능 문제가 실제로 측정되기 전까지는 메모이제이션 하지 않는다.`,
    isAdvanced: true,
  },
  {
    id: "coding-16",
    category: "coding",
    question: `[리팩토링] 아래 코드에서 불필요한 리렌더링을 찾고 개선하세요.

\`\`\`jsx
function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <ExpensiveChild count={count} />
    </div>
  );
}

function ExpensiveChild({ count }) {
  console.log('ExpensiveChild 렌더');
  return <div>{count}</div>;
}
\`\`\``,
    answer: `문제점:
- name이 바뀔 때마다 Parent가 리렌더 → ExpensiveChild도 같이 리렌더
- ExpensiveChild는 count만 사용하는데 name 변경에 영향받음

개선:
\`\`\`jsx
const ExpensiveChild = React.memo(function ExpensiveChild({ count }) {
  console.log('ExpensiveChild 렌더');
  return <div>{count}</div>;
});
\`\`\`
React.memo는 props가 얕은 비교(shallow equal)로 같으면 리렌더 건너뜀.

추가 고려:
- props로 객체/배열/함수를 내려보내면 매 렌더마다 새 참조 → memo 효과 없음
- 이 경우 해당 props를 useMemo/useCallback으로 안정화해야 함`,
  },
  {
    id: "coding-17",
    category: "coding",
    question: `[구현] 무한 스크롤 컴포넌트를 구현하세요.

요구사항:
- 초기 데이터 20개 표시
- 목록 끝에 도달하면 20개 추가 로드
- 로딩 중 스피너 표시
- 더 이상 데이터 없으면 "더 이상 없습니다" 표시`,
    answer: `\`\`\`jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = async (pageNum) => {
    setIsLoading(true);
    const res = await fetch(\`/api/items?page=\${pageNum}&limit=20\`);
    const data = await res.json();
    setItems(prev => [...prev, ...data.items]);
    setHasMore(data.hasMore);
    setIsLoading(false);
  };

  useEffect(() => { fetchItems(1); }, []);

  const bottomRef = useRef(null);
  useEffect(() => {
    if (!hasMore || isLoading) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setPage(prev => prev + 1);
    });
    const el = bottomRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) fetchItems(page);
  }, [page]);

  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
      {isLoading && <li>로딩 중...</li>}
      {!hasMore && <li>더 이상 없습니다</li>}
      <li ref={bottomRef} />
    </ul>
  );
}
\`\`\`
포인트: sentinel 요소(bottomRef)가 viewport에 진입하면 page 증가 → fetchItems 재호출. isLoading/hasMore 조건으로 중복 요청 방지.`,
    isAdvanced: true,
  },
  {
    id: "coding-18",
    category: "coding",
    question: `[구현] React Portal을 이용한 Modal 컴포넌트를 구현하세요.

요구사항:
- document.body에 렌더링 (부모 z-index, overflow 영향 안 받도록)
- 배경 클릭 시 닫힘
- ESC 키로 닫힘`,
    answer: `\`\`\`jsx
function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: '#fff', padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
\`\`\`
포인트:
- createPortal(ui, container): DOM 트리상 다른 위치에 렌더, React 이벤트 버블링은 정상 동작
- 내부 div에 stopPropagation으로 배경 클릭과 구분
- ESC 리스너는 isOpen일 때만 등록 + cleanup 필수`,
    isAdvanced: true,
  },
  {
    id: "coding-19",
    category: "coding",
    question: `[구현] 간단한 Carousel 컴포넌트를 구현하세요.

요구사항:
- 이전/다음 버튼으로 슬라이드 이동
- 마지막에서 다음 → 첫 번째로 순환
- 현재 인덱스 표시 (1 / 5 형태)`,
    answer: `\`\`\`jsx
function Carousel({ items }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex(i => (i - 1 + items.length) % items.length);
  const next = () => setIndex(i => (i + 1) % items.length);

  return (
    <div>
      <button onClick={prev}>이전</button>
      <div>{items[index]}</div>
      <button onClick={next}>다음</button>
      <span>{index + 1} / {items.length}</span>
    </div>
  );
}
\`\`\`
순환 공식:
- 이전: (i - 1 + length) % length → 0에서 -1이 되면 length-1로 순환
- 다음: (i + 1) % length → 마지막에서 0으로 순환

확장 포인트: 자동 재생(useInterval), 터치 스와이프(touchstart/touchend), 슬라이드 애니메이션(CSS transform translateX)`,
  },
  {
    id: "coding-20",
    category: "coding",
    question: `[구현] API 실패 시 자동 재시도하는 fetchWithRetry 함수를 구현하세요.

요구사항:
- 최대 retries번 재시도
- 재시도 전 delay ms 대기
- 모든 시도 실패 시 에러 throw`,
    answer: `\`\`\`js
async function fetchWithRetry(url, options = {}, retries = 3, delay = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
      return await res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
    }
  }
}
\`\`\`
포인트:
- attempt === retries이면 더 이상 재시도 없이 에러 전파
- delay * (attempt + 1): 선형 백오프 (단순 구현)
- 실제 서비스에서는 2 ** attempt * delay 형태의 Exponential Backoff + Jitter 사용
- res.ok 체크 필수: fetch는 4xx/5xx에서도 reject하지 않음`,
  },
];
