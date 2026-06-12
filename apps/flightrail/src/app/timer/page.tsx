import type { Metadata } from "next";

import { TimerPage } from "@/views/timer";

export const metadata: Metadata = { robots: { index: false } };

export default function TimerRoute() {
  return <TimerPage />;
}
