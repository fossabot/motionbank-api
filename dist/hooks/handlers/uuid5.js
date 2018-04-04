'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UUID_NULL = exports.getLocalNamespace = undefined;

var _v = require('uuid/v5');

var _v2 = _interopRequireDefault(_v);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UUID_NULL = '00000000-0000-0000-0000-000000000000';

const getDomainUUIDv5 = function (domain) {
  return (0, _v2.default)(domain, _v2.default.DNS);
};

/*
const getUrlUUIDv5 = function (url) {
  return uuidv5(url, uuidv5.URL)
}

const getNameUUIDv5 = function (name) {
  return uuidv5(name, uuidv5.name)
}
*/

const getLocalNamespace = function () {
  return function (context) {
    const { app } = context;

    if (!app.has('api.uuid.namespace')) {
      if (app.has('api.uuid.domain')) {
        app.set('api.uuid.namespace', getDomainUUIDv5(app.get('api.uuid.domain')));
        return context;
      }

      (0, _debug2.default)('mbapi')('WARNING: UUID namespace domain is not configured (api.uuid.domain)');
      if (app.has('api.uuid.root')) {
        app.set('api.uuid.namespace', getDomainUUIDv5(app.get('api.uuid.root')));
        return context;
      }

      app.set('api.uuid.namespace', UUID_NULL);
    }

    return context;
  };
};

exports.getLocalNamespace = getLocalNamespace;
exports.UUID_NULL = UUID_NULL;