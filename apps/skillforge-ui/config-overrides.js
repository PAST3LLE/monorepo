/* eslint-disable @typescript-eslint/no-var-requires */
/* config-overrides.js */
const webpack = require('webpack')
const fs = require('fs')

module.exports = {
  webpack(config) {
    const fallback = config.resolve.fallback || {}
    Object.assign(fallback, {
      assert: require.resolve('assert'),
      crypto: require.resolve('crypto-browserify'),
      https: require.resolve('https-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
      zlib: require.resolve('browserify-zlib')
    })
    config.resolve.fallback = fallback
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer']
      })
    ])
    config.ignoreWarnings = [/Failed to parse source map/]
    config.module.rules.push({
      test: /\.(ts|tsx|js|mjs|jsx)$/,
      enforce: 'pre',
      loader: require.resolve('source-map-loader'),
      resolve: {
        fullySpecified: false
      }
    })

    return config
  },

  // The function to use to create a webpack dev server configuration when running the development
  // server with 'npm run start' or 'yarn start'.
  // Example: set the dev server to use a specific certificate in https.
  devServer(configFunction) {
    // Return the replacement function for create-react-app to use to generate the Webpack
    // Development Server config. "configFunction" is the function that would normally have
    // been used to generate the Webpack Development server config - you can use it to create
    // a starting configuration to then modify instead of having to create a config from scratch.
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost)

      config.https = {
        key: fs.readFileSync(process.env.REACT_APP_HTTPS_KEY, 'utf8'),
        cert: fs.readFileSync(process.env.REACT_APP_HTTPS_CERT, 'utf8'),
        ca: fs.readFileSync(process.env.REACT_APP_HTTPS_CA, 'utf8'),
        passphrase: process.env.REACT_APP_HTTPS_PASS
      }

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }

      // Return your customised Webpack Development Server config.
      return config
    }
  }
}
