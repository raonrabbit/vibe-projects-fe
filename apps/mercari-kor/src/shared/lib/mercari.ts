import { generateDPoP, uuidv4 } from "./dpop";

export interface MercariItem {
    id: string;
    name: string;
    price: number;
    thumbnails: string[];
    itemConditionId: number;
    itemCondition?: string;
    sellerId: string;
    status: string;
}

export interface BrandSuggestion {
    id: number;
    name: string;
}

export interface SearchResult {
    items: MercariItem[];
    nextPageToken: string;
    hasMore: boolean;
}

export interface MercariItemDetail {
    id: string;
    name: string;
    price: number;
    description: string;
    status: string;
    photos: string[];
    thumbnails: string[];
    item_condition: { id: number; name: string; subname: string };
    item_size?: { id: number; name: string };
    item_brand?: { id: number; name: string; sub_name: string };
    item_category?: {
        id: number;
        name: string;
        parent_category_name: string;
        root_category_name: string;
    };
    seller: {
        id: number;
        name: string;
        photo_thumbnail_url: string;
        num_sell_items: number;
        ratings: { good: number; normal: number; bad: number };
        num_ratings: number;
        score: number;
        quick_shipper: boolean;
        star_rating_score: number;
    };
    shipping_payer: { id: number; name: string; code: string };
    shipping_method: { id: number; name: string };
    shipping_from_area: { id: number; name: string };
    shipping_duration: { id: number; name: string };
    num_likes: number;
    num_comments: number;
    updated: number;
    created: number;
}

export async function getMercariItem(id: string): Promise<MercariItemDetail> {
    if (!id.startsWith("m")) {
        return getMercariShopsItem(id);
    }

    const { generateDPoP } = await import("./dpop");
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

    if (!res.ok) {
        throw new Error(`Mercari API error: ${res.status}`);
    }

    const data = await res.json();
    return data.data as MercariItemDetail;
}

async function getMercariShopsItem(id: string): Promise<MercariItemDetail> {
    const { generateDPoP } = await import("./dpop");
    const url = `https://api.mercari.jp/v1/marketplaces/shops/products/${id}?view=FULL&imageType=JPEG`;
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

    if (!res.ok) {
        throw new Error(`Mercari Shops API error: ${res.status}`);
    }

    const data = await res.json();
    const d = data.productDetail;
    const cats: {
        categoryId: string;
        displayName: string;
        hasChild: boolean;
    }[] = d.categories ?? [];
    const leaf = cats.find((c) => !c.hasChild);
    const nonLeaves = cats.filter((c) => c.hasChild);
    const parentCat = nonLeaves[nonLeaves.length - 2] ?? nonLeaves[0];
    const rootCat = nonLeaves[nonLeaves.length - 1] ?? nonLeaves[0];

    const isOnSale =
        d.variants?.some(
            (v: { quantity: string }) => parseInt(v.quantity) > 0,
        ) ?? true;

    return {
        id,
        name: data.displayName,
        price: parseInt(data.price, 10),
        description: d.description ?? "",
        status: isOnSale ? "on_sale" : "sold_out",
        photos: d.photos ?? [],
        thumbnails: [data.thumbnail],
        item_condition: {
            id: 0,
            name: d.condition?.displayName ?? "",
            subname: "",
        },
        item_brand: d.brand
            ? { id: 0, name: d.brand.displayName, sub_name: "" }
            : undefined,
        item_category: leaf
            ? {
                  id: parseInt(leaf.categoryId, 10),
                  name: leaf.displayName,
                  parent_category_name: parentCat?.displayName ?? "",
                  root_category_name: rootCat?.displayName ?? "",
              }
            : undefined,
        seller: {
            id: 0,
            name: d.shop?.displayName ?? "",
            photo_thumbnail_url: d.shop?.thumbnail ?? "",
            num_sell_items: parseInt(d.shop?.shopStats?.reviewCount ?? "0", 10),
            ratings: { good: 0, normal: 0, bad: 0 },
            num_ratings: parseInt(d.shop?.shopStats?.reviewCount ?? "0", 10),
            score: d.shop?.shopStats?.score ?? 0,
            quick_shipper: false,
            star_rating_score: d.shop?.shopStats?.score ?? 0,
        },
        shipping_payer: {
            id: parseInt(d.shippingPayer?.shippingPayerId ?? "0", 10),
            name: d.shippingPayer?.displayName ?? "",
            code: d.shippingPayer?.code ?? "",
        },
        shipping_method: {
            id: parseInt(d.shippingMethod?.shippingMethodId ?? "0", 10),
            name: d.shippingMethod?.displayName ?? "",
        },
        shipping_from_area: {
            id: 0,
            name: d.shippingFromArea?.displayName ?? "",
        },
        shipping_duration: {
            id: parseInt(d.shippingDuration?.shippingDurationId ?? "0", 10),
            name: d.shippingDuration?.displayName ?? "",
        },
        num_likes: 0,
        num_comments: 0,
        updated: Math.floor(new Date(data.updateTime).getTime() / 1000),
        created: Math.floor(new Date(data.createTime).getTime() / 1000),
    };
}

export async function searchMercari(
    keyword: string,
    pageToken = "",
    pageSize = 30,
    brandId: number[] = [],
    onSaleOnly = false,
): Promise<SearchResult> {
    const url = "https://api.mercari.jp/v2/entities:search";
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
        body: JSON.stringify({
            userId: "",
            pageSize,
            pageToken,
            searchSessionId: uuidv4().replace(/-/g, ""),
            indexRouting: "INDEX_ROUTING_UNSPECIFIED",
            thumbnailTypes: [],
            searchCondition: {
                keyword,
                excludeKeyword: "",
                sort: "SORT_SCORE",
                order: "ORDER_DESC",
                status: onSaleOnly
                    ? ["STATUS_ON_SALE"]
                    : ["STATUS_ON_SALE", "STATUS_SOLD_OUT"],
                sizeId: [],
                categoryId: [],
                brandId,
                sellerId: [],
                priceMin: 0,
                priceMax: 0,
                itemConditionId: [],
                shippingPayerId: [],
                shippingFromArea: [],
                shippingMethod: [],
                colorId: [],
                hasCoupon: false,
                attributes: [],
                itemTypes: [],
                skuIds: [],
            },
            defaultDatasets: [],
            serviceFrom: "suruga",
        }),
    });

    if (!res.ok) {
        throw new Error(`Mercari API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const nextPageToken = (data.meta?.nextPageToken as string) ?? "";
    const items: MercariItem[] = (data.items ?? []).map(
        (item: Record<string, unknown>) => ({
            id: item.id as string,
            name: item.name as string,
            price: item.price as number,
            thumbnails: (item.thumbnails as string[]) ?? [],
            itemConditionId: item.itemConditionId as number,
            sellerId: item.sellerId as string,
            status: item.status as string,
        }),
    );

    return {
        items,
        nextPageToken,
        hasMore: !!nextPageToken,
    };
}
