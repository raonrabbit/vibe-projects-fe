"use client";

import * as d3 from "d3";
import { useCallback, useEffect, useRef } from "react";
import * as topojson from "topojson-client";

import type { Airport } from "@/entities/airport";
import { AIRPORTS } from "@/entities/airport";

type WorldData = { land: d3.ExtendedFeature; borders: d3.ExtendedFeature };
interface MapState {
    from: string | null;
    to: string | null;
    candidates: Airport[];
    world: WorldData | null;
    transform: d3.ZoomTransform;
}

export function DepartureMap({
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
    const containerRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef<MapState>({
        from,
        to,
        candidates: candidates ?? [],
        world: null,
        transform: d3.zoomIdentity,
    });
    const onSelectRef = useRef(onSelectCandidate);
    onSelectRef.current = onSelectCandidate;
    const didDragRef = useRef(false);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { world, from, to, candidates, transform: t } = stateRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.width / dpr;
        const cssH = canvas.height / dpr;

        const proj = d3.geoEquirectangular().fitSize([cssW, cssH], {
            type: "Sphere",
        } as d3.GeoPermissibleObjects);
        const path = d3.geoPath(proj, ctx);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#07101c";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (!world) return;

        ctx.save();
        ctx.scale(dpr, dpr);
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
            ctx.stroke();
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
        const container = containerRef.current;
        if (!canvas || !container) return;

        const behavior = d3
            .zoom<HTMLCanvasElement, unknown>()
            .scaleExtent([1, 12])
            .filter((event: Event) => {
                if (event instanceof MouseEvent) return !event.button;
                return true;
            })
            .on("zoom", (e: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
                if (e.sourceEvent) didDragRef.current = true;
                stateRef.current.transform = e.transform;
                draw();
            });

        const sel = d3.select(canvas);
        sel.call(behavior);
        canvas.style.touchAction = "none";

        const sync = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            canvas.width = Math.round(rect.width * dpr);
            canvas.height = Math.round(rect.height * dpr);
            behavior.translateExtent([
                [0, 0],
                [rect.width, rect.height],
            ]);
            draw();
        };

        const observer = new ResizeObserver(sync);
        observer.observe(container);
        sync();

        return () => {
            sel.on(".zoom", null);
            observer.disconnect();
        };
    }, [draw]);

    useEffect(() => {
        stateRef.current.from = from;
        stateRef.current.to = to;
        stateRef.current.candidates = candidates ?? [];
        draw();
    }, [from, to, candidates, draw]);

    function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        if (didDragRef.current) {
            didDragRef.current = false;
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const { candidates, transform: t } = stateRef.current;
        if (!candidates.length || !onSelectRef.current) return;

        const dpr = window.devicePixelRatio || 1;
        const cssW = canvas.width / dpr;
        const cssH = canvas.height / dpr;
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        const proj = d3.geoEquirectangular().fitSize([cssW, cssH], {
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
        <div
            ref={containerRef}
            className="relative w-full bg-fr-base rounded-2xl overflow-hidden select-none"
            style={{ aspectRatio: "12/5" }}
        >
            <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                onClick={handleClick}
            />
            <div className="absolute bottom-2.5 right-3 pointer-events-none">
                <span className="hidden sm:inline text-[9px] text-white/18 tracking-widest uppercase">
                    스크롤 확대 · 드래그 이동
                </span>
                <span className="sm:hidden text-[9px] text-white/18 tracking-widest uppercase">
                    드래그 이동 · 핀치 확대
                </span>
            </div>
        </div>
    );
}
