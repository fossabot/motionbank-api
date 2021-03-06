'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resourceHooks = exports.schemaOptions = exports.Schema = undefined;

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _authenticationLocal = require('@feathersjs/authentication-local');

var _authenticationLocal2 = _interopRequireDefault(_authenticationLocal);

var _deepmerge = require('deepmerge');

var _deepmerge2 = _interopRequireDefault(_deepmerge);

var _hooks = require('../hooks');

var _base = require('../base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { authenticate } = _authentication2.default.hooks;
const { hashPassword, protect } = _authenticationLocal2.default.hooks;

/**
 * Schema options
 */
const schemaOptions = { idField: 'uuid', created: true, updated: true

  /**
   * User Schema
   * @type {SchemaObjectInstance<any>}
   */
};const Schema = (0, _base.initSchema)({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  location: { type: String },
  organisation: { type: String },
  auth0Id: { type: String, invisible: true },
  scopes: { type: [String], invisible: true }
}, schemaOptions);

/**
 * Add service userHooks
 */
const resourceHooks = (0, _hooks.hooks)();
resourceHooks.before = (0, _deepmerge2.default)(resourceHooks.before, {
  find: [authenticate('jwt')],
  get: [authenticate('jwt'), function (context) {
    if (context.id === 'me') {
      context.id = context.params.payload.userId;
    }
  }],
  create: [hashPassword()],
  update: [hashPassword(), authenticate('jwt')],
  patch: [hashPassword(), authenticate('jwt')],
  remove: [authenticate('jwt')]
});
resourceHooks.after = (0, _deepmerge2.default)(resourceHooks.after, {
  all: [
  /**
   * Make sure the password field is never sent to the client
   * Always must be the last hook
   */
  protect('password')]
});

/**
 * Route access matrix by HTTP verb and OAuth grants
 */
schemaOptions.accessMatrix = {
  find: ['find:users'],
  get: ['get:users'],
  create: ['create:users'],
  update: ['update:users'],
  patch: ['patch:users'],
  remove: ['remove:users']

  /**
   * Export Users Service configuration
   */
};exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.resourceHooks = resourceHooks;