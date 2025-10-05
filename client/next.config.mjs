/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: 'a3f8e9b2c7d4f6a1b8e3c9a2d5f7e8b1c4a9d6e3f8b2c7a1d4f6e9b8c3a2d5f7',
    NEXTAUTH_SECRET: 'e8b3c7a1d4f6e9b2c7a1d4f6e9b8c3a2d5f7e8b1c4a9d6e3f8b2c7a1d4f6e9b8',
    NEXTAUTH_URL: 'https://stock-pilot-inventory-management-sy-coral.vercel.app'
  },
  // Critical for Vercel deployment

  
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