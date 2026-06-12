import type { FlightPhase } from "./types";

export function formatElapsed(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function formatDistance(s: number) {
  const km = Math.round((s / 3600) * 900);
  return `${km.toLocaleString()} km`;
}

export function skyClockDisplay(hour: number) {
  const n = ((hour % 24) + 24) % 24;
  const h = Math.floor(n);
  const m = Math.floor((n % 1) * 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getLocalHour() {
  const now = new Date();
  return now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
}

export function getFlightPhase(
  elapsed: number,
  plannedDuration: number,
  reachedGoal: boolean,
): FlightPhase {
  if (elapsed < 60) return "takeoff";
  if (elapsed < 300) return "climb";
  if (
    !reachedGoal &&
    plannedDuration - elapsed > 0 &&
    plannedDuration - elapsed <= 300
  )
    return "descent";
  return "cruise";
}

export function getAltitudeLabel(elapsed: number, plannedDuration: number) {
  const CRUISE = 35000;
  const RAMP = 180;
  let altitudeFt: number;
  if (elapsed < RAMP) {
    altitudeFt = Math.round(((elapsed / RAMP) * CRUISE) / 1000) * 1000;
  } else {
    const remaining = plannedDuration - elapsed;
    if (remaining > 0 && remaining < RAMP) {
      altitudeFt = Math.round(((remaining / RAMP) * CRUISE) / 1000) * 1000;
    } else {
      altitudeFt = elapsed >= plannedDuration ? 0 : CRUISE;
    }
  }
  return altitudeFt === 0 ? "지상" : `FL${Math.round(altitudeFt / 100)}`;
}

export function getDestinationLocalTime(utcOffset: number) {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const dest = new Date(utcMs + utcOffset * 3600000);
  return `${String(dest.getHours()).padStart(2, "0")}:${String(dest.getMinutes()).padStart(2, "0")}`;
}
