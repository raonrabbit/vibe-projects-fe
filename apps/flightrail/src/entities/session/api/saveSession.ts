import { supabase } from "@/shared/lib/supabase";

interface SaveSessionInput {
    mode: "free" | "planned";
    subject: string;
    departureAirport: string;
    destinationAirport: string;
    startedAt: Date;
    endedAt: Date;
    plannedDuration?: number;
    arrivalStatus: "ontime" | "delayed" | "abandoned";
}

export async function saveSession(input: SaveSessionInput): Promise<boolean> {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { error } = await supabase.from("sessions").insert({
        user_id: user.id,
        mode: input.mode,
        subject: input.subject,
        departure_airport: input.departureAirport,
        destination_airport: input.destinationAirport,
        started_at: input.startedAt.toISOString(),
        ended_at: input.endedAt.toISOString(),
        planned_duration: input.plannedDuration ?? null,
        arrival_status: input.arrivalStatus,
    });

    if (error) {
        console.error("Failed to save session:", error);
        return false;
    }

    return true;
}
