/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
    typedRoutes: true
  },
  images: {
    remotePatterns: []
  }
};

export default nextConfig;