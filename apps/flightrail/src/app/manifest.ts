import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flightrail",
    short_name: "Flightrail",
    description: "공부 시간을 비행 여행으로 기록하세요",
    start_url: "/",
    display: "standalone",
    background_color: "#0c1420",
    theme_color: "#0c1420",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
