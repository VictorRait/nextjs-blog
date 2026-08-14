import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
	cacheComponents: true,
	images: {
		remotePatterns: [
			{ hostname: "images.unsplash.com", protocol: "https", port: "" },
			{
				protocol: "https",
				hostname: "*.convex.cloud",
			},
		],
	},
};

export default nextConfig;
