import type { QuizQuestion } from "./types";

export const NETWORK_QUESTIONS: QuizQuestion[] = [
  // ─── 1. HTTP vs HTTPS ────────────────────────────────────────────────────────
  {
    id: "net-01",
    category: "network",
    question: "HTTP와 HTTPS의 차이는?",
    answer:
      "HTTPS는 HTTP에 TLS 레이어를 추가한 프로토콜입니다. 데이터를 암호화하여 도청을 방지하고(암호화), 메시지 인증 코드로 데이터 무결성을 보장하며(무결성), 디지털 인증서로 서버의 신원을 인증합니다(인증). HTTP는 80번 포트, HTTPS는 443번 포트를 사용합니다. TLS 핸드셰이크 과정에서 비대칭키로 대칭키를 안전하게 교환한 뒤, 실제 데이터는 대칭키로 빠르게 암호화하여 전송합니다.",
  },
  {
    id: "net-02",
    category: "network",
    question: "HTTPS에서 대칭키와 비대칭키를 함께 사용하는 이유는?",
    answer:
      "비대칭키(공개키 암호화)는 키 전달 문제를 해결하지만 속도가 느립니다. 대칭키는 빠르지만 키를 전달하는 과정에서 탈취 위험이 있습니다. HTTPS는 두 방식의 장점을 결합하여, 비대칭키로 대칭키를 안전하게 교환한 뒤 이후 실제 데이터 통신은 대칭키로 빠르게 암호화합니다. 비대칭키는 키 교환에만 사용하고 데이터 암호화에는 사용하지 않습니다.",
  },

  // ─── 2. HTTP 버전별 비교 ─────────────────────────────────────────────────────
  {
    id: "net-03",
    category: "network",
    question: "HTTP/1.1과 HTTP/2의 주요 차이는?",
    answer:
      "HTTP/2의 가장 큰 변화는 Multiplexing입니다. 하나의 TCP 연결에서 여러 요청·응답을 독립적인 스트림으로 동시에 처리할 수 있어 HTTP/1.1의 Head-of-Line Blocking 문제를 해결했습니다. 또한 HPACK 헤더 압축으로 중복 헤더를 줄이고, 텍스트 대신 바이너리 프레이밍으로 파싱 효율을 높였으며, 서버가 요청 없이 리소스를 미리 전송하는 Server Push도 추가됐습니다.",
  },
  {
    id: "net-04",
    category: "network",
    question: "HOL Blocking(Head-of-Line Blocking)이란 무엇인가요?",
    answer:
      "HOL Blocking은 앞선 요청이 지연될 때 뒤에 오는 요청도 함께 대기하는 현상입니다. HTTP/1.1의 Pipelining에서 응답은 요청 순서대로 반환돼야 하므로, 첫 번째 응답이 느리면 이미 준비된 두 번째·세 번째 응답도 전달하지 못합니다. HTTP/2는 요청마다 독립 스트림을 부여해 애플리케이션 레벨 HOL Blocking을 해결했지만, TCP 레벨에서는 패킷 손실 시 전체 스트림이 대기하는 HOL Blocking이 여전히 남아 있습니다.",
    isAdvanced: true,
  },
  {
    id: "net-05",
    category: "network",
    question: "HTTP/3가 UDP를 사용하는 이유는?",
    answer:
      "HTTP/2는 TCP 레벨의 HOL Blocking을 해결하지 못했습니다. TCP에서 패킷 하나가 손실되면 해당 패킷이 재전송될 때까지 모든 스트림이 대기하기 때문입니다. HTTP/3는 UDP + QUIC 프로토콜을 사용하여 스트림별로 독립적인 흐름 제어를 구현해 이 문제를 완전히 해결했습니다. QUIC은 UDP 위에서 TCP의 신뢰성(재전송·순서 보장)과 TLS의 보안을 애플리케이션 레벨에서 직접 구현하며, 이전 연결 정보를 캐싱하는 0-RTT/1-RTT 연결과 네트워크 변경 시에도 연결을 유지하는 연결 마이그레이션도 지원합니다.",
    isAdvanced: true,
  },

  // ─── 3. TCP vs UDP ───────────────────────────────────────────────────────────
  {
    id: "net-06",
    category: "network",
    question: "TCP와 UDP의 차이는? 각각 언제 사용하나요?",
    answer:
      "TCP는 연결 지향 프로토콜로, 3-way handshake로 연결을 맺고 순서 보장·손실 패킷 재전송·흐름 제어·혼잡 제어를 통해 신뢰성 있는 전송을 보장합니다. 오버헤드가 커서 느리지만 HTTP/HTTPS·파일 전송·이메일에 사용합니다. UDP는 비연결 프로토콜로 신뢰성 보장 없이 빠르게 전송합니다. 실시간성이 중요하고 일부 손실을 허용할 수 있는 스트리밍·VoIP·온라인 게임·DNS·QUIC에 적합합니다.",
  },

  // ─── 4. TCP 3-Way Handshake ──────────────────────────────────────────────────
  {
    id: "net-07",
    category: "network",
    question: "TCP 3-way handshake를 설명해주세요.",
    answer:
      "TCP 연결 수립은 세 단계로 이루어집니다. ① 클라이언트가 SYN 패킷(초기 시퀀스 번호 포함)을 전송합니다. ② 서버가 SYN+ACK로 응답하며 자신의 시퀀스 번호도 전달합니다. ③ 클라이언트가 ACK를 보내면 연결이 수립됩니다. 이 과정에서 양측의 초기 시퀀스 번호를 교환하고 서로 수신 준비 상태를 확인합니다. 3번의 패킷 교환으로 양방향 통신 가능 여부를 최소 비용으로 검증합니다.",
  },

  // ─── 5. TCP 4-Way Handshake (TIME_WAIT) ─────────────────────────────────────
  {
    id: "net-08",
    category: "network",
    question: "TCP 4-way handshake에서 TIME_WAIT가 존재하는 이유는?",
    answer:
      "TIME_WAIT는 마지막 ACK 전송 후 2*MSL(약 60~120초) 동안 유지되는 대기 상태입니다. 두 가지 이유가 있습니다. 첫째, 클라이언트가 보낸 마지막 ACK가 손실될 경우 서버가 FIN을 재전송하는데, TIME_WAIT 동안 대기하여 이를 처리합니다. 둘째, 이전 연결에서 지연된 패킷이 같은 포트 번호를 사용하는 새 연결에 영향을 주는 것을 방지합니다. MSL(Maximum Segment Lifetime)의 2배 동안 대기하여 이전 연결의 모든 패킷이 네트워크에서 소멸됐음을 보장합니다.",
    isAdvanced: true,
  },

  // ─── 6. TLS/SSL 핸드셰이크 ──────────────────────────────────────────────────
  {
    id: "net-09",
    category: "network",
    question: "HTTPS에서 TLS 핸드셰이크가 어떻게 이루어지나요?",
    answer:
      "TLS 1.3 기준으로 설명하면, 클라이언트가 지원하는 암호 스위트와 DH(Diffie-Hellman) 키 교환 파라미터를 포함한 ClientHello를 보냅니다. 서버가 선택한 암호 스위트와 인증서·DH 파라미터를 응답하면, 양측이 DH를 통해 공유 비밀(대칭키)을 각자 생성하고 이후 통신을 암호화합니다. TLS 1.3은 1.2의 2-RTT를 1-RTT로 줄였고, 이전 연결 정보가 있으면 0-RTT로 데이터를 즉시 전송할 수도 있습니다.",
    isAdvanced: true,
  },
  {
    id: "net-10",
    category: "network",
    question: "TLS 1.2와 TLS 1.3의 차이는?",
    answer:
      "TLS 1.3은 핸드셰이크를 2-RTT에서 1-RTT로 줄여 연결 속도를 개선했습니다. 또한 RSA 키 교환과 같은 취약한 암호 알고리즘을 제거하고 ECDHE(Elliptic Curve Diffie-Hellman Ephemeral)만 허용하여 보안을 강화했습니다. 이전 연결이 있을 경우 0-RTT 재개를 지원하지만 재전송(Replay) 공격에 주의가 필요합니다. 전반적으로 더 빠르고 더 안전한 버전입니다.",
    isAdvanced: true,
  },

  // ─── 7. REST API 설계 원칙 ───────────────────────────────────────────────────
  {
    id: "net-11",
    category: "network",
    question: "REST API란? REST의 6대 제약 조건은 무엇인가요?",
    answer:
      "REST는 HTTP 프로토콜을 기반으로 자원을 URI로 표현하고 HTTP 메서드로 행위를 정의하는 아키텍처 스타일입니다. 6대 제약 조건은 ① Client-Server(관심사 분리), ② Stateless(서버가 클라이언트 상태 저장 안 함), ③ Cacheable(응답 캐시 가능), ④ Uniform Interface(일관된 인터페이스), ⑤ Layered System(클라이언트는 서버인지 프록시인지 몰라도 됨), ⑥ Code on Demand(선택, 서버가 실행 코드 전송 가능)입니다.",
  },
  {
    id: "net-12",
    category: "network",
    question: "PUT과 PATCH의 차이는?",
    answer:
      "PUT은 리소스 전체를 대체합니다. 요청 바디에 포함되지 않은 필드는 null이나 기본값으로 초기화됩니다. PUT은 멱등성을 보장합니다(같은 요청을 반복해도 결과 동일). PATCH는 리소스의 일부만 수정합니다. 보낸 필드만 변경되고 나머지는 유지됩니다. PATCH는 구현에 따라 멱등성이 보장되지 않을 수도 있습니다. 예를 들어 PATCH로 특정 필드를 증가시키면 반복 실행 시 결과가 달라집니다.",
  },
  {
    id: "net-13",
    category: "network",
    question:
      "HTTP 메서드의 멱등성(Idempotency)과 안전성(Safety)을 비교하세요.",
    answer:
      "안전성(Safe)은 리소스를 변경하지 않음을 의미하고, 멱등성(Idempotent)은 동일한 요청을 여러 번 보내도 결과가 같음을 의미합니다. GET은 안전·멱등, HEAD·OPTIONS도 안전·멱등합니다. POST는 비안전·비멱등(매번 새 리소스 생성 가능), PUT은 비안전·멱등(전체 교체, 반복해도 같은 결과), PATCH는 비안전·비멱등(구현에 따라 다름), DELETE는 비안전·멱등(이미 삭제된 자원을 다시 삭제해도 결과 동일)입니다. 멱등성은 네트워크 오류 시 안전하게 재시도할 수 있는지의 기준이 됩니다.",
  },
  {
    id: "net-14",
    category: "network",
    question: "주요 HTTP 상태 코드를 설명해주세요.",
    answer:
      "2xx(성공): 200 OK, 201 Created(리소스 생성), 204 No Content(응답 본문 없음). 3xx(리다이렉트): 301 Moved Permanently(영구), 302 Found(임시), 304 Not Modified(캐시 유효). 4xx(클라이언트 오류): 400 Bad Request, 401 Unauthorized(인증 필요, 로그인 안 됨), 403 Forbidden(권한 없음, 로그인해도 접근 불가), 404 Not Found, 429 Too Many Requests. 5xx(서버 오류): 500 Internal Server Error, 502 Bad Gateway. 401과 403의 구분이 중요합니다. 401은 인증(Authentication) 문제, 403은 인가(Authorization) 문제입니다.",
  },

  // ─── 8. CORS ─────────────────────────────────────────────────────────────────
  {
    id: "net-15",
    category: "network",
    question: "CORS란 무엇인가요? Same-Origin Policy와 어떤 관계인가요?",
    answer:
      "Same-Origin Policy는 브라우저가 다른 출처(Origin = Protocol + Host + Port)의 리소스에 대한 JS 요청을 차단하는 보안 정책입니다. CORS(Cross-Origin Resource Sharing)는 이 정책을 완화하여 다른 출처의 리소스를 요청할 수 있도록 서버가 허용 여부를 선언하는 메커니즘입니다. 브라우저는 다른 출처로 요청 시 Origin 헤더를 포함하고, 서버의 Access-Control-Allow-Origin 응답 헤더를 확인하여 허용 여부를 결정합니다.",
  },
  {
    id: "net-16",
    category: "network",
    question: "CORS Preflight Request란 무엇인가요?",
    answer:
      "PUT·DELETE나 커스텀 헤더를 사용하는 요청처럼 단순 요청(Simple Request)이 아닌 경우, 브라우저는 실제 요청 전에 OPTIONS 메서드로 사전 요청(Preflight)을 보냅니다. 서버가 Access-Control-Allow-Origin·Allow-Methods·Allow-Headers를 응답하면 브라우저가 허용 여부를 확인한 뒤 실제 요청을 전송합니다. Access-Control-Max-Age 헤더로 Preflight 결과를 캐시하면 매번 OPTIONS 요청이 발생하는 오버헤드를 줄일 수 있습니다.",
    isAdvanced: true,
  },
  {
    id: "net-17",
    category: "network",
    question: "CORS는 보안 문제를 완전히 해결하나요?",
    answer:
      "아니오. CORS는 브라우저 레벨의 정책이므로, 브라우저가 없는 환경(curl·Postman·서버 간 통신)에서는 적용되지 않습니다. 또한 CORS를 우회하는 CSRF 같은 공격도 존재합니다. 완전한 보안을 위해서는 CORS 외에도 CSRF 토큰·SameSite 쿠키 속성·Content Security Policy 등을 함께 사용해야 합니다.",
    isAdvanced: true,
  },

  // ─── 9. 쿠키 / 세션 / JWT ────────────────────────────────────────────────────
  {
    id: "net-18",
    category: "network",
    question: "쿠키와 세션의 차이는?",
    answer:
      "쿠키는 브라우저에, 세션은 서버에 데이터를 저장합니다. 세션 기반 인증에서 서버는 세션을 생성하고 세션 ID만 쿠키로 클라이언트에 전달합니다. 이후 요청마다 쿠키의 세션 ID를 서버 저장소(DB·Redis)에서 조회하여 사용자를 식별합니다. 쿠키는 클라이언트에 저장되어 보안에 취약할 수 있지만 HttpOnly·Secure 속성으로 보완합니다. 세션은 서버에서 즉시 무효화할 수 있지만 서버 확장 시 세션 공유가 필요합니다.",
  },
  {
    id: "net-19",
    category: "network",
    question: "JWT의 장단점은?",
    answer:
      "장점: 서버에 상태를 저장하지 않아 수평 확장이 쉽고, 토큰 자체에 사용자 정보가 담겨 DB 조회 없이 인증이 가능합니다. 단점: 토큰이 탈취되면 만료 전까지 무효화할 수 없습니다. Payload는 Base64 인코딩만 되어 있어 암호화가 아니므로 민감한 정보를 담으면 안 됩니다. 이를 위해 짧은 수명(15분~1시간)의 Access Token과 긴 수명(7~30일)의 Refresh Token을 함께 사용하는 전략을 씁니다. Refresh Token은 HttpOnly 쿠키로 저장하여 XSS 공격으로부터 보호합니다.",
  },
  {
    id: "net-20",
    category: "network",
    question:
      "쿠키의 HttpOnly, Secure, SameSite 속성이 각각 무엇을 방어하나요?",
    answer:
      "HttpOnly는 JavaScript에서 document.cookie로 쿠키에 접근하지 못하게 합니다. XSS 공격이 성공해도 세션 쿠키를 탈취할 수 없습니다. Secure는 HTTPS 연결에서만 쿠키를 전송하여 네트워크 도청으로부터 보호합니다. SameSite는 CSRF 공격을 방어합니다. Strict는 다른 사이트에서의 모든 요청에 쿠키를 포함하지 않고, Lax는 GET 요청 등 안전한 경우에만 포함하며, None은 모든 요청에 포함하지만 Secure와 함께 사용해야 합니다.",
    isAdvanced: true,
  },

  // ─── 10. DNS 동작 방식 ───────────────────────────────────────────────────────
  {
    id: "net-21",
    category: "network",
    question: "브라우저에서 DNS 조회는 어떻게 이루어지나요?",
    answer:
      "브라우저 캐시 → OS 캐시 → hosts 파일 → ISP의 재귀 DNS 리졸버 순으로 확인합니다. 재귀 리졸버가 캐시에 없으면, 루트 네임서버에 질의하여 TLD 서버(.com) 주소를 얻고, TLD 서버에 질의하여 도메인의 권한 네임서버 주소를 얻고, 권한 네임서버에 최종 IP 주소를 질의합니다. 결과는 TTL(Time To Live) 동안 캐시되며, 이 과정이 첫 연결의 지연 원인 중 하나입니다.",
  },

  // ─── 11. 브라우저 URL 입력 시 일어나는 일 ────────────────────────────────────
  {
    id: "net-22",
    category: "network",
    question: "브라우저 주소창에 URL을 입력하면 어떤 일이 일어나나요?",
    answer:
      "① URL 파싱(프로토콜·도메인·경로 분리) → ② HSTS 확인(이전에 HTTPS 방문 시 자동 업그레이드) → ③ DNS 조회로 도메인을 IP로 변환 → ④ TCP 3-way handshake로 연결 수립 → ⑤ TLS 핸드셰이크(HTTPS) → ⑥ HTTP GET 요청 전송 → ⑦ 서버가 HTML 응답 → ⑧ HTML 파싱하여 DOM 트리, CSS 파싱하여 CSSOM 트리 생성 → ⑨ DOM + CSSOM으로 Render Tree 구성 → ⑩ Layout(Reflow) → Paint → Composite 단계를 거쳐 화면에 출력. 동시에 script 태그를 만나면 파싱을 중단하고 JS를 실행합니다.",
  },

  // ─── 12. CDN ─────────────────────────────────────────────────────────────────
  {
    id: "net-23",
    category: "network",
    question: "CDN이란 무엇이고 어떤 이점이 있나요?",
    answer:
      "CDN(Content Delivery Network)은 전 세계에 분산된 엣지 서버로 정적 콘텐츠를 사용자와 가까운 위치에서 제공하는 인프라입니다. DNS 기반으로 가장 가까운 엣지 서버로 라우팅되며, 캐시 히트 시 즉시 응답하고 캐시 미스 시 Origin 서버에서 콘텐츠를 가져와 캐싱합니다. 이점: ① 물리적으로 가까운 서버에서 응답하여 지연 감소, ② Origin 서버 부하 감소, ③ 분산 네트워크로 DDoS 공격 흡수, ④ 여러 엣지 서버로 가용성 향상.",
  },

  // ─── 13. WebSocket vs SSE vs Long Polling ────────────────────────────────────
  {
    id: "net-24",
    category: "network",
    question: "WebSocket·SSE·Long Polling의 차이는?",
    answer:
      "Long Polling은 클라이언트 요청에 서버가 데이터가 생길 때까지 응답을 보류하고 응답 후 즉시 재요청하는 방식으로 HTTP 기반 단방향이며 매번 HTTP 핸드셰이크가 발생해 오버헤드가 큽니다. SSE(Server-Sent Events)는 HTTP 기반 서버→클라이언트 단방향 스트리밍으로 EventSource API를 사용하고 자동 재연결을 지원합니다. 실시간 알림·주가 업데이트에 적합합니다. WebSocket은 HTTP 업그레이드 후 양방향 실시간 통신을 지원하며 헤더 없이 프레임만 전송하여 오버헤드가 가장 작습니다. 채팅·온라인 게임·협업 도구에 적합합니다.",
  },

  // ─── 14. HTTP 캐싱 ──────────────────────────────────────────────────────────
  {
    id: "net-25",
    category: "network",
    question: "HTTP 캐싱의 ETag는 어떻게 동작하나요?",
    answer:
      "서버는 응답에 ETag 헤더로 리소스의 버전 식별자(보통 컨텐츠 해시)를 보냅니다. max-age가 만료된 후 클라이언트가 같은 리소스를 요청할 때 If-None-Match 헤더에 저장된 ETag를 포함합니다. 서버는 현재 ETag와 비교하여 변경이 없으면 304 Not Modified(본문 없음)를, 변경됐으면 200 OK와 새 ETag를 응답합니다. max-age 이내에는 서버에 요청조차 하지 않는 강한 캐시와 달리, ETag는 서버에 유효성을 확인하는 약한 캐시 방식입니다.",
  },
  {
    id: "net-26",
    category: "network",
    question:
      "Cache-Control 헤더의 주요 값과 Cache Busting 전략을 설명해주세요.",
    answer:
      "Cache-Control 주요 값: max-age=N(N초 동안 캐시 유효), no-cache(매번 서버에 ETag로 유효성 검사), no-store(캐시 저장 금지), private(브라우저만 캐시, CDN 불가), public(중간 캐시도 저장 가능). Cache Busting은 파일이 변경됐을 때 캐시를 무효화하는 전략입니다. 빌드 시 파일명에 컨텐츠 해시를 포함(main.a3b4c5d6.js)하면 파일 변경 시 URL이 바뀌어 브라우저가 새로운 파일로 인식합니다. 이를 통해 정적 자산에 max-age=31536000(1년)을 설정하면서도 변경 즉시 반영이 가능합니다. index.html은 no-cache로 설정해 항상 최신 버전을 참조하도록 합니다.",
    isAdvanced: true,
  },

  // ─── 15. CSP ─────────────────────────────────────────────────────────────────
  {
    id: "net-27",
    category: "network",
    question:
      "CSP(Content Security Policy)란 무엇이고 XSS를 어떻게 방어하나요?",
    answer:
      "CSP는 HTTP 응답 헤더(Content-Security-Policy)를 통해 브라우저가 허용된 출처의 리소스만 로드·실행하도록 지시하는 보안 정책입니다. script-src 'self'와 같이 설정하면 인라인 스크립트와 외부 출처 스크립트를 차단하여, 공격자가 악성 스크립트를 주입해도 브라우저가 실행을 거부합니다. 입력 검증·출력 인코딩에 이은 마지막 방어선 역할을 합니다. nonce나 hash를 이용해 신뢰된 인라인 스크립트만 실행하도록 세밀하게 제어할 수도 있습니다.",
    isAdvanced: true,
  },

  // ─── 16. 브라우저 렌더링 파이프라인 ─────────────────────────────────────────
  {
    id: "net-28",
    category: "network",
    question: "브라우저 렌더링 파이프라인의 단계를 설명해주세요.",
    answer:
      "① HTML 파싱 → DOM 트리 구성, ② CSS 파싱 → CSSOM 트리 구성, ③ DOM + CSSOM 합쳐 Render Tree 구성(화면에 표시될 노드만), ④ Layout(Reflow): 각 노드의 크기와 위치 계산, ⑤ Paint: 레이어별로 픽셀 채우기(색상·테두리·그림자), ⑥ Composite: GPU가 레이어들을 합성하여 최종 화면 출력. script 태그를 만나면 HTML 파싱이 중단되므로 defer·async 속성으로 제어합니다.",
  },
  {
    id: "net-29",
    category: "network",
    question: "Reflow와 Repaint의 차이는?",
    answer:
      "Reflow(Layout)는 width·height·margin 변경 또는 DOM 추가·삭제 시 발생하며 Layout → Paint → Composite 전체를 재실행합니다. 가장 비용이 큽니다. Repaint는 color·background·visibility처럼 레이아웃은 변하지 않고 시각적 스타일만 바뀔 때 발생하여 Layout 단계를 건너뜁니다. transform과 opacity는 Composite 단계만 처리하므로 Reflow·Repaint를 전혀 유발하지 않아 GPU에서 처리되어 가장 성능이 좋습니다. 애니메이션에는 left 대신 transform: translateX()를 사용하는 이유입니다.",
  },
  {
    id: "net-30",
    category: "network",
    question: "script 태그의 defer와 async의 차이는?",
    answer:
      "둘 다 HTML 파싱과 스크립트 다운로드를 병렬로 수행합니다. async는 다운로드 완료 즉시 파싱을 중단하고 스크립트를 실행하여 실행 순서가 보장되지 않습니다. 독립적인 분석 스크립트에 적합합니다. defer는 HTML 파싱이 완전히 끝난 후 선언 순서대로 실행됩니다. DOMContentLoaded 이벤트 직전에 실행되므로 대부분의 경우 defer가 더 안전합니다. 일반 script 태그(속성 없음)는 파싱을 중단하고 즉시 다운로드·실행합니다.",
  },

  // ─── 17. XSS / CSRF / SQL Injection ─────────────────────────────────────────
  {
    id: "net-31",
    category: "network",
    question: "XSS와 CSRF의 차이는? 각각 어떻게 방어하나요?",
    answer:
      "XSS(Cross-Site Scripting)는 공격자가 악성 스크립트를 웹 페이지에 삽입하여 다른 사용자의 브라우저에서 실행시키는 공격입니다. 방어: innerHTML 대신 textContent 사용, 사용자 입력 HTML 인코딩, CSP 헤더, HttpOnly 쿠키. CSRF(Cross-Site Request Forgery)는 인증된 사용자가 의도치 않게 서버에 악의적인 요청을 보내도록 유도하는 공격입니다. 브라우저가 자동으로 쿠키를 포함하므로 발생합니다. 방어: SameSite=Strict·Lax 쿠키 속성, CSRF 토큰(커스텀 헤더). XSS는 '사용자 브라우저 공격', CSRF는 '서버를 속여 권한 남용'이 핵심 차이입니다.",
  },
  {
    id: "net-32",
    category: "network",
    question: "HttpOnly 쿠키가 왜 XSS 방어에 도움이 되나요?",
    answer:
      "HttpOnly 속성이 설정된 쿠키는 JavaScript에서 document.cookie로 접근할 수 없습니다. XSS 공격이 성공해 악성 스크립트가 실행되더라도 세션 쿠키를 읽거나 외부 서버로 전송할 수 없게 됩니다. 쿠키는 HTTP 요청에는 자동으로 포함되므로 서버 측 기능은 정상적으로 동작하면서도, JS에서의 직접 접근을 막아 쿠키 탈취를 방지합니다. JWT를 Refresh Token으로 사용할 때 HttpOnly 쿠키에 저장하는 이유이기도 합니다.",
    isAdvanced: true,
  },
  {
    id: "net-33",
    category: "network",
    question: "SQL Injection이란 무엇이고 어떻게 방어하나요?",
    answer:
      'SQL Injection은 사용자 입력값에 SQL 코드를 삽입하여 DB 쿼리를 조작하는 공격입니다. 예를 들어 입력값으로 "\'; DROP TABLE users; --"를 입력하면 문자열 직접 조합 쿼리에서 테이블이 삭제될 수 있습니다. 방어 방법: ① Prepared Statement(파라미터화된 쿼리) — 입력값을 코드로 해석하지 않고 데이터로만 처리, ② ORM 사용(쿼리를 직접 작성하지 않음), ③ 최소 권한 DB 계정 사용(SELECT만 필요한 경우 DROP 권한 제거). Prepared Statement가 가장 근본적인 해결책입니다.',
  },
  {
    id: "net-34",
    category: "network",
    question: "XSS 공격이란? 어떻게 방어하나요?",
    answer:
      "XSS(Cross-Site Scripting)는 공격자가 악성 스크립트를 웹 페이지에 삽입하여 다른 사용자의 브라우저에서 실행되게 하는 공격입니다. 삽입된 스크립트는 쿠키 탈취·키로깅·가짜 폼을 통한 피싱이 가능합니다. 방어 방법: ① innerHTML 대신 textContent 사용(스크립트로 해석 안 함), ② 사용자 입력 HTML 인코딩(\\ < → &lt;), ③ Content-Security-Policy 헤더로 스크립트 실행 출처 제한, ④ HttpOnly 쿠키로 JS에서 세션 쿠키 접근 차단.",
  },

  // ─── 18. 웹 성능 최적화 ─────────────────────────────────────────────────────
  {
    id: "net-35",
    category: "network",
    question: "Core Web Vitals란 무엇인가요?",
    answer:
      "Google이 정의한 웹 경험 핵심 지표로, 검색 순위에도 영향을 줍니다. 세 가지 지표: ① LCP(Largest Contentful Paint): 가장 큰 콘텐츠가 화면에 렌더링되는 시간, 목표 ≤2.5초 — 이미지 최적화·CDN·preload로 개선. ② INP(Interaction to Next Paint): 사용자 상호작용 후 다음 화면 갱신까지 시간, 목표 ≤200ms — Web Worker·가상화로 개선. ③ CLS(Cumulative Layout Shift): 예상치 못한 레이아웃 이동 누적 점수, 목표 ≤0.1 — 이미지·광고에 width/height 명시, font-display: swap으로 개선.",
  },
  {
    id: "net-36",
    category: "network",
    question:
      "프론트엔드 성능 최적화 방법을 크게 세 가지 관점으로 설명해주세요.",
    answer:
      "① 로딩 최적화(LCP 개선): 이미지 WebP/AVIF 포맷 변환, loading='lazy' 지연 로딩, CDN으로 정적 자산 배포, link rel='preload'로 중요 리소스 우선 요청. ② 렌더링 최적화(INP/CLS 개선): transform·opacity 사용으로 Reflow 회피, 긴 목록은 가상화(Virtualization)로 DOM 수 최소화, 이미지에 width·height 명시로 CLS 방지, React 18의 startTransition으로 낮은 우선순위 업데이트 구분. ③ 번들 최적화: 코드 스플리팅(라우트·컴포넌트 단위 dynamic import), Tree Shaking으로 사용하지 않는 코드 제거, 정적 자산에 Cache-Control: max-age=31536000, immutable 설정.",
  },
];
