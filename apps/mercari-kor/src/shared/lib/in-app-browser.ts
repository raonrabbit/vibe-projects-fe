/**
 * 카카오톡, 인스타그램 등 인앱 브라우저(WebView) 감지 및 외부 브라우저 열기 유틸리티
 *
 * Google OAuth는 WebView 환경을 정책적으로 차단합니다.
 * 인앱 브라우저 감지 후 외부 브라우저로 유도해야 합니다.
 */

export function isInAppBrowser(): boolean {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent;
    return /KAKAOTALK|Line\/|Instagram|FBAN|FBAV|NAVER\(|NaverSearch/i.test(ua);
}

export function isKakaoTalkBrowser(): boolean {
    if (typeof navigator === "undefined") return false;
    return /KAKAOTALK/i.test(navigator.userAgent);
}

/**
 * 현재 페이지를 외부 브라우저(기본 브라우저)로 엽니다.
 *
 * - 카카오톡: kakaotalk://web/openExternal 스킴 사용
 * - Android WebView: intent:// 스킴 사용
 * - 그 외: window.open fallback
 */
export function openInExternalBrowser(url: string): void {
    if (typeof window === "undefined") return;
    const ua = navigator.userAgent;

    if (/KAKAOTALK/i.test(ua)) {
        // 카카오톡 공식 외부 브라우저 열기 스킴
        window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
        return;
    }

    if (/Android/i.test(ua)) {
        // Android 인앱 브라우저 → intent URL로 기본 브라우저 호출
        const intentUrl = `intent://${url.replace(/^https?:\/\//, "")}#Intent;scheme=https;action=android.intent.action.VIEW;end`;
        window.location.href = intentUrl;
        return;
    }

    // iOS 및 기타: 새 탭으로 열기 (Safari 등 기본 브라우저가 열릴 수 있음)
    window.open(url, "_blank");
}
