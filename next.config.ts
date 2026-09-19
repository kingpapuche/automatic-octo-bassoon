import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'yvkcledlmlkaxwacofkb.supabase.co',
      },
    ],
  },
  // Oude /guides-URL's (o.a. in Search Console ingediend) blijvend doorsturen naar /blog.
  async redirects() {
    return [
      { source: '/:locale/guides', destination: '/:locale/blog', permanent: true },
      { source: '/:locale/guides/:slug', destination: '/:locale/blog/:slug', permanent: true },
    ]
  },
};
export default nextConfig;
