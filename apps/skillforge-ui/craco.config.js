// eslint-disable-next-line @typescript-eslint/no-var-requires
// const path = require('path')

// see https://github.com/gsoft-inc/craco/blob/master/packages/craco/README.md#configuration-overview
const webpack = require("webpack")

module.exports = {
  babel: {
    plugins: ['@babel/plugin-proposal-nullish-coalescing-operator']
  },
  webpack: {
    plugins: [],
    // https://webpack.js.org/configuration
    configure: config => {
      const fallback = config.resolve.fallback || {};
      Object.assign(fallback, {
        assert: require.resolve("assert"),
        crypto: require.resolve("crypto-browserify"),
        https: require.resolve("https-browserify"),
        stream: require.resolve("stream-browserify"),
        // path: require.resolve("path-browserify"),
        http: require.resolve("stream-http"),
        os: require.resolve("os-browserify"),
        url: require.resolve("url"),
        zlib: require.resolve("browserify-zlib")
      });
      config.resolve.fallback = fallback;
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        })
      ]); 
      config.ignoreWarnings = [/Failed to parse source map/];
      config.module.rules.push({
        test: /\.(ts|tsx|js|mjs|jsx)$/,
        enforce: "pre",
        loader: require.resolve("source-map-loader"),
        resolve: {
          fullySpecified: false,
        },
      });

      return config
    }
  }
}
