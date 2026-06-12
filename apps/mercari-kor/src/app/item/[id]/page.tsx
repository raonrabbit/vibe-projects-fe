import Link from "next/link";
import { notFound } from "next/navigation";

import { Chip } from "@/entities/item/ui/Chip";
import { InfoRow } from "@/entities/item/ui/InfoRow";
import { getMercariItem } from "@/shared/lib/mercari";

import BackButton from "./BackButton";
import FavoriteButton from "./FavoriteButton";
import ImageGallery from "./ImageGallery";
import ShareButton from "./ShareButton";

export default async function ItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let item;
  try {
    item = await getMercariItem(id);
  } catch {
    notFound();
  }

  const isOnSale = item.status === "on_sale";
  const createdDate = new Date(item.created * 1000).toLocaleDateString("ko-KR");

  return (
    <main className="min-h-screen bg-bg p-4 text-text-primary sm:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-3">
          <BackButton />
          <span className="text-border">|</span>
          <Link
            href="/"
            className="text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            Merkori
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ImageGallery photos={item.photos} />

          <div className="flex flex-col gap-4">
            {!isOnSale && (
              <span className="inline-flex items-center self-start rounded-full border border-error/30 bg-error-subtle px-2.5 py-1 text-xs font-semibold text-error">
                판매 종료
              </span>
            )}

            <h1 className="text-lg leading-snug font-bold text-text-primary">
              {item.name}
            </h1>

            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-accent">
                ¥{item.price.toLocaleString()}
              </span>
              <span className="text-xs text-text-secondary">(세금 포함)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {item.item_condition && <Chip label={item.item_condition.name} />}
              {item.item_size && (
                <Chip label={`사이즈 ${item.item_size.name}`} />
              )}
              {item.item_brand && <Chip label={item.item_brand.name} primary />}
              {item.item_category && (
                <Chip
                  label={`${item.item_category.root_category_name} > ${item.item_category.parent_category_name} > ${item.item_category.name}`}
                />
              )}
            </div>

            <div className="flex gap-2">
              <FavoriteButton
                itemId={item.id}
                itemName={item.name}
                itemPrice={item.price}
                itemThumbnail={item.thumbnails?.[0] ?? ""}
              />
              <ShareButton
                mercariUrl={
                  id.startsWith("m")
                    ? `https://jp.mercari.com/item/${item.id}`
                    : `https://jp.mercari.com/shops/product/${item.id}`
                }
              />
              <a
                href={
                  id.startsWith("m")
                    ? `https://jp.mercari.com/item/${item.id}`
                    : `https://jp.mercari.com/shops/product/${item.id}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                메루카리에서 보기 →
              </a>
            </div>

            <div className="flex items-center gap-1.5 text-text-secondary">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="text-sm">{item.num_likes}명이 좋아요</span>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4">
              <p className="mb-2 text-xs font-semibold text-text-secondary">
                상품 설명
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-text-primary">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
              <p className="mb-1 text-xs font-semibold text-text-secondary">
                배송 정보
              </p>
              <InfoRow label="배송비" value={item.shipping_payer.name} />
              <InfoRow label="배송 방법" value={item.shipping_method.name} />
              <InfoRow label="발송 지역" value={item.shipping_from_area.name} />
              <InfoRow label="발송 기간" value={item.shipping_duration.name} />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.seller.photo_thumbnail_url}
                alt=""
                className="h-10 w-10 flex-shrink-0 rounded-full border border-border"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text-primary">
                  {item.seller.name}
                </p>
                <p className="text-xs text-text-secondary">
                  평점 {item.seller.star_rating_score} · 판매{" "}
                  {item.seller.num_sell_items}건
                  {item.seller.quick_shipper && " · 빠른 발송"}
                </p>
              </div>
            </div>

            <p className="text-xs text-text-secondary">등록일: {createdDate}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
