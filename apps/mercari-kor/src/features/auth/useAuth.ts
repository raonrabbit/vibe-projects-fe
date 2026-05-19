"use client";

import { useState, useEffect, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/shared/supabase/client";
import {
    isInAppBrowser,
    openInExternalBrowser,
} from "@/shared/lib/in-app-browser";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [inAppBrowser] = useState(isInAppBrowser);
    const supabase = useMemo(() => createClient(), []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, [supabase]);

    async function signIn() {
        // 카카오톡 등 인앱 브라우저에서는 Google OAuth가 차단됩니다.
        // 외부 브라우저(기본 브라우저)로 리다이렉트하여 로그인을 유도합니다.
        if (isInAppBrowser()) {
            openInExternalBrowser(window.location.href);
            return;
        }

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback` },
        });
    }

    async function signOut() {
        await supabase.auth.signOut();
    }

    return { user, supabase, signIn, signOut, inAppBrowser };
}
