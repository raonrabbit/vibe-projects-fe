import { useCallback, useEffect, useState } from "react";

import type { TimeMode } from "../ui/TimeBar";
import { getLocalHour } from "./flightUtils";

export function useSkyTime(elapsed: number) {
    const [timeMode, setTimeMode] = useState<TimeMode>("local");
    const [fromOffset, setFromOffset] = useState(0);
    const [fixedHour, setFixedHour] = useState(0);
    const [localHour, setLocalHour] = useState(getLocalHour);

    useEffect(() => {
        const id = setInterval(() => setLocalHour(getLocalHour()), 1000);
        return () => clearInterval(id);
    }, []);

    const displayHour =
        timeMode === "local"
            ? localHour
            : timeMode === "from"
              ? (((fromOffset + elapsed / 3600) % 24) + 24) % 24
              : fixedHour;

    const modeLabel =
        timeMode === "local"
            ? "현재 시각"
            : timeMode === "from"
              ? "출발 기준"
              : "고정 시각";

    const handleModeChange = useCallback(
        (m: TimeMode) => {
            if (m === "from" && timeMode !== "from") {
                const cur = timeMode === "local" ? localHour : fixedHour;
                setFromOffset(cur - elapsed / 3600);
            } else if (m === "fixed" && timeMode !== "fixed") {
                const cur =
                    timeMode === "local"
                        ? localHour
                        : (((fromOffset + elapsed / 3600) % 24) + 24) % 24;
                setFixedHour(Math.floor(((cur % 24) + 24) % 24));
            }
            setTimeMode(m);
        },
        [timeMode, localHour, fixedHour, fromOffset, elapsed],
    );

    const handleBarDrag = useCallback(
        (hour: number) => {
            const effectiveMode = timeMode === "local" ? "from" : timeMode;
            if (effectiveMode === "from") {
                setFromOffset(hour - elapsed / 3600);
            } else {
                setFixedHour(hour);
            }
        },
        [timeMode, elapsed],
    );

    return {
        displayHour,
        timeMode,
        modeLabel,
        handleModeChange,
        handleBarDrag,
    };
}
