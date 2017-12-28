import core from './core'
import resources from './resources'

//
// Initialize abstract API server with
// custom configuration
//
// See config/default.json & production.json
// for general config variables
//
const app = core.initializeAPI({
  //
  // Config
  //
  buildVars: {
    // Custom config overrides
    // (see: src/buildVars.js for defaults)
    myVar: true,
    test: 'asdf'
  },
  //
  // Mounted resources
  //
  // - resources/annotations
  // - resources/maps
  //
  resources,
  //
  // Middleware entry points:
  // preAuth, postAuth and postResource)
  //
  middleware: {
    // Pre auth middleware (optional)
    preAuth: null,
    // Post auth middleware (optional)
    postAuth: null,
    // Post resource middleware (optional)
    postResource: null
  }
})

process.on('unhandledRejection', (reason, p) =>
  process.stderr.write(`Unhandled Rejection at: Promise p:${p} reason:${reason}\n`))

app.listen(app.get('port')).on('listening', () => {
  const pkg = require('../package.json')
  process.stdout.write(`${pkg.productName || pkg.name} v${pkg.version} ` +
    `started on http://${app.get('host')}:${app.get('port')}\n\n`)
})

export default app
