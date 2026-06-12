"use client";

import * as d3 from "d3";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as topojson from "topojson-client";

import { AIRPORTS } from "@/entities/airport";
import type { Session } from "@/entities/session";

type TimeRange = "7d" | "30d";
type WorldData = { land: d3.ExtendedFeature; borders: d3.ExtendedFeature };

interface MapState {
  world: WorldData | null;
  sessions: Session[];
  range: TimeRange;
  transform: d3.ZoomTransform;
}

function filterSessions(sessions: Session[], range: TimeRange): Session[] {
  const cutoff = Date.now() - (range === "7d" ? 7 : 30) * 86400_000;
  return sessions.filter((s) => new Date(s.started_at).getTime() >= cutoff);
}

// Fixed angle: circle always appears upper-right of the airport dot
const SAME_AIRPORT_ANGLE = -Math.PI / 4;

function drawMap(canvas: HTMLCanvasElement, state: MapState) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.width / dpr;
  const cssH = canvas.height / dpr;
  const t = state.transform;

  const proj = d3
    .geoEquirectangular()
    .fitSize([cssW, cssH], { type: "Sphere" } as d3.GeoPermissibleObjects);
  const path = d3.geoPath(proj, ctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#07101c";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (!state.world) return;

  ctx.save();
  ctx.scale(dpr, dpr);
  ctx.translate(t.x, t.y);
  ctx.scale(t.k, t.k);

  ctx.beginPath();
  path(state.world.land);
  ctx.fillStyle = "#1a3354";
  ctx.fill();

  ctx.beginPath();
  path(state.world.borders);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 0.5 / t.k;
  ctx.stroke();

  const filtered = filterSessions(state.sessions, state.range);

  // Draw each session — overlapping routes naturally accumulate opacity on canvas
  for (const s of filtered) {
    if (s.departure_airport === s.destination_airport) {
      const airport = AIRPORTS.find((a) => a.iata === s.departure_airport);
      if (!airport) continue;
      const p = proj([airport.lng, airport.lat]);
      if (!p) continue;

      // Airport dot is on the circle perimeter — circle center is offset
      const R = 6 / t.k;
      const θ = SAME_AIRPORT_ANGLE;
      const cx = p[0] - R * Math.cos(θ);
      const cy = p[1] - R * Math.sin(θ);

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(56,189,248,0.4)";
      ctx.lineWidth = 1.2 / t.k;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p[0], p[1], 2 / t.k, 0, Math.PI * 2);
      ctx.fillStyle = "#38bdf8";
      ctx.fill();
    } else {
      const from = AIRPORTS.find((a) => a.iata === s.departure_airport);
      const to = AIRPORTS.find((a) => a.iata === s.destination_airport);
      if (!from || !to) continue;

      // Great-circle arc — same route drawn multiple times naturally darkens
      ctx.beginPath();
      path({
        type: "LineString",
        coordinates: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ],
      } as unknown as d3.GeoPermissibleObjects);
      ctx.strokeStyle = "rgba(56,189,248,0.4)";
      ctx.lineWidth = 1.5 / t.k;
      ctx.stroke();

      const fp = proj([from.lng, from.lat]);
      const tp = proj([to.lng, to.lat]);
      if (fp) {
        ctx.beginPath();
        ctx.arc(fp[0], fp[1], 2 / t.k, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.fill();
      }
      if (tp) {
        ctx.beginPath();
        ctx.arc(tp[0], tp[1], 2 / t.k, 0, Math.PI * 2);
        ctx.fillStyle = "#fbbf24";
        ctx.fill();
      }
    }
  }

  ctx.restore();
}

export function FlightHistoryMap({ sessions }: { sessions: Session[] }) {
  const [range, setRange] = useState<TimeRange>("7d");
  const [worldLoaded, setWorldLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef<MapState>({
    world: null,
    sessions,
    range,
    transform: d3.zoomIdentity,
  });

  stateRef.current.sessions = sessions;
  stateRef.current.range = range;

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawMap(canvas, stateRef.current);
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
      setWorldLoaded(true);
      redraw();
    });
  }, [redraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const zoom = d3
      .zoom<HTMLCanvasElement, unknown>()
      .scaleExtent([1, 10])
      .filter((event: Event) => {
        if (event instanceof MouseEvent) return !event.button;
        return true;
      })
      .on("zoom", (e: d3.D3ZoomEvent<HTMLCanvasElement, unknown>) => {
        stateRef.current.transform = e.transform;
        redraw();
      });

    const sel = d3.select(canvas);
    sel.call(zoom);
    canvas.style.touchAction = "none";

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      zoom.translateExtent([
        [0, 0],
        [rect.width, rect.height],
      ]);
      redraw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    return () => {
      ro.disconnect();
      sel.on(".zoom", null);
    };
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [redraw, sessions, range]);

  const filteredCount = useMemo(
    () => filterSessions(sessions, range).length,
    [sessions, range],
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-6 py-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] tracking-widest text-white/30 uppercase">
          비행 항로
        </p>
        <div className="flex gap-1">
          {(["7d", "30d"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-full px-2.5 py-1 text-[10px] transition-colors ${
                range === r
                  ? "bg-sky-500/20 text-sky-400"
                  : "text-white/30 hover:text-white/50"
              }`}
            >
              {r === "7d" ? "최근 7일" : "최근 한달"}
            </button>
          ))}
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl"
        style={{ aspectRatio: "2/1" }}
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
        {worldLoaded && filteredCount === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-[13px] text-white/25">
              {range === "7d" ? "최근 7일" : "최근 한달"} 비행 기록이 없습니다
            </p>
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="h-[2px] w-3 bg-sky-400/60" />
          <span className="text-[9px] text-white/25">항로</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-sky-400" />
          <span className="text-[9px] text-white/25">출발지</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-amber-400" />
          <span className="text-[9px] text-white/25">목적지</span>
        </div>
      </div>
    </div>
  );
}
