import { NextRequest, NextResponse } from "next/server";

import { generateDPoP } from "@/shared/lib/dpop";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const url = `https://api.mercari.jp/items/get?id=${id}`;
  const dpop = await generateDPoP(url, "GET");

  const res = await fetch(url, {
    method: "GET",
    headers: {
      DPoP: dpop,
      "X-Platform": "web",
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    },
  });

  const text = await res.text();

  if (!res.ok) {
    return NextResponse.json(
      { error: `Mercari API error: ${res.status}`, body: text },
      { status: res.status },
    );
  }

  return NextResponse.json(JSON.parse(text));
}
