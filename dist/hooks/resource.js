'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hooks = require('./hooks');

var _hooks2 = _interopRequireDefault(_hooks);

var _authentication = require('@feathersjs/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { authenticate } = _authentication2.default.hooks;

exports.default = Object.assign(_hooks2.default, {
  before: {
    all: [authenticate('jwt')]
  }
});
module.exports = exports['default'];