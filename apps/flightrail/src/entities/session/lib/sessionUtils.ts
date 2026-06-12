import type { Session } from "../api/getSessions";

export function formatHM(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function formatDate(isoStr: string) {
  return new Date(isoStr).toLocaleDateString("ko-KR", {
    month: "short",
    day: "numeric",
  });
}

export function sessionSeconds(s: Session) {
  return (
    (new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000
  );
}

export function sessionDuration(s: Session) {
  return formatHM(sessionSeconds(s));
}
