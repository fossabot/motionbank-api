'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.app = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _httpProxyMiddleware = require('http-proxy-middleware');

var _httpProxyMiddleware2 = _interopRequireDefault(_httpProxyMiddleware);

var _feathers = require('@feathersjs/feathers');

var _feathers2 = _interopRequireDefault(_feathers);

var _configuration = require('@feathersjs/configuration');

var _configuration2 = _interopRequireDefault(_configuration);

var _express = require('@feathersjs/express');

var _express2 = _interopRequireDefault(_express);

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _services = require('./services');

var _services2 = _interopRequireDefault(_services);

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _persistence = require('./persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _base = require('./base');

var _resources = require('./resources');

var resources = _interopRequireWildcard(_resources);

var _buildVars = require('./build-vars');

var _buildVars2 = _interopRequireDefault(_buildVars);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') {
  _hooks.logger.level = 'debug';
}

const app = (0, _express2.default)((0, _feathers2.default)());
app.configure((0, _configuration2.default)());

const options = {
  buildVars: (0, _buildVars2.default)(),
  basePath: _path2.default.join(__dirname, '..', '..'),
  logger: _hooks.logger
};
app.set('appconf', options);
const serviceOptions = app.get('services');

/**
 * Basics
 */
app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());
app.use((0, _compression2.default)());
app.use(_express2.default.json());
app.use(_express2.default.urlencoded({ extended: true }));
app.use((0, _serveFavicon2.default)(_path2.default.join(app.get('public'), 'favicon.ico')));
app.use('/', _express2.default.static(app.get('public')));
/**
 * Transport Providers
 */
app.configure(_express2.default.rest());
app.configure(_sockets2.default.provider.primus);

/**
 * Authentication
 * TODO: needs a whole lotta fixin'
 */
app.configure(_services2.default.Authentication());

/**
 * GET Request proxy
 */
app.configure(_services2.default.Proxy());
app.use('/ingest/youtube', (0, _httpProxyMiddleware2.default)('/', {
  target: 'https://www.youtube.com',
  pathRewrite: { '^/ingest/youtube': '' },
  changeOrigin: true
}));
app.use('/ingest/vimeo', (0, _httpProxyMiddleware2.default)('/', {
  target: 'https://vimeo.com',
  pathRewrite: { '^/ingest/vimeo': '' },
  changeOrigin: true
}));

/**
 * System Resources
 * used for basic API services
 */
let paginate = app.get('paginate'),
    persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.system.persistence);
persist.options.logger = _hooks.logger;

/**
 * ACL resource
 */
app.configure((0, _base.createService)({
  logger: _hooks.logger,
  paginate,
  name: 'acls',
  private: true,
  Schema: resources.acl.Schema,
  schemaOptions: resources.acl.schemaOptions
}, persist));

/**
 * User resource
 */
app.configure((0, _base.createService)({
  logger: _hooks.logger,
  paginate,
  name: 'users',
  Schema: resources.user.Schema,
  schemaOptions: resources.user.schemaOptions,
  hooks: resources.user.resourceHooks
}, persist));

persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.resources.persistence);
persist.options.logger = _hooks.logger;
/**
 * Annotation resource
 */
app.configure((0, _base.createService)({
  logger: _hooks.logger,
  paginate,
  name: 'annotations',
  Schema: resources.annotation.Schema,
  schemaOptions: resources.annotation.schemaOptions,
  hooks: resources.annotation.resourceHooks
}, persist));

/**
 * Map resource
 */
app.configure((0, _base.createService)({
  logger: _hooks.logger,
  paginate,
  name: 'maps',
  Schema: resources.map.Schema,
  schemaOptions: resources.map.schemaOptions,
  hooks: resources.map.resourceHooks
}, persist));

/**
 * Event Channels
 */
app.configure(_sockets2.default.channels);
/**
 * Error handlers
 */
app.use(_express2.default.notFound());
app.use(_express2.default.errorHandler({ logger: options.logger || _hooks.logger }));
/**
 * App Hooks
 */
app.hooks(_hooks2.default.app);

process.on('unhandledRejection', (reason, p) => process.stderr.write(`Unhandled Rejection at: Promise p:${p} reason:${reason}\n`));

app.listen(app.get('port')).on('listening', () => {
  const pkg = require('../package.json');
  process.stdout.write(`${pkg.productName || pkg.name} v${pkg.version} ` + `started on http://${app.get('host')}:${app.get('port')}\n\n`);
});

exports.app = app;