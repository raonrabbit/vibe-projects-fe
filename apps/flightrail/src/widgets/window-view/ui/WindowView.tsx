"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAmbientAudio } from "../model/useAmbientAudio";
import { useFlightMap } from "../model/useFlightMap";
import { useFlightTimer } from "../model/useFlightTimer";
import { useLanding } from "../model/useLanding";
import { useSkyTime } from "../model/useSkyTime";
import { BoardingOverlay } from "./BoardingOverlay";
import { ClockPanel } from "./ClockPanel";
import { ControlsPill } from "./ControlsPill";
import { FlightStatsPanel } from "./FlightStatsPanel";
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

    const [phase, setPhase] = useState<"boarding" | "flying">("boarding");
    const [ready, setReady] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [mapPreloadDone, setMapPreloadDone] = useState(false);
    const [cabinMode, setCabinMode] = useState<CabinLightMode>("auto");
    const [volume, setVolume] = useState(1);
    const liveCameraOffsetRef = useRef<CamOffset | null>(null);

    const { elapsed, running, reachedGoal, setRunning } = useFlightTimer(
        plannedDuration,
        false,
    );
    const {
        displayHour,
        timeMode,
        modeLabel,
        handleModeChange,
        handleBarDrag,
    } = useSkyTime(elapsed);
    const { fromAirportData, mapDestination, mapProgress, mapProgressRate } =
        useFlightMap(from, to, elapsed);
    const { saving, landResult, handleLand } = useLanding({
        from,
        subject,
        plannedDuration,
        hardStop,
        elapsed,
        onPause: () => setRunning(false),
    });

    useAmbientAudio(running, volume);

    useEffect(() => {
        if (ready) setMapPreloadDone(true);
    }, [ready]);

    const zCls = showMap ? "z-30" : "z-10";

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

            {/* Mini-map overlay */}
            {ready && !landResult && fromAirportData && mapDestination && (
                <div className={`absolute bottom-8 left-8 ${zCls}`}>
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

            {/* Boarding overlay — covers canvas during pre-flight, fades on depart */}
            {phase === "boarding" && (
                <BoardingOverlay
                    from={from}
                    to={to ?? "—"}
                    subject={subject}
                    duration={plannedDuration}
                    hardStop={hardStop}
                    sceneReady={ready}
                    onDepart={() => {
                        setPhase("flying");
                        setRunning(true);
                    }}
                    onCancel={() => router.push("/")}
                />
            )}

            {/* Overlays */}
            {phase === "flying" && !running && !saving && !landResult && (
                <PauseOverlay
                    elapsed={elapsed}
                    plannedDuration={plannedDuration}
                    onResume={() => setRunning(true)}
                    onLand={handleLand}
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
            <div className={`absolute top-8 left-8 ${zCls}`}>
                <ClockPanel
                    displayHour={displayHour}
                    timeMode={timeMode}
                    modeLabel={modeLabel}
                    onModeChange={handleModeChange}
                    onDrag={handleBarDrag}
                />
            </div>

            {/* Top-right: flight stats */}
            <div className={`absolute top-8 right-8 ${zCls}`}>
                <FlightStatsPanel
                    subject={subject}
                    mapDestination={mapDestination}
                    elapsed={elapsed}
                    plannedDuration={plannedDuration}
                    reachedGoal={reachedGoal}
                />
            </div>

            {/* Right: controls */}
            <div
                className={`absolute right-8 top-1/2 -translate-y-1/2 ${zCls}`}
            >
                <ControlsPill
                    showMap={showMap}
                    running={running}
                    volume={volume}
                    cabinMode={cabinMode}
                    onToggleMap={() => setShowMap((s) => !s)}
                    onToggleRunning={() => setRunning((r) => !r)}
                    onVolumeChange={setVolume}
                    onCabinModeChange={setCabinMode}
                />
            </div>
        </div>
    );
}
