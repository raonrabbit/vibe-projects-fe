import type { QuizQuestion } from "./types";

export const NETWORK_QUESTIONS: QuizQuestion[] = [
  // ─── OSI 7계층 / TCP-IP ───────────────────────────────────────────────────
  {
    id: "net-01",
    category: "network",
    question: "OSI 7계층이 무엇인가요? 각 계층을 설명해보세요.",
    answer:
      "네트워크 통신을 7개 계층으로 나눈 표준 참조 모델입니다. 1계층 Physical(물리): 비트를 전기·광 신호로 변환합니다. 2계층 Data Link(데이터링크): MAC 주소로 같은 네트워크 내 장치 간 프레임 전송을 담당합니다(스위치). 3계층 Network(네트워크): IP 주소로 다른 네트워크 간 패킷 라우팅합니다(라우터). 4계층 Transport(전송): 포트 번호로 프로세스 간 통신, 신뢰성 제어를 담당합니다(TCP, UDP). 5~7계층: Session(세션 관리), Presentation(암호화·압축), Application(HTTP·DNS·SMTP 등 사용자 프로토콜).\n\n**부가설명:** 면접 핵심 포인트: HTTP는 7계층(Application), TCP/UDP는 4계층(Transport), IP는 3계층(Network)입니다.",
  },
  {
    id: "net-02",
    category: "network",
    question: "TCP/IP 4계층과 OSI 7계층의 차이는?",
    answer:
      "OSI는 이론적 표준 모델이고, TCP/IP는 실제 인터넷에서 사용하는 구현 모델입니다. TCP/IP 4계층: Network Interface(OSI 1·2계층), Internet(OSI 3계층), Transport(OSI 4계층), Application(OSI 5·6·7계층). OSI는 계층 역할을 명확히 분리하여 이론 이해에 유용하고, TCP/IP는 실용적으로 통합하여 인터넷 통신에 사용됩니다.",
  },
  {
    id: "net-03",
    category: "network",
    question: "각 계층에서 사용하는 프로토콜을 예시로 설명해보세요.",
    answer:
      "Application: HTTP/HTTPS(웹), DNS(도메인 해석), SMTP/IMAP(이메일), FTP(파일 전송), SSH(원격 접속). Transport: TCP(신뢰성), UDP(속도). Network: IP(라우팅), ICMP(ping), ARP(IP→MAC 변환). Data Link: 이더넷, Wi-Fi. Physical: 광케이블, 동축케이블. HTTPS = HTTP(7계층) + TLS + TCP(4계층) + IP(3계층)의 조합입니다.",
  },

  // ─── HTTP ─────────────────────────────────────────────────────────────────
  {
    id: "net-04",
    category: "network",
    question: "HTTP가 뭔가요?",
    answer:
      "HyperText Transfer Protocol의 약자로 클라이언트(브라우저)와 서버 간 데이터를 주고받기 위한 애플리케이션 계층 프로토콜입니다. 요청(Request)과 응답(Response) 구조로 동작하며 기본적으로 80번 포트를 사용합니다. 무상태(Stateless) 프로토콜로 각 요청이 독립적이며 이전 요청 정보를 기억하지 않습니다.\n\n**부가설명:** 무상태 특성 때문에 사용자 인증 정보를 유지하려면 쿠키·세션·JWT 같은 별도의 메커니즘이 필요합니다.",
  },
  {
    id: "net-05",
    category: "network",
    question: "HTTP vs HTTPS 차이는?",
    answer:
      "HTTPS는 HTTP에 TLS 레이어를 추가한 프로토콜입니다. 443번 포트를 사용하며 세 가지를 보장합니다: ① 암호화: 데이터를 암호화하여 도청을 방지합니다, ② 무결성: 메시지 인증 코드로 데이터 변조를 감지합니다, ③ 인증: 디지털 인증서로 서버의 신원을 확인합니다. TLS 핸드셰이크에서 비대칭키로 대칭키를 교환하고, 이후 데이터는 대칭키로 빠르게 암호화합니다.\n\n**부가설명:** SEO, 브라우저 보안 경고, HTTP/2 지원(HTTP/2는 TLS 필수) 측면에서도 HTTPS가 사실상 필수입니다.",
  },
  {
    id: "net-06",
    category: "network",
    question: "HTTP 2.0의 특징에 대해 설명해주세요.",
    answer:
      "HTTP/1.1에 비해 크게 세 가지가 개선됐습니다. ① Multiplexing: 하나의 TCP 연결에서 여러 요청·응답을 독립적인 스트림으로 동시에 처리합니다. HTTP/1.1의 HOL Blocking(앞선 요청이 지연되면 이후 요청도 대기)을 해결합니다. ② HPACK 헤더 압축: 중복 헤더를 줄여 전송량을 감소시킵니다. ③ 바이너리 프레이밍: 텍스트 대신 바이너리 형식으로 파싱 효율을 높입니다. 또한 Server Push(서버가 요청 없이 리소스를 미리 전송)도 지원합니다.",
  },

  // ─── TCP / UDP ─────────────────────────────────────────────────────────────
  {
    id: "net-08",
    category: "network",
    question: "TCP vs UDP 차이는?",
    answer:
      "TCP는 연결 지향 프로토콜로 3-way handshake로 연결을 맺고, 순서 보장·손실 패킷 재전송·흐름 제어·혼잡 제어를 통해 신뢰성 있는 전송을 보장합니다. HTTP/HTTPS·파일 전송·이메일에 사용합니다. UDP는 비연결 프로토콜로 신뢰성 보장 없이 빠르게 전송합니다. 실시간성이 중요하고 일부 손실을 허용하는 스트리밍·VoIP·온라인 게임·DNS에 적합합니다.\n\n**부가설명:** UDP는 오버헤드가 작아 빠르지만 데이터 순서와 전달을 보장하지 않습니다. 애플리케이션 레벨에서 신뢰성을 직접 구현할 때(QUIC 등) UDP를 기반으로 사용합니다.",
  },

  // ─── 3-way / 4-way Handshake ───────────────────────────────────────────────
  {
    id: "net-09",
    category: "network",
    question: "3-way Handshake는 뭔가요?",
    answer:
      "TCP 연결을 수립하는 과정입니다. ① 클라이언트 → 서버: SYN(초기 시퀀스 번호 포함) 전송, ② 서버 → 클라이언트: SYN+ACK(서버 시퀀스 번호 포함) 응답, ③ 클라이언트 → 서버: ACK 전송. 이 3단계로 양측의 초기 시퀀스 번호를 교환하고 서로 수신 준비 상태를 확인합니다.",
  },
  {
    id: "net-10",
    category: "network",
    question: "4-way Handshake는 뭔가요?",
    answer:
      "TCP 연결을 종료하는 과정입니다. ① 클라이언트 → 서버: FIN 전송(종료 요청), ② 서버 → 클라이언트: ACK 응답(서버는 아직 데이터 전송 가능), ③ 서버 → 클라이언트: FIN 전송(서버도 종료 준비 완료), ④ 클라이언트 → 서버: ACK 전송. 4단계인 이유는 서버가 클라이언트의 FIN을 받아도 아직 보낼 데이터가 남을 수 있어 ACK와 FIN을 분리해 전송하기 때문입니다.",
  },
  {
    id: "net-11",
    category: "network",
    question: "TIME_WAIT이 뭔가요?",
    answer:
      "4-way Handshake 마지막 ACK 전송 후 클라이언트가 2*MSL(약 60~120초) 동안 대기하는 상태입니다. 두 가지 이유가 있습니다. ① 마지막 ACK가 손실될 경우 서버가 FIN을 재전송하는데, TIME_WAIT 동안 대기하여 이를 처리합니다. ② 이전 연결의 지연된 패킷이 새 연결에 영향을 주는 것을 방지합니다.\n\n**부가설명:** 고부하 서버에서 TIME_WAIT이 너무 많으면 포트가 고갈될 수 있습니다. SO_REUSEADDR 소켓 옵션으로 완화할 수 있습니다.",
    isAdvanced: true,
  },

  // ─── TLS/SSL ───────────────────────────────────────────────────────────────
  {
    id: "net-12",
    category: "network",
    question: "TLS 1.2 Handshake 동작 순서에 대해 설명해보세요.",
    answer:
      "① ClientHello: 클라이언트가 지원하는 TLS 버전·암호 스위트·랜덤 값을 전송합니다. ② ServerHello: 서버가 선택한 암호 스위트·서버 인증서·랜덤 값을 응답합니다. ③ 인증서 검증: 클라이언트가 CA에서 서버 인증서를 검증합니다. ④ Pre-master Secret: 클라이언트가 서버 공개키로 암호화하여 전송합니다. ⑤ 세션 키 생성: 양측이 랜덤 값과 Pre-master Secret으로 동일한 대칭 세션 키를 생성합니다. ⑥ 이후 데이터를 세션 키로 암호화하여 전송합니다. 총 2-RTT가 필요합니다.",
  },
  {
    id: "net-13",
    category: "network",
    question: "TLS 1.3 Handshake 동작 순서에 대해 설명해주세요.",
    answer:
      "TLS 1.2의 2-RTT를 1-RTT로 줄였습니다. ① ClientHello: TLS 버전·암호 스위트 + DH 키 교환 파라미터를 함께 전송합니다. ② ServerHello: 선택한 암호 스위트·인증서·DH 파라미터를 응답합니다. ③ 양측이 Diffie-Hellman으로 공유 비밀(대칭키)을 각자 계산합니다. 이전 연결 정보가 있으면 0-RTT로 데이터를 즉시 전송할 수 있습니다. 취약한 RSA 키 교환 등을 제거하고 ECDHE만 허용하여 보안도 강화됐습니다.",
    isAdvanced: true,
  },
  {
    id: "net-14",
    category: "network",
    question:
      "CA(Certificate Authority)가 무엇이고 HTTPS 인증서는 어떻게 동작하나요?",
    answer:
      "CA는 디지털 인증서를 발급하고 서명하는 신뢰할 수 있는 제3자 기관입니다(DigiCert, Let's Encrypt 등). 동작 방식: 서버가 공개키·도메인 정보를 CSR(Certificate Signing Request)로 CA에 제출합니다. CA가 도메인 소유권을 확인하고 서버 공개키·도메인을 CA의 개인키로 서명하여 인증서를 발급합니다. 브라우저는 내장된 CA 목록(Root CA)을 기준으로 인증서 체인을 검증하여 신뢰 여부를 확인합니다.\n\n**부가설명:** 인증서에는 서버의 공개키가 포함되어 있어, 클라이언트가 서버에 데이터를 암호화할 때 이 공개키를 사용합니다.",
  },
  {
    id: "net-15",
    category: "network",
    question: "대칭키 vs 비대칭키 암호화의 차이는?",
    answer:
      "대칭키는 암호화와 복호화에 동일한 키를 사용합니다. 빠르지만 키를 안전하게 전달하는 것이 문제입니다. 비대칭키는 공개키(암호화)와 개인키(복호화) 쌍을 사용합니다. 공개키는 공개해도 개인키 없이는 복호화할 수 없어 키 전달 문제가 없지만 속도가 느립니다. HTTPS는 두 방식의 장점을 결합합니다. 비대칭키로 대칭키를 안전하게 교환하고, 이후 데이터 통신은 빠른 대칭키로 암호화합니다.",
  },

  // ─── REST API ──────────────────────────────────────────────────────────────
  {
    id: "net-16",
    category: "network",
    question: "REST API에 대해 설명하세요.",
    answer:
      "REST는 HTTP를 기반으로 자원을 URI로 표현하고 HTTP 메서드로 행위를 정의하는 아키텍처 스타일입니다. 주요 제약 조건: ① Client-Server(관심사 분리), ② Stateless(서버가 클라이언트 상태 저장 안 함), ③ Cacheable(응답 캐시 가능), ④ Uniform Interface(일관된 인터페이스), ⑤ Layered System(클라이언트는 프록시인지 서버인지 몰라도 됨). URI는 명사로 자원을 표현하고(GET /users/1), 행위는 HTTP 메서드로 표현합니다(DELETE /users/1).",
  },
  {
    id: "net-17",
    category: "network",
    question: "HTTP 메서드에 대해 전부 말하고 설명하세요.",
    answer:
      "GET: 리소스 조회(안전·멱등), POST: 리소스 생성(비안전·비멱등), PUT: 리소스 전체 교체(비안전·멱등), PATCH: 리소스 일부 수정(비안전), DELETE: 리소스 삭제(비안전·멱등), HEAD: GET과 동일하나 바디 없이 헤더만 반환, OPTIONS: 지원 메서드 확인(CORS Preflight에 사용). 멱등성(Idempotent): 동일한 요청을 여러 번 해도 같은 결과. 안전성(Safe): 리소스를 변경하지 않음.\n\n**부가설명:** PUT과 PATCH의 차이: PUT은 전체 교체이므로 보내지 않은 필드는 null이 됩니다. PATCH는 보낸 필드만 변경합니다.",
  },
  {
    id: "net-18",
    category: "network",
    question:
      "HTTP 상태 코드에 대해 설명해주세요. (200, 201, 204, 301, 302, 304, 400, 401, 403, 404, 500, 502)",
    answer:
      "2xx(성공): 200 OK(성공), 201 Created(리소스 생성 성공), 204 No Content(성공했지만 응답 본문 없음). 3xx(리다이렉트): 301 Moved Permanently(영구 이동), 302 Found(임시 이동), 304 Not Modified(캐시 유효, 본문 없음). 4xx(클라이언트 오류): 400 Bad Request(잘못된 요청), 401 Unauthorized(인증 필요-로그인 안 됨), 403 Forbidden(권한 없음-로그인해도 접근 불가), 404 Not Found. 5xx(서버 오류): 500 Internal Server Error, 502 Bad Gateway(upstream 서버 오류).\n\n**부가설명:** 401과 403의 차이가 자주 출제됩니다. 401은 인증(Authentication) 문제, 403은 인가(Authorization) 문제입니다.",
  },

  // ─── CORS ──────────────────────────────────────────────────────────────────
  {
    id: "net-19",
    category: "network",
    question: "CORS가 뭔가요?",
    answer:
      "Cross-Origin Resource Sharing의 약자입니다. 브라우저는 Same-Origin Policy(출처가 Protocol+Host+Port로 동일해야 함)에 의해 다른 출처의 리소스에 대한 JS 요청을 차단합니다. CORS는 서버가 Access-Control-Allow-Origin 헤더를 통해 특정 출처의 요청을 허용하는 메커니즘입니다. 브라우저가 요청 시 Origin 헤더를 포함하고, 서버 응답의 Access-Control-Allow-Origin을 확인하여 허용 여부를 결정합니다.\n\n**부가설명:** CORS는 브라우저 레벨의 정책이므로 curl·Postman 같은 서버 간 통신에는 적용되지 않습니다.",
  },
  {
    id: "net-20",
    category: "network",
    question: "CORS를 해결하기 위해 백엔드에서 어떻게 해야 하나요?",
    answer:
      "서버의 응답 헤더에 Access-Control-Allow-Origin을 추가합니다. 특정 출처만 허용: Access-Control-Allow-Origin: https://example.com, 모든 출처 허용(비권장): Access-Control-Allow-Origin: *. 쿠키를 포함한 인증 요청에는 Access-Control-Allow-Credentials: true와 정확한 출처를 명시해야 합니다(와일드카드 불가). PUT·DELETE나 커스텀 헤더가 있는 요청은 Preflight(OPTIONS 요청)를 먼저 처리해야 합니다(Access-Control-Allow-Methods, Allow-Headers 헤더 필요).\n\n**부가설명:** Next.js에서는 next.config.js의 headers 또는 API Route에서 헤더를 설정합니다. Express에서는 cors() 미들웨어를 사용합니다.",
  },

  // ─── WebSocket / 실시간 통신 ────────────────────────────────────────────────
  {
    id: "net-21",
    category: "network",
    question: "WebSocket이 무엇인가요?",
    answer:
      "HTTP 업그레이드 핸드셰이크를 통해 수립되는 양방향 실시간 통신 프로토콜입니다. 한 번 연결하면 클라이언트와 서버 모두 상대방의 요청 없이도 언제든 데이터를 전송할 수 있습니다. HTTP 헤더 없이 프레임 단위로 데이터를 전송하여 오버헤드가 작습니다. 채팅·실시간 협업·온라인 게임·주식 시세 등에 적합합니다.\n\n**부가설명:** 연결 유지를 위해 주기적인 ping/pong 메시지를 교환합니다. Socket.IO는 WebSocket을 지원하지 않는 환경에서 Long Polling으로 폴백하는 라이브러리입니다.",
  },
  {
    id: "net-23",
    category: "network",
    question: "WebSocket은 언제 사용하고 SSE는 언제 사용하나요?",
    answer:
      "WebSocket은 클라이언트와 서버가 모두 데이터를 주고받아야 하는 양방향 통신에 사용합니다. 채팅·온라인 게임·실시간 협업 도구가 대표적입니다. SSE는 서버에서 클라이언트로만 데이터를 보내는 단방향 스트리밍에 사용합니다. 실시간 알림·주식 시세·뉴스 피드처럼 클라이언트가 데이터를 보낼 필요가 없는 경우에 적합합니다. SSE는 HTTP 기반이라 CORS 처리·헤더 설정이 WebSocket보다 간단합니다.",
  },

  // ─── 쿠키 / 세션 / JWT ─────────────────────────────────────────────────────
  {
    id: "net-24",
    category: "network",
    question: "쿠키에 대해 설명해보세요.",
    answer:
      "서버가 클라이언트(브라우저)에 저장하는 작은 데이터 조각으로, 이후 모든 요청에 자동으로 포함됩니다. 만료 시간(Expires/Max-Age)을 설정하여 영구 또는 임시 저장이 가능합니다. 주요 보안 속성: HttpOnly(JS에서 접근 불가, XSS 방어), Secure(HTTPS에서만 전송), SameSite(CSRF 방어, Strict/Lax/None). 도메인·경로별 전송 범위를 제한할 수 있습니다.\n\n**부가설명:** 브라우저당 쿠키는 도메인별 4KB, 개수 제한이 있습니다.",
  },
  {
    id: "net-25",
    category: "network",
    question: "세션에 대해 설명해보세요.",
    answer:
      "서버 측에서 사용자 상태를 관리하는 방식입니다. 로그인 시 서버가 고유한 Session ID를 생성하여 서버 저장소(메모리·DB·Redis)에 저장하고, Session ID만 쿠키로 클라이언트에 전달합니다. 이후 요청마다 쿠키의 Session ID로 서버 저장소를 조회하여 사용자를 식별합니다. 서버에서 즉시 세션을 무효화할 수 있어 로그아웃·강제 탈퇴 처리가 확실합니다.\n\n**부가설명:** 단점: 서버가 여러 대인 경우 세션 공유를 위한 별도 저장소(Redis)가 필요합니다. 서버 확장 시 복잡도가 증가합니다.",
  },
  {
    id: "net-26",
    category: "network",
    question: "JWT에 대해 설명해보세요.",
    answer:
      "JSON Web Token의 약자로 인증 정보를 토큰 자체에 담아 서버가 상태를 저장하지 않는 방식입니다. Header(알고리즘).Payload(사용자 정보).Signature 세 부분을 점(.)으로 이어붙인 구조입니다. 서버는 요청의 Signature를 비밀키로 검증하여 위변조를 확인합니다. 서버 확장이 쉬운 장점이 있지만, 토큰이 탈취되면 만료 전까지 무효화할 수 없습니다.\n\n**부가설명:** Payload는 Base64 인코딩만 된 것이라 누구나 디코딩 가능합니다. 민감한 정보는 담으면 안 됩니다. 짧은 수명의 Access Token + 긴 수명의 Refresh Token 조합으로 보안을 높입니다.",
  },
  {
    id: "net-27",
    category: "network",
    question: "쿠키, LocalStorage, SessionStorage의 차이는?",
    answer:
      "쿠키: 서버와 클라이언트 양측에서 접근 가능합니다. 모든 요청에 자동 포함되고, 만료 시간 설정 가능합니다. 4KB 제한. LocalStorage: 브라우저에만 저장되며 서버로 자동 전송되지 않습니다. 브라우저를 닫아도 유지됩니다. 5~10MB 제한. SessionStorage: 브라우저 탭(세션)이 닫히면 삭제됩니다. 탭 간 공유되지 않습니다. 5~10MB 제한.\n\n**부가설명:** 인증 토큰 저장 위치: Access Token은 메모리(가장 안전, 새로고침 시 초기화), Refresh Token은 HttpOnly 쿠키(XSS 방어). LocalStorage에 토큰을 저장하면 XSS 공격에 취약합니다.",
  },

  // ─── DNS ───────────────────────────────────────────────────────────────────
  {
    id: "net-28",
    category: "network",
    question: "DNS가 뭔가요?",
    answer:
      "Domain Name System의 약자로 도메인 이름(example.com)을 IP 주소(93.184.216.34)로 변환하는 분산 데이터베이스 시스템입니다. '인터넷의 전화번호부'에 비유됩니다. UDP 53번 포트를 주로 사용합니다.\n\n**부가설명:** DNS는 계층 구조(Root NS → TLD NS → Authoritative NS)로 구성되며, 전 세계에 분산되어 있습니다. DNS 응답은 TTL(Time To Live) 동안 캐시됩니다.",
  },
  {
    id: "net-29",
    category: "network",
    question: "DNS → IP 주소 변환 과정에 대해 설명해보세요.",
    answer:
      "① 브라우저 캐시 확인 → ② OS 캐시(hosts 파일) 확인 → ③ ISP의 재귀 DNS 리졸버에 질의 → ④ 리졸버 캐시 미스 시 루트 네임서버(.com TLD NS 주소 응답) → ⑤ TLD 네임서버(example.com 권한 NS 주소 응답) → ⑥ 권한 네임서버(최종 IP 주소 응답) → ⑦ 리졸버가 클라이언트에 IP 반환. 결과는 TTL 동안 각 단계에서 캐시됩니다.\n\n**부가설명:** 전체 과정은 수십~수백ms가 걸릴 수 있어 첫 연결의 지연 원인 중 하나입니다. DNS Prefetch(rel='dns-prefetch')로 미리 해석하여 지연을 줄일 수 있습니다.",
  },
  {
    id: "net-30",
    category: "network",
    question: "DNS 레코드 타입에 대해 설명해보세요.",
    answer:
      "A 레코드: 도메인을 IPv4 주소로 매핑합니다(가장 기본). AAAA 레코드: 도메인을 IPv6 주소로 매핑합니다. CNAME 레코드: 도메인을 다른 도메인으로 매핑합니다(별칭). www.example.com → example.com. MX 레코드: 이메일 서버 지정. TXT 레코드: 도메인 소유 인증·SPF 등 텍스트 정보. NS 레코드: 도메인의 권한 네임서버 지정. TTL이 짧으면 DNS 변경이 빨리 전파되지만 쿼리가 증가합니다.",
    isAdvanced: true,
  },

  // ─── CDN ──────────────────────────────────────────────────────────────────
  {
    id: "net-31",
    category: "network",
    question: "CDN이 뭔가요?",
    answer:
      "Content Delivery Network의 약자로 전 세계에 분산된 엣지 서버로 정적 콘텐츠를 사용자와 가까운 위치에서 제공하는 인프라입니다. DNS 기반으로 가장 가까운 엣지 서버로 라우팅되며, 캐시 히트 시 즉시 응답하고 미스 시 Origin 서버에서 가져와 캐싱합니다. 이점: ① 지연 감소, ② Origin 서버 부하 감소, ③ DDoS 흡수, ④ 가용성 향상.\n\n**부가설명:** Cloudflare, AWS CloudFront, Fastly가 대표적입니다. 이미지·JS·CSS 같은 정적 자산은 CDN에서 서빙하고, API 응답은 Origin 서버에서 처리하는 것이 일반적입니다.",
  },

  // ─── Proxy / Load Balancer ─────────────────────────────────────────────────
  {
    id: "net-32",
    category: "network",
    question: "Reverse Proxy와 Forward Proxy의 차이는?",
    answer:
      "Forward Proxy는 클라이언트 앞에 위치합니다. 클라이언트가 서버에 직접 요청하지 않고 프록시를 통해 요청합니다. 클라이언트 IP를 숨기거나 캐싱·콘텐츠 필터링에 사용합니다(학교·기업 웹 필터링). Reverse Proxy는 서버 앞에 위치합니다. 외부 요청을 받아 실제 서버로 전달합니다. 서버의 IP를 숨기고 로드 밸런싱·SSL 종료·캐싱을 처리합니다. Nginx, AWS ALB, Cloudflare가 대표적입니다.\n\n**부가설명:** 이름의 방향이 헷갈리기 쉽습니다. Forward Proxy는 클라이언트를 대신하고, Reverse Proxy는 서버를 대신합니다.",
  },
  {
    id: "net-33",
    category: "network",
    question: "Load Balancer가 무엇이고 어떤 알고리즘이 있나요?",
    answer:
      "여러 서버에 트래픽을 분산하여 단일 서버의 과부하를 방지하고 가용성을 높이는 장치입니다. 주요 알고리즘: ① Round Robin: 순서대로 분배(서버 성능이 동일할 때 적합), ② Weighted Round Robin: 성능 비례 가중치로 분배, ③ Least Connections: 현재 연결 수가 가장 적은 서버에 분배(처리 시간이 다를 때 유리), ④ IP Hash: 클라이언트 IP 기반 분배(동일 클라이언트가 항상 같은 서버로, sticky session).\n\n**부가설명:** L4 로드 밸런서는 IP·포트 기반, L7 로드 밸런서는 URL·헤더·쿠키 기반으로 더 세밀한 분배가 가능합니다.",
  },
  {
    id: "net-34",
    category: "network",
    question: "Reverse Proxy를 왜 사용하나요?",
    answer:
      "① 로드 밸런싱: 여러 백엔드 서버에 요청을 분산합니다. ② SSL 종료(SSL Termination): Reverse Proxy에서 HTTPS를 처리하고 백엔드는 HTTP로 통신합니다. 인증서 관리를 한 곳에서 합니다. ③ 캐싱: 정적 콘텐츠를 캐시하여 백엔드 부하를 줄입니다. ④ 보안: 실제 서버 IP와 구조를 숨기고 WAF 역할도 합니다. ⑤ gzip 압축을 백엔드 대신 처리합니다.\n\n**부가설명:** Next.js 앱을 Nginx 뒤에 배포하는 것이 대표적인 패턴입니다. Vercel, Netlify도 내부적으로 Reverse Proxy를 사용합니다.",
    isAdvanced: true,
  },

  // ─── HTTP 캐싱 ────────────────────────────────────────────────────────────
  {
    id: "net-35",
    category: "network",
    question: "HTTP 캐싱이 무엇인가요?",
    answer:
      "이전에 가져온 리소스를 브라우저나 중간 서버에 저장하여 동일한 요청 시 서버에 다시 요청하지 않고 저장된 응답을 사용하는 기술입니다. 크게 강한 캐시(Strong Cache)와 협상 캐시(Negotiation Cache)로 나뉩니다. 네트워크 요청을 줄여 로딩 속도를 높이고 서버 부하를 감소시킵니다.\n\n**부가설명:** 웹 성능 최적화에서 캐싱은 가장 효과적인 방법 중 하나입니다. 정적 자산(JS·CSS·이미지)은 긴 캐시, API 응답은 짧은 캐시 또는 no-cache를 적용합니다.",
  },
  {
    id: "net-36",
    category: "network",
    question: "Cache-Control 헤더에 대해 설명해보세요.",
    answer:
      "캐시 동작을 제어하는 HTTP 헤더입니다. 주요 지시어: max-age=N(N초 동안 캐시 유효, 강한 캐시), no-cache(캐시는 하되 매번 서버에 유효성 검사, 협상 캐시), no-store(캐시 저장 자체를 금지), private(브라우저만 캐시 가능, CDN 불가), public(중간 캐시도 저장 가능), immutable(max-age 내에 절대 변경되지 않음을 명시).\n\n**부가설명:** 정적 자산에 파일명에 해시를 포함(main.a3b4c5.js)하고 max-age=31536000 immutable을 설정하면 1년간 캐시되면서 변경 시 즉시 반영(Cache Busting)됩니다. index.html은 no-cache로 항상 최신 버전을 참조합니다.",
  },
  {
    id: "net-37",
    category: "network",
    question: "ETag와 Last-Modified의 차이는?",
    answer:
      "Last-Modified는 리소스의 마지막 수정 시간을 기반으로 검증합니다. 클라이언트가 If-Modified-Since 헤더로 보내고, 서버는 변경 없으면 304 Not Modified로 응답합니다. ETag는 리소스 내용의 해시값을 사용하여 1초 미만의 변경도 감지하고 더 정확합니다. 클라이언트가 If-None-Match 헤더로 보냅니다. ETag가 더 정확하지만 서버에서 해시를 계산하는 비용이 있습니다.",
  },

  // ─── CSP ──────────────────────────────────────────────────────────────────
  {
    id: "net-39",
    category: "network",
    question: "CSP가 뭔가요?",
    answer:
      "Content Security Policy의 약자입니다. HTTP 응답 헤더(Content-Security-Policy)로 브라우저에게 어떤 출처의 리소스만 로드·실행할 수 있는지 지시하는 보안 정책입니다. script-src 'self'로 설정하면 인라인 스크립트와 외부 출처 스크립트를 차단하여, 공격자가 XSS로 스크립트를 주입해도 실행을 차단합니다. 입력 검증·출력 인코딩에 이은 마지막 방어선 역할입니다.\n\n**부가설명:** nonce나 hash를 이용해 신뢰된 인라인 스크립트만 실행하도록 세밀하게 제어할 수 있습니다. CSP 위반 사항을 report-uri로 수집하여 공격 시도를 모니터링할 수 있습니다.",
    isAdvanced: true,
  },

  // ─── 보안 ─────────────────────────────────────────────────────────────────
  {
    id: "net-40",
    category: "network",
    question: "XSS가 뭔가요?",
    answer:
      "Cross-Site Scripting의 약자로, 공격자가 악성 스크립트를 웹 페이지에 삽입하여 다른 사용자의 브라우저에서 실행시키는 공격입니다. 삽입된 스크립트로 쿠키 탈취·키로깅·가짜 폼을 통한 피싱이 가능합니다. 방어: ① innerHTML 대신 textContent 사용, ② 사용자 입력 HTML 인코딩(< → &lt;), ③ CSP 헤더로 스크립트 출처 제한, ④ HttpOnly 쿠키로 JS에서 세션 접근 차단.",
  },
  {
    id: "net-41",
    category: "network",
    question: "CSRF가 뭔가요?",
    answer:
      "Cross-Site Request Forgery의 약자로, 인증된 사용자가 의도치 않게 악의적인 요청을 서버에 보내도록 유도하는 공격입니다. 브라우저가 쿠키를 자동으로 포함하기 때문에 발생합니다. 방어: ① SameSite=Strict·Lax 쿠키 속성(다른 사이트에서의 요청에 쿠키 미포함), ② CSRF 토큰(요청마다 서버가 발급한 토큰을 검증), ③ 커스텀 헤더 검증.\n\n**부가설명:** XSS와 CSRF의 차이: XSS는 '사용자 브라우저 공격'(스크립트 실행), CSRF는 '서버를 속여 권한 남용'(인증된 사용자로 위장)입니다.",
  },
  {
    id: "net-42",
    category: "network",
    question: "SQL Injection이 무엇인가요? 어떻게 방어하나요?",
    answer:
      "사용자 입력값에 SQL 코드를 삽입하여 DB 쿼리를 조작하는 공격입니다. 예를 들어 로그인 폼에 '; DROP TABLE users; --를 입력하면 테이블이 삭제될 수 있습니다. 방어: ① Prepared Statement(파라미터화된 쿼리): 입력값을 데이터로만 처리하고 SQL 코드로 해석하지 않습니다(가장 근본적인 해결책), ② ORM 사용(쿼리를 직접 작성하지 않음), ③ 최소 권한 DB 계정 사용.",
  },

  // ─── Web ───────────────────────────────────────────────────────────────────
  {
    id: "net-44",
    category: "network",
    question:
      "https://example.com을 눌렀을 때의 동작 과정에 대해 설명해보세요.",
    answer:
      "① URL 파싱(프로토콜·도메인·경로 분리) → ② HSTS 확인(이전 방문 시 자동 HTTPS) → ③ DNS 조회(도메인을 IP로 변환) → ④ TCP 3-way Handshake(연결 수립) → ⑤ TLS Handshake(HTTPS 암호화 협상) → ⑥ HTTP GET 요청 전송 → ⑦ 서버가 HTML 응답 → ⑧ HTML 파싱(DOM 트리 생성)·CSS 파싱(CSSOM 생성) → ⑨ Render Tree 구성 → ⑩ Layout → Paint → Composite(화면 출력). script 태그를 만나면 파싱을 중단하고 JS를 실행합니다.",
  },
  {
    id: "net-45",
    category: "network",
    question: "브라우저 렌더링 과정에 대해 설명해보세요.",
    answer:
      "① HTML 파싱 → DOM 트리 생성 ② CSS 파싱 → CSSOM 트리 생성 ③ DOM + CSSOM 합쳐 Render Tree 구성(화면에 표시될 노드만 포함, display:none 제외) ④ Layout(Reflow): 각 노드의 크기와 위치를 픽셀로 계산 ⑤ Paint: 레이어별로 픽셀을 채움(색상·테두리·그림자) ⑥ Composite: GPU가 레이어를 합성하여 최종 화면 출력.\n\n**부가설명:** width·height 변경은 Layout부터 다시 실행(Reflow = 가장 비용이 큼). color 변경은 Paint부터. transform·opacity 변경은 Composite만 처리(GPU, 가장 빠름). 애니메이션에 left 대신 transform을 사용하는 이유입니다.",
  },
];
