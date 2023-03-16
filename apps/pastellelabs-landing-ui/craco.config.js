// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path')

// see https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview

module.exports = {
  babel: {
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator']
  },
  webpack: {
    plugins: [],
    // https://webpack.js.org/configuration
    configure: webpackConfig => ({
      ...webpackConfig,
      resolve: {
        ...webpackConfig.resolve,
        // alias: {
        //   react: path.resolve('./node_modules/react'),
        //   'react-dom': path.resolve('./node_modules/react-dom'),
        //   // adjust this path as needed depending on where your webpack config is
        //   'styled-components': path.resolve('./node_modules/styled-components')
        // },
        modules: [...webpackConfig.resolve.modules],
        fallback: {
          fs: false,
          os: false,
          tls: false,
          net: false,
          path: false,
          zlib: false,
          http: false,
          https: false,
          stream: false,
          crypto: false,
          assert: false
        }
      }
    })
  }
}
