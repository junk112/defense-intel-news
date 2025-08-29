/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  // 開発時のファイル変更監視を改善
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // HTMLファイルを静的に提供するための設定
  async rewrites() {
    return [
      {
        source: '/raw/:slug*',
        destination: '/api/raw/:slug*',
      },
    ];
  },
}

module.exports = nextConfig