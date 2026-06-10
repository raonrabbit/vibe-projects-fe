import type { QuizQuestion } from "./types";

export const JAVASCRIPT_QUESTIONS: QuizQuestion[] = [
  // ── 실행 컨텍스트 & 스코프 ──────────────────────────────────────────────
  {
    id: "js-01",
    category: "javascript",
    question: "실행 컨텍스트(Execution Context)란 무엇인가요?",
    answer:
      "자바스크립트 코드가 실행되는 환경을 나타내는 추상적인 개념입니다. 변수·함수 선언·this 바인딩 등의 정보를 담고 있으며, 코드 실행 시 콜 스택에 쌓이고 실행이 완료되면 제거됩니다. 전역 컨텍스트·함수 컨텍스트·eval 컨텍스트 세 종류가 있습니다.\n\n[구성 요소]\n• LexicalEnvironment: let/const, 함수 선언 저장. EnvironmentRecord(현재 스코프 바인딩)와 OuterEnvironmentReference(상위 스코프 포인터)로 구성.\n• VariableEnvironment: var 선언 저장 (함수 스코프).\n• ThisBinding: 실행 시점의 this 값.\n\n[생성 단계]\n① Creation Phase: 선언 등록 — var는 undefined로 초기화, let/const는 TDZ 진입, 함수 선언은 함수 객체 전체 등록.\n② Execution Phase: 코드를 한 줄씩 실행하며 실제 값 할당.",
  },
  {
    id: "js-02",
    category: "javascript",
    question: "렉시컬 스코프(Lexical Scope)란?",
    answer:
      "함수가 호출된 위치가 아닌, 정의된 위치에 따라 상위 스코프가 결정되는 방식입니다. JS는 렉시컬 스코프를 따르기 때문에 함수를 어디서 호출하든 스코프 체인은 항상 함수가 작성된 위치 기준으로 동작합니다.\n\n[원리]\n함수 객체 생성 시 현재 렉시컬 환경을 [[Environment]] 슬롯에 저장합니다. 변수 탐색 시 이 참조를 따라 OuterEnvironmentReference를 순서대로 거슬러 올라가는 스코프 체인이 형성됩니다. 클로저도 이 메커니즘을 기반으로 동작합니다.",
  },
  {
    id: "js-03",
    category: "javascript",
    question:
      "`var`와 `let`의 스코프 차이를 실행 컨텍스트 관점에서 설명하세요.",
    answer:
      "`var`는 VariableEnvironment에 등록되어 함수 스코프를 가집니다. `let`/`const`는 LexicalEnvironment에 등록되어 블록 스코프를 가집니다. 또한 `var`는 Creation Phase에서 `undefined`로 초기화되어 호이스팅이 일어나지만, `let`/`const`는 TDZ 상태로 선언만 되고 초기화되지 않아 선언 전 접근 시 ReferenceError가 발생합니다.\n\n[실무 포인트]\nfor 루프에서 `var`를 쓰면 루프 종료 후 하나의 변수만 남아 클로저와 함께 버그를 유발합니다. `let`은 매 반복마다 새로운 블록 스코프 바인딩이 생성됩니다.",
    isAdvanced: true,
  },

  // ── 클로저 ──────────────────────────────────────────────────────────────
  {
    id: "js-04",
    category: "javascript",
    question: "클로저(Closure)란 무엇인가요?",
    answer:
      "클로저는 함수가 자신이 선언된 렉시컬 환경을 기억하여, 외부 함수의 실행이 끝난 후에도 외부 스코프의 변수에 접근할 수 있는 함수입니다. 내부 함수가 외부 함수의 변수를 참조하고 있으면, 외부 함수의 실행 컨텍스트가 콜 스택에서 제거되어도 해당 변수는 GC되지 않습니다.\n\n[동작 원리]\n함수 생성 시 [[Environment]] 슬롯에 현재 렉시컬 환경의 참조를 저장합니다. 외부 실행 컨텍스트가 스택에서 제거되어도 내부 함수의 [[Environment]]가 해당 환경을 참조하므로 GC 대상에서 제외됩니다.\n\n[주요 활용]\n• 데이터 은닉(모듈 패턴의 private 변수)\n• 부분 적용(Partial Application)\n• 메모이제이션(이전 결과 캐싱)\n• React useState(상태값 보존)",
  },
  {
    id: "js-05",
    category: "javascript",
    question: "클로저로 인한 메모리 누수는 어떻게 발생하고 방지하나요?",
    answer:
      "클로저가 더 이상 필요하지 않은데도 외부 변수를 계속 참조하면 GC가 해당 변수를 수거하지 못해 메모리 누수가 발생합니다. 이벤트 리스너나 타이머에서 클로저를 사용할 때 특히 주의해야 하며, 더 이상 필요하지 않은 경우 `removeEventListener`로 리스너를 제거하거나, 변수에 `null`을 할당해 참조를 끊어야 합니다.\n\n[대표 패턴]\n① 이벤트 리스너 미제거: DOM 노드가 제거되어도 리스너가 큰 스코프를 참조하면 유지됩니다.\n② setInterval 미정리: clearInterval 없이 방치하면 콜백과 참조 객체 계속 유지됩니다.\n③ React useEffect의 stale closure: 의존성 배열이 잘못되면 오래된 상태를 계속 참조합니다.",
    isAdvanced: true,
  },

  // ── 호이스팅 ────────────────────────────────────────────────────────────
  {
    id: "js-06",
    category: "javascript",
    question: "호이스팅(Hoisting)이란?",
    answer:
      "JS 엔진이 코드 실행 전 Creation Phase에서 변수와 함수 선언을 먼저 메모리에 등록하는 동작입니다. `var`는 `undefined`로 초기화되고, `let`/`const`는 TDZ 상태로 있어 선언 전 접근 시 ReferenceError가 발생합니다. 함수 선언문은 함수 객체 전체가 호이스팅됩니다.\n\n[구분 정리]\n• var → undefined로 초기화, 선언 전 접근 가능(undefined 반환)\n• let/const → TDZ 진입, 선언 전 접근 시 ReferenceError\n• 함수 선언문 → 함수 객체 전체 등록, 선언 전 호출 가능\n• 함수 표현식(var) → undefined로 초기화, 선언 전 호출 시 TypeError\n• 클래스 → TDZ 진입, 선언 전 접근 시 ReferenceError",
  },
  {
    id: "js-07",
    category: "javascript",
    question: "TDZ(Temporal Dead Zone)가 존재하는 이유는?",
    answer:
      "`var`의 호이스팅은 예측하기 어려운 버그를 유발합니다. `let`/`const`에 TDZ를 도입함으로써 선언 전 변수 사용을 런타임 에러로 잡아내어 코드의 예측 가능성을 높입니다. 또한 `const`의 경우 선언과 동시에 반드시 초기화해야 한다는 의미론을 강화합니다.\n\n[TDZ 범위]\n블록의 시작부터 let/const 선언문 바로 직전까지의 구간입니다. 선언은 호이스팅되어 엔진이 인식하지만, 초기화는 선언문 실행 시점까지 미뤄집니다.",
    isAdvanced: true,
  },

  // ── 이벤트 루프 ─────────────────────────────────────────────────────────
  {
    id: "js-08",
    category: "javascript",
    question: "자바스크립트가 싱글 스레드임에도 비동기 처리가 가능한 이유는?",
    answer:
      "JS 엔진 자체는 싱글 스레드이지만, 브라우저나 Node.js 런타임이 Web APIs / libuv 같은 별도의 스레드 풀을 제공합니다. 비동기 작업은 런타임에 위임되고, 완료되면 콜백이 Task Queue나 Microtask Queue에 추가됩니다. 이벤트 루프가 콜 스택이 비어있을 때 큐에서 콜백을 꺼내 실행하는 방식으로 비동기를 처리합니다.\n\n[이벤트 루프 순서]\n① 콜 스택 실행 → ② Microtask Queue 전부 처리(새로 추가된 것 포함) → ③ Task Queue에서 하나 처리 → ④ 렌더링(브라우저) → 반복",
  },
  {
    id: "js-09",
    category: "javascript",
    question: "Microtask와 Macrotask의 차이는?",
    answer:
      "Microtask(Promise.then, queueMicrotask, MutationObserver)는 현재 작업이 끝난 직후 렌더링 전에 모두 처리됩니다. Macrotask(setTimeout, setInterval, I/O, UI 이벤트)는 Microtask Queue가 완전히 비워진 후 한 번에 하나씩 처리됩니다. 따라서 Microtask가 항상 Macrotask보다 먼저 실행됩니다.\n\n[실행 순서 예시]\nconsole.log('1') → setTimeout(cb, 0) → Promise.resolve().then(cb) → console.log('5') 순서로 코드가 있으면 출력은 1, 5, Promise 콜백, setTimeout 콜백 순입니다.",
  },
  {
    id: "js-10",
    category: "javascript",
    question: "`setTimeout(fn, 0)`이 즉시 실행되지 않는 이유는?",
    answer:
      "setTimeout은 최소 지연 시간을 보장하지만, 실제 실행은 이벤트 루프의 Task Queue 순서에 따릅니다. 현재 콜 스택이 모두 비워지고 Microtask Queue까지 처리된 후에야 Task Queue에서 꺼내 실행됩니다. 또한 브라우저 스펙상 최소 1ms(중첩 시 4ms)의 딜레이가 강제됩니다.\n\n[Node.js 차이]\nNode.js에서는 process.nextTick이 Microtask보다도 먼저 처리되며, setImmediate는 I/O 콜백 이후 check 단계에서 실행됩니다.",
    isAdvanced: true,
  },

  // ── Promise & async/await ─────────────────────────────────────────────
  {
    id: "js-11",
    category: "javascript",
    question: "async/await와 Promise의 차이는?",
    answer:
      "async/await은 Promise 기반의 문법적 설탕입니다. Promise 체이닝을 동기 코드처럼 읽히게 해주어 가독성이 좋고, try/catch로 에러 처리가 가능합니다. 내부적으로 async 함수는 항상 Promise를 반환하고, await은 Promise가 settled될 때까지 해당 함수의 실행을 일시 중단합니다.\n\n[내부 동작]\nawait 키워드를 만나면 해당 Promise가 settled될 때까지 현재 함수 실행을 중단하고, 이후 코드를 Microtask Queue에 등록합니다. 이는 Generator의 yield 동작과 본질적으로 동일합니다.",
  },
  {
    id: "js-12",
    category: "javascript",
    question: "Promise와 콜백의 차이는? Promise가 해결하는 문제는?",
    answer:
      "콜백 방식은 중첩이 깊어질수록 '콜백 지옥'이 발생하고 에러 처리가 분산되는 문제가 있습니다. Promise는 체이닝으로 비동기 흐름을 선형으로 표현하고, catch로 에러를 한 곳에서 처리할 수 있습니다. 또한 Promise는 한 번 settled되면 상태가 변하지 않는(immutable) 특성으로 신뢰성이 높습니다.\n\n[Promise 3가지 상태]\n• pending: 초기 상태\n• fulfilled: 작업 성공 완료\n• rejected: 작업 실패\n상태 전이는 단방향이며 한 번 settled되면 변경 불가합니다.",
    isAdvanced: true,
  },
  {
    id: "js-13",
    category: "javascript",
    question: "`await Promise.all([...])`과 순차 `await`의 성능 차이는?",
    answer:
      "순차 `await`은 각 비동기 작업이 완료된 후 다음 작업을 시작하므로 총 시간이 각 작업 시간의 합입니다. `Promise.all`은 모든 작업을 동시에 시작하므로 총 시간이 가장 오래 걸리는 작업 하나의 시간입니다. 독립적인 비동기 작업은 항상 `Promise.all`로 병렬 처리해야 합니다.\n\n[주의사항]\nPromise.all은 하나라도 reject되면 즉시 전체 reject됩니다. 일부 실패가 허용되는 경우 Promise.allSettled를 사용합니다.",
    isAdvanced: true,
  },
  {
    id: "js-14",
    category: "javascript",
    question:
      "Promise.all, Promise.allSettled, Promise.race, Promise.any의 차이는?",
    answer:
      "Promise.all은 모든 Promise가 fulfilled되면 resolve, 하나라도 reject되면 즉시 reject합니다. 모두 성공해야 할 때 사용합니다.\nPromise.allSettled는 성공·실패 무관하게 모두 완료될 때까지 기다리며 {status, value/reason} 배열을 반환합니다.\nPromise.race는 가장 먼저 settled(성공·실패 무관)되는 결과를 반환하며 타임아웃 구현에 활용합니다.\nPromise.any는 가장 먼저 fulfilled되는 결과를 반환하며, 모두 reject되면 AggregateError를 throw합니다.",
  },

  // ── 프로토타입 체인 ───────────────────────────────────────────────────
  {
    id: "js-15",
    category: "javascript",
    question: "프로토타입 체인이란?",
    answer:
      "객체에서 프로퍼티나 메서드를 찾을 때 현재 객체에 없으면 [[Prototype]] 링크를 따라 상위 프로토타입에서 찾고, 없으면 계속 올라가 Object.prototype까지 탐색하는 메커니즘입니다. 최상위인 Object.prototype의 [[Prototype]]은 null입니다.\n\n[new 연산자 동작 원리]\n① Object.create(Constructor.prototype)으로 빈 객체 생성\n② 생성자 함수를 새 객체에 바인딩하여 실행(this = 새 객체)\n③ 생성자가 객체를 반환하면 그것을, 아니면 새 객체를 반환",
  },
  {
    id: "js-16",
    category: "javascript",
    question: "ES6 클래스(class)는 프로토타입과 어떤 관계인가요?",
    answer:
      "ES6 클래스는 프로토타입 기반 상속의 문법적 설탕(Syntactic Sugar)입니다. 내부적으로 클래스 메서드는 prototype 객체에 추가되고, extends는 자식 클래스의 prototype.__proto__를 부모 클래스 prototype으로 연결합니다. typeof로 확인하면 'function'이 반환됩니다.\n\n[차이점]\n클래스는 일반 함수와 달리 반드시 new로만 호출해야 하며, TDZ의 영향을 받고, 암묵적으로 strict mode로 동작합니다.",
  },
  {
    id: "js-17",
    category: "javascript",
    question: "`Object.create(null)`로 만든 객체의 특징은?",
    answer:
      "`Object.create(null)`은 프로토타입이 null인 객체를 만듭니다. Object.prototype의 메서드(toString, hasOwnProperty 등)가 없어서 순수한 해시맵으로 사용하기 적합합니다. 프로토타입 오염 공격(Prototype Pollution)을 방지하는 데도 사용됩니다.\n\n[Prototype Pollution]\n`obj.__proto__`나 `obj.constructor` 키를 통해 Object.prototype을 오염시키는 공격입니다. Object.create(null)로 만든 객체는 프로토타입 체인이 없으므로 이 공격에 면역입니다.",
    isAdvanced: true,
  },

  // ── this 바인딩 ─────────────────────────────────────────────────────
  {
    id: "js-18",
    category: "javascript",
    question: "this 바인딩의 4가지 규칙을 설명하세요.",
    answer:
      "this는 함수 호출 방식에 따라 동적으로 결정됩니다. 우선순위 순으로:\n① new 바인딩: new로 호출 시 새로 생성된 객체가 this\n② 명시적 바인딩: call/apply/bind로 지정한 객체가 this\n③ 암시적 바인딩: 메서드 호출 시 점(.) 앞의 객체가 this\n④ 기본 바인딩: 나머지 경우 전역 객체(strict mode에서는 undefined)\n\n[주의]\n메서드를 변수에 담아 호출하면 암시적 바인딩이 사라져 기본 바인딩이 적용됩니다(const fn = obj.method; fn() → this는 전역).",
  },
  {
    id: "js-19",
    category: "javascript",
    question: "화살표 함수와 일반 함수의 `this` 차이는?",
    answer:
      "일반 함수는 호출 방식에 따라 this가 동적으로 결정됩니다. 화살표 함수는 자체 this 바인딩이 없고, 선언된 위치의 외부 스코프 this를 렉시컬하게 캡처합니다. 따라서 화살표 함수는 call/apply/bind로 this를 변경할 수 없습니다.\n\n[실무 활용]\nsetInterval/setTimeout 콜백, Promise 체이닝 내부, React 클래스 컴포넌트의 이벤트 핸들러 등에서 화살표 함수를 사용하면 외부 컨텍스트의 this를 안전하게 사용할 수 있습니다.",
  },

  // ── 가비지 컬렉션 ───────────────────────────────────────────────────
  {
    id: "js-20",
    category: "javascript",
    question: "Mark & Sweep 가비지 컬렉션 알고리즘을 설명하세요.",
    answer:
      "Mark & Sweep은 현대 JS 엔진(V8)의 기본 GC 알고리즘입니다.\n\n[동작 순서]\n① Mark 단계: GC 루트(전역 변수, 콜 스택의 변수)에서 시작해 참조를 따라가며 도달 가능한 모든 객체에 마킹합니다.\n② Sweep 단계: 마킹되지 않은 객체(도달 불가능)를 메모리에서 해제합니다.\n③ Compact 단계: 해제 후 단편화된 메모리를 정리합니다.\n\n참조 카운팅 방식과 달리 순환 참조(a→b, b→a)가 있어도 외부에서 도달 불가능하면 정상 수거됩니다.",
  },
  {
    id: "js-21",
    category: "javascript",
    question: "V8의 세대별 GC(Generational GC)를 설명하세요.",
    answer:
      "V8은 '대부분의 객체는 짧게 산다'는 세대 가설(Generational Hypothesis)을 활용합니다.\n\n[구조]\n• Young Generation(New Space): 새로 생성된 객체 관리. Scavenger 알고리즘으로 빈번하게 수거. From/To 두 공간을 오가며 살아남은 객체를 복사.\n• Old Generation(Old Space): Young GC에서 여러 번 살아남은 객체. Mark-Compact로 덜 빈번하게 수거.\n\n[효과]\n짧게 사는 객체가 많으므로 Young Generation을 자주 빠르게 수거하고, 오래 사는 객체는 Old Generation에서 드물게 처리해 전체 GC 비용을 줄입니다.",
    isAdvanced: true,
  },
  {
    id: "js-22",
    category: "javascript",
    question: "자바스크립트 메모리 누수를 어떻게 감지하고 해결하나요?",
    answer:
      "Chrome DevTools의 Memory 탭에서 힙 스냅샷을 찍거나 Allocation Timeline을 통해 메모리 증가를 추적할 수 있습니다. 주요 원인은 이벤트 리스너 미제거·해제되지 않은 타이머·클로저에 의한 과도한 참조·의도치 않은 전역 변수입니다. 해결책은 불필요한 이벤트 리스너 제거·clearInterval/clearTimeout 호출·WeakMap/WeakRef 사용·전역 변수 최소화입니다.\n\n[4대 누수 패턴]\n① 전역 변수: GC 루트에 영구 등록\n② 이벤트 리스너: removeEventListener 없이 방치\n③ setInterval: clearInterval 없이 방치\n④ 클로저: 필요 이상으로 큰 스코프 참조",
    isAdvanced: true,
  },

  // ── 모듈 시스템 ─────────────────────────────────────────────────────
  {
    id: "js-23",
    category: "javascript",
    question: "CommonJS(CJS)와 ES Modules(ESM)의 차이는?",
    answer:
      "CJS는 Node.js에서 사용하는 동기적 모듈 시스템으로, 런타임에 동적으로 로드합니다(require()). ESM은 브라우저 표준으로, 파싱 단계에서 정적으로 분석되어 트리 쉐이킹과 코드 최적화가 가능합니다(import/export). ESM은 Live Binding을 지원하여 export된 값이 변경되면 import한 쪽에도 반영됩니다.\n\n[트리 쉐이킹]\nESM은 정적 분석이 가능하므로 번들러(Webpack, Rollup)가 실제로 사용되지 않는 export를 최종 번들에서 제거할 수 있습니다. CJS는 런타임 동적 로딩이기 때문에 사전에 어떤 코드가 사용될지 알 수 없어 트리 쉐이킹이 어렵습니다.",
  },

  // ── 타입 변환 ────────────────────────────────────────────────────────
  {
    id: "js-24",
    category: "javascript",
    question: "`==`와 `===`의 차이는?",
    answer:
      "`==`는 타입이 다를 경우 암묵적 타입 변환을 수행한 후 비교하는 느슨한 동등 연산자입니다. `===`는 타입 변환 없이 값과 타입이 모두 같아야 true를 반환하는 엄격한 동등 연산자입니다. 예측 불가능한 버그를 방지하기 위해 항상 `===` 사용을 권장합니다.\n\n[대표적인 == 함정]\n• 0 == false → true (false가 0으로 변환)\n• '' == false → true (둘 다 0으로 변환)\n• null == undefined → true (특별 규칙)\n• NaN == NaN → false (NaN은 자기 자신과도 불일치)\n• [] + {} → '[object Object]' (+ 연산자의 문자열 우선 변환)",
  },

  // ── WeakMap / WeakSet ────────────────────────────────────────────────
  {
    id: "js-25",
    category: "javascript",
    question: "Map과 WeakMap의 차이는?",
    answer:
      "Map은 키를 강한 참조로 유지하여 GC되지 않지만, WeakMap은 키 객체를 약한 참조로 유지하여 다른 참조가 없으면 GC될 수 있습니다. WeakMap은 이터러블이 아니라 열거할 수 없으며, 키는 반드시 객체여야 합니다. DOM 노드나 외부 라이브러리 객체에 부가 데이터를 연결할 때 메모리 누수 없이 사용할 수 있습니다.\n\n[활용 예시]\nDOM 요소에 캐시 데이터를 WeakMap으로 연결하면, 해당 요소가 DOM에서 제거되었을 때 WeakMap 항목도 자동으로 GC 대상이 됩니다. Map을 썼다면 직접 삭제하지 않는 한 메모리에 남습니다.",
  },

  // ── Generator & Iterator ─────────────────────────────────────────────
  {
    id: "js-26",
    category: "javascript",
    question: "Generator 함수란 무엇이고 어떻게 동작하나요?",
    answer:
      "Generator는 function* 키워드로 선언하며, yield로 실행을 일시 중단하고 값을 내보낼 수 있는 함수입니다. 호출 시 즉시 실행되지 않고 Iterator 객체를 반환하며, next()를 호출할 때마다 다음 yield까지 실행됩니다.\n\n[Iterator 프로토콜]\nnext()를 호출하면 { value, done } 형태의 객체를 반환합니다. done이 true가 될 때까지 반복 가능합니다.\n\n[주요 활용]\n• 무한 시퀀스 생성(ID 생성기, 페이지네이션)\n• 지연 평가(Lazy Evaluation): 필요한 시점에만 값 계산\n• async/await 폴리필: Babel은 async/await을 Generator로 트랜스파일",
  },
  {
    id: "js-27",
    category: "javascript",
    question: "Generator가 async/await의 기반이 되는 이유는?",
    answer:
      "Generator는 yield로 실행을 중단하고 외부에서 값을 주입받아 재개할 수 있습니다. 비동기 작업의 완료를 기다리는 동안 실행을 멈추고, 완료 후 결과값을 주입받아 재개하는 async/await의 동작과 동일한 원리입니다. Babel은 async/await을 Generator 기반으로 트랜스파일합니다.\n\n[동작 유사성]\nawait somePromise는 Generator의 yield somePromise와 같습니다. 외부 실행기(runner)가 Promise 완료 시 gen.next(result)를 호출해 재개하는 구조가 async/await의 내부 동작입니다.",
    isAdvanced: true,
  },

  // ── Proxy & Reflect ─────────────────────────────────────────────────
  {
    id: "js-28",
    category: "javascript",
    question: "Proxy란 무엇이고 어떤 상황에서 사용하나요?",
    answer:
      "Proxy는 객체에 대한 기본 동작(읽기, 쓰기, 삭제 등)을 가로채고 커스텀 동작을 정의할 수 있는 래퍼 객체입니다. get, set, deleteProperty 등 13가지 트랩(trap)을 정의할 수 있습니다.\n\n[활용 사례]\n• 유효성 검사: set 트랩에서 타입/범위 검사\n• 반응성 시스템: Vue 3의 reactive()는 Proxy로 프로퍼티 변경을 감지\n• 로깅/디버깅: get 트랩으로 프로퍼티 접근 추적\n• 기본값 제공: get 트랩에서 undefined 대신 기본값 반환",
  },
  {
    id: "js-29",
    category: "javascript",
    question: "Proxy와 Object.defineProperty의 차이는?",
    answer:
      "Object.defineProperty는 특정 프로퍼티 하나에만 getter/setter를 정의할 수 있어, 동적으로 추가된 프로퍼티나 배열 인덱스 변경을 감지할 수 없습니다. Proxy는 객체 전체를 가로채는 트랩을 설정하므로 모든 프로퍼티 접근을 감지하고, 13가지 트랩을 통해 다양한 동작을 커스터마이징할 수 있습니다. Vue 3·MobX 등이 Proxy 기반 반응성 시스템으로 마이그레이션한 이유입니다.\n\n[Vue 2 vs Vue 3]\nVue 2는 Object.defineProperty를 사용해 배열 인덱스 직접 수정이나 동적 프로퍼티 추가를 감지하지 못했습니다. Vue 3는 Proxy로 전환하여 이 한계를 극복했습니다.",
    isAdvanced: true,
  },

  // ── 프로세스 vs 스레드 ──────────────────────────────────────────────
  {
    id: "js-30",
    category: "javascript",
    question: "프로세스와 스레드의 차이는?",
    answer:
      "프로세스는 OS로부터 독립적인 메모리 공간(Code/Data/Heap/Stack)을 할당받은 실행 단위입니다. 스레드는 프로세스 내의 실행 흐름으로, 같은 프로세스의 Code/Data/Heap을 공유하고 Stack만 독립적입니다. 스레드는 메모리를 공유하므로 통신이 빠르지만 동기화 문제(Race Condition, Deadlock)가 발생할 수 있습니다.\n\n[브라우저 구조]\nChrome은 탭마다 별도 프로세스를 사용합니다. 한 탭이 죽어도 다른 탭에 영향을 주지 않는 안정성 덕분입니다.",
  },
  {
    id: "js-31",
    category: "javascript",
    question: "JavaScript는 싱글 스레드인데 멀티코어 CPU를 어떻게 활용하나요?",
    answer:
      "메인 스레드는 단일 스레드로 동작하지만, Web Workers API를 통해 별도 스레드에서 CPU 집약적 작업을 실행할 수 있습니다. Node.js에서는 Worker Threads와 Cluster 모듈을 사용합니다. 또한 브라우저와 Node.js 런타임 자체는 멀티스레드로 구현되어 있어 I/O 작업을 백그라운드 스레드에서 처리합니다.\n\n[Web Worker 특징]\n메인 스레드와 메시지 패싱(postMessage)으로 통신하며 DOM에 직접 접근할 수 없습니다. 이미지 처리·대용량 데이터 계산 등 메인 스레드를 블로킹할 수 있는 작업에 사용합니다.",
    isAdvanced: true,
  },

  // ── 메모리 구조 ─────────────────────────────────────────────────────
  {
    id: "js-32",
    category: "javascript",
    question: "스택(Stack)과 힙(Heap) 메모리의 차이는?",
    answer:
      "스택은 함수 호출 시 자동 할당/해제되며 LIFO 구조로 빠릅니다. 지역 변수 등 원시값이 저장됩니다. 힙은 동적으로 할당되며 GC가 관리합니다. 객체·배열 같은 참조 타입이 저장됩니다.\n\n[Stack Overflow]\n함수가 재귀적으로 끝없이 호출되면 스택 프레임이 계속 쌓여 스택 크기 제한을 초과합니다. 꼬리 호출 최적화(Tail Call Optimization)나 반복문으로 대체할 수 있습니다.",
  },
  {
    id: "js-33",
    category: "javascript",
    question: "JavaScript에서 원시값과 참조값의 차이는?",
    answer:
      "원시값(number, string, boolean, null, undefined, symbol, bigint)은 Stack에 값 자체가 저장되어 복사 시 독립적인 복사본이 생깁니다. 참조값(object, array, function)은 Heap에 실제 데이터가 저장되고 Stack에는 주소(참조)만 저장됩니다. 따라서 복사 시 같은 Heap 주소를 가리켜 한쪽 변경이 다른 쪽에 영향을 줍니다.\n\n[React 불변성과의 연결]\n리액트는 참조 비교(===)로 상태 변경을 감지합니다. 객체 내부 값만 변경하면 참조가 같아 변경을 감지하지 못하므로, 새 객체를 만들어 할당하는 불변 업데이트가 필요합니다.",
  },
  {
    id: "js-34",
    category: "javascript",
    question: "V8의 Hidden Class란 무엇인가요?",
    answer:
      "V8은 동적 타입 언어인 JS의 성능을 높이기 위해 같은 구조(프로퍼티 이름과 순서가 동일)의 객체를 같은 Hidden Class로 묶어 관리합니다. 이를 통해 C++의 구조체처럼 프로퍼티에 오프셋 기반으로 빠르게 접근할 수 있습니다.\n\n[성능 저하 패턴]\n프로퍼티를 동적으로 추가하거나 순서를 달리하면 Hidden Class가 달라져 최적화가 무효화됩니다. 객체를 { x: 1, y: 2 }처럼 한 번에 초기화하는 것이 좋습니다.",
    isAdvanced: true,
  },

  // ── 동기 vs 비동기 / 블로킹 vs 논블로킹 ─────────────────────────────
  {
    id: "js-35",
    category: "javascript",
    question: "동기와 비동기, 블로킹과 논블로킹의 차이는?",
    answer:
      "동기/비동기는 작업 완료를 기다리는지 여부입니다. 동기는 작업이 끝날 때까지 기다리고, 비동기는 완료 여부와 상관없이 다음 코드를 실행합니다.\n블로킹/논블로킹은 제어권을 넘기는지 여부입니다. 블로킹은 완료될 때까지 제어권을 넘겨 스레드를 정지시키고, 논블로킹은 즉시 제어권을 반환합니다.\n\nJavaScript는 싱글 스레드이기 때문에 블로킹을 피하고 비동기 + 논블로킹 모델을 사용합니다. 네트워크 요청을 블로킹 방식으로 처리하면 응답 대기 중 UI가 전혀 반응하지 않게 됩니다.",
  },

  // ── V8 엔진과 JIT 컴파일 ─────────────────────────────────────────────
  {
    id: "js-36",
    category: "javascript",
    question: "JavaScript는 컴파일 언어인가요, 인터프리터 언어인가요?",
    answer:
      "전통적으로 인터프리터 언어로 분류되지만, 현대 JS 엔진(V8)은 JIT(Just-In-Time) 컴파일을 사용합니다. 처음에는 Ignition 인터프리터가 바이트코드를 실행하고, 자주 실행되는 코드(Hot Path)를 Turbofan이 기계어로 컴파일합니다. 타입이 변경되면 최적화를 취소(Deoptimization)하므로 일관된 타입 유지가 성능에 중요합니다.\n\n[처리 파이프라인]\n소스 코드 → Parser → AST → Ignition(바이트코드 인터프리팅) → Hot Code 감지 → Turbofan(기계어 JIT 컴파일) → Deoptimization(타입 변경 시 바이트코드로 롤백)",
  },
  {
    id: "js-37",
    category: "javascript",
    question: "V8의 Deoptimization이란 무엇이고 어떻게 방지하나요?",
    answer:
      "Turbofan은 타입이 일정하다고 가정하고 최적화된 기계어를 생성합니다. 런타임에 해당 가정이 깨지면(예: number 타입 변수에 string이 들어올 때) 최적화를 취소하고 Ignition 바이트코드로 롤백합니다. 이 과정을 Deoptimization이라 하며 성능 저하를 유발합니다.\n\n[방지 방법]\n• 함수에 항상 같은 타입의 인수를 전달합니다.\n• 객체의 프로퍼티 타입을 일관성 있게 유지합니다.\n• Hidden Class를 파괴하는 동적 프로퍼티 추가를 피합니다.\n• TypeScript를 사용해 타입 일관성을 컴파일 타임에 강제합니다.",
    isAdvanced: true,
  },
];
