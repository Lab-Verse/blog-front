import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

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
  webpack: (config) => {
    // pdfjs-dist optionally depends on 'canvas' (Node.js native); disable it
    config.resolve.alias.canvas = false
    return config
  },
  serverExternalPackages: ['pdfjs-dist'],
  images: {
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
      // Specific R2 public bucket
      {
        protocol: 'https',
        hostname: 'pub-b3abd4448aa7438db921404307c0e985.r2.dev',
        pathname: '/**',
      },
      // Production site (self-referencing images)
      {
        protocol: 'https',
        hostname: 'twa.com.pk',
        pathname: '/**',
      },
      // Production API server
      {
        protocol: 'https',
        hostname: 'api.twa.com.pk',
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
  async rewrites() {
    return [
      {
        source: '/r2-proxy/:path*',
        destination:
          'https://pub-b3abd4448aa7438db921404307c0e985.r2.dev/:path*',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
