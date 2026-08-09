/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'fph.my.id',
          },
        ],
        destination: 'https://www.fph.my.id/:path*',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
