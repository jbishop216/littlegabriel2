/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['bcryptjs'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side polyfills for node modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
      };
    }
    return config;
  },
};

module.exports = nextConfig;