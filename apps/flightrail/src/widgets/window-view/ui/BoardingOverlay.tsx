"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getAirport } from "@/entities/airport";
import { PlaneIcon } from "@/shared/ui/icons";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${String(m).padStart(2, "0")}m`;
  if (m === 0) return `${String(h).padStart(2, "0")}h`;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m`;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

const SEAT_COLS = ["A", "B", "C", "D", "E", "F"] as const;
const SEAT_ROWS = 8;
const PICKED_COL = "A";

function randInt(min: number, max: number) {
  const range = max - min + 1;
  const r = new Uint32Array(1);
  crypto.getRandomValues(r);
  return min + (r[0] % range);
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  from: string;
  to: string;
  subject: string;
  duration: number;
  hardStop: boolean;
  sceneReady: boolean;
  onDepart: () => void;
  onCancel: () => void;
  onTakeoff?: () => void;
}

export function BoardingOverlay({
  from,
  to,
  subject,
  duration,
  hardStop,
  sceneReady,
  onDepart,
  onCancel,
  onTakeoff,
}: Props) {
  const fromAirport = useMemo(() => getAirport(from), [from]);
  const toAirport = useMemo(() => getAirport(to), [to]);

  const pickedSeat = useMemo(() => {
    const row = randInt(1, SEAT_ROWS);
    return `${row}${PICKED_COL}`;
  }, []);

  const [visualProgress, setVisualProgress] = useState(0);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const pickedReady = minTimePassed && sceneReady;
  const progress = pickedReady ? 100 : visualProgress;

  const [seatFading, setSeatFading] = useState(false);
  const [takingOff, setTakingOff] = useState(false);
  const startedAtRef = useRef<number | null>(null);
  const onDepartRef = useRef(onDepart);
  onDepartRef.current = onDepart;
  const onTakeoffRef = useRef(onTakeoff);
  onTakeoffRef.current = onTakeoff;

  useEffect(() => {
    startedAtRef.current = performance.now();
    const minMs = 3000;

    let raf = 0;
    const tick = () => {
      const elapsed =
        performance.now() - (startedAtRef.current ?? performance.now());
      const t = clamp01(elapsed / minMs);
      const eased = 1 - Math.pow(1 - t, 2.6);
      setVisualProgress(Math.min(Math.round(eased * 100), 95));

      if (t >= 1) {
        setMinTimePassed(true);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!takingOff) return;

    onTakeoffRef.current?.();

    const departTimer = setTimeout(() => {
      onDepartRef.current();
    }, 1100);

    return () => clearTimeout(departTimer);
  }, [takingOff]);

  const now = useMemo(() => new Date(), []);
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const seatIds = useMemo(() => {
    const ids: string[] = [];
    for (let r = 1; r <= SEAT_ROWS; r++) {
      for (const c of SEAT_COLS) ids.push(`${r}${c}`);
    }
    return ids;
  }, []);

  const fillOrder = useMemo(() => {
    const ids = seatIds.filter((id) => id !== pickedSeat);
    return shuffleInPlace(ids);
  }, [seatIds, pickedSeat]);

  const filledCount = useMemo(() => {
    const n = fillOrder.length;
    return Math.min(n, Math.floor((progress / 100) * n));
  }, [progress, fillOrder.length]);

  const fillSet = useMemo(
    () => new Set(fillOrder.slice(0, filledCount)),
    [fillOrder, filledCount],
  );

  const picked = pickedReady ? pickedSeat : null;
  const [pickedBouncing, setPickedBouncing] = useState(false);

  useEffect(() => {
    if (!pickedReady) return;
    setPickedBouncing(true);
    const t = setTimeout(() => setPickedBouncing(false), 700);
    return () => clearTimeout(t);
  }, [pickedReady]);

  return (
    <div
      className="absolute inset-0 z-50 overflow-y-auto bg-fr-base"
      style={{
        animation: takingOff ? "frFadeOut 900ms ease-in forwards" : undefined,
      }}
    >
      <style>{`
                @keyframes frPlaneTakeoff {
                    0%   { transform: translate3d(0, 24px, 0) scale(0.9); opacity: 0; }
                    15%  { opacity: 1; }
                    100% { transform: translate3d(0, -320px, 0) scale(1.55); opacity: 1; }
                }
                @keyframes frFadeOut {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
                @keyframes frSeatBounce {
                    0%   { transform: scale(1); }
                    20%  { transform: scale(1.18); }
                    45%  { transform: scale(0.94); }
                    70%  { transform: scale(1.10); }
                    100% { transform: scale(1); }
                }
            `}</style>

      <div className="absolute inset-0">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(56,189,248,0.10),transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_60%_at_50%_110%,rgba(255,255,255,0.06),transparent)]" />
      </div>

      <div className="relative z-10 flex min-h-full items-start justify-center px-4 py-10">
        <div className="my-auto w-full max-w-[420px]">
          <div
            className="overflow-hidden rounded-3xl shadow-2xl shadow-black/70 transition-opacity duration-600 select-none"
            style={{ opacity: seatFading ? 0 : 1 }}
          >
            <div className="bg-fr-parchment-mid px-6 pt-6 pb-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    Boarding Pass
                  </p>
                  <p className="mt-1 text-[10px] text-fr-ink-dim">
                    {dateStr} • {timeStr}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-fr-ink opacity-80">
                    <PlaneIcon size={14} />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.25em] text-fr-ink uppercase">
                    Flightrail
                  </span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <p className="text-[42px] leading-none font-bold tracking-tight text-fr-ink">
                    {from}
                  </p>
                  <p className="mt-1 text-[10px] leading-none text-fr-ink-dim">
                    {fromAirport?.name ?? from}
                  </p>
                </div>

                <div className="flex-1 px-4 pb-3">
                  <div className="border-t border-dashed border-fr-parchment-border" />
                  <p className="mt-2 text-center text-[9px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    en route
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[42px] leading-none font-bold tracking-tight text-fr-parchment-border">
                    {to}
                  </p>
                  <p className="mt-1 text-[10px] leading-none text-fr-ink-dim">
                    {toAirport?.name ?? " "}
                  </p>
                </div>
              </div>

              {subject && (
                <div className="mt-4 rounded-2xl border border-fr-parchment-muted bg-fr-parchment px-4 py-3">
                  <p className="text-[9px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    Study
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-fr-ink">
                    {subject}
                  </p>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-fr-parchment-muted bg-fr-parchment px-4 py-3">
                  <p className="text-[9px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    Duration
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-fr-ink">
                    {duration ? formatDuration(duration) : "—"}
                  </p>
                </div>
                <div className="rounded-2xl border border-fr-parchment-muted bg-fr-parchment px-4 py-3">
                  <p className="text-[9px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    Landing
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-fr-ink">
                    {hardStop ? "Auto" : "Manual"}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] tracking-[0.35em] text-fr-ink-dim uppercase">
                    Seat Selection
                  </p>
                  <p className="font-mono text-[10px] text-fr-ink-dim">
                    {progress}%
                  </p>
                </div>

                <div className="rounded-2xl border border-fr-parchment-muted bg-fr-parchment px-4 py-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] tracking-wide text-fr-ink-dim">
                      {picked ? `${picked} 좌석 선택 완료` : "좌석 배정 중..."}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                        <span className="h-2.5 w-2.5 rounded-[3px] border border-fr-parchment-muted bg-fr-parchment-mid" />
                        빈좌석
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                        <span className="h-2.5 w-2.5 rounded-[3px] border border-fr-ink-dim/70 bg-fr-ink-dim/55" />
                        배정중
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[9px] text-fr-ink-dim">
                        <span className="h-2.5 w-2.5 rounded-[3px] border border-fr-sky bg-fr-sky/70" />
                        선택됨
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center">
                      <p className="mb-2 text-[9px] tracking-[0.35em] text-fr-ink-dim uppercase">
                        front
                      </p>
                      <div className="grid grid-cols-[repeat(3,18px)_10px_repeat(3,18px)] gap-2">
                        {Array.from(
                          { length: SEAT_ROWS },
                          (_, rIdx) => rIdx + 1,
                        ).flatMap((row) =>
                          SEAT_COLS.flatMap((col, _cIdx) => {
                            const id = `${row}${col}`;
                            const isPicked = picked === id;
                            const isFilling = !isPicked && fillSet.has(id);
                            const cls = isPicked
                              ? "bg-fr-sky/70 border-fr-sky"
                              : isFilling
                                ? "bg-fr-ink-dim/55 border-fr-ink-dim/70"
                                : "bg-fr-parchment-mid border-fr-parchment-muted";

                            const cells = [
                              <div
                                key={id}
                                className={`h-[18px] w-[18px] rounded-[6px] border transition-colors duration-150 ${cls}`}
                                style={{
                                  boxShadow: isPicked
                                    ? "0 0 0 3px rgba(56,189,248,0.18)"
                                    : undefined,
                                  animation:
                                    isPicked && pickedBouncing
                                      ? "frSeatBounce 650ms cubic-bezier(.2,.9,.25,1) both"
                                      : undefined,
                                }}
                                title={id}
                              />,
                            ];

                            if (col === "C") {
                              cells.push(
                                <div
                                  key={`${row}-aisle`}
                                  className="w-[10px]"
                                />,
                              );
                            }

                            return cells;
                          }),
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={onCancel}
                    disabled={takingOff}
                    className={`mr-2 rounded-2xl px-4 py-3 text-[13px] font-semibold transition-colors ${
                      takingOff
                        ? "cursor-not-allowed border border-fr-parchment-border bg-fr-parchment-dim text-fr-ink-dim opacity-50"
                        : "border border-fr-parchment-border bg-fr-parchment-dim text-fr-ink-mid hover:bg-fr-parchment-muted hover:text-fr-ink"
                    }`}
                  >
                    여행 취소
                  </button>
                  <button
                    disabled={!pickedReady || seatFading || takingOff}
                    onClick={() => {
                      setSeatFading(true);
                      setTimeout(() => {
                        setTakingOff(true);
                      }, 650);
                    }}
                    className={`rounded-2xl px-5 py-3 text-[13px] font-semibold tracking-wide transition-all ${
                      pickedReady && !seatFading && !takingOff
                        ? "bg-fr-sky-deep text-white hover:bg-fr-sky-deep/90 active:bg-fr-sky-deep"
                        : "cursor-not-allowed bg-black/5 text-fr-ink-dim"
                    }`}
                  >
                    출발
                  </button>
                </div>
              </div>
            </div>

            <div className="relative bg-fr-parchment-mid">
              <div className="absolute inset-x-0 top-0 h-px bg-fr-parchment-border" />
              <div className="flex items-center justify-center py-4">
                <div className="flex gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-2 w-2 rounded-full bg-fr-base"
                      style={{
                        opacity: 0.08 + (i % 4) * 0.04,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 h-28">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/70"
              style={{
                animation: takingOff
                  ? "frPlaneTakeoff 1100ms cubic-bezier(.16,.84,.22,1) forwards"
                  : undefined,
                opacity: takingOff ? 1 : 0,
              }}
            >
              <PlaneIcon size={54} />
            </div>
            {!takingOff && (
              <div className="absolute inset-0 flex items-end justify-center">
                <p className="pb-2 text-[10px] tracking-[0.45em] text-white/20 uppercase">
                  boarding
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
