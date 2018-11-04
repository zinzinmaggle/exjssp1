

// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})

// Import the rest of our application.
module.exports = require('./server.js')
module.exports = require('./database/index.js')

/** Controllers */
//module.exports = require('./controllers/root/index.js')

/** Services */
//module.exports = require('./services/root/index.js')

/** Routers */
module.exports = require('./router/root/index.js')