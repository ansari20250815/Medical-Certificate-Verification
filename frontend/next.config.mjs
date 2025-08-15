import { fileURLToPath } from 'url'
import path from 'path'

const basePath = process.env.NEXT_PUBLIC_BASE_PATH
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
  // Configure base path and asset prefix for production build
  basePath: basePath,
  assetPrefix: basePath,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Generates static HTML/CSS/JS files (i.e. client-side rendering) instead of requiring a Node.js server
  // Options:
  // - undefined (default): server-side rendering
  // - 'export': static HTML export / client-side rendering
  // - 'standalone': optimized production server
  output: undefined,

  // Image configuration
  // When true:
  // - No server-side image optimization
  // - No automatic responsive sizes
  // - Faster builds
  // - Always "true" for static exports / client-side rendering since optimization requires Node.js to work
  images: {
    unoptimized: true
  },

  // React Strict Mode setting (mostly apply for development)
  // When true:
  // - Double-renders components in development to find bugs
  // - Warns about deprecated features
  // - Enables additional runtime checks
  // - Recommended to be true unless you have specific reasons
  // When false:
  // - Single render in development
  // - Fewer warnings
  // - Less strict checks
  // - Might miss some potential bugs
  reactStrictMode: true,
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@emotion': path.resolve(__dirname, 'node_modules/@emotion'),
      '@mui': path.resolve(__dirname, 'node_modules/@mui'),
      '@tabler/icons-react': path.resolve(__dirname, 'node_modules/@tabler/icons-react'),
      i18next: path.resolve(__dirname, 'node_modules/i18next'),
      'next-auth': path.resolve(__dirname, 'node_modules/next-auth'),
      'react-hook-form': path.resolve(__dirname, 'node_modules/react-hook-form'),
      'react-i18next': path.resolve(__dirname, 'node_modules/react-i18next')
    }

    return config
  }
}

export default nextConfig
