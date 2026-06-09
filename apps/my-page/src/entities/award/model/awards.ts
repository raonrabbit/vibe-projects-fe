export interface Award {
  id: string;
  title: string;
  organizer: string;
  date: string;
  description: string;
  projectId?: string;
}

export const AWARDS: Award[] = [
  {
    id: "1",
    title: "SSAFY 1학기 프로젝트 최우수상",
    organizer: "삼성 청년 SW·AI 아카데미",
    date: "2024.11",
    description:
      "AI를 활용한 부동산 추천 플랫폼 '이집어때'로 1학기 프로젝트 최우수상(1등)을 수상했습니다.",
    projectId: "ezip",
  },
  {
    id: "2",
    title: "SSAFY 2학기 프로젝트 우수상",
    organizer: "삼성 청년 SW·AI 아카데미",
    date: "2025.04",
    description:
      "시니어를 위한 AI 기반 뱅킹 키오스크 '동행'으로 2학기 프로젝트 우수상(1등)을 수상했습니다.",
    projectId: "donghang",
  },
  {
    id: "3",
    title: "SSAFY 2학기 프로젝트 우수상",
    organizer: "삼성 청년 SW·AI 아카데미",
    date: "2025.05",
    description:
      "유기견 보호소 관리 플랫폼 '행복하개'로 2학기 프로젝트 우수상(2등)을 수상했습니다.",
    projectId: "hangbokdog",
  },
];
