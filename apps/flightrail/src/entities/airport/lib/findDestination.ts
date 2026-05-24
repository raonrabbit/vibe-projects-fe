import { type Airport, AIRPORTS } from "../data/airports";

function haversineKm(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

export function findDestination(
    fromIata: string,
    elapsedSeconds: number,
): Airport | null {
    const from = AIRPORTS.find((a) => a.iata === fromIata);
    if (!from) return null;

    const reachableKm = (elapsedSeconds / 3600) * 900;

    let best: Airport | null = null;
    let bestDiff = Infinity;

    for (const airport of AIRPORTS) {
        if (airport.iata === fromIata) continue;
        const dist = haversineKm(from.lat, from.lng, airport.lat, airport.lng);
        const diff = Math.abs(dist - reachableKm);
        if (diff < bestDiff) {
            bestDiff = diff;
            best = airport;
        }
    }

    return best;
}

export function getAirport(iata: string): Airport | undefined {
    return AIRPORTS.find((a) => a.iata === iata);
}
