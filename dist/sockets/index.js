'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _primus = require('@feathersjs/primus');

var _primus2 = _interopRequireDefault(_primus);

var _channels = require('./channels');

var _channels2 = _interopRequireDefault(_channels);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: https://docs.feathersjs.com/api/client/primus.html
// TODO: https://github.com/primus/metroplex
// TODO: https://github.com/mmalecki/primus-redis-rooms

exports.default = {
  provider: {
    primus: (0, _primus2.default)({ transformer: 'uws' })
  },
  channels: _channels2.default
};
module.exports = exports['default'];