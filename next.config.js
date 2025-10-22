const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enhanced image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qgyboabomydquodygomq.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Enhanced experimental features for performance
  experimental: {
    optimizePackageImports: [
      'lucide-react', 
      'recharts', 
      '@heroicons/react',
      'framer-motion',
      'react-hot-toast',
      'date-fns',
    ],
    optimizeCss: true,
    scrollRestoration: true,
    esmExternals: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              priority: -5,
              reuseExistingChunk: true,
            },
            // Separate chunks for large libraries
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 10,
              chunks: 'all',
            },
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: 'recharts',
              priority: 10,
              chunks: 'all',
            },
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 10,
              chunks: 'all',
            },
          },
        },
      };
    }

    // Tree shaking optimization
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    // Module resolution optimization
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    };

    return config;
  },

  // Enhanced compression
  compress: true,

  // Performance optimizations
  poweredByHeader: false,
  generateEtags: false,

  // CORS headers for development
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
      // Security headers
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
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Performance headers
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO and performance
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/',
        permanent: true,
      },
    ];
  },

  // Rewrites for API optimization
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/check',
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL:
      process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Output configuration
  output: 'standalone',
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Trailing slash configuration
  trailingSlash: false,

  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.CDN_URL : '',

  // Build ID for cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
