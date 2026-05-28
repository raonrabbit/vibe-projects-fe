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
            <div className="w-[480px] bg-fr-elevated border border-white/[0.08] rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
                {/* Status header */}
                <div
                    className={`px-8 pt-6 pb-4 border-b border-white/[0.06] flex items-center justify-between ${statusCls.header}`}
                >
                    <p className="text-[10px] text-white/30 tracking-[0.4em] uppercase">
                        착륙 완료
                    </p>
                    <span
                        className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full ${statusCls.badge}`}
                    >
                        {statusCls.label}
                    </span>
                </div>

                <div className="px-8 py-6">
                    {/* Route */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white tracking-tight leading-none">
                                {landResult.fromAirport?.iata ?? from}
                            </p>
                            <p className="text-[11px] text-white/35 mt-1.5 tracking-wide">
                                {landResult.fromAirport?.city ?? ""}
                            </p>
                        </div>

                        <div className="flex-1 flex flex-col items-center gap-1">
                            <svg
                                width="100%"
                                height="20"
                                viewBox="0 0 120 20"
                                fill="none"
                            >
                                <line
                                    x1="0"
                                    y1="10"
                                    x2="105"
                                    y2="10"
                                    stroke="rgba(255,255,255,0.15)"
                                    strokeWidth="1"
                                    strokeDasharray="4 4"
                                />
                                <path
                                    d="M105 10 l-6 -4 l0 8 z"
                                    fill="rgba(255,255,255,0.25)"
                                />
                            </svg>
                            <p className="text-[9px] text-white/20 tracking-widest uppercase">
                                {formatDistance(landResult.elapsed)}
                            </p>
                        </div>

                        <div className="text-center">
                            <p
                                className={`text-3xl font-bold tracking-tight leading-none ${
                                    landResult.destination
                                        ? "text-white"
                                        : "text-white/30"
                                }`}
                            >
                                {landResult.destination?.iata ?? "---"}
                            </p>
                            <p className="text-[11px] text-white/35 mt-1.5 tracking-wide">
                                {landResult.destination?.city ?? ""}
                            </p>
                        </div>
                    </div>

                    {/* Destination detail */}
                    {landResult.destination && (
                        <div className="bg-white/[0.04] border border-white/[0.06] rounded-2xl px-4 py-3.5 mb-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-[11px] text-white/25 tracking-widest uppercase mb-1">
                                        목적지
                                    </p>
                                    <p className="text-[15px] font-semibold text-white/80 leading-tight">
                                        {landResult.destination.name}
                                    </p>
                                    <p className="text-[12px] text-white/35 mt-0.5">
                                        {landResult.destination.city} ·{" "}
                                        {landResult.destination.country}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="text-[9px] text-white/20 tracking-widest uppercase mb-1">
                                        현지 시각
                                    </p>
                                    <p className="text-[17px] font-mono font-semibold text-white/55 tabular-nums">
                                        {getDestinationLocalTime(
                                            landResult.destination.utcOffset,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Stats row */}
                    <div className="flex gap-3 mb-5">
                        <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-center">
                            <p className="text-lg font-bold text-white tabular-nums tracking-tight">
                                {formatElapsed(landResult.elapsed)}
                            </p>
                            <p className="text-[9px] text-white/25 mt-1 tracking-widest uppercase">
                                비행 시간
                            </p>
                        </div>
                        {landResult.subject && (
                            <div className="flex-1 bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-center flex items-center justify-center">
                                <span className="text-[13px] font-medium text-sky-400/80">
                                    {landResult.subject}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onHome}
                        className="w-full py-3.5 bg-sky-600/80 hover:bg-sky-500 text-white rounded-2xl font-semibold text-[15px] transition-all duration-150 tracking-wide"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}
