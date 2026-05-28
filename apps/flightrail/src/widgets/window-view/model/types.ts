import type { Airport } from "@/entities/airport";

export interface LandResult {
    destination: Airport | null;
    fromAirport: Airport | undefined;
    arrivalStatus: "ontime" | "delayed" | "emergency_landing";
    elapsed: number;
    subject: string;
}

export type FlightPhase = "takeoff" | "climb" | "cruise" | "descent";
