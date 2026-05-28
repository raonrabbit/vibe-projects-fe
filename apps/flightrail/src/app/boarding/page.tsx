import { redirect } from "next/navigation";

export default async function BoardingRoute({
    searchParams,
}: {
    searchParams: Promise<Record<string, string>>;
}) {
    const params = await searchParams;
    const qs = new URLSearchParams(params).toString();
    redirect(qs ? `/timer?${qs}` : "/");
}
