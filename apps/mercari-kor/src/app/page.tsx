import { Suspense } from "react";
import { HomePage } from "@/widgets/HomePage";

export default function Home() {
    return (
        <Suspense>
            <HomePage />
        </Suspense>
    );
}
