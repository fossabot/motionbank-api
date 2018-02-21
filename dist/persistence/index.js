'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nedb = require('./nedb');

var _nedb2 = _interopRequireDefault(_nedb);

var _mongodb = require('./mongodb');

var _mongodb2 = _interopRequireDefault(_mongodb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: check leveldb & lmdb
exports.default = {
  NeDB: _nedb2.default,
  MongoDB: _mongodb2.default
};
module.exports = exports['default'];