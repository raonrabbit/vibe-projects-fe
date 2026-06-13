import type { QuizQuestion } from "./types";

export const CODING_QUESTIONS: QuizQuestion[] = [
  // ─── 리팩토링 (구두 설명) ──────────────────────────────────────────────────

  {
    id: "code-01",
    category: "coding",
    question:
      "[리팩토링] Prop Drilling이 5단계 이상 발생하고 있습니다. 어떻게 리팩토링하겠습니까?",
    answer:
      "단계별로 접근합니다. 먼저 Context API로 해결할 수 있는지 확인합니다. 테마·언어·유저 정보처럼 변경이 드문 데이터라면 createContext + useContext로 Prop Drilling을 제거합니다. 변경이 잦은 데이터라면 Zustand나 Jotai 같은 외부 상태관리를 고려합니다. 세 번째로 컴포넌트 합성(Composition) 패턴을 검토합니다. children이나 render prop을 활용하면 중간 컴포넌트를 거치지 않고 직접 전달할 수 있어 Drilling 자체를 없앨 수 있습니다.\n\n**부가설명:** 무조건 전역 상태를 쓰기 전에 컴포넌트 구조 자체를 바꿀 수 있는지 먼저 봅니다. 컴포넌트를 더 높이 끌어올리거나(lifting state up) 합성으로 해결되면 상태관리 의존성 없이 해결됩니다.",
  },
  {
    id: "code-02",
    category: "coding",
    question:
      "[리팩토링] useEffect 안에서 fetch한 데이터를 setState로 저장하는 코드가 있는데, 컴포넌트 언마운트 시 메모리 누수 경고가 발생합니다. 어떻게 수정하겠습니까?",
    answer:
      "두 가지 방법이 있습니다. 첫 번째는 AbortController를 사용합니다. useEffect 안에서 controller = new AbortController()를 생성하고 fetch에 signal을 전달합니다. 클린업 함수에서 controller.abort()를 호출하면 언마운트 시 요청이 취소됩니다. 두 번째는 mounted 플래그를 사용합니다. let mounted = true로 선언하고, setState 호출 전 if (mounted)로 확인합니다. 클린업에서 mounted = false로 설정합니다. 실무에서는 AbortController가 더 근본적인 해결책이고, React Query를 쓰면 이런 처리를 자동으로 해줍니다.\n\n**부가설명:** 경고 메시지 'Can't perform a React state update on an unmounted component'가 이 케이스입니다. React 18에서는 이 경고가 제거됐지만, 요청 자체가 완료되고 불필요한 setState가 실행되는 건 여전히 낭비이므로 AbortController로 취소하는 것이 좋습니다.",
  },
  {
    id: "code-03",
    category: "coding",
    question:
      "[리팩토링] 컴포넌트가 300줄이 넘고 API 호출 로직, 폼 검증, 렌더링 로직이 전부 뒤섞여 있습니다. 어떻게 분리하겠습니까?",
    answer:
      "관심사 분리(Separation of Concerns) 원칙으로 세 레이어로 나눕니다. 첫째, API 호출은 Custom Hook(useFetchUser 등)이나 별도 서비스 함수로 추출합니다. React Query를 쓴다면 useQuery로 서버 상태를 완전히 분리합니다. 둘째, 폼 검증 로직은 별도 유틸 함수나 react-hook-form 같은 라이브러리로 추출합니다. 셋째, 남은 컴포넌트는 Container/Presentational 패턴으로 나눕니다. 컨테이너(스마트)는 데이터와 상태만 담당하고, 프레젠테이셔널(덤)은 props를 받아 렌더링만 합니다.\n\n**부가설명:** 단일 책임 원칙(SRP)을 컴포넌트에 적용하는 것입니다. '이 컴포넌트가 하는 일을 한 문장으로 설명할 수 있는가?'로 분리 기준을 잡으면 좋습니다.",
  },
  {
    id: "code-04",
    category: "coding",
    question:
      "[리팩토링] 5개 컴포넌트에서 동일한 로컬 스토리지 접근 로직(get/set/remove)이 반복되고 있습니다. 어떻게 리팩토링하겠습니까?",
    answer:
      "useLocalStorage Custom Hook으로 추출합니다. 훅 내부에서 로컬 스토리지 읽기·쓰기·삭제 로직과 JSON 직렬화/역직렬화, 스토리지 접근 실패 예외 처리, storage 이벤트 구독(다른 탭 변경 감지)을 처리합니다. 각 컴포넌트는 const [value, setValue] = useLocalStorage('key', defaultValue) 한 줄로 사용합니다. 수정이 필요하면 훅 한 곳만 고치면 되어 DRY 원칙을 지킬 수 있습니다.",
  },
  {
    id: "code-05",
    category: "coding",
    question:
      "[리팩토링] 아래처럼 JSX 안 조건부 렌더링이 중첩되어 가독성이 나쁩니다. 어떻게 개선하겠습니까?\n\nreturn (\n  <div>\n    {isLoggedIn ? (isAdmin ? <AdminPanel /> : (hasPermission ? <Dashboard /> : <Forbidden />)) : <Login />}\n  </div>\n);",
    answer:
      "렌더링 로직을 JSX 밖으로 꺼냅니다. 먼저 렌더링할 컴포넌트를 결정하는 함수 getContent()를 만들고 if/else로 명확하게 분기합니다. JSX는 {getContent()}만 남깁니다. 또는 Early Return 패턴을 활용하여 각 조건을 컴포넌트 상단에서 순서대로 처리합니다. 삼항 연산자 중첩은 '두 단계' 이상을 넘어가면 가독성이 급격히 나빠지므로 즉시 함수로 분리하는 것이 좋습니다.\n\n**부가설명:** 조건이 많아질수록 Strategy 패턴처럼 { condition: Component } 매핑 객체를 만들고 참조하는 방식도 깔끔합니다.",
  },
  {
    id: "code-06",
    category: "coding",
    question:
      "[리팩토링] Redux Toolkit으로 관리하던 서버 데이터(유저 목록, 상품 목록)를 React Query로 마이그레이션하는 과정을 설명해주세요.",
    answer:
      "단계적으로 진행합니다. ① QueryClient를 앱 최상단에 설정합니다. ② Redux slice에서 API 호출 로직(createAsyncThunk)과 로딩·에러 상태를 담당하던 부분을 useQuery로 교체합니다. ③ 기존 dispatch(fetchUsers()) → useQuery({ queryKey: ['users'], queryFn: fetchUsers })로 변경합니다. ④ isLoading·isError·data를 훅에서 직접 받아 사용합니다. ⑤ 뮤테이션은 useMutation + invalidateQueries로 처리합니다. Redux slice에서 서버 상태 관련 리듀서를 제거하면 보일러플레이트가 대폭 줄어듭니다.\n\n**부가설명:** 마이그레이션 후 Redux에는 진짜 클라이언트 UI 상태(모달 열림 여부, 선택된 탭 등)만 남습니다. Redux가 많이 줄어들고 코드가 단순해집니다.",
  },
  {
    id: "code-07",
    category: "coding",
    question:
      "[리팩토링] 아래 코드의 문제점을 말하고 수정해주세요.\n\nuseEffect(() => {\n  fetchUser(userId).then(setUser);\n}, []);",
    answer:
      "두 가지 문제가 있습니다. 첫째, userId가 deps 배열에 없습니다. userId가 변경돼도 재실행되지 않아 이전 유저 데이터가 유지됩니다. 의존성 배열에 userId를 추가해야 합니다. 둘째, 클린업이 없어 컴포넌트가 언마운트 후에 setUser가 호출될 수 있습니다. 수정: AbortController를 추가하고 클린업에서 abort()를 호출합니다.\n\n```js\nuseEffect(() => {\n  const controller = new AbortController();\n  fetchUser(userId, { signal: controller.signal })\n    .then(setUser)\n    .catch(err => { if (err.name !== 'AbortError') setError(err); });\n  return () => controller.abort();\n}, [userId]);\n```",
  },
  {
    id: "code-08",
    category: "coding",
    question:
      "[리팩토링] React.memo를 과도하게 모든 컴포넌트에 적용한 코드베이스가 있습니다. 어떤 기준으로 제거하겠습니까?",
    answer:
      "React Profiler로 실제 렌더링 시간을 측정한 뒤, 메모이제이션 비용(props 얕은 비교)이 렌더링 비용보다 작은 컴포넌트에서 제거합니다. 제거 우선 대상: ① 자체 렌더링이 매우 가벼운 컴포넌트(단순 텍스트, 아이콘), ② 부모가 자주 리렌더링되지 않는 컴포넌트, ③ props가 매 렌더링마다 새 참조로 전달되는 컴포넌트(React.memo가 무의미). 유지 우선 대상: ① 무거운 렌더링 로직이 있는 컴포넌트(리스트 아이템, 차트), ② 부모가 자주 바뀌지만 자신의 props는 안 바뀌는 컴포넌트.",
  },

  // ─── 구현 (직접 코딩) ─────────────────────────────────────────────────────

  {
    id: "code-09",
    category: "coding",
    question: "[구현] debounce 함수를 직접 구현해보세요.",
    answer:
      "```js\nfunction debounce(fn, delay) {\n  let timer = null;\n  return function (...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => {\n      fn.apply(this, args);\n    }, delay);\n  };\n}\n\n// 사용 예시\nconst onSearch = debounce((query) => fetchResults(query), 300);\n```\n\n**부가설명:** 핵심은 클로저로 timer를 유지하는 것입니다. 함수가 호출될 때마다 이전 타이머를 취소(clearTimeout)하고 새 타이머를 설정합니다. delay 이내에 호출이 없으면 마지막 호출만 실행됩니다. throttle과의 차이: debounce는 '마지막 호출 후 N ms 뒤에 실행', throttle은 'N ms마다 최대 1번 실행'입니다.",
  },
  {
    id: "code-10",
    category: "coding",
    question: "[구현] throttle 함수를 직접 구현해보세요.",
    answer:
      "```js\nfunction throttle(fn, limit) {\n  let inThrottle = false;\n  return function (...args) {\n    if (!inThrottle) {\n      fn.apply(this, args);\n      inThrottle = true;\n      setTimeout(() => {\n        inThrottle = false;\n      }, limit);\n    }\n  };\n}\n\n// 사용 예시\nconst onScroll = throttle(() => updatePosition(), 100);\n```\n\n**부가설명:** 클로저로 inThrottle 플래그를 유지합니다. 함수가 실행되면 플래그를 true로 설정하고 limit ms 후에 false로 초기화합니다. 스크롤·리사이즈 이벤트처럼 빈번하게 발생하는 이벤트를 일정 주기로 제한할 때 사용합니다.",
  },
  {
    id: "code-11",
    category: "coding",
    question: "[구현] 배열 flatten 함수(depth 옵션 포함)를 구현해보세요.",
    answer:
      "```js\nfunction flatten(arr, depth = 1) {\n  if (depth === 0) return arr.slice();\n  return arr.reduce((acc, val) => {\n    if (Array.isArray(val)) {\n      acc.push(...flatten(val, depth - 1));\n    } else {\n      acc.push(val);\n    }\n    return acc;\n  }, []);\n}\n\n// flatten([1, [2, [3, [4]]]], 1) → [1, 2, [3, [4]]]\n// flatten([1, [2, [3]]], Infinity) → [1, 2, 3]\n```\n\n**부가설명:** 재귀를 사용하여 depth만큼만 내려갑니다. depth가 Infinity면 완전히 평탄화됩니다. ES2019 이후 Array.prototype.flat(depth)이 내장되어 있습니다.",
  },
  {
    id: "code-12",
    category: "coding",
    question: "[구현] 객체 deep clone 함수를 구현해보세요. (순환 참조 고려)",
    answer:
      "```js\nfunction deepClone(obj, visited = new WeakMap()) {\n  if (obj === null || typeof obj !== 'object') return obj;\n  if (visited.has(obj)) return visited.get(obj); // 순환 참조 방지\n\n  if (obj instanceof Date) return new Date(obj);\n  if (obj instanceof RegExp) return new RegExp(obj);\n  if (Array.isArray(obj)) {\n    const clone = [];\n    visited.set(obj, clone);\n    obj.forEach((item, i) => { clone[i] = deepClone(item, visited); });\n    return clone;\n  }\n\n  const clone = {};\n  visited.set(obj, clone);\n  for (const key of Object.keys(obj)) {\n    clone[key] = deepClone(obj[key], visited);\n  }\n  return clone;\n}\n```\n\n**부가설명:** WeakMap으로 이미 복제한 객체를 추적하여 순환 참조 시 무한루프를 방지합니다. 간단한 경우엔 JSON.parse(JSON.stringify(obj))를 쓰지만 Date, undefined, 함수, 순환 참조를 처리하지 못합니다. 실무에서는 lodash의 cloneDeep을 사용합니다.",
  },
  {
    id: "code-13",
    category: "coding",
    question: "[구현] Promise.all을 직접 구현해보세요.",
    answer:
      "```js\nfunction promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    if (promises.length === 0) return resolve([]);\n\n    const results = new Array(promises.length);\n    let completed = 0;\n\n    promises.forEach((promise, index) => {\n      Promise.resolve(promise).then((value) => {\n        results[index] = value;\n        completed++;\n        if (completed === promises.length) {\n          resolve(results);\n        }\n      }).catch(reject); // 하나라도 실패하면 즉시 reject\n    });\n  });\n}\n```\n\n**부가설명:** 핵심 포인트: ① 순서 보장(results[index]에 저장), ② 모두 완료 시 resolve, ③ 하나라도 실패 시 즉시 reject. Promise.allSettled와의 차이: allSettled는 실패해도 reject하지 않고 모든 결과를 { status, value/reason } 형태로 반환합니다.",
  },
  {
    id: "code-14",
    category: "coding",
    question: "[구현] useDebounce Custom Hook을 구현해보세요.",
    answer:
      "```tsx\nimport { useState, useEffect } from 'react';\n\nfunction useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    const timer = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => clearTimeout(timer); // value가 바뀌면 이전 타이머 취소\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\n// 사용 예시\nconst debouncedQuery = useDebounce(searchQuery, 300);\nuseEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);\n```\n\n**부가설명:** 클린업에서 clearTimeout을 호출하는 게 핵심입니다. value가 빠르게 변경될 때 이전 타이머를 취소하여 delay 이후 마지막 값만 debouncedValue로 설정됩니다.",
  },
  {
    id: "code-15",
    category: "coding",
    question:
      "[구현] useFetch Custom Hook을 구현해보세요. (로딩, 에러, 데이터 상태 포함)",
    answer:
      "```tsx\nimport { useState, useEffect } from 'react';\n\nfunction useFetch<T>(url: string) {\n  const [data, setData] = useState<T | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<Error | null>(null);\n\n  useEffect(() => {\n    const controller = new AbortController();\n    setLoading(true);\n    setError(null);\n\n    fetch(url, { signal: controller.signal })\n      .then((res) => {\n        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);\n        return res.json();\n      })\n      .then((json) => setData(json))\n      .catch((err) => {\n        if (err.name !== 'AbortError') setError(err);\n      })\n      .finally(() => setLoading(false));\n\n    return () => controller.abort();\n  }, [url]);\n\n  return { data, loading, error };\n}\n```\n\n**부가설명:** AbortController로 언마운트 시 요청을 취소합니다. finally로 항상 loading을 false로 설정합니다. 실무에서는 React Query의 useQuery가 캐싱·재시도·백그라운드 refetch까지 처리해주어 더 강력합니다.",
  },
  {
    id: "code-16",
    category: "coding",
    question: "[구현] useLocalStorage Custom Hook을 구현해보세요.",
    answer:
      "```tsx\nimport { useState } from 'react';\n\nfunction useLocalStorage<T>(key: string, initialValue: T) {\n  const [storedValue, setStoredValue] = useState<T>(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  const setValue = (value: T | ((prev: T) => T)) => {\n    try {\n      const valueToStore = value instanceof Function ? value(storedValue) : value;\n      setStoredValue(valueToStore);\n      window.localStorage.setItem(key, JSON.stringify(valueToStore));\n    } catch (error) {\n      console.error(error);\n    }\n  };\n\n  const removeValue = () => {\n    setStoredValue(initialValue);\n    window.localStorage.removeItem(key);\n  };\n\n  return [storedValue, setValue, removeValue] as const;\n}\n```\n\n**부가설명:** useState의 초기화 함수(lazy initialization)로 첫 렌더링 시에만 localStorage를 읽습니다. setter가 함수도 받을 수 있도록 하여 useState와 동일한 인터페이스를 제공합니다.",
  },
  {
    id: "code-17",
    category: "coding",
    question:
      "[구현] LRU Cache를 구현해보세요. (get, set 메서드, capacity 제한)",
    answer:
      "```js\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map(); // 삽입 순서를 유지하는 Map 활용\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const value = this.cache.get(key);\n    // 최근 사용으로 갱신: 삭제 후 재삽입\n    this.cache.delete(key);\n    this.cache.set(key, value);\n    return value;\n  }\n\n  set(key, value) {\n    if (this.cache.has(key)) {\n      this.cache.delete(key);\n    } else if (this.cache.size >= this.capacity) {\n      // Map의 첫 번째 키(가장 오래된) 제거\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n    this.cache.set(key, value);\n  }\n}\n```\n\n**부가설명:** JS의 Map은 삽입 순서를 보장합니다. 이를 활용하면 별도의 LinkedList 없이도 LRU를 O(1)로 구현할 수 있습니다. 접근 시 삭제 후 재삽입으로 '가장 최근'으로 갱신하고, 용량 초과 시 첫 번째 키(가장 오래된)를 제거합니다.",
    isAdvanced: true,
  },
  {
    id: "code-18",
    category: "coding",
    question: "[구현] 이진 탐색을 반복문으로 구현해보세요.",
    answer:
      "```js\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n\n  while (left <= right) {\n    const mid = left + Math.floor((right - left) / 2);\n\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n\n  return -1; // 없으면 -1\n}\n\n// 시간복잡도: O(log n)\n```\n\n**부가설명:** mid 계산 시 (left + right) / 2 대신 left + Math.floor((right - left) / 2)를 사용합니다. left + right가 정수 최대값을 초과할 수 있기 때문입니다(Java/C++에서 특히 중요). 반드시 정렬된 배열에서만 사용 가능합니다.",
  },
  {
    id: "code-19",
    category: "coding",
    question: "[구현] 클로저를 활용한 memoize 함수를 구현해보세요.",
    answer:
      "```js\nfunction memoize(fn) {\n  const cache = new Map();\n  return function (...args) {\n    const key = JSON.stringify(args);\n    if (cache.has(key)) {\n      return cache.get(key);\n    }\n    const result = fn.apply(this, args);\n    cache.set(key, result);\n    return result;\n  };\n}\n\n// 사용 예시\nconst memoizedFib = memoize(function fib(n) {\n  if (n <= 1) return n;\n  return memoizedFib(n - 1) + memoizedFib(n - 2);\n});\n```\n\n**부가설명:** 클로저로 cache Map을 유지합니다. JSON.stringify(args)를 키로 사용하여 인수 조합을 문자열로 변환합니다. 단, 함수·undefined·순환 참조는 직렬화되지 않아 별도 처리가 필요합니다. DP의 Memoization 개념을 직접 구현한 것과 동일합니다.",
  },
  {
    id: "code-20",
    category: "coding",
    question: "[구현] Array.prototype.reduce를 직접 구현해보세요.",
    answer:
      "```js\nArray.prototype.myReduce = function (callback, initialValue) {\n  const hasInitial = arguments.length >= 2;\n  let accumulator = hasInitial ? initialValue : this[0];\n  let startIndex = hasInitial ? 0 : 1;\n\n  if (!hasInitial && this.length === 0) {\n    throw new TypeError('myReduce: empty array with no initial value');\n  }\n\n  for (let i = startIndex; i < this.length; i++) {\n    if (i in this) { // 희소 배열(sparse array) 처리\n      accumulator = callback(accumulator, this[i], i, this);\n    }\n  }\n\n  return accumulator;\n};\n```\n\n**부가설명:** 포인트: ① initialValue 유무에 따라 시작 인덱스가 달라집니다. ② 빈 배열 + initialValue 없음은 TypeError를 던집니다. ③ i in this로 희소 배열의 빈 슬롯을 건너뜁니다.",
    isAdvanced: true,
  },
  {
    id: "code-21",
    category: "coding",
    question:
      "[구현] 함수 파이프라인(pipe)을 구현해보세요. pipe(f, g, h)(x)는 h(g(f(x)))를 실행합니다.",
    answer:
      "```js\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\n\n// 사용 예시\nconst process = pipe(\n  (x) => x * 2,\n  (x) => x + 1,\n  (x) => x ** 2\n);\nprocess(3); // ((3*2)+1)^2 = 49\n\n// compose는 오른쪽에서 왼쪽으로 실행 (반대 방향)\nconst compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);\n```\n\n**부가설명:** pipe는 함수형 프로그래밍의 핵심 개념입니다. 왼쪽에서 오른쪽으로 데이터를 변환하는 함수들을 연결합니다. Redux의 compose, RxJS의 pipe, lodash/fp 등에서 활용됩니다. reduce의 응용이라는 점이 면접에서 자주 평가됩니다.",
  },
  {
    id: "code-22",
    category: "coding",
    question:
      "[구현] useIntersectionObserver Custom Hook을 구현해보세요. (무한 스크롤, Lazy Load 등에 사용)",
    answer:
      "```tsx\nimport { useEffect, useRef, useState } from 'react';\n\nfunction useIntersectionObserver(\n  options: IntersectionObserverInit = {}\n) {\n  const ref = useRef<Element | null>(null);\n  const [isIntersecting, setIsIntersecting] = useState(false);\n\n  useEffect(() => {\n    const element = ref.current;\n    if (!element) return;\n\n    const observer = new IntersectionObserver(([entry]) => {\n      setIsIntersecting(entry.isIntersecting);\n    }, options);\n\n    observer.observe(element);\n    return () => observer.disconnect();\n  }, [options.threshold, options.root, options.rootMargin]);\n\n  return { ref, isIntersecting };\n}\n\n// 사용 예시 (무한 스크롤)\nconst { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });\nuseEffect(() => { if (isIntersecting) fetchNextPage(); }, [isIntersecting]);\nreturn <div ref={ref}>로드 트리거</div>;\n```\n\n**부가설명:** IntersectionObserver는 스크롤 이벤트보다 성능이 좋습니다. 스크롤 이벤트는 매번 실행되지만 IO는 뷰포트 교차 시에만 콜백이 호출됩니다. 클린업에서 disconnect()로 관찰을 해제합니다.",
  },
  {
    id: "code-23",
    category: "coding",
    question:
      "[구현] EventEmitter(이벤트 버스)를 구현해보세요. (on, off, emit 메서드)",
    answer:
      "```js\nclass EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n\n  on(event, listener) {\n    if (!this.events[event]) this.events[event] = [];\n    this.events[event].push(listener);\n    return this; // 체이닝 가능\n  }\n\n  off(event, listener) {\n    if (!this.events[event]) return this;\n    this.events[event] = this.events[event].filter((l) => l !== listener);\n    return this;\n  }\n\n  emit(event, ...args) {\n    if (!this.events[event]) return;\n    this.events[event].forEach((listener) => listener(...args));\n    return this;\n  }\n\n  once(event, listener) {\n    const wrapper = (...args) => {\n      listener(...args);\n      this.off(event, wrapper);\n    };\n    return this.on(event, wrapper);\n  }\n}\n```\n\n**부가설명:** Observer 패턴의 구현입니다. once는 한 번만 실행되는 리스너로, wrapper로 감싸 실행 후 자신을 제거합니다. Node.js의 EventEmitter, 브라우저의 addEventListener가 같은 개념입니다. 컴포넌트 간 직접 의존 없이 통신할 때 사용합니다.",
  },
  {
    id: "code-24",
    category: "coding",
    question:
      "[구현] 중복 없이 배열에서 고유한 값만 추출하는 방법을 3가지로 설명해보세요.",
    answer:
      "```js\nconst arr = [1, 2, 2, 3, 3, 4];\n\n// 1. Set 활용 (가장 간결, O(n))\nconst unique1 = [...new Set(arr)];\n\n// 2. filter + indexOf (O(n²), 인덱스와 처음 등장 위치가 같은 것만 유지)\nconst unique2 = arr.filter((val, idx) => arr.indexOf(val) === idx);\n\n// 3. reduce + includes\nconst unique3 = arr.reduce((acc, val) => {\n  if (!acc.includes(val)) acc.push(val);\n  return acc;\n}, []);\n```\n\n**부가설명:** 성능 순서: Set(O(n)) > filter+indexOf(O(n²)) > reduce+includes(O(n²)). 실무에서는 Set을 사용합니다. 객체 배열에서 특정 키 기준 중복 제거는 Map을 사용합니다: new Map(arr.map(item => [item.id, item])).values().",
  },
  {
    id: "code-25",
    category: "coding",
    question:
      "[구현] 비동기 작업을 순차적으로 실행하는 함수를 구현해보세요. (Promise 체이닝 없이 for...of 또는 reduce 사용)",
    answer:
      "```js\n// 방법 1: for...of + async/await (가장 직관적)\nasync function runSequential(tasks) {\n  const results = [];\n  for (const task of tasks) {\n    const result = await task(); // 하나씩 기다림\n    results.push(result);\n  }\n  return results;\n}\n\n// 방법 2: reduce로 Promise 체인 구성\nfunction runSequentialReduce(tasks) {\n  return tasks.reduce(\n    (chain, task) => chain.then((results) =>\n      task().then((result) => [...results, result])\n    ),\n    Promise.resolve([])\n  );\n}\n\n// 사용 예시\nconst tasks = [\n  () => fetch('/api/a').then(r => r.json()),\n  () => fetch('/api/b').then(r => r.json()),\n];\nrunSequential(tasks).then(console.log);\n```\n\n**부가설명:** Promise.all은 병렬 실행입니다. 순차 실행이 필요한 경우(앞 결과가 다음 요청에 필요한 경우, API rate limit 등)에는 for...of + await를 사용합니다. reduce 방식은 async/await 없이 Promise 체인만으로 순차 처리하는 함수형 접근입니다.",
    isAdvanced: true,
  },
];
