"use client";

import * as d3 from "d3";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import * as topojson from "topojson-client";

import { AIRPORTS, findDestinationCandidates } from "@/entities/airport";
import type { Airport, AirportCandidate } from "@/entities/airport";
import { PassportButton } from "@/features/auth";

/* ─── Icons ──────────────────────────────────────────────────────────── */
function PlaneIcon({
    size = 18,
    className,
}: {
    size?: number;
    className?: string;
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
    );
}

function LandingIcon({ size = 14 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        >
            <path d="M12 2v10M5 9l7 7 7-7M3 19h18" />
        </svg>
    );
}

/* ─── FlapIata: scramble on mount ────────────────────────────────────── */
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function FlapIata({ value, className }: { value: string; className?: string }) {
    // Initialize with actual value so SSR and client hydration match
    const [display, setDisplay] = useState(value);
    useEffect(() => {
        // After hydration, immediately scramble then settle
        setDisplay(
            value
                .split("")
                .map(() => ALPHA[Math.floor(Math.random() * 26)])
                .join(""),
        );
        let frame = 0;
        const total = value.length * 5;
        const id = setInterval(() => {
            const settled = Math.floor(frame / 5);
            setDisplay(
                value
                    .split("")
                    .map((ch, i) =>
                        i < settled
                            ? ch
                            : ALPHA[Math.floor(Math.random() * 26)],
                    )
                    .join(""),
            );
            frame++;
            if (frame >= total) {
                setDisplay(value);
                clearInterval(id);
            }
        }, 45);
        return () => clearInterval(id);
    }, []);
    return <span className={className}>{display}</span>;
}

/* ─── SplitIata: scramble on value change ────────────────────────────── */
function SplitIata({
    value,
    className,
}: {
    value: string;
    className?: string;
}) {
    const [display, setDisplay] = useState(value);
    const prevRef = useRef(value);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    useEffect(() => {
        if (value === prevRef.current) return;
        prevRef.current = value;
        let frame = 0;
        const total = value.length * 5 + 4;
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            const settled = Math.floor(frame / 5);
            setDisplay(
                value
                    .split("")
                    .map((ch, i) =>
                        i < settled
                            ? ch
                            : ALPHA[Math.floor(Math.random() * 26)],
                    )
                    .join(""),
            );
            frame++;
            if (frame > total) {
                setDisplay(value);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        }, 45);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [value]);
    return <span className={className}>{display}</span>;
}

