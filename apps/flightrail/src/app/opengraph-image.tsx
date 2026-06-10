import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Flightrail — 공부 시간을 비행 여행으로 기록하세요";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
    return new ImageResponse(
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background:
                    "linear-gradient(160deg, #0c1a2e 0%, #0c1420 50%, #071020 100%)",
                fontFamily: "sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "800px",
                    height: "400px",
                    background:
                        "radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)",
                }}
            />
            {/* Plane icon */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(56,189,248,0.15)",
                    border: "1px solid rgba(56,189,248,0.3)",
                    marginBottom: "28px",
                    fontSize: "36px",
                }}
            >
                ✈
            </div>
            <div
                style={{
                    fontSize: "72px",
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-2px",
                    marginBottom: "16px",
                }}
            >
                Flightrail
            </div>
            <div
                style={{
                    fontSize: "28px",
                    color: "rgba(186,230,253,0.7)",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                }}
            >
                공부 시간을 비행 여행으로 기록하세요
            </div>
        </div>,
        { ...size },
    );
}
