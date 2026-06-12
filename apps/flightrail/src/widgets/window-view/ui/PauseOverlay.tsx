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
      <p className="mb-1 text-[9px] tracking-[0.5em] text-white/20 uppercase">
        FLIGHT HOLD
      </p>
      <p className="mb-3 text-[13px] tracking-widest text-white/50 uppercase">
        비행 일시정지
      </p>
      <p className="mb-8 text-[12px] text-white/25 tabular-nums">
        {altLabel} &nbsp;·&nbsp; {formatElapsed(elapsed)} 비행 중
      </p>
      <button
        onClick={onResume}
        className="rounded-2xl border border-white/20 bg-white/10 px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-white/20"
      >
        비행 재개
      </button>
      <button
        onClick={onLand}
        className="mt-3 px-6 py-2.5 text-[13px] text-white/40 transition-colors hover:text-white/70"
      >
        착륙하기 (세션 종료)
      </button>
      <button
        onClick={onSaveLater}
        className="mt-1 px-6 py-2.5 text-[12px] text-white/30 transition-colors hover:text-white/55"
      >
        나중에 이어서 하기
      </button>
    </div>
  );
}
