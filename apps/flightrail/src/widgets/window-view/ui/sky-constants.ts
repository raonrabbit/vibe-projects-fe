import * as THREE from "three";

import type { TimeOfDay } from "@/shared/lib/sky-time";

export function lerpN(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function lerpColor(a: string, b: string, t: number): string {
    return new THREE.Color(a).lerp(new THREE.Color(b), t).getStyle();
}

export const SKY_PARAMS: Record<
    TimeOfDay,
    {
        turbidity: number;
        rayleigh: number;
        mieCoefficient: number;
        mieDirectionalG: number;
    }
> = {
    night: {
        turbidity: 20,
        rayleigh: 0.57,
        mieCoefficient: 0.038,
        mieDirectionalG: 0.0,
    },
    dawn: {
        turbidity: 10,
        rayleigh: 3.0,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
    },
    morning: {
        turbidity: 1.0,
        rayleigh: 0.01,
        mieCoefficient: 0.002,
        mieDirectionalG: 0.9,
    },
    day: {
        turbidity: 1.0,
        rayleigh: 0.01,
        mieCoefficient: 0.002,
        mieDirectionalG: 0.9,
    },
    evening: {
        turbidity: 6.0,
        rayleigh: 1.5,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
    },
    dusk: {
        turbidity: 12,
        rayleigh: 0.5,
        mieCoefficient: 0.02,
        mieDirectionalG: 0.0,
    },
};

export const HEMI_LIGHT: Record<
    TimeOfDay,
    { sky: string; ground: string; intensity: number }
> = {
    night: { sky: "#1a2540", ground: "#050810", intensity: 0.7 },
    dawn: { sky: "#ff8c40", ground: "#201008", intensity: 0.85 },
    morning: { sky: "#87ceeb", ground: "#8b8b6b", intensity: 1.6 },
    day: { sky: "#87ceeb", ground: "#8b8b6b", intensity: 1.6 },
    evening: { sky: "#ff6020", ground: "#201008", intensity: 1.0 },
    dusk: { sky: "#4020a0", ground: "#100818", intensity: 0.6 },
};

export const FOG_COLORS: Record<TimeOfDay, string> = {
    night: "#020810",
    dawn: "#c07840",
    morning: "#70b0e0",
    day: "#70b0e0",
    evening: "#c06030",
    dusk: "#302050",
};

export const NIGHT_FACTOR: Record<TimeOfDay, number> = {
    night: 1,
    dawn: 0.25,
    morning: 0,
    day: 0,
    evening: 0.05,
    dusk: 0.55,
};

export const AMBIENT_INTENSITY: Record<TimeOfDay, number> = {
    night: 0.3,
    dawn: 0.4,
    morning: 0.75,
    day: 0.75,
    evening: 0.65,
    dusk: 0.3,
};

export const SKY_GLOW: Record<TimeOfDay, string> = {
    night: "#0c1628",
    dawn: "#e06830",
    morning: "#88b8f0",
    day: "#88b8f0",
    evening: "#e08820",
    dusk: "#3818a0",
};

export const OCEAN_TILE_W = 400;
export const OCEAN_SPEED = 1;
export const OCEAN_TILE_XS = [-OCEAN_TILE_W, 0, OCEAN_TILE_W] as const;
