import { useCallback, useEffect, useRef, useState } from "react";

import { findDestination, getAirport } from "@/entities/airport";
import { saveSession } from "@/entities/session";

import type { LandResult } from "./types";

interface UseLandingParams {
  from: string;
  subject: string;
  plannedDuration: number;
  hardStop: boolean;
  elapsed: number;
  onPause: () => void;
}

export function useLanding({
  from,
  subject,
  plannedDuration,
  hardStop,
  elapsed,
  onPause,
}: UseLandingParams) {
  const [saving, setSaving] = useState(false);
  const [landResult, setLandResult] = useState<LandResult | null>(null);
  const startedAt = useRef(new Date());
  const autoLandedRef = useRef(false);

  const handleLand = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    onPause();

    const destination = findDestination(from, elapsed);
    const ratio = elapsed / plannedDuration;
    const arrivalStatus: "ontime" | "delayed" | "emergency_landing" =
      ratio >= 0.8 && ratio <= 1.2
        ? "ontime"
        : ratio > 1.2
          ? "delayed"
          : "emergency_landing";

    try {
      await saveSession({
        subject,
        departureAirport: from,
        destinationAirport: destination?.iata ?? from,
        startedAt: startedAt.current,
        endedAt: new Date(),
        plannedDuration,
        hardStop,
        arrivalStatus,
      });
    } catch {
      // silently fail — don't block navigation
    }

    setSaving(false);
    setLandResult({
      destination,
      fromAirport: getAirport(from),
      arrivalStatus,
      elapsed,
      subject,
    });
  }, [saving, from, elapsed, plannedDuration, subject, hardStop, onPause]);

  useEffect(() => {
    if (
      hardStop &&
      elapsed >= plannedDuration &&
      !autoLandedRef.current &&
      !saving &&
      !landResult
    ) {
      autoLandedRef.current = true;
      handleLand();
    }
  }, [elapsed]);

  return { saving, landResult, handleLand };
}
