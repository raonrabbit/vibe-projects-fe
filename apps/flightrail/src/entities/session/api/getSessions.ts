import { supabase } from "@/shared/lib/supabase";

export interface Session {
    id: string;
    mode: "free" | "planned";
    subject: string;
    departure_airport: string;
    destination_airport: string;
    started_at: string;
    ended_at: string;
    planned_duration: number | null;
    arrival_status: "ontime" | "delayed" | "abandoned";
}

export async function getSessions(): Promise<Session[]> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from("sessions")
        .select(
            "id, mode, subject, departure_airport, destination_airport, started_at, ended_at, planned_duration, arrival_status",
        )
        .eq("user_id", user.id)
        .order("started_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch sessions:", error);
        return [];
    }

    return data ?? [];
}
