import { useCallback, useEffect, useState } from "react";

import { getLocalHour } from "./flightUtils";

export function useSkyTime() {
    const [isFixed, setIsFixed] = useState(false);
    const [fixedHour, setFixedHour] = useState(0);
    const [offset, setOffset] = useState(0); // hours offset from localHour when not fixed
    const [localHour, setLocalHour] = useState(getLocalHour);

    useEffect(() => {
        const id = setInterval(() => setLocalHour(getLocalHour()), 1000);
        return () => clearInterval(id);
    }, []);

    const shiftedHour = (((localHour + offset) % 24) + 24) % 24;
    const displayHour = isFixed ? fixedHour : shiftedHour;
    const isAdjusted = isFixed || offset !== 0;
    const modeLabel = isFixed ? "고정 시각" : "현재 시각";

    // Toggle fixed: freeze at current displayed hour, or unfreeze
    const handleToggleFixed = useCallback(() => {
        if (isFixed) {
            setIsFixed(false);
        } else {
            const sh = (((localHour + offset) % 24) + 24) % 24;
            setFixedHour(Math.floor(sh));
            setIsFixed(true);
        }
    }, [isFixed, localHour, offset]);

    // Snap to current local time without touching isFixed
    const handleResetToLocal = useCallback(() => {
        setOffset(0);
        if (isFixed) {
            setFixedHour(Math.floor(((localHour % 24) + 24) % 24));
        }
    }, [isFixed, localHour]);

    // Drag: adjust position without changing isFixed
    const handleBarDrag = useCallback(
        (hour: number) => {
            if (isFixed) {
                setFixedHour(hour);
            } else {
                setOffset(hour - localHour);
            }
        },
        [isFixed, localHour],
    );

    return {
        displayHour,
        isFixed,
        isAdjusted,
        modeLabel,
        handleToggleFixed,
        handleResetToLocal,
        handleBarDrag,
    };
}
