import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY' // Prevent clickjacking attacks
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff' // Prevent MIME type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin' // Control referrer information
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off' // Disable DNS prefetching for privacy
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()' // Restrict browser features
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // PayloadCMS admin needs inline scripts
              "style-src 'self' 'unsafe-inline'", // Allow inline styles for styling
              "img-src 'self' data: blob:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'", // Prevent embedding in frames
            ].join('; ')
          }
        ]
      }
    ]
  }
}

export default withPayload(nextConfig)
