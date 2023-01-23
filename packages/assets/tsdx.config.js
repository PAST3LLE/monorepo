/* eslint-disable @typescript-eslint/no-var-requires */
// const svg = require('rollup-plugin-svg')
const image = require('@rollup/plugin-image')
const url = require('@rollup/plugin-url')

module.exports = {
  rollup(config) {
    config.plugins.unshift(
      image({
        include: ["**/*.png", "**/*.svg"]
      }),
      url({
        include: ["**/*.ttf"]
      })
    )

    return config
  },
}
