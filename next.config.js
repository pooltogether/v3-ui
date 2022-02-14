const chalk = require("chalk")
const _ = require('lodash')

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
  generateEtags: false,
  images: {
    disableStaticImages: true, // disable next/image so images are imported properly for `next export`
  },
  async redirects() {
    return [
      {
        source: '/prizes',
        destination: '/prizes/mainnet/PT-cDAI',
        permanent: true,
      },
      {
        source: '/',
        destination: '/pools',
        permanent: false,
      }
    ]
  },
  publicRuntimeConfig: {
    locizeProjectId: process.env.NEXT_PUBLIC_LOCIZE_PROJECT_ID,
    locizeApiKey: process.env.NEXT_PUBLIC_LOCIZE_DEV_API_KEY,
    locizeVersion: process.env.NEXT_PUBLIC_LOCIZE_VERSION
  },
  webpack(config, options) {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.png/,
            type: 'asset/resource'
          },
          {
            test: /\.svg/,
            type: 'asset/resource'
          }
        ]
      }
    }
  }
}

console.log('')
console.log(chalk.green('Using next.js config options:'))
console.log(nextConfig)
console.log('')

module.exports = nextConfig
