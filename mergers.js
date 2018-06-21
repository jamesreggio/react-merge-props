"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.takeOuter = exports.assertExclusive = exports.mergeStyles = exports.mergeStrings = exports.mergeBooleans = exports.mergeFunctions = void 0;

var _styleEqual = _interopRequireDefault(require("style-equal"));

var _shallowEquals = _interopRequireDefault(require("shallow-equals"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Merge a prop that accepts functions.
 *
 * The functions are invoked in series; inner function first.
 * The return value behavior is not defined.
 */
var mergeFunctions = function mergeFunctions(innerProp, outerProp, lastProp) {
  if (innerProp == null) {
    return outerProp;
  } else if (outerProp == null) {
    return innerProp;
  }

  (0, _utils.invariant)(typeof innerProp === 'function' && typeof outerProp === 'function', "Cannot merge non-function prop value");
  var nextFns = [innerProp, outerProp];
  var lastFns = lastProp && lastProp.fns;

  if ((0, _shallowEquals.default)(nextFns, lastFns)) {
    return lastProp;
  }

  var nextProp = function nextProp() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return nextFns.forEach(function (fn) {
      return fn.apply(void 0, args);
    });
  };

  nextProp.fns = nextFns;
  return nextProp;
};
/**
 * Merge a prop using a boolean operator.
 *
 * Each value is coerced to a boolean before the operator is applied.
 */


exports.mergeFunctions = mergeFunctions;

var mergeBooleans = function mergeBooleans(op) {
  switch (op) {
    case '&&':
      return function (innerProp, outerProp) {
        return !!innerProp && !!outerProp;
      };

    case '||':
      return function (innerProp, outerProp) {
        return !!innerProp || !!outerProp;
      };

    default:
      throw Error("Unexpected boolean operator: ".concat(op));
  }
};
/**
 * Merge a prop that accepts strings.
 *
 * The given value is used to join the strings.
 * The outer string is appended to the inner string.
 * Empty strings are not joined.
 */


exports.mergeBooleans = mergeBooleans;

var mergeStrings = function mergeStrings(join) {
  return function (innerProp, outerProp) {
    if (!innerProp) {
      return outerProp;
    } else if (!outerProp) {
      return innerProp;
    }

    return "".concat(innerProp).concat(join).concat(outerProp);
  };
};
/**
 * Merge a prop that accepts React Native styles.
 *
 * Outer styles take precendence over inner styles.
 */


exports.mergeStrings = mergeStrings;

var mergeStyles = function mergeStyles(innerProp, outerProp, lastProp) {
  var nextProp = [].concat(innerProp, outerProp).filter(Boolean);

  if (nextProp.length === 0) {
    return null;
  } else if (nextProp.length === 1) {
    nextProp = nextProp[0];
  }

  return (0, _styleEqual.default)(lastProp, nextProp) ? lastProp : nextProp;
};
/**
 * Assert that only one of the props is defined.
 *
 * This function is only invoked if the outer and inner prop objects both
 * contain the prop, so all it needs to do is throw.
 */


exports.mergeStyles = mergeStyles;

var assertExclusive = function assertExclusive() {
  throw Error("Cannot merge prop due to conflicting values");
};
/**
 * Take the outer prop.
 */


exports.assertExclusive = assertExclusive;

var takeOuter = function takeOuter(innerProp, outerProp) {
  return outerProp;
};

exports.takeOuter = takeOuter;