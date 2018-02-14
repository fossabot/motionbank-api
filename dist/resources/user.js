'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.schemaOptions = exports.Schema = undefined;

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _authenticationLocal = require('@feathersjs/authentication-local');

var _authenticationLocal2 = _interopRequireDefault(_authenticationLocal);

var _hooks = require('libmb-base/hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _initSchema = require('libmb-base/init-schema');

var _initSchema2 = _interopRequireDefault(_initSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { authenticate } = _authentication2.default.hooks;
const { hashPassword, protect } = _authenticationLocal2.default.hooks;

/**
 * User Schema
 * @type {SchemaObjectInstance<any>}
 */
const Schema = (0, _initSchema2.default)({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, minLength: 6 },
  location: { type: String },
  organisation: { type: String },
  auth0Id: { type: String, invisible: true }
});

/**
 * Schema options
 */
const schemaOptions = {};

/**
 * Add service hooks
 */
const hooks = (0, _hooks2.default)();
hooks.before = Object.assign(hooks.before, {
  find: [authenticate('jwt')],
  get: [authenticate('jwt')],
  create: [hashPassword()],
  update: [hashPassword(), authenticate('jwt')],
  patch: [hashPassword(), authenticate('jwt')],
  remove: [authenticate('jwt')]
});
hooks.after = Object.assign(hooks.after, {
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
  find: ['retrieve:users'],
  get: ['retrieve:users'],
  create: ['create:users'],
  update: ['update:users'],
  patch: ['update:users'],
  remove: ['remove:users']

  /**
   * Export Users Service configuration
   */
};exports.Schema = Schema;
exports.schemaOptions = schemaOptions;
exports.hooks = hooks;