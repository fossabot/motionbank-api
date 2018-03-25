'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _service = require('./service');

var _service2 = _interopRequireDefault(_service);

var _errors = require('@feathersjs/errors');

var _errors2 = _interopRequireDefault(_errors);

var _feathersHooksCommon = require('feathers-hooks-common');

var _feathersHooksCommon2 = _interopRequireDefault(_feathersHooksCommon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service factory function
 * @param options
 * @param persistence
 * @returns {Function}
 */
function createService(options = {}, persistence = undefined) {
  _assert2.default.equal(typeof options.Schema, 'function', 'create-service: options.Schema must be function');
  _assert2.default.equal(typeof options.name, 'string', 'create-service: options.name must be string');
  _assert2.default.equal(typeof options.schemaOptions.idField, 'string', 'create-service: options.schemaOptions.idField must be string');

  /**
   * Service configuration
   * @type {{path: string, schemaOptions: {}} | {}}
   */
  options = Object.assign({
    path: options.path || `/${options.name}`,
    logger: options.logger
  }, options);
  options.schemaOptions = Object.assign({}, options.schemaOptions);

  /**
   * Persistence configuration
   * @type {{Constructor: Persistence, options: {}} | any}
   */
  persistence = Object.assign({
    Constructor: undefined,
    options: {}
  }, persistence);
  persistence.options = Object.assign({
    name: options.name
  }, persistence.options);

  /**
   * Register Service with app
   */
  return function (app) {
    let service = new _service2.default(options, persistence, options.schemaOptions.idField);
    app.use(options.path, service);
    service = app.service(options.name);
    if (options.private) {
      service.hooks({ before: { all: [_feathersHooksCommon2.default.disallow('external')] } });
    } else {
      service.hooks(options.hooks || {});
    }
  };
}

exports.default = createService;
module.exports = exports['default'];