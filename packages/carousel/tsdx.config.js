const image = require('@rollup/plugin-image')
const svg = require('rollup-plugin-svg')

module.exports = {
  rollup(config) {
    config.plugins.unshift(image())
    config.plugins.push(svg())
    return config
  },
}
