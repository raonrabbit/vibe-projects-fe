import { NextRequest, NextResponse } from "next/server";
import { generateDPoP, uuidv4 } from "@/shared/lib/dpop";

const BRANDS_URL = "https://api.mercari.jp/v2/brands:search";

async function fetchBrands(
    query: string,
): Promise<{ id: number; name: string }[]> {
    const dpop = await generateDPoP(BRANDS_URL, "POST");
    const res = await fetch(BRANDS_URL, {
        method: "POST",
        headers: {
            DPoP: dpop,
            "X-Platform": "web",
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        },
        body: JSON.stringify({
            query,
            pageSize: 50,
            pageToken: "",
            searchSessionId: uuidv4().replace(/-/g, ""),
        }),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        console.error(
            "[brands] search failed:",
            res.status,
            errText.slice(0, 200),
        );
        return [];
    }

    const data = await res.json();
    const raw: unknown[] = data.brands ?? [];
    return raw
        .map((b) => {
            const obj = b as Record<string, unknown>;
            return {
                id: Number(obj.id ?? 0),
                name: String(obj.name ?? obj.nameOfficial ?? ""),
            };
        })
        .filter((b) => b.id > 0 && b.name);
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";

    if (!q.trim()) return NextResponse.json({ brands: [] });

    const allBrands = await fetchBrands(q);

    if (allBrands.length > 0) return NextResponse.json({ brands: allBrands });

    // Fallback: popular brands list (no Mercari brand ID — search will use keyword)
    const fallback = POPULAR_BRANDS.filter((b) =>
        b.name.toLowerCase().includes(q.toLowerCase()),
    ).slice(0, 10);

    return NextResponse.json({ brands: fallback });
}

// Fallback: popular brands (id=0 means text-only search, no brand ID filter)
const POPULAR_BRANDS: { id: number; name: string }[] = [
    { id: 0, name: "Nike" },
    { id: 0, name: "Adidas" },
    { id: 0, name: "New Balance" },
    { id: 0, name: "Nigel Cabourn" },
    { id: 0, name: "North Face" },
    { id: 0, name: "Supreme" },
    { id: 0, name: "UNIQLO" },
    { id: 0, name: "Levi's" },
    { id: 0, name: "Carhartt" },
    { id: 0, name: "Stussy" },
    { id: 0, name: "BAPE" },
    { id: 0, name: "Stone Island" },
    { id: 0, name: "Arc'teryx" },
    { id: 0, name: "Patagonia" },
    { id: 0, name: "Champion" },
    { id: 0, name: "Comme des Garcons" },
    { id: 0, name: "Yohji Yamamoto" },
    { id: 0, name: "Issey Miyake" },
    { id: 0, name: "Undercover" },
    { id: 0, name: "Visvim" },
    { id: 0, name: "Needles" },
    { id: 0, name: "Engineered Garments" },
    { id: 0, name: "nonnative" },
    { id: 0, name: "Wtaps" },
    { id: 0, name: "Human Made" },
    { id: 0, name: "Kapital" },
    { id: 0, name: "Prada" },
    { id: 0, name: "Gucci" },
    { id: 0, name: "Louis Vuitton" },
    { id: 0, name: "Balenciaga" },
    { id: 0, name: "Burberry" },
    { id: 0, name: "Moncler" },
    { id: 0, name: "Canada Goose" },
    { id: 0, name: "Ralph Lauren" },
    { id: 0, name: "Tommy Hilfiger" },
    { id: 0, name: "Polo Ralph Lauren" },
    { id: 0, name: "Helmut Lang" },
    { id: 0, name: "Maison Margiela" },
    { id: 0, name: "Rick Owens" },
    { id: 0, name: "Off-White" },
    { id: 0, name: "Palm Angels" },
    { id: 0, name: "Kenzo" },
    { id: 0, name: "Sacai" },
    { id: 0, name: "Jil Sander" },
    { id: 0, name: "Acne Studios" },
    { id: 0, name: "A.P.C." },
    { id: 0, name: "Isabel Marant" },
    { id: 0, name: "Ami Paris" },
    { id: 0, name: "Raf Simons" },
    { id: 0, name: "Dries Van Noten" },
];
