const path = require('path');
const { i18n } = require('./next-i18next.config');
const { withSentryConfig } = require('@sentry/nextjs');

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

const nextConfig = {
  i18n,
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  async redirects() {
    return [
      {
        source: '/pools/:id*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/account/:id*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/players/:id*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/prizes/:id*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/pods/:id*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/rewards/:id*',
        destination: '/',
        permanent: true,
      },
    ]
  },
  webpack(config, options) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@abis': path.resolve(__dirname, './src/abis'),
      '@atoms': path.resolve(__dirname, './src/atoms'),
      '@components': path.resolve(__dirname, './src/components'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@twabDelegator': path.resolve(__dirname, './src/tools/TwabDelegator'),
      '@twabRewards': path.resolve(__dirname, './src/tools/TwabRewards'),
      '@liquidator': path.resolve(__dirname, './src/tools/Liquidator'),
      '@tokenFaucet': path.resolve(__dirname, './src/tools/TokenFaucet')
    };
    return config
  }
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
