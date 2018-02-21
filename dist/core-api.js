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

var _feathersHooks = require('@motionbank-js/feathers-hooks');

var _feathersHooks2 = _interopRequireDefault(_feathersHooks);

var _feathersServices = require('@motionbank-js/feathers-services');

var _feathersServices2 = _interopRequireDefault(_feathersServices);

var _feathersSockets = require('@motionbank-js/feathers-sockets');

var _feathersSockets2 = _interopRequireDefault(_feathersSockets);

var _persistence = require('@motionbank-js/persistence');

var _persistence2 = _interopRequireDefault(_persistence);

var _base = require('@motionbank-js/base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Debug logging when not in production **/
if (process.env.NODE_ENV !== 'production') {
  _feathersHooks.logger.level = 'debug';
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
    logger: _feathersHooks.logger
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
  app.configure(_feathersSockets2.default.provider.primus);
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
  app.configure(_feathersServices2.default.Authentication());
  /**
   * System Resources
   * used for basic API services
   */
  for (let [name, value] of Object.entries(options.systemResources)) {
    const { Schema, schemaOptions, hooks } = value,
          persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.system.persistence);
    persist.options.logger = _feathersHooks.logger;
    app.configure((0, _base.createService)({
      logger: _feathersHooks.logger,
      paginate: app.get('paginate'),
      name,
      Schema,
      schemaOptions,
      hooks
    }, persist));
  }
  /**
   * ACL (Access Control List)
   * with backends:
   *
   * - memoryBackend
   * - redisBackend
   * - mongoBackend
   */
  const ACLBackend = _feathersServices2.default.ACL.memoryBackend;
  app.set('acl', new _feathersServices2.default.ACL(new ACLBackend(), buildVars));
  app.configure(app.get('acl').middleware);
  /**
   * Post auth middleware
   */
  if (options.middleware && options.middleware.postAuth) {
    app.configure(options.middleware.postAuth);
  }
  /**
   * Resources
   */
  for (let [name, value] of Object.entries(options.serviceResources)) {
    const { Schema, schemaOptions, hooks } = value,
          persist = _base.Util.parseConfig(_persistence2.default, serviceOptions.resources.persistence);
    persist.options.logger = _feathersHooks.logger;
    app.configure((0, _base.createService)({
      logger: _feathersHooks.logger,
      paginate: app.get('paginate'),
      name,
      Schema,
      schemaOptions,
      hooks,
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
  app.configure(_feathersSockets2.default.channels);
  /**
   * Error handlers
   */
  app.use(_express2.default.notFound());
  app.use(_express2.default.errorHandler({ logger: options.logger || _feathersHooks.logger }));
  /**
   * App Hooks
   */
  app.hooks(_feathersHooks2.default.app);
  return app;
}

exports.default = {
  /**
   * Core API Factory function
   */
  factory
};
exports.hooks = _feathersHooks2.default;
exports.services = _feathersServices2.default;
exports.sockets = _feathersSockets2.default;
exports.persistence = _persistence2.default;
exports.logger = _feathersHooks.logger;