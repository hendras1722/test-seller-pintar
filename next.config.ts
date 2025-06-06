import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
 
  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/seller-pintar/:path*',
          destination: 'https://test-fe.mysellerpintar.com/:path*',
        },
      ],
      beforeFiles: [
        {
          source: '/seller-pintar/:path*',
          destination: 'https://test-fe.mysellerpintar.com/:path*',
        },
      ],
      fallback: [
        {
          source: '/seller-pintar/:path*',
          destination: 'https://test-fe.mysellerpintar.com/:path*',
        },
      ],
    }
  },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  },
  poweredByHeader: false,
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
        },
        {
          key: 'Cache-Control',
          value: 'no-store',
        },
      ],
    },
  ],
  
}

export default nextConfig
