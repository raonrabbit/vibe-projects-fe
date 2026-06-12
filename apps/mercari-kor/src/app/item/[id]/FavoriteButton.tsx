"use client";

import { useEffect, useMemo, useState } from "react";

import { createClient } from "@/shared/supabase/client";

interface Props {
  itemId: string;
  itemName: string;
  itemPrice: number;
  itemThumbnail: string;
}

export default function FavoriteButton({
  itemId,
  itemName,
  itemPrice,
  itemThumbnail,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkFavorite(uid: string) {
    const { data } = await supabase
      .from("favorites")
      .select("item_id")
      .eq("item_id", itemId)
      .eq("user_id", uid)
      .maybeSingle();
    setIsFavorited(!!data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) checkFavorite(uid);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) checkFavorite(uid);
      else setIsFavorited(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function toggle() {
    if (!userId || loading) return;
    setLoading(true);
    if (isFavorited) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("item_id", itemId)
        .eq("user_id", userId);
      if (!error) setIsFavorited(false);
    } else {
      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        item_id: itemId,
        item_name: itemName,
        item_price: itemPrice,
        item_thumbnail: itemThumbnail,
      });
      if (!error) setIsFavorited(true);
    }
    setLoading(false);
  }

  if (!userId) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all disabled:opacity-50 ${
        isFavorited
          ? "border-accent/30 bg-accent/15 text-accent"
          : "border-border bg-surface-raised text-text-secondary"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={isFavorited ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {isFavorited ? "관심 등록됨" : "관심 등록"}
    </button>
  );
}
