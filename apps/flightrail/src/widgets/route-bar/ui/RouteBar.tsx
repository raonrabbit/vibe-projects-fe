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
          className="group flex shrink-0 flex-col items-start"
        >
          <span className="text-[9px] tracking-widest text-white/25 uppercase">
            출발지
          </span>
          <span className="mt-1 text-[38px] leading-none font-bold tracking-tight text-white transition-colors group-hover:text-sky-300 sm:text-[46px]">
            {from}
          </span>
          <span className="mt-1 max-w-[100px] truncate text-[10px] leading-tight text-white/35 sm:text-[11px]">
            {fromAirport?.city}
          </span>
        </button>

        {/* Flight path */}
        <div className="flex flex-1 items-center gap-2 pb-4">
          <div className="flex-1 border-t border-dashed border-white/[0.1]" />
          <PlaneIcon size={15} className="shrink-0 text-white/20" />
          <div className="flex-1 border-t border-dashed border-white/[0.1]" />
        </div>

        {/* TO */}
        <div className="flex shrink-0 flex-col items-end">
          <span className="text-[9px] tracking-widest text-white/25 uppercase">
            목적지
          </span>
          {toAirport ? (
            <>
              <SplitIata
                value={toAirport.iata}
                className="mt-1 text-[38px] leading-none font-bold tracking-tight text-amber-300 sm:text-[46px]"
              />
              <span className="mt-1 max-w-[100px] truncate text-right text-[10px] leading-tight text-white/35 sm:text-[11px]">
                {toAirport.city}
              </span>
            </>
          ) : (
            <>
              <span className="mt-1 text-[38px] leading-none font-bold tracking-tight text-white/15 sm:text-[46px]">
                ???
              </span>
              <span className="mt-1 text-[10px] text-white/15">미정</span>
            </>
          )}
        </div>
      </div>

      {/* Departure dropdown */}
      {open && (
        <div className="absolute top-full left-0 z-50 mt-3 w-[90vw] rounded-2xl border border-white/[0.08] bg-fr-elevated p-4 shadow-2xl shadow-black/80 sm:w-[420px]">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="도시, 공항, IATA..."
            className="mb-3 w-full rounded-xl border border-white/[0.07] bg-white/[0.05] px-4 py-3 text-[14px] text-white transition-colors outline-none placeholder:text-white/20 focus:border-sky-500/40"
          />
          <div className="max-h-[40vh] space-y-3 overflow-y-auto">
            {Object.entries(groupedFiltered).map(([country, airports]) => (
              <div key={country}>
                <p className="mb-1.5 px-0.5 text-[10px] tracking-[0.15em] text-white/30 uppercase">
                  {country}
                </p>
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                  {airports.map((a) => (
                    <button
                      key={a.iata}
                      onClick={() => {
                        onFrom(a.iata);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`flex flex-col items-center rounded-xl border px-1 py-3 text-center transition-all ${
                        from === a.iata
                          ? "border-sky-500/50 bg-sky-500/10 text-sky-400"
                          : "border-white/[0.05] bg-white/[0.02] text-white hover:border-white/12 hover:bg-white/5"
                      }`}
                    >
                      <span className="font-mono text-[13px] font-bold tracking-wide">
                        {a.iata}
                      </span>
                      <span className="mt-0.5 w-full truncate px-1 text-[9px] text-white/30">
                        {a.city}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
