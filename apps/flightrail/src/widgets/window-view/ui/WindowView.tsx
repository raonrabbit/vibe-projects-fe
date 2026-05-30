"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { formatDistance, formatElapsed } from "../model/flightUtils";
import { useAmbientAudio } from "../model/useAmbientAudio";
import { useFlightMap } from "../model/useFlightMap";
import { useFlightTimer } from "../model/useFlightTimer";
import { useLanding } from "../model/useLanding";
import { useSkyTime } from "../model/useSkyTime";
import { BoardingOverlay } from "./BoardingOverlay";
import { CabinLightControl } from "./CabinLightControl";
import { ClockPanel } from "./ClockPanel";
import { ControlsPill } from "./ControlsPill";
import { LandingResultOverlay } from "./LandingResultOverlay";
import type { CamOffset } from "./LiveMapCanvas";
import { MiniMap } from "./MiniMap";
import { PauseOverlay } from "./PauseOverlay";
import type { CabinLightMode } from "./WindowScene";

const WindowScene = dynamic(() => import("./WindowScene"), { ssr: false });
const LiveMapCanvas = dynamic(() => import("./LiveMapCanvas"), { ssr: false });

export default function WindowView() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const subject = searchParams.get("subject") ?? "";
    const from = searchParams.get("from") ?? "ICN";
    const to = searchParams.get("to");
    const plannedDuration = Number(searchParams.get("duration") ?? 7200);
    const hardStop = searchParams.get("hardStop") === "true";
    const resumeElapsed = Number(searchParams.get("elapsed") ?? 0);
    const isResuming = resumeElapsed > 0;

    const [phase, setPhase] = useState<"boarding" | "flying">(
        isResuming ? "flying" : "boarding",
    );
    const [departing, setDeparting] = useState(false);
    const [ready, setReady] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapPreloadDone, setMapPreloadDone] = useState(false);
    const [cabinMode, setCabinMode] = useState<CabinLightMode>("auto");
    const [volume, setVolume] = useState(1);
    const [showMiniMap, setShowMiniMap] = useState(true);
    const [miniMapClosing, setMiniMapClosing] = useState(false);

    const toggleMiniMap = () => {
        if (showMiniMap) {
            setMiniMapClosing(true);
            setTimeout(() => {
                setShowMiniMap(false);
                setMiniMapClosing(false);
            }, 200);
        } else {
            setShowMiniMap(true);
        }
    };
    const liveCameraOffsetRef = useRef<CamOffset | null>(null);

    const {
        elapsed,
        running,
        reachedGoal: _reachedGoal,
        setRunning,
    } = useFlightTimer(plannedDuration, isResuming, resumeElapsed);
    const {
        displayHour,
        isFixed,
        isAdjusted,
        modeLabel,
        handleToggleFixed,
        handleResetToLocal,
        handleBarDrag,
    } = useSkyTime();
    const { fromAirportData, mapDestination, mapProgress, mapProgressRate } =
        useFlightMap(from, to, elapsed, plannedDuration, hardStop);
    const { saving, landResult, handleLand } = useLanding({
        from,
        subject,
        plannedDuration,
        hardStop,
        elapsed,
        onPause: () => setRunning(false),
    });

    const handleSaveLater = () => {
        setRunning(false);
        localStorage.setItem(
            "flightrail:resumeFlight",
            JSON.stringify({
                from,
                to,
                subject,
                duration: plannedDuration,
                hardStop,
                elapsed,
                savedAt: Date.now(),
            }),
        );
        router.push("/");
    };

    useAmbientAudio(running, departing, volume);

    useEffect(() => {
        if (ready) setMapPreloadDone(true);
    }, [ready]);

    const zCls = showMap ? "z-30" : "z-10";

    const timerMain =
        elapsed < plannedDuration
            ? {
                  value: formatElapsed(plannedDuration - elapsed),
                  label: "착륙까지",
                  delayed: false,
              }
            : {
                  value: formatElapsed(elapsed - plannedDuration),
                  label: "연착 중",
                  delayed: true,
              };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 3D sky canvas */}
            <div
                className="absolute inset-0"
                style={showMap ? { display: "none" } : undefined}
            >
                <WindowScene
                    hour={displayHour}
                    cabinMode={cabinMode}
                    onReady={() => setReady(true)}
                />
            </div>

            {/* 3D map view */}
            {fromAirportData && mapDestination && (
                <div
                    style={
                        showMap
                            ? undefined
                            : mapPreloadDone
                              ? { display: "none" }
                              : {
                                    position: "absolute",
                                    inset: 0,
                                    opacity: 0,
                                    pointerEvents: "none",
                                }
                    }
                >
                    <LiveMapCanvas
                        fromLat={fromAirportData.lat}
                        fromLng={fromAirportData.lng}
                        toLat={mapDestination.lat}
                        toLng={mapDestination.lng}
                        progress={mapProgress}
                        progressRate={running ? mapProgressRate : 0}
                        hour={displayHour}
                        onClose={() => setShowMap(false)}
                        cameraSnapshotRef={liveCameraOffsetRef}
                        showRoute={true}
                    />
                </div>
            )}

            {/* Boarding overlay */}
            {phase === "boarding" && (
                <BoardingOverlay
                    from={from}
                    to={to ?? "—"}
                    subject={subject}
                    duration={plannedDuration}
                    hardStop={hardStop}
                    sceneReady={ready}
                    onTakeoff={() => setDeparting(true)}
                    onDepart={() => {
                        setPhase("flying");
                        setRunning(true);
                    }}
                    onCancel={() => router.push("/")}
                />
            )}

            {/* Pause overlay */}
            {phase === "flying" && !running && !saving && !landResult && (
                <PauseOverlay
                    elapsed={elapsed}
                    plannedDuration={plannedDuration}
                    onResume={() => setRunning(true)}
                    onLand={handleLand}
                    onSaveLater={handleSaveLater}
                />
            )}

            {saving && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
                    <p className="text-white/60 text-[13px] tracking-widest uppercase">
                        착륙 중...
                    </p>
                </div>
            )}

            {landResult && (
                <LandingResultOverlay
                    landResult={landResult}
                    from={from}
                    onHome={() => router.push("/")}
                />
            )}

            {/* Top-left: clock */}
            <div className={`absolute top-4 left-4 md:top-8 md:left-8 ${zCls}`}>
                <ClockPanel
                    displayHour={displayHour}
                    isFixed={isFixed}
                    isAdjusted={isAdjusted}
                    modeLabel={modeLabel}
                    onToggleFixed={handleToggleFixed}
                    onResetToLocal={handleResetToLocal}
                    onDrag={handleBarDrag}
                />
            </div>

            {/* Top-right: cabin light */}
            {ready && !showMap && !landResult && (
                <div
                    className={`absolute top-4 right-4 md:top-8 md:right-8 ${zCls}`}
                >
                    <CabinLightControl
                        cabinMode={cabinMode}
                        onCabinModeChange={setCabinMode}
                    />
                </div>
            )}

            {/* Bottom-left: mini-map + flight stats (collapsible) */}
            {ready && !landResult && (
                <div
                    className={`absolute bottom-4 left-4 md:bottom-8 md:left-8 ${zCls} flex flex-col items-start gap-1.5`}
                >
                    {/* Panel — appears above toggle button when open */}
                    {(showMiniMap || miniMapClosing) && (
                        <div
                            className={`flex flex-col md:flex-row items-start md:items-end gap-3 ${
                                miniMapClosing
                                    ? "animate-[fr-slide-down_200ms_ease-in_forwards]"
                                    : "animate-[fr-slide-up_200ms_ease-out]"
                            }`}
                        >
                            {/* Stats — first on mobile (above), second on desktop (right) */}
                            <div className="order-1 md:order-2 bg-black/20 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/8">
                                {subject && (
                                    <p className="text-[9px] text-sky-400/60 tracking-widest uppercase mb-1.5">
                                        {subject}
                                    </p>
                                )}
                                {mapDestination && (
                                    <>
                                        <p className="text-[10px] text-white/25 tracking-widest uppercase">
                                            목적지
                                        </p>
                                        <p className="text-sm font-bold text-white/70 tracking-tight leading-tight mt-0.5">
                                            {mapDestination.iata}
                                            <span className="text-[11px] font-normal text-white/35 ml-1">
                                                {mapDestination.city}
                                            </span>
                                        </p>
                                        <div className="h-px bg-white/8 my-2" />
                                    </>
                                )}
                                <p
                                    className={`text-lg font-bold tabular-nums tracking-tight leading-none ${
                                        timerMain.delayed
                                            ? "text-amber-400"
                                            : "text-white"
                                    }`}
                                >
                                    {timerMain.value}
                                </p>
                                <p className="text-[10px] text-white/35 mt-0.5 tracking-widest uppercase">
                                    {timerMain.label}
                                </p>
                                <div className="h-px bg-white/8 my-2" />
                                <p className="text-sm font-medium text-white/55 tabular-nums tracking-tight leading-none">
                                    {formatDistance(elapsed)}{" "}
                                    <span className="text-white/25">/</span>{" "}
                                    {formatDistance(plannedDuration)}
                                </p>
                                <p className="text-[10px] text-white/25 mt-0.5 tracking-widest uppercase">
                                    이동 거리
                                </p>
                            </div>
                            {/* MiniMap — second on mobile (below stats), first on desktop (left) */}
                            {fromAirportData && mapDestination && (
                                <div className="order-2 md:order-1">
                                    <MiniMap
                                        fromLat={fromAirportData.lat}
                                        fromLng={fromAirportData.lng}
                                        toLat={mapDestination.lat}
                                        toLng={mapDestination.lng}
                                        fromIata={fromAirportData.iata}
                                        toIata={mapDestination.iata}
                                        progress={mapProgress}
                                        showRoute={true}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Toggle button — always visible, opens and closes the panel */}
                    <button
                        onClick={toggleMiniMap}
                        className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm rounded-xl border border-white/8 hover:bg-white/8 transition-colors group"
                    >
                        <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeOpacity="0.45"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        {fromAirportData && mapDestination && (
                            <span className="text-white/55 text-[12px] font-medium group-hover:text-white/75 transition-colors">
                                {fromAirportData.iata} → {mapDestination.iata}
                            </span>
                        )}
                        <span
                            className={`text-[12px] font-bold tabular-nums ${
                                timerMain.delayed
                                    ? "text-amber-400/80"
                                    : "text-white/60"
                            }`}
                        >
                            {timerMain.value}
                        </span>
                        <svg
                            width="10"
                            height="6"
                            viewBox="0 0 10 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            className={`text-white/30 transition-transform duration-200 ${showMiniMap && !miniMapClosing ? "rotate-180" : ""}`}
                        >
                            <path d="M1 4.5L5 1.5L9 4.5" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Bottom-right: controls */}
            <div
                className={`absolute right-4 md:right-8 bottom-4 md:bottom-8 ${zCls}`}
            >
                <ControlsPill
                    showMap={showMap}
                    running={running}
                    volume={volume}
                    onToggleMap={() => setShowMap((s) => !s)}
                    onToggleRunning={() => setRunning((r) => !r)}
                    onVolumeChange={setVolume}
                />
            </div>
        </div>
    );
}
