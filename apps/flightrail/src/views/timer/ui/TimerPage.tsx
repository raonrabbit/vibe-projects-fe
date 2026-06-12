import { Suspense } from "react";

import { WindowView } from "@/widgets/window-view";

export default function TimerPage() {
  return (
    <Suspense>
      <WindowView />
    </Suspense>
  );
}
