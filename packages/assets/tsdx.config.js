/* eslint-disable @typescript-eslint/no-var-requires */
const image = require('@rollup/plugin-image')
const url = require('@rollup/plugin-url')

module.exports = {
  rollup(config) {
    config.plugins.unshift(
      image({
        include: ["**/*.png", "**/*.svg"]
      }),
      url({
        include: ["**/*.ttf"],
        limit: Infinity,
        fileName: '[dirname][name][extname]',
      })
    )

    return config
  },
}
