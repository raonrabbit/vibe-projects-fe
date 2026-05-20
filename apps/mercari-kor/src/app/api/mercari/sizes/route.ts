import { NextResponse } from "next/server";
import { generateDPoP } from "@/shared/lib/dpop";
import type { SizeOption } from "@/shared/lib/mercari";

// Fallback sizes — IDs scraped from live Mercari JP item data (2025-05).
// /v2/sizes:search endpoint is currently 404; update these if item data diverges.
const FALLBACK_SIZES: SizeOption[] = [
    { id: 154, name: "XS(SS)", group: "의류" },
    { id: 2, name: "S", group: "의류" },
    { id: 3, name: "M", group: "의류" },
    { id: 4, name: "L", group: "의류" },
    { id: 5, name: "XL(LL)", group: "의류" },
    { id: 155, name: "2XL(3L)", group: "의류" },
    { id: 156, name: "3XL(4L)", group: "의류" },
    { id: 157, name: "4XL(5L)~", group: "의류" },
    { id: 7, name: "FREE SIZE", group: "의류" },
    { id: 146, name: "21cm", group: "신발" },
    { id: 148, name: "22cm", group: "신발" },
    { id: 16, name: "22.5cm", group: "신발" },
    { id: 17, name: "23cm", group: "신발" },
    { id: 18, name: "23.5cm", group: "신발" },
    { id: 19, name: "24cm", group: "신발" },
    { id: 20, name: "24.5cm", group: "신발" },
    { id: 21, name: "25cm", group: "신발" },
    { id: 22, name: "25.5cm", group: "신발" },
    { id: 9, name: "26cm", group: "신발" },
    { id: 10, name: "26.5cm", group: "신발" },
    { id: 11, name: "27cm", group: "신발" },
    { id: 12, name: "27.5cm", group: "신발" },
    { id: 13, name: "28cm", group: "신발" },
    { id: 138, name: "28.5cm", group: "신발" },
    { id: 139, name: "29cm", group: "신발" },
    { id: 141, name: "30cm", group: "신발" },
    { id: 56, name: "60cm", group: "키즈" },
    { id: 57, name: "70cm", group: "키즈" },
    { id: 58, name: "80cm", group: "키즈" },
    { id: 59, name: "90cm", group: "키즈" },
    { id: 40, name: "100cm", group: "키즈" },
    { id: 41, name: "110cm", group: "키즈" },
    { id: 42, name: "120cm", group: "키즈" },
    { id: 43, name: "130cm", group: "키즈" },
    { id: 44, name: "140cm", group: "키즈" },
    { id: 45, name: "150cm", group: "키즈" },
    { id: 55, name: "160cm", group: "키즈" },
];

export async function GET() {
    try {
        const url = "https://api.mercari.jp/v2/sizes:search";
        const dpop = await generateDPoP(url, "POST");

        const res = await fetch(url, {
            method: "POST",
            headers: {
                DPoP: dpop,
                "X-Platform": "web",
                "Content-Type": "application/json",
                Accept: "application/json",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            },
            body: JSON.stringify({ pageSize: 100, pageToken: "" }),
        });

        if (res.ok) {
            const data = await res.json();
            const apiSizes: SizeOption[] = (data.sizes ?? []).map(
                (s: {
                    id: number;
                    name: string;
                    parentSizeGroupName?: string;
                }) => ({
                    id: s.id,
                    name: s.name,
                    group: s.parentSizeGroupName ?? "기타",
                }),
            );
            if (apiSizes.length > 0) {
                return NextResponse.json({ sizes: apiSizes });
            }
        }
    } catch {
        // fall through to hardcoded
    }

    return NextResponse.json({ sizes: FALLBACK_SIZES });
}
