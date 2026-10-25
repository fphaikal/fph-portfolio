/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Bisa diarahkan ke direktori lain untuk build verifikasi:
  //   NEXT_DIST_DIR=.next-build npx next build
  distDir: process.env.NEXT_DIST_DIR || '.next',
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
