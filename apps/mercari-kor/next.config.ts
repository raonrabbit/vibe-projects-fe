import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "**.mercari.com" },
            { protocol: "https", hostname: "**.mercariimg.com" },
            { protocol: "https", hostname: "**.akamaihd.net" },
        ],
    },
};

export default nextConfig;