/* ─── CandidateChip ──────────────────────────────────────────────────── */
function CandidateChip({
    candidate,
    index,
    selected,
    onSelect,
}: {
    candidate: AirportCandidate;
    index: number;
    selected: boolean;
    onSelect: () => void;
}) {
    const [entered, setEntered] = useState(false);
    useEffect(() => {
        const id = setTimeout(
            () => setEntered(true),
            30 + Math.min(index, 18) * 35,
        );
        return () => clearTimeout(id);
    }, []);
    return (
        <button
            onClick={onSelect}
            style={{
                opacity: entered ? 1 : 0,
                transform: entered
                    ? "none"
                    : "perspective(280px) rotateX(-55deg)",
                transition: "opacity 0.28s ease, transform 0.32s ease",
            }}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border shrink-0 ${
                selected
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/14 active:bg-white/[0.07]"
            }`}
        >
            <FlapIata
                value={candidate.airport.iata}
                className={`text-[13px] font-bold font-mono tracking-wide ${selected ? "text-amber-300" : "text-white"}`}
            />
            <span
                className={`text-[10px] ${selected ? "text-amber-400/70" : "text-white/35"}`}
            >
                {candidate.airport.city}
            </span>
            <span
                className={`text-[9px] ${selected ? "text-amber-400/50" : "text-white/22"}`}
            >
                {candidate.flightMinutes}m
            </span>
        </button>
    );
}

/* ─── InteractiveWorldMap ────────────────────────────────────────────── */
type WorldData = { land: d3.ExtendedFeature; borders: d3.ExtendedFeature };
interface MapState {
    from: string | null;
    to: string | null;
    candidates: Airport[];
    world: WorldData | null;
    transform: d3.ZoomTransform;
}

function InteractiveWorldMap({
    from,
    to,
    candidates,
    onSelectCandidate,
}: {
    from: string | null;
    to: string | null;
    candidates?: Airport[];
    onSelectCandidate?: (iata: string) => void;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const stateRef = useRef<MapState>({
        from,
        to,
        candidates: candidates ?? [],
        world: null,
        transform: d3.zoomIdentity,
    });
    const onSelectRef = useRef(onSelectCandidate);
    onSelectRef.current = onSelectCandidate;
    // 드래그 직후 click을 무시하기 위한 플래그
    const didDragRef = useRef(false);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { world, from, to, candidates, transform: t } = stateRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const { width, height } = canvas;
        const proj = d3.geoEquirectangular().fitSize([width, height], {
            type: "Sphere",
        } as d3.GeoPermissibleObjects);
        const path = d3.geoPath(proj, ctx);
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#07101c";
        ctx.fillRect(0, 0, width, height);
        if (!world) return;
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.k, t.k);
        ctx.beginPath();
        path(world.land);
        ctx.fillStyle = "#1a3354";
        ctx.fill();
        ctx.beginPath();
        path(world.borders);
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.lineWidth = 0.5 / t.k;
        ctx.stroke();
        const fromA = from
            ? (AIRPORTS.find((a) => a.iata === from) ?? null)
            : null;
        const toA = to ? (AIRPORTS.find((a) => a.iata === to) ?? null) : null;
        if (fromA && toA) {
            ctx.beginPath();
            path({
                type: "LineString",
                coordinates: [
                    [fromA.lng, fromA.lat],
                    [toA.lng, toA.lat],
                ],
            } as unknown as d3.GeoPermissibleObjects);
            ctx.strokeStyle = "rgba(56,189,248,0.45)";
            ctx.lineWidth = 1.5 / t.k;
            ctx.setLineDash([5 / t.k, 5 / t.k]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        for (const c of candidates) {
            const p = proj([c.lng, c.lat]);
            if (!p) continue;
            const sel = to === c.iata;
            ctx.beginPath();
            ctx.arc(p[0], p[1], (sel ? 6 : 4.5) / t.k, 0, Math.PI * 2);
            ctx.fillStyle = sel ? "#fbbf24" : "rgba(251,191,36,0.4)";
            ctx.fill();
            ctx.strokeStyle = sel
                ? "rgba(251,191,36,0.3)"
                : "rgba(251,191,36,0.1)";
            ctx.lineWidth = 7 / t.k;
            ctx.stroke();
        }
        const drawDot = (a: Airport, color: string, glow: string) => {
            const p = proj([a.lng, a.lat]);
            if (!p) return;
            const g = ctx.createRadialGradient(
                p[0],
                p[1],
                0,
                p[0],
                p[1],
                16 / t.k,
            );
            g.addColorStop(0, glow);
            g.addColorStop(1, "rgba(0,0,0,0)");
            ctx.beginPath();
            ctx.arc(p[0], p[1], 16 / t.k, 0, Math.PI * 2);
            ctx.fillStyle = g;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(p[0], p[1], 4 / t.k, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        };
        if (fromA) drawDot(fromA, "#38bdf8", "rgba(56,189,248,0.22)");
        if (toA && !candidates.find((c) => c.iata === to))
            drawDot(toA, "#fbbf24", "rgba(251,191,36,0.22)");
        ctx.restore();
    }, []);

    useEffect(() => {
        d3.json("/countries-110m.json").then((raw) => {
            if (!raw) return;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const topo = raw as any;
            stateRef.current.world = {
                land: topojson.feature(
                    topo,
                    topo.objects.land,
                ) as unknown as d3.ExtendedFeature,
                borders: topojson.mesh(
                    topo,
                    topo.objects.countries,
                    (a: unknown, b: unknown) => a !== b,
                ) as unknown as d3.ExtendedFeature,
            };
            draw();
        });
    }, [draw]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const behavior = d3
            .zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([0.6, 12])
            .filter((event: Event) => {
                // 터치: 두 손가락 핀치만 허용 (단일 터치는 페이지 스크롤로)
                const te = event as TouchEvent;
                if (te.touches !== undefined) return te.touches.length >= 2;
                // 마우스: 왼쪽 버튼만
                return !(event as MouseEvent).button;
            })
            .on("zoom", (e: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
                if (e.sourceEvent) didDragRef.current = true;
                stateRef.current.transform = e.transform;
                draw();
            });
        d3.select(canvas).call(behavior);
        // D3가 강제로 설정하는 touch-action: none 을 덮어써서 페이지 스크롤 복구
        canvas.style.touchAction = "pan-y";
        return () => void d3.select(canvas).on(".zoom", null);
    }, [draw]);

    useEffect(() => {
        stateRef.current.from = from;
        stateRef.current.to = to;
        stateRef.current.candidates = candidates ?? [];
        draw();
    }, [from, to, candidates, draw]);

    function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { candidates, transform: t } = stateRef.current;
        if (!candidates.length || !onSelectRef.current) return;
        const rect = canvas.getBoundingClientRect();
        const cx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const cy = (e.clientY - rect.top) * (canvas.height / rect.height);
        const proj = d3
            .geoEquirectangular()
            .fitSize([canvas.width, canvas.height], {
                type: "Sphere",
            } as d3.GeoPermissibleObjects);
        for (const c of candidates) {
            const p = proj([c.lng, c.lat]);
            if (!p) continue;
            if (Math.hypot(p[0] * t.k + t.x - cx, p[1] * t.k + t.y - cy) < 18) {
                onSelectRef.current(c.iata);
                return;
            }
        }
    }

    return (
        <div className="relative w-full h-56 sm:h-72 bg-[#07101c] rounded-2xl overflow-hidden select-none">
            <canvas
                ref={canvasRef}
                width={1200}
                height={500}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onClick={handleClick}
            />
            <div className="absolute bottom-2.5 right-3 pointer-events-none">
                <span className="hidden sm:inline text-[9px] text-white/18 tracking-widest uppercase">
                    스크롤 확대 · 드래그 이동
                </span>
                <span className="sm:hidden text-[9px] text-white/18 tracking-widest uppercase">
                    핀치 확대 · 드래그 이동
                </span>
            </div>
        </div>
    );
}

/* ─── RouteBar ───────────────────────────────────────────────────────── */
function RouteBar({
    from,
    to,
    onFrom,
}: {
    from: string;
    to: string | null;
    onFrom: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
    const fromAirport = AIRPORTS.find((a) => a.iata === from);
    const toAirport = to ? AIRPORTS.find((a) => a.iata === to) : null;
    const filtered = AIRPORTS.filter(
        (a) =>
            a.iata.includes(search.toUpperCase()) ||
            a.name.includes(search) ||
            a.city.includes(search),
    );

    useEffect(() => {
        if (!open) return;
        const h = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            {/* Route display strip */}
            <div className="flex items-center gap-3 sm:gap-5">
                {/* FROM */}
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex flex-col items-start group shrink-0"
                >
                    <span className="text-[9px] text-white/25 tracking-widest uppercase">
                        출발지
                    </span>
                    <span className="text-[38px] sm:text-[46px] font-bold leading-none mt-1 text-white group-hover:text-sky-300 transition-colors tracking-tight">
                        {from}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-white/35 mt-1 leading-tight max-w-[100px] truncate">
                        {fromAirport?.city}
                    </span>
                </button>

                {/* Flight path */}
                <div className="flex-1 flex items-center gap-2 pb-4">
                    <div className="flex-1 border-t border-dashed border-white/[0.1]" />
                    <PlaneIcon size={15} className="text-white/20 shrink-0" />
                    <div className="flex-1 border-t border-dashed border-white/[0.1]" />
                </div>

                {/* TO */}
                <div className="flex flex-col items-end shrink-0">
                    <span className="text-[9px] text-white/25 tracking-widest uppercase">
                        목적지
                    </span>
                    {toAirport ? (
                        <>
                            <SplitIata
                                value={toAirport.iata}
                                className="text-[38px] sm:text-[46px] font-bold leading-none mt-1 text-amber-300 tracking-tight"
                            />
                            <span className="text-[10px] sm:text-[11px] text-white/35 mt-1 leading-tight text-right max-w-[100px] truncate">
                                {toAirport.city}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="text-[38px] sm:text-[46px] font-bold leading-none mt-1 text-white/15 tracking-tight">
                                ???
                            </span>
                            <span className="text-[10px] text-white/15 mt-1">
                                미정
                            </span>
                        </>
                    )}
                </div>
            </div>

            {/* Departure dropdown */}
            {open && (
                <div className="absolute top-full left-0 mt-3 z-50 w-[90vw] sm:w-[420px] bg-[#0d1826] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 p-4">
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="도시, 공항, IATA..."
                        className="w-full bg-white/[0.05] border border-white/[0.07] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-[14px] outline-none focus:border-sky-500/40 transition-colors mb-3"
                    />
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-[40vh] overflow-y-auto">
                        {filtered.map((a) => (
                            <button
                                key={a.iata}
                                onClick={() => {
                                    onFrom(a.iata);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className={`flex flex-col items-center py-3 px-1 rounded-xl border text-center transition-all ${
                                    from === a.iata
                                        ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
                                        : "border-white/[0.05] bg-white/[0.02] text-white hover:bg-white/5 hover:border-white/12"
                                }`}
                            >
                                <span className="text-[13px] font-bold font-mono tracking-wide">
                                    {a.iata}
                                </span>
                                <span className="text-[9px] text-white/30 truncate w-full mt-0.5 px-1">
                                    {a.city}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── DurationPicker ─────────────────────────────────────────────────── */
function clamp(v: number, min: number, max: number) {
    return Math.min(max, Math.max(min, v));
}

function DurationPicker({
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
                        type="number"
                        min={0}
                        max={23}
                        value={hours}
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
                        type="number"
                        min={0}
                        max={59}
                        value={minutes}
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
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={23}
                        value={hours}
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
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={59}
                        value={minutes}
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

/* ─── HomePage ───────────────────────────────────────────────────────── */
export default function HomePage() {
    const router = useRouter();
    const [tab, setTab] = useState<"new" | "active">("new");
    const [from, setFrom] = useState("ICN");
    const [to, setTo] = useState<string | null>(null);
    const [hours, setHours] = useState(2);
    const [minutes, setMinutes] = useState(0);
    const [subject, setSubject] = useState("");
    const [hardStop, setHardStop] = useState(false);

    const durationSeconds = hours * 3600 + minutes * 60;
    const candidates =
        durationSeconds > 0
            ? findDestinationCandidates(from, durationSeconds)
            : [];
    const candidateAirports = candidates.map((c) => c.airport);
    const canDepart = to !== null && durationSeconds > 0;

    const today = new Date();
    const todayFull = today.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    function handleDepart() {
        if (!canDepart || !to) return;
        const params = new URLSearchParams({
            subject,
            from,
            to,
            duration: String(durationSeconds),
            hardStop: String(hardStop),
        });
        router.push(`/timer?${params}`);
    }

    return (
        <main className="relative w-full min-h-screen bg-[#060c18] flex flex-col">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#091524] via-[#060c18] to-[#040810]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(56,189,248,0.05),transparent)]" />

            {/* Header */}
            <header className="relative z-10 flex items-center justify-between px-5 sm:px-10 pt-5 sm:pt-8 shrink-0">
                <div className="flex items-center gap-2.5 text-white">
                    <PlaneIcon size={17} />
                    <span className="font-semibold tracking-[0.25em] text-[12px] uppercase text-white/75">
                        Flightrail
                    </span>
                </div>
                <nav className="flex items-center gap-2">
                    <Link
                        href="/records"
                        className="px-3.5 py-2 text-white/30 hover:text-white/60 text-[13px] transition-colors rounded-xl hover:bg-white/5"
                    >
                        기록
                    </Link>
                    <PassportButton />
                </nav>
            </header>

            {/* Main */}
            <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 pt-6 pb-10">
                <p className="text-[9px] text-white/18 tracking-[0.5em] uppercase mb-6">
                    Ready for Takeoff
                </p>

                <div className="w-full max-w-3xl">
                    {/* Tab bar */}
                    <div className="flex items-center border-b border-white/[0.07]">
                        {(["new", "active"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-5 py-3 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                                    tab === t
                                        ? "text-white border-sky-500"
                                        : "text-white/28 border-transparent hover:text-white/50"
                                }`}
                            >
                                {t === "new" ? "새 여행" : "진행중인 여행"}
                            </button>
                        ))}
                        <div className="flex-1" />
                        <span className="hidden sm:inline text-[11px] text-white/18 pb-3 pr-1">
                            {todayFull}
                        </span>
                    </div>

                    {/* Card */}
                    <div className="bg-[#0c1521]/60 backdrop-blur-sm border border-t-0 border-white/[0.07] rounded-b-3xl rounded-tr-3xl">
                        {tab === "active" ? (
                            <div className="flex flex-col items-center justify-center py-14 gap-4 px-6">
                                <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/25">
                                    <PlaneIcon size={22} />
                                </div>
                                <p className="text-[13px] text-white/35">
                                    진행중인 여행이 없습니다
                                </p>
                                <Link
                                    href="/timer"
                                    className="px-5 py-2.5 text-[13px] text-white/50 hover:text-white/80 border border-white/[0.08] hover:border-white/20 rounded-xl transition-colors"
                                >
                                    타이머로 이동
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {/* ① Route bar */}
                                <div className="px-5 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-white/[0.05]">
                                    <RouteBar
                                        from={from}
                                        to={to}
                                        onFrom={(v) => {
                                            setFrom(v);
                                            setTo(null);
                                        }}
                                    />
                                </div>

                                {/* ② Duration + Candidates */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05] bg-white/[0.015]">
                                    <p className="text-[9px] text-white/28 tracking-widest uppercase mb-4">
                                        비행 시간
                                    </p>
                                    <DurationPicker
                                        hours={hours}
                                        minutes={minutes}
                                        onHours={setHours}
                                        onMinutes={setMinutes}
                                    />
                                    {candidates.length > 0 && (
                                        <div className="mt-5">
                                            <p className="text-[9px] text-white/22 tracking-widest uppercase mb-2.5">
                                                도달 가능 공항
                                                <span className="text-amber-500/55 ml-1.5">
                                                    {candidates.length}개
                                                </span>
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {candidates.map((c, i) => (
                                                    <CandidateChip
                                                        key={`${from}-${hours}-${minutes}-${c.airport.iata}`}
                                                        candidate={c}
                                                        index={i}
                                                        selected={
                                                            to ===
                                                            c.airport.iata
                                                        }
                                                        onSelect={() =>
                                                            setTo(
                                                                c.airport.iata,
                                                            )
                                                        }
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {candidates.length === 0 &&
                                        durationSeconds === 0 && (
                                            <p className="text-[12px] text-white/20 mt-2">
                                                시간을 설정하면 목적지 후보가
                                                표시됩니다
                                            </p>
                                        )}
                                </div>

                                {/* ③ Subject */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05]">
                                    <p className="text-[9px] text-white/28 tracking-widest uppercase mb-3">
                                        여행 목적
                                    </p>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) =>
                                            setSubject(e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            e.key === "Enter" && handleDepart()
                                        }
                                        placeholder="무엇을 공부할 예정인가요?"
                                        className="w-full bg-transparent text-white placeholder:text-white/18 text-[15px] sm:text-[16px] outline-none"
                                    />
                                    <div className="flex gap-1.5 mt-3 flex-wrap">
                                        {[
                                            "알고리즘",
                                            "영어",
                                            "수학",
                                            "프로그래밍",
                                            "독서",
                                        ].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() =>
                                                    setSubject(
                                                        subject === tag
                                                            ? ""
                                                            : tag,
                                                    )
                                                }
                                                className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
                                                    subject === tag
                                                        ? "border-sky-500/60 bg-sky-500/10 text-sky-400"
                                                        : "border-white/[0.07] text-white/25 hover:text-white/50 hover:border-white/15 active:bg-white/5"
                                                }`}
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* ④ Map */}
                                <div className="px-5 sm:px-8 py-5 border-b border-white/[0.05]">
                                    <InteractiveWorldMap
                                        from={from}
                                        to={to}
                                        candidates={candidateAirports}
                                        onSelectCandidate={setTo}
                                    />
                                </div>

                                {/* ⑤ Landing option + Book */}
                                <div className="px-5 sm:px-8 py-5 sm:py-6">
                                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                                        <div className="flex-1">
                                            <p className="text-[9px] text-white/28 tracking-widest uppercase mb-3">
                                                착륙 옵션
                                            </p>
                                            <div className="flex gap-2">
                                                {(
                                                    [
                                                        {
                                                            v: false,
                                                            label: "계속 비행",
                                                            desc: "목표 시간 후에도 타이머가 계속 실행됩니다. 직접 착륙을 선택해야 기록됩니다.",
                                                            icon: (
                                                                <PlaneIcon
                                                                    size={12}
                                                                />
                                                            ),
                                                        },
                                                        {
                                                            v: true,
                                                            label: "자동 착륙",
                                                            desc: "목표 시간이 되면 자동으로 세션이 종료되고 기록됩니다.",
                                                            icon: (
                                                                <LandingIcon
                                                                    size={12}
                                                                />
                                                            ),
                                                        },
                                                    ] as const
                                                ).map(
                                                    ({
                                                        v,
                                                        label,
                                                        desc,
                                                        icon,
                                                    }) => (
                                                        <button
                                                            key={String(v)}
                                                            onClick={() =>
                                                                setHardStop(v)
                                                            }
                                                            className={`flex-1 flex items-start gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                                                                hardStop === v
                                                                    ? "border-sky-500/45 bg-sky-500/7 text-white"
                                                                    : "border-white/[0.06] text-white/40 hover:text-white/60 hover:border-white/12"
                                                            }`}
                                                        >
                                                            <span
                                                                className={`mt-0.5 shrink-0 ${hardStop === v ? "text-sky-400" : "text-white/28"}`}
                                                            >
                                                                {icon}
                                                            </span>
                                                            <div>
                                                                <p className="text-[12px] font-medium leading-none mb-1.5">
                                                                    {label}
                                                                </p>
                                                                <p
                                                                    className={`text-[10px] leading-relaxed ${hardStop === v ? "text-white/40" : "text-white/22"}`}
                                                                >
                                                                    {desc}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleDepart}
                                            disabled={!canDepart}
                                            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 sm:py-5 rounded-2xl font-semibold text-[14px] transition-all duration-200 tracking-wide shrink-0 ${
                                                canDepart
                                                    ? "bg-sky-600 hover:bg-sky-500 active:bg-sky-600 text-white shadow-lg shadow-sky-900/40"
                                                    : "bg-white/4 text-white/18 cursor-not-allowed"
                                            }`}
                                        >
                                            <PlaneIcon size={18} />
                                            <span>예매하기</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
