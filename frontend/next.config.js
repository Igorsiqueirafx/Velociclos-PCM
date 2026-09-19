/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
  async rewrites() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://velociclos-api.vercel.app'
    return [
      {
        source: '/api/articles',
        destination: `${backend}/api/articles`,
      },
      {
        source: '/api/certificates',
        destination: `${backend}/api/certificates`,
      },
      {
        source: '/api/courses',
        destination: `${backend}/api/courses`,
      },
      {
        source: '/api/courses/:courseId/modules',
        destination: `${backend}/api/courses/:courseId/modules`,
      },
    ]
  },
}

module.exports = nextConfig


