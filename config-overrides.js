const {override, useBabelRc, useEslintRc} = require(`customize-cra`)

module.exports = override(useBabelRc(), useEslintRc())
