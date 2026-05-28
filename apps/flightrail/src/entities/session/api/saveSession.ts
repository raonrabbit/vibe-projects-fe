import { supabase } from "@/shared/lib/supabase";

interface SaveSessionInput {
    subject: string;
    departureAirport: string;
    destinationAirport: string;
    startedAt: Date;
    endedAt: Date;
    plannedDuration: number;
    hardStop: boolean;
    arrivalStatus: "ontime" | "delayed" | "emergency_landing";
}

export async function saveSession(input: SaveSessionInput): Promise<boolean> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase.from("sessions").insert({
        user_id: user.id,
        subject: input.subject,
        departure_airport: input.departureAirport,
        destination_airport: input.destinationAirport,
        started_at: input.startedAt.toISOString(),
        ended_at: input.endedAt.toISOString(),
        planned_duration: input.plannedDuration,
        hard_stop: input.hardStop,
        arrival_status: input.arrivalStatus,
    });

    if (error) {
        console.error("Failed to save session:", error);
        return false;
    }

    return true;
}
