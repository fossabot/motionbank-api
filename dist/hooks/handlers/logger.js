'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return context => {
    logger.log('debug', `${context.type} app.service('${context.path}').${context.method}()`);
    if (typeof context.toJSON === 'function') {
      logger.log('debug', 'Hook Context', JSON.stringify(context, null, '  '));
    }
    if (context.error) {
      logger.log('error', context.error);
    }
  };
};

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = _winston2.default.createLogger({
  level: process.env.NODE_ENV && process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
  format: _winston2.default.format.json(),
  transports: [new _winston2.default.transports.Console()]
});

/**
 * Logger factory for hooks
 * @returns {function(*=)}
 */
module.exports = exports['default'];