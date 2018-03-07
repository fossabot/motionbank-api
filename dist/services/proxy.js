'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Proxy;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Proxy() {
  return function (app) {
    app.use('/proxy', function (req, res, next) {
      _superagent2.default.get(req.query.url).then(result => {
        res.setHeader('Content-Type', result.type);
        res.end(result.text);
      }).catch(() => {
        res.statusCode(404);
        res.end();
      });
    });
  };
}
module.exports = exports['default'];