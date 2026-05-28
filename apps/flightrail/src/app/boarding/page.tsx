import { Suspense } from "react";

import { BoardingPage } from "@/views/boarding";

export default function BoardingRoute() {
    return (
        <Suspense>
            <BoardingPage />
        </Suspense>
    );
}
