'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = exports.persistence = exports.sockets = exports.services = exports.hooks = undefined;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') {
  _hooks.logger.level = 'debug';
}

// TODO: this file needs to shrink!

function factory(options = {}, buildVars) {
  /**
   * Configuration (see config/default.json)
   */
  const app = (0, _express2.default)((0, _feathers2.default)());
  app.configure((0, _configuration2.default)());
  options = Object.assign({
    systemResources: [],
    serviceResources: [],
    middleware: {
      preAuth: options.middleware ? Object.assign({}, options.middleware.preAuth) : undefined,
      postAuth: options.middleware ? Object.assign({}, options.middleware.postAuth) : undefined,
      postResource: options.middleware ? Object.assign({}, options.middleware.postResource) : undefined
    },
    buildVars: Object.assign(buildVars, options.buildVars),
    logger: _hooks.logger
  }, options);
  options.basePath = options.basePath && options.basePath[0] === _path2.default.sep ? _path2.default.resolve(options.basePath) : _path2.default.join(__dirname, '..', '..');
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
   * Pre auth middleware
   */
  if (options.middleware && options.middleware.preAuth) {
    app.configure(options.middleware.preAuth);
  }
  /**
   * Authentication
   * TODO: needs a whole lotta fixin'
   */
  app.configure(_services2.default.Authentication());
  /**
   * ACL (Access Control List)
   * with backends:
   *
   * - memoryBackend
   * - redisBackend
   * - mongoBackend
   */
  const ACLBackend = _services2.default.ACL.memoryBackend;
  app.set('acl', new _services2.default.ACL(new ACLBackend(), buildVars));
  // app.configure(app.get('acl').middleware)
  /**
   * Post auth middleware
   */
  if (options.middleware && options.middleware.postAuth) {
    app.configure(options.middleware.postAuth);
  }
  /**
   * GET Request proxy
   */
  app.configure(_services2.default.Proxy());
  /**
   * System Resources
   * used for basic API services
   */
  for (let [name, value] of Object.entries(options.systemResources)) {
    const { Schema, schemaOptions, resourceHooks } = value,
          persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.system.persistence);
    persist.options.logger = _hooks.logger;
    app.configure((0, _base.createService)({
      logger: _hooks.logger,
      paginate: app.get('paginate'),
      name,
      Schema,
      schemaOptions,
      hooks: Object.assign(_hooks2.default.resource, resourceHooks)
    }, persist));
  }
  /**
   * Resources
   */
  for (let [name, value] of Object.entries(options.serviceResources)) {
    const { Schema, schemaOptions, resourceHooks } = value,
          persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.resources.persistence);
    persist.options.logger = _hooks.logger;
    app.configure((0, _base.createService)({
      logger: _hooks.logger,
      paginate: app.get('paginate'),
      name,
      Schema,
      schemaOptions,
      hooks: Object.assign(_hooks2.default.resource, resourceHooks),
      idField: schemaOptions.idField
    }, persist));
  }
  /**
   * Post resource middleware
   */
  if (options.middleware && options.middleware.postResource) {
    app.configure(options.middleware.postResource);
  }
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
  return app;
}

exports.default = {
  /**
   * Core API Factory function
   */
  factory
};
exports.hooks = _hooks2.default;
exports.services = _services2.default;
exports.sockets = _sockets2.default;
exports.persistence = _persistence2.default;
exports.logger = _hooks.logger;