

// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})
// Import the rest of our application.
module.exports = require('./server.js')
module.exports = require('./database/index.js')
/** Routers */
module.exports = require('./router/root/index.js')

setTimeout(function(){
    module.exports = require('./batchs/mqtt-startup.js')

},100)

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);