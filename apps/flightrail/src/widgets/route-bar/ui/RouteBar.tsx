"use client";

import { useEffect, useRef, useState } from "react";

import { AIRPORTS } from "@/entities/airport";
import { SplitIata } from "@/shared/ui/FlapIata";
import { PlaneIcon } from "@/shared/ui/icons";

export function RouteBar({
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
            a.city.includes(search) ||
            a.country.includes(search),
    );

    const groupedFiltered = filtered.reduce<Record<string, typeof filtered>>(
        (acc, a) => {
            if (!acc[a.country]) acc[a.country] = [];
            acc[a.country].push(a);
            return acc;
        },
        {},
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
                <div className="absolute top-full left-0 mt-3 z-50 w-[90vw] sm:w-[420px] bg-fr-elevated border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 p-4">
                    <input
                        autoFocus
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="도시, 공항, IATA..."
                        className="w-full bg-white/[0.05] border border-white/[0.07] rounded-xl px-4 py-3 text-white placeholder:text-white/20 text-[14px] outline-none focus:border-sky-500/40 transition-colors mb-3"
                    />
                    <div className="max-h-[40vh] overflow-y-auto space-y-3">
                        {Object.entries(groupedFiltered).map(
                            ([country, airports]) => (
                                <div key={country}>
                                    <p className="text-[10px] text-white/30 tracking-[0.15em] uppercase mb-1.5 px-0.5">
                                        {country}
                                    </p>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                                        {airports.map((a) => (
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
                            ),
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
