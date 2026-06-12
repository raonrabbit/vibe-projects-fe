"use client";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

export function DurationPicker({
  hours,
  minutes,
  onHours,
  onMinutes,
}: {
  hours: number;
  minutes: number;
  onHours: (v: number) => void;
  onMinutes: (v: number) => void;
}) {
  const spinnerOff =
    "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]";
  const fmt2 = (v: number) => String(v).padStart(2, "0");

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {/* ── PC: inline ± spinners ─────────────────── */}
      <div className="hidden items-center gap-3 sm:flex">
        {/* Hours */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => onHours(clamp(hours + 1, 0, 23))}
            className="flex h-7 w-9 items-center justify-center text-white/25 transition-colors hover:text-white/70"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={fmt2(hours)}
            onChange={(e) =>
              onHours(clamp(parseInt(e.target.value) || 0, 0, 23))
            }
            onBlur={(e) => onHours(clamp(parseInt(e.target.value) || 0, 0, 23))}
            className={`h-12 w-14 bg-transparent text-center text-[28px] leading-none font-bold text-white tabular-nums outline-none ${spinnerOff}`}
          />
          <button
            onClick={() => onHours(clamp(hours - 1, 0, 23))}
            className="flex h-7 w-9 items-center justify-center text-white/25 transition-colors hover:text-white/70"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        <span className="mb-6 text-[22px] font-bold text-white/25">:</span>
        {/* Minutes */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => onMinutes(clamp(minutes + 1, 0, 59))}
            className="flex h-7 w-9 items-center justify-center text-white/25 transition-colors hover:text-white/70"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={fmt2(minutes)}
            onChange={(e) =>
              onMinutes(clamp(parseInt(e.target.value) || 0, 0, 59))
            }
            onBlur={(e) =>
              onMinutes(clamp(parseInt(e.target.value) || 0, 0, 59))
            }
            className={`h-12 w-14 bg-transparent text-center text-[28px] leading-none font-bold text-white tabular-nums outline-none ${spinnerOff}`}
          />
          <button
            onClick={() => onMinutes(clamp(minutes - 1, 0, 59))}
            className="flex h-7 w-9 items-center justify-center text-white/25 transition-colors hover:text-white/70"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
        <div className="mb-1.5 ml-1 flex flex-col gap-1">
          <span className="text-[10px] text-white/25">시간</span>
          <span className="text-[10px] text-white/25">분</span>
        </div>
      </div>

      {/* ── Mobile: large number inputs ───────────── */}
      <div className="flex w-full items-center gap-2 sm:hidden">
        <div className="flex flex-1 flex-col items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={fmt2(hours)}
            onChange={(e) =>
              onHours(clamp(parseInt(e.target.value) || 0, 0, 23))
            }
            onBlur={(e) => onHours(clamp(parseInt(e.target.value) || 0, 0, 23))}
            className={`h-16 w-full rounded-2xl border border-white/[0.10] bg-white/[0.06] text-center text-[36px] font-bold text-white tabular-nums transition-colors outline-none focus:border-sky-500/40 ${spinnerOff}`}
          />
          <span className="text-[10px] text-white/25">시간</span>
        </div>
        <span className="pb-5 text-[28px] font-bold text-white/25">:</span>
        <div className="flex flex-1 flex-col items-center gap-1">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={fmt2(minutes)}
            onChange={(e) =>
              onMinutes(clamp(parseInt(e.target.value) || 0, 0, 59))
            }
            onBlur={(e) =>
              onMinutes(clamp(parseInt(e.target.value) || 0, 0, 59))
            }
            className={`h-16 w-full rounded-2xl border border-white/[0.10] bg-white/[0.06] text-center text-[36px] font-bold text-white tabular-nums transition-colors outline-none focus:border-sky-500/40 ${spinnerOff}`}
          />
          <span className="text-[10px] text-white/25">분</span>
        </div>
      </div>
    </div>
  );
}
