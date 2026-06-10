import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    compress: true,
    transpilePackages: ["@vibe/ui"],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default nextConfig;
