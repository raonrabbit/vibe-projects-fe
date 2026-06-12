import type { Metadata } from "next";

import { RecordsPage } from "@/views/records";

export const metadata: Metadata = {
  title: "비행 기록",
  description:
    "나의 공부 비행 기록을 확인하세요. 출발지, 목적지, 비행 시간을 지도로 시각화합니다.",
};

export default RecordsPage;
