'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = undefined;

var _coreApi = require('./core-api');

var _coreApi2 = _interopRequireDefault(_coreApi);

var _resources = require('./resources');

var resources = _interopRequireWildcard(_resources);

var _buildVars = require('./build-vars');

var _buildVars2 = _interopRequireDefault(_buildVars);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const serviceResources = {
  annotations: resources.annotation,
  maps: resources.map
};

const systemResources = {
  users: resources.user

  /**
   * libmb-feathers-api v1.0.0
   *
   * Initialize abstract API server with
   * custom configuration
   *
   * See config/default.json & production.json
   * for general config variables
   **/
};const app = _coreApi2.default.factory({
  /**
   * System related basic resources
   *
   * - resources/users -> /users
   */
  systemResources,
  /**
   * Build Variables (see: src/buildVars.js)
   **/
  buildVars: {
    myVar: true,
    test: 'asdf'
  },
  /**
   * Services: Resources (mounted as endpoints)
   *
   * - resources/annotations -> /annotations
   * - resources/maps        -> /maps
   **/
  serviceResources,
  /**
   * Custom Middleware (Optional entry points)
   **/
  middleware: {
    /** Pre auth middleware (optional) **/
    preAuth: null,
    /** Post auth middleware (optional) **/
    postAuth: null,
    /** Post resource middleware (optional) **/
    postResource: null
  }
}, (0, _buildVars2.default)());

process.on('unhandledRejection', (reason, p) => process.stderr.write(`Unhandled Rejection at: Promise p:${p} reason:${reason}\n`));

app.listen(app.get('port')).on('listening', () => {
  const pkg = require('../package.json');
  process.stdout.write(`${pkg.productName || pkg.name} v${pkg.version} ` + `started on http://${app.get('host')}:${app.get('port')}\n\n`);
});

exports.app = app;