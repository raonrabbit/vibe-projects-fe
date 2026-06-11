import type { QuizQuestion } from "./types";

export const JAVASCRIPT_QUESTIONS: QuizQuestion[] = [
  // ── 실행 컨텍스트 & 스코프 ──────────────────────────────────────────────
  {
    id: "js-01",
    category: "javascript",
    question: "실행 컨텍스트(Execution Context)란 무엇인가요?",
    answer:
      "자바스크립트 코드가 실행될 때 필요한 환경 정보를 담은 객체입니다. let/const를 저장하는 LexicalEnvironment, var를 저장하는 VariableEnvironment, 그리고 this 바인딩 정보로 구성됩니다. 실행 시에는 두 단계로 나뉩니다. Creation Phase에서 선언을 모두 등록하는데, 이때 var는 undefined로 초기화되고 let/const는 TDZ에 진입합니다. 이후 Execution Phase에서 코드를 한 줄씩 실행하며 실제 값을 할당합니다.",
  },
  {
    id: "js-02",
    category: "javascript",
    question: "렉시컬 스코프(Lexical Scope)란?",
    answer:
      "함수가 호출된 위치가 아닌, 정의된 위치를 기준으로 상위 스코프가 결정되는 방식입니다. 자바스크립트는 렉시컬 스코프를 따르기 때문에 함수를 어디서 호출하든 스코프 체인은 항상 함수가 작성된 곳을 기준으로 동작합니다. 함수가 생성될 때 현재 환경을 [[Environment]] 슬롯에 저장하고, 변수를 탐색할 때 이 참조를 따라 상위 스코프로 거슬러 올라갑니다. 클로저도 이 메커니즘을 기반으로 합니다.",
  },
  {
    id: "js-03",
    category: "javascript",
    question:
      "`var`와 `let`의 스코프 차이를 실행 컨텍스트 관점에서 설명하세요.",
    answer:
      "var는 함수 스코프이고 let/const는 블록 스코프입니다. 내부적으로는 var가 VariableEnvironment에, let/const가 LexicalEnvironment에 등록되는 차이입니다. 또한 var는 Creation Phase에서 undefined로 초기화되어 선언 전에 접근해도 오류가 없지만, let/const는 TDZ 상태에 있어 선언 전 접근 시 ReferenceError가 발생합니다. 실무적으로 for 루프에서 var를 쓰면 루프 종료 후 하나의 변수만 남아 클로저 버그를 만들 수 있는데, let은 매 반복마다 새 바인딩이 생성되어 이 문제가 없습니다.",
    isAdvanced: true,
  },

  // ── 클로저 ──────────────────────────────────────────────────────────────
  {
    id: "js-04",
    category: "javascript",
    question: "클로저(Closure)란 무엇인가요?",
    answer:
      "함수가 자신이 선언된 렉시컬 환경을 기억해서, 외부 함수의 실행이 끝난 후에도 외부 변수에 접근할 수 있는 함수입니다. 외부 함수의 실행 컨텍스트가 콜 스택에서 제거되어도, 내부 함수의 [[Environment]]가 그 환경을 참조하고 있으면 GC 대상에서 제외됩니다. private 변수를 만들거나, 함수에 일부 인자를 미리 고정하는 부분 적용, React의 useState처럼 상태값을 보존하는 데 활용됩니다.",
  },
  {
    id: "js-05",
    category: "javascript",
    question: "클로저로 인한 메모리 누수는 어떻게 발생하고 방지하나요?",
    answer:
      "클로저가 더 이상 필요 없는데도 큰 스코프를 계속 참조하면 GC가 해당 메모리를 수거하지 못합니다. 이벤트 리스너에서 자주 발생하는데, DOM 노드가 제거되어도 리스너가 살아있으면 참조하는 스코프 전체가 메모리에 남습니다. removeEventListener로 리스너를 명시적으로 제거하거나, React useEffect의 클린업 함수에서 정리해줘야 합니다. setInterval도 clearInterval 없이 방치하면 콜백과 참조 객체가 계속 유지됩니다.",
    isAdvanced: true,
  },

  // ── 호이스팅 ────────────────────────────────────────────────────────────
  {
    id: "js-06",
    category: "javascript",
    question: "호이스팅(Hoisting)이란?",
    answer:
      "JS 엔진이 코드 실행 전에 변수와 함수 선언을 먼저 메모리에 등록하는 동작입니다. var는 undefined로 초기화되어 선언 전에 접근해도 오류 없이 undefined를 반환하고, let/const는 TDZ 상태에 있어 선언 전 접근 시 ReferenceError가 발생합니다. 함수 선언문은 함수 객체 전체가 등록되어 선언 전 호출이 가능하지만, 함수 표현식(var로 선언)은 undefined로 초기화되어 선언 전 호출 시 TypeError가 납니다.",
  },
  {
    id: "js-07",
    category: "javascript",
    question: "TDZ(Temporal Dead Zone)가 존재하는 이유는?",
    answer:
      "var의 호이스팅은 선언 전에 접근해도 오류 없이 undefined를 반환해서 예측하기 어려운 버그를 만들 수 있습니다. TDZ는 이를 막기 위해 let/const의 선언 전 접근을 런타임 에러로 잡아내어 코드의 예측 가능성을 높입니다. 블록이 시작되는 시점부터 선언문이 실행되기 직전까지가 TDZ 구간이며, 선언은 호이스팅되어 엔진이 인식하지만 초기화는 선언문 실행 시점까지 미뤄집니다.",
    isAdvanced: true,
  },

  // ── 이벤트 루프 ─────────────────────────────────────────────────────────
  {
    id: "js-08",
    category: "javascript",
    question: "자바스크립트가 싱글 스레드임에도 비동기 처리가 가능한 이유는?",
    answer:
      "JS 엔진 자체는 싱글 스레드이지만, 브라우저나 Node.js 런타임이 별도의 스레드 풀을 통해 비동기 작업을 대신 처리합니다. 작업이 완료되면 콜백이 Task Queue나 Microtask Queue에 추가됩니다. 이벤트 루프가 콜 스택이 비어있을 때 큐에서 콜백을 꺼내 실행합니다. 실행 순서는 콜 스택 → Microtask Queue 전부 처리 → Task Queue에서 하나 처리 → 렌더링 순입니다.",
  },
  {
    id: "js-09",
    category: "javascript",
    question: "Microtask와 Macrotask의 차이는?",
    answer:
      "Microtask(Promise.then, queueMicrotask, MutationObserver)는 현재 작업이 끝난 직후 렌더링 전에 큐에 있는 것을 모두 처리합니다. Macrotask(setTimeout, setInterval, I/O, UI 이벤트)는 Microtask Queue가 완전히 비워진 후 하나씩 처리됩니다. 따라서 Microtask가 항상 Macrotask보다 먼저 실행됩니다. setTimeout(fn, 0)과 Promise.then(fn)이 함께 있으면 Promise 콜백이 먼저 실행됩니다.",
  },
  {
    id: "js-10",
    category: "javascript",
    question: "`setTimeout(fn, 0)`이 즉시 실행되지 않는 이유는?",
    answer:
      "지연 시간이 0이라도 현재 콜 스택이 비워지고 Microtask Queue까지 처리된 후에야 Task Queue에서 꺼내 실행됩니다. 타이머 지연 시간은 '최소 지연'을 보장할 뿐이고, 실제 실행 시점은 이벤트 루프의 상태에 달려있습니다. 브라우저 스펙상 중첩 setTimeout에는 최소 4ms의 딜레이가 강제되기도 합니다.",
    isAdvanced: true,
  },

  // ── Promise & async/await ─────────────────────────────────────────────
  {
    id: "js-11",
    category: "javascript",
    question: "async/await와 Promise의 차이는?",
    answer:
      "async/await은 Promise 기반의 문법적 설탕으로, Promise 체이닝을 동기 코드처럼 읽히게 해주어 가독성이 좋고 try/catch로 에러 처리가 가능합니다. async 함수는 항상 Promise를 반환하고, await은 Promise가 settled될 때까지 해당 함수의 실행을 일시 중단하고 이후 코드를 Microtask Queue에 등록합니다. 이는 Generator의 yield 동작과 본질적으로 동일합니다.",
  },
  {
    id: "js-12",
    category: "javascript",
    question: "Promise와 콜백의 차이는? Promise가 해결하는 문제는?",
    answer:
      "콜백은 중첩이 깊어질수록 콜백 지옥이 생기고 에러 처리가 각 콜백마다 분산됩니다. Promise는 체이닝으로 비동기 흐름을 선형으로 표현하고 catch 하나로 에러를 처리할 수 있습니다. Promise는 pending(대기), fulfilled(성공), rejected(실패) 세 가지 상태를 가지며, 한 번 settled되면 상태가 변하지 않아 신뢰성이 높습니다.",
    isAdvanced: true,
  },
  {
    id: "js-13",
    category: "javascript",
    question: "`await Promise.all([...])`과 순차 `await`의 성능 차이는?",
    answer:
      "순차 await은 각 작업이 완료된 후 다음 작업을 시작해 총 시간이 각 작업 시간의 합이 됩니다. Promise.all은 모든 작업을 동시에 시작해 총 시간이 가장 오래 걸리는 작업 하나의 시간입니다. 서로 독립적인 비동기 작업은 항상 Promise.all로 병렬 처리해야 합니다. 단, 하나라도 reject되면 즉시 전체가 reject되므로, 일부 실패를 허용해야 한다면 Promise.allSettled를 사용합니다.",
    isAdvanced: true,
  },
  {
    id: "js-14",
    category: "javascript",
    question:
      "Promise.all, Promise.allSettled, Promise.race, Promise.any의 차이는?",
    answer:
      "Promise.all은 모두 fulfilled되면 resolve되고, 하나라도 reject되면 즉시 reject됩니다. Promise.allSettled는 성공·실패 무관하게 모두 완료될 때까지 기다려 각 결과를 {status, value/reason} 배열로 반환합니다. Promise.race는 가장 먼저 settled(성공·실패 무관)되는 결과를 반환하며 타임아웃 구현에 씁니다. Promise.any는 가장 먼저 fulfilled된 결과를 반환하고, 모두 실패하면 AggregateError를 던집니다.",
  },

  // ── 프로토타입 체인 ───────────────────────────────────────────────────
  {
    id: "js-15",
    category: "javascript",
    question: "프로토타입 체인이란?",
    answer:
      "객체에서 프로퍼티를 찾을 때 현재 객체에 없으면 [[Prototype]] 링크를 따라 상위 프로토타입에서 탐색하고, 없으면 계속 올라가 Object.prototype까지 탐색하는 메커니즘입니다. new 연산자는 생성자 함수의 prototype을 참조하는 빈 객체를 만들고, 생성자 함수를 그 객체에 바인딩해 실행한 뒤, 생성자가 객체를 반환하면 그걸, 아니면 만들어진 빈 객체를 반환합니다.",
  },
  {
    id: "js-16",
    category: "javascript",
    question: "ES6 클래스(class)는 프로토타입과 어떤 관계인가요?",
    answer:
      "ES6 클래스는 프로토타입 기반 상속의 문법적 설탕입니다. 내부적으로 클래스 메서드는 prototype에 추가되고, extends는 자식 클래스의 prototype.__proto__를 부모 클래스 prototype으로 연결합니다. typeof로 확인해도 'function'이 나옵니다. 다만 일반 함수와 달리 반드시 new로만 호출해야 하고, TDZ의 영향을 받으며 암묵적으로 strict mode로 동작합니다.",
  },
  {
    id: "js-17",
    category: "javascript",
    question: "`Object.create(null)`로 만든 객체의 특징은?",
    answer:
      "프로토타입이 null인 순수한 객체를 만듭니다. Object.prototype의 메서드(toString, hasOwnProperty 등)가 없어서 키-값 저장소로 쓸 때 의도치 않은 프로퍼티 충돌이 없습니다. 또한 __proto__나 constructor 같은 키를 통해 Object.prototype을 오염시키는 프로토타입 오염 공격에 면역입니다.",
    isAdvanced: true,
  },

  // ── this 바인딩 ─────────────────────────────────────────────────────
  {
    id: "js-18",
    category: "javascript",
    question: "this 바인딩의 4가지 규칙을 설명하세요.",
    answer:
      "this는 함수 호출 방식에 따라 동적으로 결정됩니다. 우선순위 순으로, new로 호출하면 새로 생성된 객체, call/apply/bind로 명시하면 지정한 객체, 메서드로 호출하면 점(.) 앞의 객체, 그 외 일반 호출에서는 전역 객체(strict mode에서는 undefined)가 this가 됩니다. 메서드를 변수에 담아 호출하면 암시적 바인딩이 사라져 기본 바인딩이 적용되는 점을 주의해야 합니다.",
  },
  {
    id: "js-19",
    category: "javascript",
    question: "화살표 함수와 일반 함수의 `this` 차이는?",
    answer:
      "일반 함수는 호출 방식에 따라 this가 동적으로 결정되지만, 화살표 함수는 자체 this 바인딩이 없고 선언된 위치의 외부 스코프 this를 렉시컬하게 캡처합니다. 따라서 call/apply/bind로 this를 바꿀 수 없습니다. setTimeout·Promise 체이닝 콜백, React 클래스 컴포넌트의 이벤트 핸들러 등에서 외부 컨텍스트의 this를 안전하게 사용할 때 화살표 함수를 씁니다.",
  },

  // ── 가비지 컬렉션 ───────────────────────────────────────────────────
  {
    id: "js-20",
    category: "javascript",
    question: "Mark & Sweep 가비지 컬렉션 알고리즘을 설명하세요.",
    answer:
      "GC 루트(전역 변수, 콜 스택의 변수)에서 시작해 참조를 따라가며 도달 가능한 객체에 마킹하고, 마킹되지 않은 객체를 메모리에서 해제합니다. 참조 카운팅 방식과 달리, a가 b를, b가 a를 참조하는 순환 참조가 있어도 외부에서 도달 불가능하면 정상적으로 수거됩니다.",
  },
  {
    id: "js-21",
    category: "javascript",
    question: "V8의 세대별 GC(Generational GC)를 설명하세요.",
    answer:
      "'대부분의 객체는 짧게 산다'는 세대 가설을 활용합니다. 새로 생성된 객체는 Young Generation에서 빈번하게 수거하고, 여러 번 살아남은 객체만 Old Generation으로 승격시켜 드물게 수거합니다. 짧게 사는 객체가 많기 때문에 Young Generation을 자주 빠르게 처리하고 Old Generation은 덜 처리하는 방식으로 전체 GC 비용을 줄입니다.",
    isAdvanced: true,
  },
  {
    id: "js-22",
    category: "javascript",
    question: "자바스크립트 메모리 누수를 어떻게 감지하고 해결하나요?",
    answer:
      "Chrome DevTools의 Memory 탭에서 힙 스냅샷을 찍거나 Allocation Timeline으로 메모리 증가를 추적합니다. 주요 원인 네 가지는 이벤트 리스너를 removeEventListener 없이 방치하는 것, clearInterval 없이 setInterval을 사용하는 것, 클로저가 필요 이상으로 큰 스코프를 참조하는 것, 의도치 않게 전역 변수에 할당하는 것입니다. WeakMap이나 WeakRef를 사용하면 GC가 자동으로 처리할 수 있습니다.",
    isAdvanced: true,
  },

  // ── 모듈 시스템 ─────────────────────────────────────────────────────
  {
    id: "js-23",
    category: "javascript",
    question: "CommonJS(CJS)와 ES Modules(ESM)의 차이는?",
    answer:
      "CJS는 Node.js에서 사용하는 방식으로 런타임에 동적으로 모듈을 로드합니다(require()). ESM은 브라우저 표준으로 파싱 단계에서 정적으로 분석됩니다(import/export). ESM은 정적 분석이 가능하기 때문에 번들러가 실제로 사용되지 않는 export를 최종 번들에서 제거하는 트리 쉐이킹이 가능합니다. CJS는 런타임에 동적으로 로딩하기 때문에 어떤 코드가 사용될지 사전에 알 수 없어 트리 쉐이킹이 어렵습니다. 또한 ESM은 Live Binding을 지원해 export된 값이 변경되면 import한 쪽에도 반영됩니다.",
  },

  // ── 타입 변환 ────────────────────────────────────────────────────────
  {
    id: "js-24",
    category: "javascript",
    question: "`==`와 `===`의 차이는?",
    answer:
      "==는 타입이 다를 때 암묵적으로 타입을 변환한 후 비교하고, ===는 타입 변환 없이 값과 타입이 모두 같아야 true를 반환합니다. ==는 0 == false가 true, null == undefined가 true 같은 예측하기 어려운 결과가 있어서 항상 ===를 권장합니다. NaN은 자기 자신과도 같지 않아 NaN === NaN이 false인 점도 주의해야 합니다.",
  },

  // ── WeakMap / WeakSet ────────────────────────────────────────────────
  {
    id: "js-25",
    category: "javascript",
    question: "Map과 WeakMap의 차이는?",
    answer:
      "Map은 키를 강한 참조로 유지해서 명시적으로 삭제하지 않으면 GC되지 않습니다. WeakMap은 키 객체를 약한 참조로 유지해서 다른 참조가 없으면 자동으로 GC됩니다. WeakMap은 이터러블이 아니고 키는 반드시 객체여야 합니다. DOM 요소에 부가 데이터를 연결할 때 WeakMap을 사용하면, 해당 DOM 요소가 제거됐을 때 연결된 데이터도 자동으로 수거됩니다.",
  },

  // ── Generator & Iterator ─────────────────────────────────────────────
  {
    id: "js-26",
    category: "javascript",
    question: "Generator 함수란 무엇이고 어떻게 동작하나요?",
    answer:
      "function* 키워드로 선언하며, yield로 실행을 일시 중단하고 값을 내보낼 수 있는 함수입니다. 호출 시 즉시 실행되지 않고 Iterator 객체를 반환하며, next()를 호출할 때마다 다음 yield까지 실행합니다. next()는 { value, done } 형태를 반환합니다. 무한 시퀀스를 만들거나 필요한 시점에만 값을 계산하는 지연 평가에 유용하고, Babel이 async/await을 트랜스파일하면 Generator로 변환됩니다.",
  },
  {
    id: "js-27",
    category: "javascript",
    question: "Generator가 async/await의 기반이 되는 이유는?",
    answer:
      "Generator는 yield로 실행을 중단하고 외부에서 값을 주입받아 재개할 수 있습니다. 비동기 작업이 완료될 때까지 기다리다가 결과를 받아 재개하는 async/await의 동작과 본질적으로 같습니다. await somePromise가 내부적으로 yield somePromise와 같고, 외부 실행기가 Promise 완료 시 gen.next(result)를 호출해 재개하는 구조입니다.",
    isAdvanced: true,
  },

  // ── Proxy & Reflect ─────────────────────────────────────────────────
  {
    id: "js-28",
    category: "javascript",
    question: "Proxy란 무엇이고 어떤 상황에서 사용하나요?",
    answer:
      "객체에 대한 읽기, 쓰기, 삭제 같은 기본 동작을 가로채서 커스텀 동작을 정의할 수 있는 래퍼 객체입니다. set 트랩에서 타입이나 범위를 검사하는 유효성 검사, Vue 3의 reactive()처럼 프로퍼티 변경을 감지해 반응성을 구현하거나, get 트랩으로 접근을 추적하는 로깅에 사용합니다.",
  },
  {
    id: "js-29",
    category: "javascript",
    question: "Proxy와 Object.defineProperty의 차이는?",
    answer:
      "Object.defineProperty는 특정 프로퍼티 하나에만 getter/setter를 정의할 수 있어, 동적으로 추가된 프로퍼티나 배열 인덱스 변경을 감지하지 못합니다. Proxy는 객체 전체를 가로채는 방식이라 모든 프로퍼티 접근을 감지하고 더 다양한 동작을 커스터마이징할 수 있습니다. Vue 3가 Proxy 기반으로 마이그레이션한 이유가 이 차이인데, Vue 2에서는 배열 인덱스 직접 수정이나 동적 프로퍼티 추가를 감지하지 못하는 한계가 있었습니다.",
    isAdvanced: true,
  },

  // ── 프로세스 vs 스레드 ──────────────────────────────────────────────
  {
    id: "js-30",
    category: "javascript",
    question: "프로세스와 스레드의 차이는?",
    answer:
      "프로세스는 OS로부터 독립적인 메모리 공간을 할당받은 실행 단위이고, 스레드는 프로세스 내의 실행 흐름으로 같은 프로세스의 메모리를 공유하고 스택만 독립적입니다. 스레드는 메모리를 공유하기 때문에 통신이 빠르지만 Race Condition이나 Deadlock 같은 동기화 문제가 생깁니다. Chrome은 탭마다 별도 프로세스를 사용해서 한 탭이 죽어도 다른 탭에 영향을 주지 않습니다.",
  },
  {
    id: "js-31",
    category: "javascript",
    question: "JavaScript는 싱글 스레드인데 멀티코어 CPU를 어떻게 활용하나요?",
    answer:
      "메인 스레드는 단일 스레드이지만 Web Workers API로 별도 스레드에서 CPU 집약적 작업을 실행할 수 있습니다. Node.js에서는 Worker Threads와 Cluster 모듈을 사용합니다. Web Worker는 메인 스레드와 postMessage로 통신하며 DOM에 직접 접근할 수 없고, 이미지 처리나 대용량 데이터 계산처럼 메인 스레드를 오래 블로킹하는 작업에 씁니다.",
    isAdvanced: true,
  },

  // ── 메모리 구조 ─────────────────────────────────────────────────────
  {
    id: "js-32",
    category: "javascript",
    question: "스택(Stack)과 힙(Heap) 메모리의 차이는?",
    answer:
      "스택은 함수 호출 시 자동으로 할당·해제되는 LIFO 구조로 원시값과 함수 실행 정보가 저장됩니다. 힙은 GC가 관리하는 동적 메모리로 객체·배열 같은 참조 타입이 저장됩니다. 재귀 함수가 끝없이 호출되면 스택 프레임이 쌓여 스택 크기 제한을 초과하는 Stack Overflow가 발생하며, 꼬리 호출 최적화나 반복문으로 대체해 방지할 수 있습니다.",
  },
  {
    id: "js-33",
    category: "javascript",
    question: "JavaScript에서 원시값과 참조값의 차이는?",
    answer:
      "원시값(number, string, boolean 등)은 스택에 값 자체가 저장되어 복사 시 독립적인 복사본이 생깁니다. 참조값(object, array, function)은 힙에 실제 데이터가 저장되고 스택에는 주소만 저장됩니다. 복사하면 같은 힙 주소를 가리켜 한쪽 변경이 다른 쪽에도 영향을 줍니다. React가 참조 비교(===)로 상태 변경을 감지하기 때문에 객체 내부 값만 바꾸면 감지가 안 되고, 새 객체를 만들어 할당하는 불변 업데이트가 필요한 이유입니다.",
  },
  {
    id: "js-34",
    category: "javascript",
    question: "V8의 Hidden Class란 무엇인가요?",
    answer:
      "V8은 같은 구조(프로퍼티 이름과 순서가 동일)의 객체들을 같은 Hidden Class로 묶어 프로퍼티에 오프셋 기반으로 빠르게 접근합니다. 동적으로 프로퍼티를 추가하거나 순서를 달리하면 Hidden Class가 달라져 이 최적화가 무효화됩니다. 객체를 { x: 1, y: 2 }처럼 한 번에 초기화하는 것이 성능에 좋은 이유입니다.",
    isAdvanced: true,
  },

  // ── 동기 vs 비동기 / 블로킹 vs 논블로킹 ─────────────────────────────
  {
    id: "js-35",
    category: "javascript",
    question: "동기와 비동기, 블로킹과 논블로킹의 차이는?",
    answer:
      "동기/비동기는 작업 완료를 기다리는지 여부입니다. 동기는 작업이 끝날 때까지 기다리고, 비동기는 완료 여부와 상관없이 다음 코드를 실행합니다. 블로킹/논블로킹은 제어권을 넘기는지 여부입니다. 블로킹은 완료될 때까지 제어권을 넘겨 스레드를 정지시키고, 논블로킹은 즉시 제어권을 반환합니다. 자바스크립트는 싱글 스레드이기 때문에 블로킹을 피하고 비동기 + 논블로킹 모델을 사용합니다.",
  },

  // ── V8 엔진과 JIT 컴파일 ─────────────────────────────────────────────
  {
    id: "js-36",
    category: "javascript",
    question: "JavaScript는 컴파일 언어인가요, 인터프리터 언어인가요?",
    answer:
      "전통적으로 인터프리터 언어로 분류되지만, V8 같은 현대 JS 엔진은 JIT 컴파일을 사용합니다. 처음에는 Ignition 인터프리터가 바이트코드로 실행하고, 자주 실행되는 코드를 Turbofan이 기계어로 컴파일해 최적화합니다. 타입이 변경되면 최적화를 취소하고 다시 인터프리터로 실행하기 때문에, 일관된 타입을 유지하는 게 성능에 중요합니다.",
  },
  {
    id: "js-37",
    category: "javascript",
    question: "V8의 Deoptimization이란 무엇이고 어떻게 방지하나요?",
    answer:
      "Turbofan은 타입이 일정하다고 가정하고 최적화된 기계어를 생성합니다. 런타임에 그 가정이 깨지면, 예를 들어 number 변수에 string이 들어오면 최적화를 취소하고 Ignition 바이트코드로 롤백합니다. 방지하려면 함수에 항상 같은 타입의 인수를 전달하고, 객체 프로퍼티 타입을 일관되게 유지하며, 동적 프로퍼티 추가를 피해야 합니다. TypeScript를 사용하면 컴파일 타임에 이를 강제할 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "js-38",
    category: "javascript",
    question: "Set은 언제 사용하나요?",
    answer:
      "중복 없는 값의 집합을 관리할 때 사용합니다. 배열에서 중복을 제거할 때 [...new Set(arr)]처럼 쓰거나, 특정 값이 존재하는지 확인할 때 배열의 includes(O(n)) 대신 Set의 has(O(1))를 써서 성능을 높일 수 있습니다. 방문한 노드를 추적하는 BFS/DFS, 이미 처리한 ID 목록 관리처럼 '이 값이 있었나?'를 빠르게 확인해야 하는 상황에 적합합니다.",
  },
];
