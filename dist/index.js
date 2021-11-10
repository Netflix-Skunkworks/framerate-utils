
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./framerate-utils.cjs.production.min.js')
} else {
  module.exports = require('./framerate-utils.cjs.development.js')
}
