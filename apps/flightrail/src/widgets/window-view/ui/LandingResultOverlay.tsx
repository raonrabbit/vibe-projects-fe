import {
  formatDistance,
  formatElapsed,
  getDestinationLocalTime,
} from "../model/flightUtils";
import type { LandResult } from "../model/types";

interface Props {
  landResult: LandResult;
  from: string;
  onHome: () => void;
}

export function LandingResultOverlay({ landResult, from, onHome }: Props) {
  const statusCls = {
    ontime: {
      header: "bg-sky-500/5",
      badge: "bg-sky-500/20 text-sky-400",
      label: "정시 도착",
    },
    delayed: {
      header: "bg-amber-500/5",
      badge: "bg-amber-500/20 text-amber-400",
      label: "연착 도착",
    },
    emergency_landing: {
      header: "bg-rose-500/5",
      badge: "bg-rose-500/20 text-rose-400",
      label: "비상착륙",
    },
  }[landResult.arrivalStatus];

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-[480px] overflow-hidden rounded-3xl border border-white/[0.08] bg-fr-elevated shadow-2xl shadow-black/60">
        {/* Status header */}
        <div
          className={`flex items-center justify-between border-b border-white/[0.06] px-8 pt-6 pb-4 ${statusCls.header}`}
        >
          <p className="text-[10px] tracking-[0.4em] text-white/30 uppercase">
            착륙 완료
          </p>
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase ${statusCls.badge}`}
          >
            {statusCls.label}
          </span>
        </div>

        <div className="px-8 py-6">
          {/* Route */}
          <div className="mb-6 flex items-center gap-4">
            <div className="text-center">
              <p className="text-3xl leading-none font-bold tracking-tight text-white">
                {landResult.fromAirport?.iata ?? from}
              </p>
              <p className="mt-1.5 text-[11px] tracking-wide text-white/35">
                {landResult.fromAirport?.city ?? ""}
              </p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1">
              <svg width="100%" height="20" viewBox="0 0 120 20" fill="none">
                <line
                  x1="0"
                  y1="10"
                  x2="105"
                  y2="10"
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <path d="M105 10 l-6 -4 l0 8 z" fill="rgba(255,255,255,0.25)" />
              </svg>
              <p className="text-[9px] tracking-widest text-white/20 uppercase">
                {formatDistance(landResult.elapsed)}
              </p>
            </div>

            <div className="text-center">
              <p
                className={`text-3xl leading-none font-bold tracking-tight ${
                  landResult.destination ? "text-white" : "text-white/30"
                }`}
              >
                {landResult.destination?.iata ?? "---"}
              </p>
              <p className="mt-1.5 text-[11px] tracking-wide text-white/35">
                {landResult.destination?.city ?? ""}
              </p>
            </div>
          </div>

          {/* Destination detail */}
          {landResult.destination && (
            <div className="mb-5 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3.5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-1 text-[11px] tracking-widest text-white/25 uppercase">
                    목적지
                  </p>
                  <p className="text-[15px] leading-tight font-semibold text-white/80">
                    {landResult.destination.name}
                  </p>
                  <p className="mt-0.5 text-[12px] text-white/35">
                    {landResult.destination.city} ·{" "}
                    {landResult.destination.country}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0 text-right">
                  <p className="mb-1 text-[9px] tracking-widest text-white/20 uppercase">
                    현지 시각
                  </p>
                  <p className="font-mono text-[17px] font-semibold text-white/55 tabular-nums">
                    {getDestinationLocalTime(landResult.destination.utcOffset)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats row */}
          <div className="mb-5 flex gap-3">
            <div className="flex-1 rounded-xl border border-white/[0.05] bg-white/[0.03] px-4 py-3 text-center">
              <p className="text-lg font-bold tracking-tight text-white tabular-nums">
                {formatElapsed(landResult.elapsed)}
              </p>
              <p className="mt-1 text-[9px] tracking-widest text-white/25 uppercase">
                비행 시간
              </p>
            </div>
            {landResult.subject && (
              <div className="flex flex-1 items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.03] px-4 py-3 text-center">
                <span className="text-[13px] font-medium text-sky-400/80">
                  {landResult.subject}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={onHome}
            className="w-full rounded-2xl bg-sky-600/80 py-3.5 text-[15px] font-semibold tracking-wide text-white transition-all duration-150 hover:bg-sky-500"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
