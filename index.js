"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  withMergedProps: true
};
Object.defineProperty(exports, "withMergedProps", {
  enumerable: true,
  get: function get() {
    return _containers.withMergedProps;
  }
});

var _containers = require("./containers");

var _mergers = require("./mergers");

Object.keys(_mergers).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mergers[key];
    }
  });
});