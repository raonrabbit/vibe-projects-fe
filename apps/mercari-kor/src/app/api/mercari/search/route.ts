import { NextRequest, NextResponse } from "next/server";
import { searchMercari } from "@/shared/lib/mercari";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") ?? "";
    const pageToken = searchParams.get("pageToken") ?? "";
    const brandIdParam = searchParams.get("brandId") ?? "";
    const brandId = brandIdParam
        ? brandIdParam.split(",").map(Number).filter(Boolean)
        : [];
    const onSaleOnly = searchParams.get("onSaleOnly") === "true";

    if (!keyword.trim() && brandId.length === 0) {
        return NextResponse.json(
            { error: "keyword or brandId is required" },
            { status: 400 },
        );
    }

    try {
        const result = await searchMercari(
            keyword,
            pageToken,
            30,
            brandId,
            onSaleOnly,
        );
        return NextResponse.json(result);
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
