"use client";

import { useEffect, useRef, useState } from "react";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function FlapIata({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const [display, setDisplay] = useState(value);
    useEffect(() => {
        setDisplay(
            value
                .split("")
                .map(() => ALPHA[Math.floor(Math.random() * 26)])
                .join(""),
        );
        let frame = 0;
        const total = value.length * 5;
        const id = setInterval(() => {
            const settled = Math.floor(frame / 5);
            setDisplay(
                value
                    .split("")
                    .map((ch, i) =>
                        i < settled
                            ? ch
                            : ALPHA[Math.floor(Math.random() * 26)],
                    )
                    .join(""),
            );
            frame++;
            if (frame >= total) {
                setDisplay(value);
                clearInterval(id);
            }
        }, 45);
        return () => clearInterval(id);
    }, []);
    return <span className={className}>{display}</span>;
}

export function SplitIata({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        if (value === prevRef.current) return;
        prevRef.current = value;
        let frame = 0;
        const total = value.length * 5 + 4;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const settled = Math.floor(frame / 5);
            setDisplay(
                value
                    .split("")
                    .map((ch, i) =>
                        i < settled
                            ? ch
                            : ALPHA[Math.floor(Math.random() * 26)],
                    )
                    .join(""),
            );
            frame++;
            if (frame > total) {
                setDisplay(value);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 45);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [value]);
    return <span className={className}>{display}</span>;
}
