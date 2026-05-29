export function AnalogClock({
    hour,
    size = 56,
}: {
    hour: number;
    size?: number;
}) {
    const n = ((hour % 24) + 24) % 24;
    const h12 = n % 12;
    const mins = (n % 1) * 60;
    const hourDeg = (h12 / 12) * 360 + (mins / 60) * 30;
    const minDeg = (mins / 60) * 360;

    const px = (len: number, deg: number) =>
        28 + len * Math.sin((deg * Math.PI) / 180);
    const py = (len: number, deg: number) =>
        28 - len * Math.cos((deg * Math.PI) / 180);

    return (
        <svg width={size} height={size} viewBox="0 0 56 56">
            <circle
                cx="28"
                cy="28"
                r="26"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                fill="rgba(0,0,0,0.15)"
            />
            {[0, 90, 180, 270].map((deg) => (
                <line
                    key={deg}
                    x1={px(20, deg)}
                    y1={py(20, deg)}
                    x2={px(23, deg)}
                    y2={py(23, deg)}
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                />
            ))}
            <line
                x1="28"
                y1="28"
                x2={px(14, hourDeg)}
                y2={py(14, hourDeg)}
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeOpacity="0.9"
            />
            <line
                x1="28"
                y1="28"
                x2={px(21, minDeg)}
                y2={py(21, minDeg)}
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeOpacity="0.6"
            />
            <circle cx="28" cy="28" r="2.5" fill="white" fillOpacity="0.9" />
        </svg>
    );
}
