'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _logger = require('./handlers/logger');

var _logger2 = _interopRequireDefault(_logger);

var _mergeDeep = require('merge-deep');

var _mergeDeep2 = _interopRequireDefault(_mergeDeep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _mergeDeep2.default)((0, _hooks2.default)(), {
  before: {
    all: [(0, _logger2.default)()]
  },
  after: {
    all: [(0, _logger2.default)()]
  },
  error: {
    all: [(0, _logger2.default)()]
  }
});
module.exports = exports['default'];