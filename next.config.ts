import type { NextConfig } from "next"
import path from "path"

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: isDev,
  },
  images: {
    unoptimized: isDev,
  },
  experimental: {
    optimizeCss: !isDev,
    workerThreads: false,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      }
    }
    return config
  },
}

export default nextConfig
