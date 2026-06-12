import { type Airport, AIRPORTS } from "../data/airports";

export interface AirportCandidate {
  airport: Airport;
  distKm: number;
  flightMinutes: number;
}

export function findDestinationCandidates(
  fromIata: string,
  targetSeconds: number,
): AirportCandidate[] {
  const from = AIRPORTS.find((a) => a.iata === fromIata);
  if (!from) return [];

  const targetKm = (targetSeconds / 3600) * 900;
  const toleranceKm = 450; // ±30min at 900 km/h

  const all = AIRPORTS.filter((a) => a.iata !== fromIata)
    .map((a) => {
      const distKm = haversineKm(from.lat, from.lng, a.lat, a.lng);
      return {
        airport: a,
        distKm: Math.round(distKm),
        flightMinutes: Math.round((distKm / 900) * 60),
      };
    })
    .sort(
      (a, b) => Math.abs(a.distKm - targetKm) - Math.abs(b.distKm - targetKm),
    );

  const inRange = all.filter(
    ({ distKm }) => Math.abs(distKm - targetKm) <= toleranceKm,
  );
  // 후보가 없으면 가장 가까운 5개 fallback
  return inRange.length > 0 ? inRange : all.slice(0, 5);
}

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

  // 경비행기: 30분 미만은 출발지 그대로
  if (elapsedSeconds < 1800) return from;

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
