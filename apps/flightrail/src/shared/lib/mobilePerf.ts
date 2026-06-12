import { useMemo } from "react";

/** Returns true when running on a mobile/small-screen device. Computed once at mount. */
export function useIsMobile(): boolean {
  return useMemo(() => {
    if (typeof navigator === "undefined") return false;
    return (
      /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (typeof screen !== "undefined" && screen.width < 768)
    );
  }, []);
}
