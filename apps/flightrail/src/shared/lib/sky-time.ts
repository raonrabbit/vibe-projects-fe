export type TimeOfDay =
    | "night"
    | "dawn"
    | "morning"
    | "day"
    | "evening"
    | "dusk";

export function getTimeOfDay(hour: number): TimeOfDay {
    if (hour < 5 || hour >= 22) return "night";
    if (hour < 7) return "dawn";
    if (hour < 10) return "morning";
    if (hour < 17) return "day";
    if (hour < 20) return "evening";
    return "dusk";
}

// Returns [x, y, z] sun position for the @react-three/drei Sky component.
// y > 0 → above horizon (day), y < 0 → below horizon (night).
// hour 6 → rising (east, y≈0), hour 12 → peak (y=1), hour 18 → setting (west, y≈0)
export function getSunPosition(hour: number): [number, number, number] {
    const angle = (hour / 12) * Math.PI - Math.PI / 2;
    return [Math.cos(angle), Math.sin(angle), 0];
}

// Anchor hours where each TimeOfDay is "pure" — values between anchors are lerped.
const ANCHORS: Array<{ hour: number; tod: TimeOfDay }> = [
    { hour: 0, tod: "night" },
    { hour: 6, tod: "dawn" },
    { hour: 8.5, tod: "morning" },
    { hour: 13.5, tod: "day" },
    { hour: 18.5, tod: "evening" },
    { hour: 21, tod: "dusk" },
    { hour: 24, tod: "night" },
];

export function getBlend(hour: number): {
    from: TimeOfDay;
    to: TimeOfDay;
    t: number;
} {
    const h = ((hour % 24) + 24) % 24;
    for (let i = 0; i < ANCHORS.length - 1; i++) {
        if (h >= ANCHORS[i].hour && h < ANCHORS[i + 1].hour) {
            return {
                from: ANCHORS[i].tod,
                to: ANCHORS[i + 1].tod,
                t:
                    (h - ANCHORS[i].hour) /
                    (ANCHORS[i + 1].hour - ANCHORS[i].hour),
            };
        }
    }
    return { from: "night", to: "night", t: 0 };
}
