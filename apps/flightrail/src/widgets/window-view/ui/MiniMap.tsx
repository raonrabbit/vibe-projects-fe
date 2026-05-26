"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import * as topojson from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";

type WorldTopology = Topology<{
    land: GeometryCollection;
    countries: GeometryCollection;
}>;

let topoCache: WorldTopology | null = null;

async function loadTopo(): Promise<WorldTopology | null> {
    if (!topoCache) {
        topoCache =
            (await d3.json<WorldTopology>("/countries-110m.json")) ?? null;
    }
    return topoCache;
}

interface Props {
    fromLat: number;
    fromLng: number;
    toLat: number;
    toLng: number;
    fromIata: string;
    toIata: string;
    progress: number;
}

const W = 220;
const H = 110;

function buildProjection(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
): d3.GeoProjection {
    const interp = d3.geoInterpolate([fromLng, fromLat], [toLng, toLat]);
    const [midLng, midLat] = interp(0.5) as [number, number];

    // Sample great-circle route; rotating the projection so the midpoint sits
    // at [0,0] avoids antimeridian-crossing artifacts in the bbox calculation.
    const routePoints = Array.from({ length: 21 }, (_, i) => interp(i / 20));
    const multiPoint = {
        type: "Feature",
        geometry: { type: "MultiPoint", coordinates: routePoints },
        properties: null,
    } as d3.GeoPermissibleObjects;

    const proj = d3
        .geoEquirectangular()
        .rotate([-midLng, -midLat])
        .fitExtent(
            [
                [20, 20],
                [W - 20, H - 20],
            ],
            multiPoint,
        );

    // Cap zoom so very short routes still show meaningful geography (≥ ±15°)
    const maxScale = (W / 2 - 20) / ((15 * Math.PI) / 180);
    if (proj.scale() > maxScale) {
        proj.scale(maxScale).translate([W / 2, H / 2]);
    }

    return proj;
}

export function MiniMap({
    fromLat,
    fromLng,
    toLat,
    toLng,
    fromIata,
    toIata,
    progress,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bgRef = useRef<ImageData | null>(null);
    const projRef = useRef<d3.GeoProjection | null>(null);

    // Build background (map + dashed route + airport dots) when airports change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let cancelled = false;

        const projection = buildProjection(fromLat, fromLng, toLat, toLng);
        projRef.current = projection;
        bgRef.current = null;

        loadTopo().then((world) => {
            if (cancelled || !world) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const path = d3.geoPath(projection, ctx);
            const land = topojson.feature(world, world.objects.land);
            const borders = topojson.mesh(
                world,
                world.objects.countries,
                (a, b) => a !== b,
            );
            const interp = d3.geoInterpolate(
                [fromLng, fromLat],
                [toLng, toLat],
            );

            ctx.fillStyle = "#060d1c";
            ctx.fillRect(0, 0, W, H);

            ctx.beginPath();
            path(d3.geoGraticule()());
            ctx.strokeStyle = "#0d1b30";
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.beginPath();
            path(land);
            ctx.fillStyle = "#192d4a";
            ctx.fill();

            ctx.beginPath();
            path(borders);
            ctx.strokeStyle = "#1f3d62";
            ctx.lineWidth = 0.6;
            ctx.stroke();

            // Full route — dashed
            ctx.beginPath();
            for (let i = 0; i <= 60; i++) {
                const pt = projection(interp(i / 60) as [number, number]);
                if (!pt) continue;
                if (i === 0) ctx.moveTo(pt[0], pt[1]);
                else ctx.lineTo(pt[0], pt[1]);
            }
            ctx.strokeStyle = "rgba(255,255,255,0.18)";
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 5]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Departure dot + label
            const fromPt = projection([fromLng, fromLat] as [number, number]);
            if (fromPt) {
                ctx.beginPath();
                ctx.arc(fromPt[0], fromPt[1], 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.85)";
                ctx.fill();
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillStyle = "rgba(255,255,255,0.65)";
                ctx.fillText(fromIata, fromPt[0], fromPt[1] + 12);
            }

            // Destination dot + label
            const toPt = projection([toLng, toLat] as [number, number]);
            if (toPt) {
                ctx.beginPath();
                ctx.arc(toPt[0], toPt[1], 2.5, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(255,255,255,0.38)";
                ctx.fill();
                ctx.font = "bold 8px monospace";
                ctx.textAlign = "center";
                ctx.fillStyle = "rgba(255,255,255,0.32)";
                ctx.fillText(toIata, toPt[0], toPt[1] + 12);
            }

            bgRef.current = ctx.getImageData(0, 0, W, H);
        });

        return () => {
            cancelled = true;
        };
    }, [fromLat, fromLng, toLat, toLng, fromIata, toIata]);

    // Overlay traveled arc + plane on each progress tick
    useEffect(() => {
        const canvas = canvasRef.current;
        const bg = bgRef.current;
        const projection = projRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx || !bg || !projection) return;

        ctx.putImageData(bg, 0, 0);

        const interp = d3.geoInterpolate([fromLng, fromLat], [toLng, toLat]);

        // Traveled portion — bright arc
        if (progress > 0.005) {
            const steps = Math.max(2, Math.ceil(60 * progress));
            ctx.beginPath();
            for (let i = 0; i <= steps; i++) {
                const t = (i / steps) * progress;
                const pt = projection(interp(t) as [number, number]);
                if (!pt) continue;
                if (i === 0) ctx.moveTo(pt[0], pt[1]);
                else ctx.lineTo(pt[0], pt[1]);
            }
            ctx.strokeStyle = "rgba(147,197,253,0.75)";
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        // Plane icon
        const planePt = projection(interp(progress) as [number, number]);
        const prevPt = projection(
            interp(Math.max(0, progress - 0.015)) as [number, number],
        );
        if (!planePt || !prevPt) return;

        const angle = Math.atan2(
            planePt[1] - prevPt[1],
            planePt[0] - prevPt[0],
        );

        ctx.save();
        ctx.translate(planePt[0], planePt[1]);
        ctx.rotate(angle);
        ctx.shadowColor = "rgba(147,197,253,0.9)";
        ctx.shadowBlur = 5;
        ctx.fillStyle = "#bfdbfe";
        ctx.beginPath();
        ctx.moveTo(7, 0);
        ctx.lineTo(0, -3.5);
        ctx.lineTo(-2, -3);
        ctx.lineTo(-1.5, 0);
        ctx.lineTo(-4.5, -1.5);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-4.5, 1.5);
        ctx.lineTo(-1.5, 0);
        ctx.lineTo(-2, 3);
        ctx.lineTo(0, 3.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }, [fromLat, fromLng, toLat, toLng, progress]);

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/40">
            <canvas
                ref={canvasRef}
                width={W}
                height={H}
                style={{ display: "block" }}
            />
        </div>
    );
}
