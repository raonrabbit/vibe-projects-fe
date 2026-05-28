import { CabinLightControl } from "./CabinLightControl";
import { LeftTooltip } from "./LeftTooltip";
import { VolumeControl } from "./VolumeControl";
import type { CabinLightMode } from "./WindowScene";

const BTN_CLS =
    "w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors";

interface Props {
    showMap: boolean;
    running: boolean;
    volume: number;
    cabinMode: CabinLightMode;
    onToggleMap: () => void;
    onToggleRunning: () => void;
    onVolumeChange: (v: number) => void;
    onCabinModeChange: (m: CabinLightMode) => void;
}

export function ControlsPill({
    showMap,
    running,
    volume,
    cabinMode,
    onToggleMap,
    onToggleRunning,
    onVolumeChange,
    onCabinModeChange,
}: Props) {
    return (
        <div className="bg-black/20 backdrop-blur-md rounded-2xl flex flex-col divide-y divide-white/8">
            <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />

            {/* Globe / Window toggle */}
            <div className="relative group">
                <button className={BTN_CLS} onClick={onToggleMap}>
                    {showMap ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeOpacity="0.65"
                        >
                            <rect x="3" y="3" width="18" height="18" rx="4" />
                            <path d="M3 9h18M9 9v12" />
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeOpacity="0.65"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    )}
                </button>
                <LeftTooltip label={showMap ? "창문 뷰" : "지도"} />
            </div>

            {/* Pause / Play */}
            <div className="relative group">
                <button
                    className={`${BTN_CLS} ${showMap ? "rounded-b-2xl" : ""}`}
                    onClick={onToggleRunning}
                >
                    {running ? (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                            fillOpacity="0.65"
                        >
                            <rect x="6" y="4" width="4" height="16" rx="1" />
                            <rect x="14" y="4" width="4" height="16" rx="1" />
                        </svg>
                    ) : (
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                            fillOpacity="0.65"
                        >
                            <polygon points="5,3 19,12 5,21" />
                        </svg>
                    )}
                </button>
                <LeftTooltip label={running ? "일시정지" : "재생"} />
            </div>

            {/* Cabin light (only in window mode) */}
            {!showMap && (
                <CabinLightControl
                    cabinMode={cabinMode}
                    onCabinModeChange={onCabinModeChange}
                />
            )}
        </div>
    );
}
