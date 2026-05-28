import { useMemo } from "react";

import { findDestination, getAirport } from "@/entities/airport";
import { haversineKm } from "@/shared/lib/mapUtils";

export function useFlightMap(from: string, to: string | null, elapsed: number) {
    const fromAirportData = useMemo(() => getAirport(from), [from]);
    const toAirportData = useMemo(() => (to ? getAirport(to) : null), [to]);

    const mapDestination = useMemo(
        () =>
            toAirportData ??
            findDestination(from, elapsed) ??
            fromAirportData ??
            null,
        [toAirportData, from, elapsed, fromAirportData],
    );

    const routeTotalKm = useMemo(() => {
        if (!fromAirportData || !mapDestination) return 0;
        return haversineKm(
            fromAirportData.lat,
            fromAirportData.lng,
            mapDestination.lat,
            mapDestination.lng,
        );
    }, [fromAirportData, mapDestination]);

    const mapProgress = useMemo(() => {
        if (!routeTotalKm) return 0;
        const traveledKm = (elapsed / 3600) * 900;
        return Math.min(traveledKm / routeTotalKm, 1);
    }, [routeTotalKm, elapsed]);

    const mapProgressRate = useMemo(() => {
        if (!routeTotalKm) return 0;
        return 900 / 3600 / routeTotalKm;
    }, [routeTotalKm]);

    return { fromAirportData, mapDestination, mapProgress, mapProgressRate };
}
