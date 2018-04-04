'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hooks = exports.logger = undefined;

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _hooks = require('../base/hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _author = require('./handlers/author');

var _author2 = _interopRequireDefault(_author);

var _method = require('./handlers/method');

var _method2 = _interopRequireDefault(_method);

var _uuid = require('./handlers/uuid5');

var uuid5Hooks = _interopRequireWildcard(_uuid);

var _resource = require('./resource');

var _resource2 = _interopRequireDefault(_resource);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = _winston2.default.createLogger({
  level: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: _winston2.default.format.json(),
  transports: [new _winston2.default.transports.Console()]
});

exports.logger = logger;
exports.hooks = _hooks2.default;


const defaultHooks = {
  app: _app2.default,
  author: _author2.default,
  method: _method2.default,
  uuid5Hooks,
  resource: _resource2.default
};

exports.default = defaultHooks;