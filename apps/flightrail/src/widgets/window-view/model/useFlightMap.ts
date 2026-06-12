import { useMemo, useRef } from "react";

import type { Airport } from "@/entities/airport";
import { findDestination, getAirport } from "@/entities/airport";
import { haversineKm } from "@/shared/lib/mapUtils";

interface LegInfo {
  airport: Airport;
  dest: Airport | null;
  startElapsed: number;
}

export function useFlightMap(
  from: string,
  to: string | null,
  elapsed: number,
  plannedDuration: number,
  hardStop: boolean,
) {
  const fromAirportData = useMemo(() => getAirport(from), [from]);
  const toAirportData = useMemo(() => (to ? getAirport(to) : null), [to]);

  // Continuation leg: locked in once elapsed first crosses plannedDuration
  const continuationRef = useRef<LegInfo | null>(null);
  if (
    !hardStop &&
    elapsed >= plannedDuration &&
    continuationRef.current === null
  ) {
    const legOrigin =
      toAirportData ??
      findDestination(from, plannedDuration) ??
      fromAirportData;
    if (legOrigin) {
      continuationRef.current = {
        airport: legOrigin,
        dest:
          findDestination(legOrigin.iata, plannedDuration) ??
          fromAirportData ??
          null,
        startElapsed: elapsed,
      };
    }
  }

  const leg = continuationRef.current;
  const isInContinuation = leg !== null;
  const legElapsed = leg ? elapsed - leg.startElapsed : elapsed;
  const effectiveFrom = isInContinuation ? leg!.airport : fromAirportData;

  const mapDestination = useMemo(() => {
    if (isInContinuation) return leg!.dest ?? fromAirportData ?? null;
    return (
      toAirportData ?? findDestination(from, elapsed) ?? fromAirportData ?? null
    );
  }, [isInContinuation, leg, fromAirportData, toAirportData, from, elapsed]);

  const routeTotalKm = useMemo(() => {
    if (!effectiveFrom || !mapDestination) return 0;
    return haversineKm(
      effectiveFrom.lat,
      effectiveFrom.lng,
      mapDestination.lat,
      mapDestination.lng,
    );
  }, [effectiveFrom, mapDestination]);

  const mapProgress = useMemo(() => {
    if (isInContinuation) {
      if (!routeTotalKm) return 0;
      return Math.min(((legElapsed / 3600) * 900) / routeTotalKm, 1);
    }
    // Time-based progress when destination is specified: arrive exactly at plannedDuration
    if (to && plannedDuration > 0) {
      return Math.min(elapsed / plannedDuration, 1);
    }
    if (!routeTotalKm) return 0;
    return Math.min(((elapsed / 3600) * 900) / routeTotalKm, 1);
  }, [
    isInContinuation,
    legElapsed,
    routeTotalKm,
    to,
    elapsed,
    plannedDuration,
  ]);

  const mapProgressRate = useMemo(() => {
    if (isInContinuation || !to) {
      if (!routeTotalKm) return 0;
      return 900 / 3600 / routeTotalKm;
    }
    return 1 / plannedDuration;
  }, [isInContinuation, routeTotalKm, to, plannedDuration]);

  return {
    fromAirportData: effectiveFrom,
    mapDestination,
    mapProgress,
    mapProgressRate,
  };
}
