const {
  addWebpackPlugin,
  override,
  useBabelRc,
  useEslintRc,
} = require(`customize-cra`)
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = override(
  useBabelRc(),
  useEslintRc(),

  addWebpackPlugin(new ReactRefreshPlugin())
)
