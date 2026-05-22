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
