"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return context => {
    if (context.data) {
      context.data.author = context.params.payload.userId;
    }
  };
};

module.exports = exports["default"]; /**
                                      * Add/set author field with current user id
                                      * @return {Function}
                                      */