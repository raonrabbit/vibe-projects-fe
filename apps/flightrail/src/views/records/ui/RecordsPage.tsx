"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getAirport } from "@/entities/airport";
import {
  deleteSession,
  formatDate,
  formatHM,
  getSessions,
  type Session,
  sessionDuration,
  sessionSeconds,
} from "@/entities/session";
import { AppHeader } from "@/widgets/app-header";

import { FlightHistoryMap } from "./FlightHistoryMap";

function heatOpacity(seconds: number, isFuture: boolean) {
  if (isFuture || seconds === 0) return 0.04;
  if (seconds < 1800) return 0.15;
  if (seconds < 3600) return 0.3;
  if (seconds < 7200) return 0.55;
  return 0.85;
}

function StatusBadge({ status }: { status: Session["arrival_status"] }) {
  const map = {
    ontime: { label: "정시", cls: "bg-sky-500/20 text-sky-400" },
    delayed: { label: "연착", cls: "bg-amber-500/20 text-amber-400" },
    emergency_landing: {
      label: "비상착륙",
      cls: "bg-rose-500/20 text-rose-400",
    },
  };
  const { label, cls } = map[status] ?? map.emergency_landing;
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.15em] uppercase ${cls}`}
    >
      {label}
    </span>
  );
}

function HeatmapCalendar({ sessions }: { sessions: Session[] }) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const weeks = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sessions) {
      const d = new Date(s.started_at);
      d.setHours(0, 0, 0, 0);
      const key = d.toLocaleDateString("en-CA");
      map.set(key, (map.get(key) ?? 0) + sessionSeconds(s));
    }

    const dayOfWeek = today.getDay();
    const gridStart = new Date(today);
    gridStart.setDate(today.getDate() - dayOfWeek - 51 * 7);

    return Array.from({ length: 52 }, (_, w) =>
      Array.from({ length: 7 }, (_, d) => {
        const date = new Date(gridStart);
        date.setDate(gridStart.getDate() + w * 7 + d);
        const key = date.toLocaleDateString("en-CA");
        return {
          key,
          seconds: map.get(key) ?? 0,
          isFuture: date > today,
        };
      }),
    );
  }, [sessions, today]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-6 py-5 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[10px] tracking-widest text-white/30 uppercase">
          비행 캘린더
        </p>
        <p className="text-[10px] text-white/20">최근 1년</p>
      </div>
      <div ref={scrollRef} className="fr-scrollbar overflow-x-auto">
        <div className="flex gap-[3px]" style={{ minWidth: "max-content" }}>
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((cell) => (
                <div
                  key={cell.key}
                  title={
                    cell.seconds > 0
                      ? `${cell.key}: ${formatHM(cell.seconds)}`
                      : cell.key
                  }
                  className="h-[10px] w-[10px] rounded-[2px] bg-sky-400"
                  style={{
                    opacity: heatOpacity(cell.seconds, cell.isFuture),
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5">
        <span className="text-[9px] text-white/20">적음</span>
        {[0.04, 0.15, 0.3, 0.55, 0.85].map((opacity, i) => (
          <div
            key={i}
            className="h-[10px] w-[10px] rounded-[2px] bg-sky-400"
            style={{ opacity }}
          />
        ))}
        <span className="text-[9px] text-white/20">많음</span>
      </div>
    </div>
  );
}

function TripRow({
  session,
  onDelete,
}: {
  session: Session;
  onDelete: () => void;
}) {
  const from = getAirport(session.departure_airport);
  const to = getAirport(session.destination_airport);

  return (
    <div className="flex items-center gap-3 border-b border-white/[0.04] py-3 last:border-0">
      <div className="w-14 flex-shrink-0 text-[11px] text-white/25">
        {formatDate(session.started_at)}
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex-shrink-0 text-center">
          <p className="text-[13px] leading-none font-bold text-white">
            {session.departure_airport}
          </p>
          <p className="mt-0.5 text-[9px] leading-none text-white/25">
            {from?.city ?? ""}
          </p>
        </div>
        <svg
          width="24"
          height="10"
          viewBox="0 0 24 10"
          fill="none"
          className="flex-shrink-0"
        >
          <line
            x1="0"
            y1="5"
            x2="18"
            y2="5"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path d="M18 5 l-4-2.5 l0 5 z" fill="rgba(255,255,255,0.18)" />
        </svg>
        <div className="flex-shrink-0 text-center">
          <p className="text-[13px] leading-none font-bold text-white">
            {session.destination_airport}
          </p>
          <p className="mt-0.5 text-[9px] leading-none text-white/25">
            {to?.city ?? ""}
          </p>
        </div>
        {session.subject && (
          <span className="ml-2 truncate text-[11px] text-sky-400/60">
            {session.subject}
          </span>
        )}
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <span className="text-[12px] text-white/40 tabular-nums">
          {sessionDuration(session)}
        </span>
        <StatusBadge status={session.arrival_status} />
        <button
          onClick={onDelete}
          className="p-1 text-white/20 transition-colors hover:text-rose-400"
          aria-label="삭제"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M2 2L10 10M10 2L2 10" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default function RecordsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data);
      setLoading(false);
    });
  }, []);

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    deleteSession(id).catch(() => {
      getSessions().then(setSessions);
    });
  };

  const totalSeconds = useMemo(
    () => sessions.reduce((sum, s) => sum + sessionSeconds(s), 0),
    [sessions],
  );

  const totalKm = Math.round((totalSeconds / 3600) * 900);

  const uniqueAirports = useMemo(
    () => new Set(sessions.map((s) => s.destination_airport)).size,
    [sessions],
  );

  const todaySeconds = useMemo(() => {
    const todayStr = new Date().toLocaleDateString("en-CA");
    return sessions
      .filter(
        (s) => new Date(s.started_at).toLocaleDateString("en-CA") === todayStr,
      )
      .reduce((sum, s) => sum + sessionSeconds(s), 0);
  }, [sessions]);

  const stats = [
    {
      label: "누적 비행 시간",
      value: loading ? "—" : formatHM(totalSeconds),
    },
    {
      label: "총 비행 거리",
      value: loading ? "—" : `${totalKm.toLocaleString()} km`,
    },
    {
      label: "방문 공항",
      value: loading ? "—" : `${uniqueAirports}곳`,
    },
    {
      label: "오늘 공부",
      value: loading ? "—" : formatHM(todaySeconds),
    },
  ];

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-fr-base">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fr-surface via-fr-base to-fr-deep" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_45%_at_50%_-10%,rgba(56,189,248,0.05),transparent)]" />

      <AppHeader active="records" />

      <div className="relative z-10 flex-1 space-y-4 px-5 py-10 sm:px-10">
        <div className="mb-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            비행 기록
          </h2>
          <p className="mt-1 text-[13px] text-white/30">
            지금까지의 공부 여행 요약
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.06] bg-black/20 px-5 py-5 backdrop-blur-sm"
            >
              <p className="text-2xl leading-none font-bold tracking-tight text-white tabular-nums">
                {value}
              </p>
              <p className="mt-1.5 text-[10px] tracking-widest text-white/30 uppercase">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Flight history map */}
        <FlightHistoryMap sessions={sessions} />

        {/* Heatmap calendar */}
        <HeatmapCalendar sessions={sessions} />

        {/* Trip list */}
        <div className="rounded-2xl border border-white/[0.06] bg-black/20 px-6 py-5 backdrop-blur-sm">
          <p className="mb-4 text-[10px] tracking-widest text-white/30 uppercase">
            여행 목록
          </p>
          {loading ? (
            <p className="py-6 text-center text-[13px] text-white/20">
              불러오는 중...
            </p>
          ) : sessions.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-white/20">
              아직 비행 기록이 없습니다. 첫 출발을 시작해보세요.
            </p>
          ) : (
            <div>
              {sessions.map((s) => (
                <TripRow
                  key={s.id}
                  session={s}
                  onDelete={() => handleDelete(s.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
