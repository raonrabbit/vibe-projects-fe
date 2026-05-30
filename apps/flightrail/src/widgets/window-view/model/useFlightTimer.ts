import { useEffect, useState } from "react";

export function useFlightTimer(
    plannedDuration: number,
    initialRunning = true,
    initialElapsed = 0,
) {
    const [elapsed, setElapsed] = useState(initialElapsed);
    const [running, setRunning] = useState(initialRunning);
    const [reachedGoal, setReachedGoal] = useState(false);

    useEffect(() => {
        if (!running) return;
        const id = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(id);
    }, [running]);

    useEffect(() => {
        if (elapsed >= plannedDuration && !reachedGoal) {
            setReachedGoal(true);
        }
    }, [elapsed, plannedDuration, reachedGoal]);

    return { elapsed, running, reachedGoal, setRunning };
}
