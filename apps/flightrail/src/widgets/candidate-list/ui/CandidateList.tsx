"use client";

import { useEffect, useState } from "react";

import type { AirportCandidate } from "@/entities/airport";
import { FlapIata } from "@/shared/ui/FlapIata";

function formatFlightTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

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
        transform: entered ? "none" : "perspective(280px) rotateX(-55deg)",
        transition: "opacity 0.28s ease, transform 0.32s ease",
      }}
      className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 ${
        selected
          ? "border-amber-500/50 bg-amber-500/10"
          : "border-white/[0.07] bg-white/[0.02] hover:border-white/14 hover:bg-white/[0.05] active:bg-white/[0.07]"
      }`}
    >
      <FlapIata
        value={candidate.airport.iata}
        className={`font-mono text-[13px] font-bold tracking-wide ${selected ? "text-amber-300" : "text-white"}`}
      />
      <span
        className={`text-[10px] ${selected ? "text-amber-400/70" : "text-white/35"}`}
      >
        {candidate.airport.city}
      </span>
      <span
        className={`text-[9px] ${selected ? "text-amber-400/50" : "text-white/22"}`}
      >
        {formatFlightTime(candidate.flightMinutes)}
      </span>
    </button>
  );
}

export function CandidateList({
  candidates,
  selected,
  keyPrefix,
  onSelect,
}: {
  candidates: AirportCandidate[];
  selected: string | null;
  keyPrefix: string;
  onSelect: (iata: string) => void;
}) {
  if (candidates.length === 0) return null;

  const grouped = candidates.reduce<Record<string, typeof candidates>>(
    (acc, c) => {
      if (!acc[c.airport.country]) acc[c.airport.country] = [];
      acc[c.airport.country].push(c);
      return acc;
    },
    {},
  );

  return (
    <div className="mt-5">
      <p className="mb-1 text-[9px] tracking-widest text-white/22 uppercase">
        도달 가능 공항
        <span className="ml-1.5 text-amber-500/55">{candidates.length}개</span>
      </p>
      <p className="mb-2.5 text-[8px] text-white/18">
        비행 시간 ±30분 이내 도착 가능한 공항
      </p>
      <div className="space-y-2.5">
        {Object.entries(grouped).map(([country, group]) => (
          <div key={country}>
            <p className="mb-1.5 text-[9px] tracking-[0.15em] text-white/28 uppercase">
              {country}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.map((c) => (
                <CandidateChip
                  key={`${keyPrefix}-${c.airport.iata}`}
                  candidate={c}
                  index={candidates.indexOf(c)}
                  selected={selected === c.airport.iata}
                  onSelect={() => onSelect(c.airport.iata)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
