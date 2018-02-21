'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.logger = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = _winston2.default.createLogger({
  level: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: _winston2.default.format.json(),
  transports: [new _winston2.default.transports.Console()]
});

exports.logger = logger;
exports.hooks = _hooks2.default;
exports.default = {
  app: _app2.default,
  resource: _resource2.default
};