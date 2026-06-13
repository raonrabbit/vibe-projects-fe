import type { QuizQuestion } from "./types";

export const JAVASCRIPT_QUESTIONS: QuizQuestion[] = [
  // ─── 실행 컨텍스트 & 스코프 ────────────────────────────────────────────────
  {
    id: "js-01",
    category: "javascript",
    question: "실행 컨텍스트(Execution Context)가 뭔가요?",
    answer:
      "JavaScript 코드가 실행될 때 필요한 환경 정보를 담은 객체입니다. 전역 실행 컨텍스트(Global EC)와 함수 실행 컨텍스트(Function EC)가 있으며, 함수 호출마다 새로운 실행 컨텍스트가 생성되어 콜 스택에 쌓입니다.\n\n**부가설명:** 실행 컨텍스트는 두 단계로 동작합니다. Creation Phase(생성 단계): 변수·함수 선언을 등록하고, var는 undefined로, let/const는 TDZ 상태로 초기화합니다. Execution Phase(실행 단계): 코드를 한 줄씩 실행하며 값을 할당합니다.",
  },
  {
    id: "js-02",
    category: "javascript",
    question: "실행 컨텍스트의 구성 요소를 나열하고 각각에 대해 설명해주세요.",
    answer:
      "① LexicalEnvironment: let·const·함수 선언을 저장하며, 외부 환경(outer)에 대한 참조를 포함합니다. 클로저와 스코프 체인의 기반입니다. ② VariableEnvironment: var로 선언된 변수를 저장합니다. ③ ThisBinding: 현재 컨텍스트에서 this가 가리키는 값입니다.\n\n**부가설명:** ES6 이후에는 LexicalEnvironment와 VariableEnvironment가 분리되어 var와 let/const의 스코프 규칙이 달라졌습니다.",
  },
  {
    id: "js-03",
    category: "javascript",
    question: "실행 컨텍스트 생성 단계에 대해 설명해주세요.",
    answer:
      "① Creation Phase(생성 단계): 코드를 실행하기 전 선언을 스캔하여 메모리를 확보합니다. var는 undefined로 초기화, let/const는 TDZ 상태로 등록, 함수 선언은 함수 객체 전체를 등록합니다. ② Execution Phase(실행 단계): 코드를 위에서 아래로 한 줄씩 실행하며 변수에 실제 값을 할당합니다.\n\n**부가설명:** Creation Phase에서 선언이 메모리에 등록되는 것이 '호이스팅'의 실체입니다. 실제로 코드가 위로 이동하는 것이 아니라 실행 전에 먼저 등록되는 것입니다.",
  },
  {
    id: "js-04",
    category: "javascript",
    question: "스코프 체인(Scope Chain)에 대해 설명해주세요.",
    answer:
      "변수를 탐색할 때 현재 스코프에 없으면 외부(상위) 스코프로 올라가며 찾고, 없으면 계속 올라가 전역 스코프까지 탐색하는 메커니즘입니다. JavaScript는 렉시컬 스코프(함수가 정의된 위치 기준)를 사용하므로, 함수가 생성될 때 [[Environment]] 슬롯에 외부 환경 참조를 저장합니다.\n\n**부가설명:** 스코프 체인은 실행 시점이 아닌 코드 작성 시점(정의 위치)에 결정됩니다. 이것이 렉시컬 스코프이며, 클로저의 동작 원리이기도 합니다.",
  },

  // ─── 클로저 ────────────────────────────────────────────────────────────────
  {
    id: "js-05",
    category: "javascript",
    question: "클로저(Closure)가 뭔가요?",
    answer:
      "함수가 자신이 선언된 렉시컬 환경을 기억하여, 외부 함수의 실행이 끝난 후에도 외부 변수에 접근할 수 있는 함수입니다. 외부 함수가 콜 스택에서 제거되어도 내부 함수의 [[Environment]]가 외부 환경을 참조하고 있으면 GC 대상에서 제외됩니다.\n\n**부가설명:** 클로저의 활용: private 변수 구현, 부분 적용(커링), React의 useState 내부 구현. 클로저가 필요 이상으로 큰 스코프를 계속 참조하면 메모리 누수가 발생할 수 있습니다.",
  },
  {
    id: "js-06",
    category: "javascript",
    question: "클로저의 동작 원리가 뭔가요?",
    answer:
      "함수가 생성될 때 현재 LexicalEnvironment에 대한 참조를 [[Environment]] 내부 슬롯에 저장합니다. 함수가 실행될 때 이 [[Environment]]를 outer 참조로 사용하여 스코프 체인을 구성합니다. 외부 함수가 반환된 후에도 내부 함수의 [[Environment]]가 외부 환경을 강한 참조로 유지하므로 GC가 수거하지 않습니다.\n\n**부가설명:** 클로저가 메모리를 점유하는 이유가 바로 이 [[Environment]] 참조 때문입니다. 더 이상 필요 없는 클로저는 null을 할당하여 참조를 끊어야 합니다.",
  },

  // ─── 호이스팅 ──────────────────────────────────────────────────────────────
  {
    id: "js-07",
    category: "javascript",
    question: "호이스팅(Hoisting)이 뭔가요?",
    answer:
      "실행 컨텍스트 생성 단계(Creation Phase)에서 변수와 함수 선언이 먼저 메모리에 등록되는 현상입니다. var는 undefined로 초기화되어 선언 전 접근해도 오류 없이 undefined를 반환합니다. 함수 선언문은 함수 객체 전체가 등록되어 선언 전 호출이 가능합니다. let/const는 TDZ에 있어 선언 전 접근 시 ReferenceError가 발생합니다.\n\n**부가설명:** 실제로 코드 줄이 위로 이동하는 것이 아니라, 실행 전 생성 단계에서 선언이 먼저 처리되는 것입니다.",
  },
  {
    id: "js-08",
    category: "javascript",
    question: "TDZ(Temporal Dead Zone)가 뭔가요?",
    answer:
      "let/const 변수의 블록 시작부터 선언문이 실행되기 직전까지의 구간입니다. 이 구간에서 변수에 접근하면 ReferenceError가 발생합니다. 선언이 호이스팅되어 엔진이 변수를 인식하지만, 초기화는 선언문 실행 시점까지 미뤄집니다.\n\n**부가설명:** TDZ는 var의 호이스팅으로 인한 예상치 못한 undefined 버그를 방지하기 위해 도입됐습니다. '있는 것은 알지만 아직 사용할 수 없는 상태'입니다.",
  },

  // ─── 이벤트 루프 ───────────────────────────────────────────────────────────
  {
    id: "js-09",
    category: "javascript",
    question: "이벤트 루프 과정에 대해 설명해주세요.",
    answer:
      "① 코드 실행: 콜 스택이 비어있을 때까지 동기 코드를 실행합니다. ② Microtask 처리: 콜 스택이 비면 Microtask Queue(Promise.then, queueMicrotask)의 작업을 모두 처리합니다. ③ 렌더링: 브라우저가 필요에 따라 화면을 다시 그립니다. ④ Task 처리: Macrotask Queue(setTimeout, setInterval, I/O)에서 하나만 꺼내 실행합니다. 이 과정을 반복합니다.\n\n**부가설명:** Microtask가 항상 Macrotask보다 먼저 처리됩니다. setTimeout(fn, 0)과 Promise.then(fn)이 함께 있으면 Promise 콜백이 먼저 실행됩니다.",
  },
  {
    id: "js-10",
    category: "javascript",
    question: "JS가 싱글스레드임에도 비동기 처리가 가능한 이유는?",
    answer:
      "JS 엔진 자체는 싱글 스레드이지만, 브라우저나 Node.js 런타임이 별도의 스레드 풀(Web APIs, libuv)을 통해 비동기 작업을 대신 처리합니다. 타이머·네트워크 요청·파일 I/O 같은 작업이 백그라운드에서 완료되면 콜백이 Task Queue에 추가됩니다. 이벤트 루프가 콜 스택이 비어있을 때 큐에서 콜백을 꺼내 실행합니다.\n\n**부가설명:** JS 엔진(V8 등)은 코드 실행만 담당하고, 비동기 작업 자체는 브라우저·Node.js 런타임이 처리합니다. JS가 비동기를 '직접' 처리하는 것이 아니라 런타임에 위임하는 구조입니다.",
  },

  // ─── Promise & async/await ─────────────────────────────────────────────────
  {
    id: "js-11",
    category: "javascript",
    question: "동기가 뭐고 비동기가 뭔가요?",
    answer:
      "동기(Synchronous)는 이전 작업이 완료된 후에만 다음 작업을 실행합니다. 코드가 순서대로 실행되어 예측이 쉽지만 오래 걸리는 작업이 있으면 전체가 멈춥니다. 비동기(Asynchronous)는 작업 완료를 기다리지 않고 다음 코드를 실행합니다. 완료되면 콜백이나 Promise로 결과를 받습니다.\n\n**부가설명:** 블로킹/논블로킹은 제어권 반환 여부입니다. 자바스크립트는 싱글 스레드이므로 동기적으로 실행되는 긴 작업(CPU 집약적 연산)은 모든 작업을 차단합니다. 이것이 비동기 모델이 중요한 이유입니다.",
  },
  {
    id: "js-12",
    category: "javascript",
    question: "Promise가 뭔가요?",
    answer:
      "비동기 작업의 최종 완료 또는 실패를 나타내는 객체입니다. 콜백 지옥을 해결하고 then() 체이닝으로 비동기 흐름을 선형으로 작성할 수 있습니다. catch()로 에러를 일괄 처리하고, finally()로 항상 실행할 코드를 지정할 수 있습니다.\n\n**부가설명:** Promise는 한 번 settled되면 상태가 변하지 않아 신뢰성이 높습니다. Promise.all(병렬 실행), Promise.allSettled(모두 완료 대기), Promise.race(가장 빠른 결과), Promise.any(가장 빠른 성공)를 상황에 맞게 사용합니다.",
  },
  {
    id: "js-13",
    category: "javascript",
    question: "Promise의 3가지 상태에 대해 말해주세요.",
    answer:
      "① Pending(대기): 비동기 작업이 아직 완료되지 않은 초기 상태입니다. ② Fulfilled(이행): 비동기 작업이 성공적으로 완료되어 결과값이 있는 상태입니다. then() 콜백이 실행됩니다. ③ Rejected(거부): 비동기 작업이 실패한 상태입니다. catch() 콜백이 실행됩니다.\n\n**부가설명:** Fulfilled와 Rejected를 합쳐 Settled(완료된) 상태라고 합니다. 한 번 Settled되면 다시 Pending이나 다른 상태로 변경할 수 없습니다.",
  },
  {
    id: "js-14",
    category: "javascript",
    question: "async/await이 뭔가요?",
    answer:
      "Promise를 동기 코드처럼 읽히게 해주는 문법적 설탕(Syntactic Sugar)입니다. async 함수는 항상 Promise를 반환하고, await는 Promise가 settled될 때까지 해당 함수의 실행을 일시 중단합니다. try/catch로 에러 처리가 가능하여 가독성이 좋습니다.\n\n**부가설명:** await는 해당 async 함수의 실행만 일시 중단하고, 이벤트 루프는 계속 다른 작업을 처리합니다. 독립적인 비동기 작업은 await Promise.all([a(), b()])로 병렬 처리해야 합니다.",
  },
  {
    id: "js-15",
    category: "javascript",
    question: "Promise와 async/await의 차이가 뭔가요?",
    answer:
      "async/await은 Promise 기반이므로 기능적 차이는 없습니다. 가독성과 에러 처리 방식에서 차이가 있습니다. Promise는 then/catch 체이닝으로 작성하고, async/await은 동기 코드처럼 선형으로 작성합니다. async/await은 try/catch로 에러를 처리할 수 있어 동기 코드와 일관성 있게 처리됩니다.\n\n**부가설명:** 복잡한 분기가 필요한 경우 async/await이 더 읽기 쉽습니다. 여러 Promise를 병렬로 처리해야 할 때는 Promise.all을 async/await과 함께 사용합니다.",
  },

  // ─── this ──────────────────────────────────────────────────────────────────
  {
    id: "js-16",
    category: "javascript",
    question: "this가 어떻게 결정되는지 설명해주세요.",
    answer:
      "this는 함수 호출 방식에 따라 동적으로 결정됩니다(우선순위 순): ① new로 호출: 새로 생성된 객체, ② call/apply/bind로 명시: 지정한 객체, ③ 메서드로 호출(obj.method()): 점 앞의 객체(obj), ④ 일반 호출: 전역 객체(strict mode에서는 undefined).\n\n**부가설명:** 메서드를 변수에 담아 호출하면(const fn = obj.method; fn();) 암시적 바인딩이 사라져 일반 함수 호출이 됩니다. 이벤트 핸들러에서 this를 잃어버리는 것도 같은 이유입니다.",
  },
  {
    id: "js-17",
    category: "javascript",
    question: "화살표 함수의 this는 뭔가요?",
    answer:
      "화살표 함수는 자체 this 바인딩이 없고, 선언된 위치의 외부 스코프 this를 렉시컬하게 캡처합니다. call/apply/bind로 this를 변경할 수 없습니다. 외부 컨텍스트의 this를 그대로 사용해야 하는 setTimeout·Promise 체이닝 콜백·이벤트 핸들러에서 유용합니다.\n\n**부가설명:** 화살표 함수를 객체의 메서드로 사용하면 this가 해당 객체가 아닌 외부(전역)를 가리키므로 주의가 필요합니다. 클래스의 메서드에서는 일반 함수를 사용하고, 내부 콜백에서 화살표 함수를 사용하는 패턴이 일반적입니다.",
  },

  // ─── GC ────────────────────────────────────────────────────────────────────
  {
    id: "js-18",
    category: "javascript",
    question: "GC(Garbage Collection)가 뭔가요?",
    answer:
      "더 이상 사용하지 않는 메모리를 자동으로 해제하는 메커니즘입니다. V8은 Mark & Sweep 방식을 사용합니다. GC 루트(전역 변수·콜 스택)에서 시작해 도달 가능한 객체에 마킹하고, 마킹되지 않은 객체를 메모리에서 해제합니다.\n\n**부가설명:** V8은 세대별 GC(Generational GC)를 사용합니다. 새로 생성된 객체는 Young Generation에서 빈번하게 수거하고, 살아남은 객체는 Old Generation으로 승격합니다. '대부분의 객체는 짧게 산다'는 세대 가설을 활용합니다.",
  },
  {
    id: "js-19",
    category: "javascript",
    question: "메모리 누수를 어떻게 감지하고 해결하나요?",
    answer:
      "Chrome DevTools의 Memory 탭에서 힙 스냅샷 촬영이나 Allocation Timeline으로 메모리 증가를 추적합니다. 주요 원인: ① removeEventListener 없이 이벤트 리스너 방치, ② clearInterval 없이 setInterval 사용, ③ 클로저가 불필요하게 큰 스코프를 참조, ④ 의도치 않은 전역 변수 생성. 해결: 리스너 명시적 제거, React useEffect 클린업 함수 활용, WeakMap/WeakRef 사용.\n\n**부가설명:** WeakMap은 키 객체가 다른 곳에서 참조되지 않으면 자동으로 GC됩니다. DOM 요소에 부가 데이터를 연결할 때 WeakMap을 사용하면 DOM 제거 시 연결된 데이터도 자동으로 수거됩니다.",
  },

  // ─── Stack 메모리 / Heap 메모리 ────────────────────────────────────────────
  {
    id: "js-20",
    category: "javascript",
    question: "Stack 메모리가 뭔가요?",
    answer:
      "함수 호출 시 자동으로 할당되고 반환 시 자동으로 해제되는 LIFO 구조의 메모리입니다. 함수의 실행 컨텍스트(지역 변수, 매개변수, 반환 주소)와 원시값(number, boolean, string 등)이 저장됩니다. 크기가 고정되어 있고 할당·해제가 빠릅니다.\n\n**부가설명:** 재귀 함수가 끝없이 호출되면 스택 프레임이 계속 쌓여 Stack Overflow가 발생합니다. 꼬리 재귀 최적화(TCO)나 반복문으로 변환하여 해결합니다.",
  },
  {
    id: "js-21",
    category: "javascript",
    question: "Heap 메모리가 뭔가요?",
    answer:
      "GC가 관리하는 동적 메모리 공간입니다. 객체·배열·함수처럼 크기가 가변적인 참조 타입이 저장됩니다. 변수에는 실제 데이터가 있는 힙 주소(참조값)가 저장됩니다. 스택보다 크기가 훨씬 크지만, GC로 관리되어 할당·해제 비용이 있습니다.\n\n**부가설명:** 참조 타입을 복사하면 같은 힙 주소를 가리키므로 한쪽 변경이 다른 쪽에도 영향을 줍니다. React가 참조 비교(===)로 상태 변경을 감지하기 때문에 객체의 내부 값만 변경하면 리렌더링이 발생하지 않습니다.",
  },

  // ─── 엔진 ──────────────────────────────────────────────────────────────────
  {
    id: "js-22",
    category: "javascript",
    question: "V8이 뭔가요?",
    answer:
      "Google이 개발한 JavaScript 엔진으로 Chrome 브라우저와 Node.js에서 사용됩니다. JavaScript 코드를 파싱하여 바이트코드로 변환하고(Ignition 인터프리터), 자주 실행되는 코드(Hot Path)를 기계어로 컴파일합니다(Turbofan JIT 컴파일러). 메모리 관리(GC), 숨겨진 클래스(Hidden Class) 최적화 등도 담당합니다.\n\n**부가설명:** V8 외에도 SpiderMonkey(Firefox), JavaScriptCore(Safari), Chakra(구 Edge) 등의 JavaScript 엔진이 있습니다.",
  },
  {
    id: "js-23",
    category: "javascript",
    question: "JS는 인터프리터 언어인가요 컴파일 언어인가요?",
    answer:
      "전통적으로 인터프리터 언어로 분류되지만, 현대 V8 같은 엔진은 JIT 컴파일을 사용하여 두 방식의 특성을 모두 가집니다. 처음에는 Ignition 인터프리터가 바이트코드로 빠르게 실행하고, 자주 실행되는 코드는 Turbofan이 기계어로 컴파일하여 최적화합니다.\n\n**부가설명:** 컴파일 언어(C, Java)와 달리 실행 전에 전체 컴파일을 하지 않고 런타임에 부분적으로 컴파일합니다. 이를 JIT(Just-In-Time) 컴파일이라 합니다.",
  },
  {
    id: "js-24",
    category: "javascript",
    question: "JIT 컴파일이 뭔가요?",
    answer:
      "Just-In-Time 컴파일의 약자로, 런타임에 코드를 분석하여 자주 실행되는 코드를 기계어로 컴파일하는 방식입니다. V8에서는 Ignition 인터프리터가 프로파일링하여 자주 실행되는 함수를 감지하면, Turbofan이 해당 코드를 최적화된 기계어로 컴파일합니다.\n\n**부가설명:** 최적화 가정(타입이 일정하다 등)이 런타임에 깨지면 Deoptimization이 발생하여 다시 인터프리터 모드로 돌아갑니다. 일관된 타입을 유지하면 JIT 최적화 효과를 유지할 수 있습니다.",
  },
];
