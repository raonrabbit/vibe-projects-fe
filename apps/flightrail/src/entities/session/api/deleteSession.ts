import { supabase } from "@/shared/lib/supabase";

export async function deleteSession(id: string): Promise<void> {
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("로그인이 필요합니다.");

    const { data, error } = await supabase
        .from("sessions")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id)
        .select("id");

    if (error) throw error;
    if (!data || data.length === 0)
        throw new Error("삭제 실패: RLS DELETE 정책을 확인하세요.");
}
