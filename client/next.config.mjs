/** @type {import('next').NextConfig} */
const nextConfig = {
  // Critical for Vercel deployment
  output: 'standalone',
  
  // Error handling during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // API route configuration
  experimental: {
    appDir: true,
  },
  
  // Image optimization
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
}

export default nextConfig