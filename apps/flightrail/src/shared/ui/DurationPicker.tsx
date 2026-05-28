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
            <div className="hidden sm:flex items-center gap-3">
                {/* Hours */}
                <div className="flex flex-col items-center gap-0.5">
                    <button
                        onClick={() => onHours(clamp(hours + 1, 0, 23))}
                        className="text-white/25 hover:text-white/70 transition-colors w-9 h-7 flex items-center justify-center"
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
                        onBlur={(e) =>
                            onHours(clamp(parseInt(e.target.value) || 0, 0, 23))
                        }
                        className={`w-14 h-12 text-center text-[28px] font-bold text-white bg-transparent outline-none tabular-nums leading-none ${spinnerOff}`}
                    />
                    <button
                        onClick={() => onHours(clamp(hours - 1, 0, 23))}
                        className="text-white/25 hover:text-white/70 transition-colors w-9 h-7 flex items-center justify-center"
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
                <span className="text-[22px] font-bold text-white/25 mb-6">
                    :
                </span>
                {/* Minutes */}
                <div className="flex flex-col items-center gap-0.5">
                    <button
                        onClick={() => onMinutes(clamp(minutes + 1, 0, 59))}
                        className="text-white/25 hover:text-white/70 transition-colors w-9 h-7 flex items-center justify-center"
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
                            onMinutes(
                                clamp(parseInt(e.target.value) || 0, 0, 59),
                            )
                        }
                        onBlur={(e) =>
                            onMinutes(
                                clamp(parseInt(e.target.value) || 0, 0, 59),
                            )
                        }
                        className={`w-14 h-12 text-center text-[28px] font-bold text-white bg-transparent outline-none tabular-nums leading-none ${spinnerOff}`}
                    />
                    <button
                        onClick={() => onMinutes(clamp(minutes - 1, 0, 59))}
                        className="text-white/25 hover:text-white/70 transition-colors w-9 h-7 flex items-center justify-center"
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
                <div className="flex flex-col gap-1 mb-1.5 ml-1">
                    <span className="text-[10px] text-white/25">시간</span>
                    <span className="text-[10px] text-white/25">분</span>
                </div>
            </div>

            {/* ── Mobile: large number inputs ───────────── */}
            <div className="flex sm:hidden items-center gap-2 w-full">
                <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={fmt2(hours)}
                        onChange={(e) =>
                            onHours(clamp(parseInt(e.target.value) || 0, 0, 23))
                        }
                        onBlur={(e) =>
                            onHours(clamp(parseInt(e.target.value) || 0, 0, 23))
                        }
                        className={`w-full h-16 text-center text-[36px] font-bold text-white bg-white/[0.06] border border-white/[0.10] rounded-2xl outline-none focus:border-sky-500/40 transition-colors tabular-nums ${spinnerOff}`}
                    />
                    <span className="text-[10px] text-white/25">시간</span>
                </div>
                <span className="text-[28px] font-bold text-white/25 pb-5">
                    :
                </span>
                <div className="flex-1 flex flex-col items-center gap-1">
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={fmt2(minutes)}
                        onChange={(e) =>
                            onMinutes(
                                clamp(parseInt(e.target.value) || 0, 0, 59),
                            )
                        }
                        onBlur={(e) =>
                            onMinutes(
                                clamp(parseInt(e.target.value) || 0, 0, 59),
                            )
                        }
                        className={`w-full h-16 text-center text-[36px] font-bold text-white bg-white/[0.06] border border-white/[0.10] rounded-2xl outline-none focus:border-sky-500/40 transition-colors tabular-nums ${spinnerOff}`}
                    />
                    <span className="text-[10px] text-white/25">분</span>
                </div>
            </div>
        </div>
    );
}
