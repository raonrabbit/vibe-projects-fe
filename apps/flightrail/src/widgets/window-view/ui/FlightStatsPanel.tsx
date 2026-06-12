import type { Airport } from "@/entities/airport";

import {
  formatDistance,
  formatElapsed,
  getAltitudeLabel,
  getFlightPhase,
} from "../model/flightUtils";
import type { FlightPhase } from "../model/types";

const PHASE_LABELS: Record<FlightPhase, { label: string; color: string }> = {
  takeoff: { label: "이륙 중", color: "text-amber-400/70" },
  climb: { label: "상승 중", color: "text-sky-400/70" },
  cruise: { label: "순항 중", color: "text-white/35" },
  descent: { label: "착륙 준비", color: "text-amber-400/70" },
};

interface Props {
  subject: string;
  mapDestination: Airport | null;
  elapsed: number;
  plannedDuration: number;
  reachedGoal: boolean;
}

export function FlightStatsPanel({
  subject,
  mapDestination,
  elapsed,
  plannedDuration,
  reachedGoal,
}: Props) {
  const flightPhase = getFlightPhase(elapsed, plannedDuration, reachedGoal);
  const altLabel = getAltitudeLabel(elapsed, plannedDuration);
  const timerMain =
    elapsed < plannedDuration
      ? {
          value: formatElapsed(plannedDuration - elapsed),
          label: "착륙까지",
          delayed: false,
        }
      : {
          value: formatElapsed(elapsed - plannedDuration),
          label: "연착 중",
          delayed: true,
        };

  return (
    <div className="rounded-xl border border-white/8 bg-black/20 px-3 py-2 text-right backdrop-blur-sm md:rounded-2xl md:px-4 md:py-3">
      {subject && (
        <p className="mb-2 hidden text-[10px] tracking-widest text-sky-400/70 uppercase md:block">
          {subject}
        </p>
      )}
      {mapDestination?.iata && (
        <div className="mb-2 hidden md:block">
          <p className="text-[10px] tracking-widest text-white/25 uppercase">
            예상 목적지
          </p>
          <p className="mt-0.5 text-base leading-tight font-bold tracking-tight text-white/70">
            {mapDestination.iata}
            <span className="ml-1.5 text-[11px] font-normal text-white/35">
              {mapDestination.city}
            </span>
          </p>
          <div className="mt-2 mb-2 h-px bg-white/8" />
        </div>
      )}
      <p
        className={`text-xl leading-none font-bold tracking-tight tabular-nums md:text-2xl ${
          timerMain.delayed ? "text-amber-400" : "text-white"
        }`}
      >
        {timerMain.value}
      </p>
      <p className="mt-0.5 text-[10px] tracking-widest text-white/35 uppercase">
        {timerMain.label}
      </p>
      <div className="hidden md:block">
        <div className="my-2 h-px bg-white/8" />
        <p className="text-sm leading-none font-medium tracking-tight text-white/50 tabular-nums">
          {formatElapsed(elapsed)}
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-white/25 uppercase">
          총 비행 시간
        </p>
        <div className="my-2 h-px bg-white/8" />
        <p className="text-lg leading-none font-semibold tracking-tight text-white/70 tabular-nums">
          {formatDistance(elapsed)}
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-white/35 uppercase">
          비행 거리
        </p>
        <div className="my-2 h-px bg-white/8" />
        <div className="flex items-center justify-end gap-1.5">
          <p
            className={`text-[10px] tracking-widest ${PHASE_LABELS[flightPhase].color}`}
          >
            {PHASE_LABELS[flightPhase].label}
          </p>
          <span className="text-[10px] text-white/15">·</span>
          <p className="text-[10px] text-white/30 tabular-nums">{altLabel}</p>
        </div>
      </div>
    </div>
  );
}
