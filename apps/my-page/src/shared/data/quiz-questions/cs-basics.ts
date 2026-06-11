import type { QuizQuestion } from "./types";

export const CS_BASICS_QUESTIONS: QuizQuestion[] = [
  {
    id: "cs-01",
    category: "cs-basics",
    question: "가상 메모리(Virtual Memory)란 무엇인가요?",
    answer:
      "가상 메모리는 OS가 각 프로세스에게 독립적인 연속 주소 공간이 있는 것처럼 보이게 하는 추상화 기법입니다. 실제 물리 메모리는 4KB 단위의 페이지로 분할되어 관리되며, 물리 메모리가 부족하면 디스크의 스왑 공간을 사용합니다. 덕분에 프로세스 간 메모리 격리(보안), 실제 물리 메모리보다 큰 메모리 사용, 메모리 단편화 해결이 가능합니다.",
  },
  {
    id: "cs-02",
    category: "cs-basics",
    question: "가상 메모리의 페이지(Page)와 페이지 테이블이란 무엇인가요?",
    answer:
      "페이지는 가상 주소 공간을 일정한 크기(보통 4KB)로 나눈 단위입니다. 물리 메모리의 동일한 크기 단위는 프레임(Frame)이라고 합니다. 페이지 테이블은 가상 주소의 페이지 번호를 물리 주소의 프레임 번호로 변환하는 매핑 정보를 담은 자료구조입니다. CPU의 MMU(Memory Management Unit)가 페이지 테이블을 참조해 주소 변환을 수행합니다.",
  },
  {
    id: "cs-03",
    category: "cs-basics",
    question: "페이지 폴트(Page Fault)란 무엇이고, 어떻게 처리되나요?",
    answer:
      "페이지 폴트는 프로세스가 접근하려는 페이지가 물리 메모리에 없을 때 발생하는 인터럽트입니다. 처리 과정은 다음과 같습니다. 1) CPU가 페이지 폴트 인터럽트를 발생시킵니다. 2) OS가 해당 페이지를 디스크(스왑)에서 찾습니다. 3) 비어 있는 프레임에 페이지를 로드합니다. 4) 페이지 테이블을 업데이트합니다. 5) 중단된 명령을 재실행합니다. 빈 프레임이 없으면 페이지 교체 알고리즘(LRU 등)으로 교체할 페이지를 선택합니다.",
    isAdvanced: true,
  },
  {
    id: "cs-04",
    category: "cs-basics",
    question: "CPU 스케줄링이란 무엇이고, 왜 필요한가요?",
    answer:
      "CPU 스케줄링은 Ready 상태의 여러 프로세스 중 어느 것을 CPU에 할당할지 결정하는 OS의 역할입니다. CPU는 한 번에 하나의 작업만 처리할 수 있으므로, 여러 프로세스가 CPU를 공정하고 효율적으로 사용하게 하기 위해 필요합니다. 주요 목표는 CPU 이용률 극대화, 처리량(Throughput) 향상, 응답 시간 최소화, 기아(Starvation) 방지입니다.",
  },
  {
    id: "cs-05",
    category: "cs-basics",
    question: "Round Robin 스케줄링 알고리즘을 설명하세요.",
    answer:
      "Round Robin은 모든 프로세스에 동일한 시간 할당량(Time Quantum, 보통 10~100ms)을 부여하고 순서대로 돌아가며 CPU를 할당하는 선점형 알고리즘입니다. 할당 시간이 끝나면 프로세스는 Ready 큐의 맨 뒤로 돌아갑니다. 모든 프로세스가 공평하게 처리되어 응답성이 좋다는 장점이 있습니다. 단, Time Quantum이 너무 작으면 컨텍스트 스위칭 오버헤드가 커지고, 너무 크면 FCFS와 유사해져 응답성이 떨어집니다. 브라우저의 탭 간 CPU 시간 분배와 개념적으로 연결됩니다.",
  },
  {
    id: "cs-06",
    category: "cs-basics",
    question: "MLFQ(다단계 피드백 큐) 스케줄링이란 무엇인가요?",
    answer:
      "MLFQ(Multi-Level Feedback Queue)는 여러 개의 우선순위 큐를 두고, 프로세스의 CPU 사용 패턴에 따라 큐 간에 이동시키는 스케줄링 알고리즘입니다. 처음 진입한 프로세스는 높은 우선순위 큐에 배치됩니다. 할당 시간 내에 완료되지 않으면 낮은 우선순위 큐로 이동합니다. I/O가 많은 짧은 작업은 높은 우선순위를 유지하고, CPU 집약적인 긴 작업은 낮은 우선순위로 이동합니다. Starvation 방지를 위해 오랫동안 대기한 프로세스를 높은 우선순위로 올리는 Aging 기법을 함께 사용합니다.",
    isAdvanced: true,
  },
  {
    id: "cs-07",
    category: "cs-basics",
    question:
      "컨텍스트 스위칭(Context Switching)이란 무엇이고, 어떤 비용이 있나요?",
    answer:
      "컨텍스트 스위칭은 CPU가 실행 중인 프로세스 또는 스레드를 전환할 때, 현재 상태(레지스터, PC, 스택 포인터 등 PCB 정보)를 저장하고 다음 프로세스의 상태를 복원하는 과정입니다. 비용으로는 PCB 저장·복원 비용, 캐시 플러시로 인한 캐시 미스, TLB(Translation Lookaside Buffer) 무효화가 있습니다. 프로세스 전환은 주소 공간까지 바뀌므로 스레드 전환보다 훨씬 무겁습니다. Round Robin의 Time Quantum이 너무 작으면 이 비용이 성능 병목이 됩니다.",
  },
  {
    id: "cs-08",
    category: "cs-basics",
    question: "Race Condition(경쟁 조건)이란 무엇이고, 어떻게 해결하나요?",
    answer:
      "둘 이상의 스레드가 공유 자원에 동시에 접근할 때 실행 순서에 따라 결과가 달라지는 문제입니다. count++은 내부적으로 읽기→증가→쓰기 세 단계인데, 두 스레드가 동시에 실행하면 그 사이에 다른 스레드가 끼어들어 최종값이 1만 증가할 수 있습니다. 해결 방법은 Mutex(한 번에 하나의 스레드만 임계 구역에 진입하도록 잠금)와 Semaphore(N개 스레드까지 동시 접근 허용)입니다. JavaScript는 싱글 스레드라 기본적으로 Race Condition이 발생하지 않습니다.",
    isAdvanced: true,
  },
  {
    id: "cs-09",
    category: "cs-basics",
    question: "Deadlock(교착 상태)이란 무엇이고, 발생 조건은 무엇인가요?",
    answer:
      "Deadlock은 두 개 이상의 프로세스가 서로 상대방이 점유한 자원을 기다리며 무한히 대기하는 상태입니다. Deadlock 발생의 4가지 필요 조건(Coffman 조건)은 다음과 같습니다. 1) 상호 배제(Mutual Exclusion): 자원을 한 번에 하나의 프로세스만 사용. 2) 점유와 대기(Hold and Wait): 자원을 보유한 채 다른 자원을 기다림. 3) 비선점(No Preemption): 자원을 강제로 빼앗을 수 없음. 4) 순환 대기(Circular Wait): 프로세스들이 원형으로 서로의 자원을 기다림. 이 4가지 중 하나라도 깨면 Deadlock을 예방할 수 있습니다.",
    isAdvanced: true,
  },
];
