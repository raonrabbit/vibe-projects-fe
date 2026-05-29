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
        <div className="bg-black/20 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 border border-white/8 text-right">
            {subject && (
                <p className="hidden md:block text-[10px] text-sky-400/70 tracking-widest uppercase mb-2">
                    {subject}
                </p>
            )}
            {mapDestination?.iata && (
                <div className="hidden md:block mb-2">
                    <p className="text-[10px] text-white/25 tracking-widest uppercase">
                        예상 목적지
                    </p>
                    <p className="text-base font-bold text-white/70 tracking-tight leading-tight mt-0.5">
                        {mapDestination.iata}
                        <span className="text-[11px] font-normal text-white/35 ml-1.5">
                            {mapDestination.city}
                        </span>
                    </p>
                    <div className="h-px bg-white/8 mt-2 mb-2" />
                </div>
            )}
            <p
                className={`text-xl md:text-2xl font-bold tabular-nums tracking-tight leading-none ${
                    timerMain.delayed ? "text-amber-400" : "text-white"
                }`}
            >
                {timerMain.value}
            </p>
            <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                {timerMain.label}
            </p>
            <div className="hidden md:block">
                <div className="h-px bg-white/8 my-2" />
                <p className="text-sm font-medium text-white/50 tabular-nums tracking-tight leading-none">
                    {formatElapsed(elapsed)}
                </p>
                <p className="text-[10px] text-white/25 mt-0.5 tracking-widest uppercase">
                    총 비행 시간
                </p>
                <div className="h-px bg-white/8 my-2" />
                <p className="text-lg font-semibold text-white/70 tabular-nums tracking-tight leading-none">
                    {formatDistance(elapsed)}
                </p>
                <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                    비행 거리
                </p>
                <div className="h-px bg-white/8 my-2" />
                <div className="flex items-center justify-end gap-1.5">
                    <p
                        className={`text-[10px] tracking-widest ${PHASE_LABELS[flightPhase].color}`}
                    >
                        {PHASE_LABELS[flightPhase].label}
                    </p>
                    <span className="text-white/15 text-[10px]">·</span>
                    <p className="text-[10px] text-white/30 tabular-nums">
                        {altLabel}
                    </p>
                </div>
            </div>
        </div>
    );
}
