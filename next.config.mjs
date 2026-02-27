/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      '@headlessui/react',
      '@hugeicons/react',
      '@hugeicons/core-free-icons',
      'framer-motion',
      '@tiptap/react',
      '@tiptap/starter-kit',
      'react-aria',
      'react-stately',
    ],
  },
  images: {
    unoptimized: true, // Use unoptimized images to avoid _next/image proxy 404s on production
    minimumCacheTTL: 2678400 * 6, // 3 months
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      // Cloudflare R2 storage (backend uploads)
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev',
        pathname: '/**',
      },
      // Local API server
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
