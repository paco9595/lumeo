import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'fmjxrdhqiklcgglddpme.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ishopmx.vtexassets.com',
      },
      {
        protocol: 'https',
        hostname: 'mixupmx.vtexassets.com',
      }
    ],
  },
};

export default nextConfig;
