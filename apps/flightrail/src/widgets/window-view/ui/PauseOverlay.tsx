import { formatElapsed, getAltitudeLabel } from "../model/flightUtils";

interface Props {
    elapsed: number;
    plannedDuration: number;
    onResume: () => void;
    onLand: () => void;
    onSaveLater: () => void;
}

export function PauseOverlay({
    elapsed,
    plannedDuration,
    onResume,
    onLand,
    onSaveLater,
}: Props) {
    const altLabel = getAltitudeLabel(elapsed, plannedDuration);

    return (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md">
            <p className="text-white/20 text-[9px] tracking-[0.5em] uppercase mb-1">
                FLIGHT HOLD
            </p>
            <p className="text-white/50 text-[13px] tracking-widest uppercase mb-3">
                비행 일시정지
            </p>
            <p className="text-white/25 text-[12px] mb-8 tabular-nums">
                {altLabel} &nbsp;·&nbsp; {formatElapsed(elapsed)} 비행 중
            </p>
            <button
                onClick={onResume}
                className="px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-white font-semibold text-[15px] transition-all"
            >
                비행 재개
            </button>
            <button
                onClick={onLand}
                className="mt-3 px-6 py-2.5 text-white/40 hover:text-white/70 text-[13px] transition-colors"
            >
                착륙하기 (세션 종료)
            </button>
            <button
                onClick={onSaveLater}
                className="mt-1 px-6 py-2.5 text-white/30 hover:text-white/55 text-[12px] transition-colors"
            >
                나중에 이어서 하기
            </button>
        </div>
    );
}
