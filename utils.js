"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisplayName = exports.invariant = void 0;

/**
 * Throw an exception if a given invariant is not met.
 */
var invariant = function invariant(test, message) {
  if (!test) {
    throw Error(message);
  }
};
/**
 * Return the display name of a React component.
 */


exports.invariant = invariant;

var getDisplayName = function getDisplayName(Input) {
  return Input.displayName || Input.name || 'Component';
};

exports.getDisplayName = getDisplayName;