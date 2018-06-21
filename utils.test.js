"use strict";

var _react = require("react");

var _utils = require("./utils");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

describe("invariant", function () {
  it("throws when the condition is falsey", function () {
    expect(function () {
      return (0, _utils.invariant)(null, 'Error message');
    }).toThrowErrorMatchingSnapshot();
  });
  it("doesn't throw when the condition is truthy", function () {
    expect(function () {
      return (0, _utils.invariant)({}, 'Error message');
    }).not.toThrow();
  });
});
describe("getDisplayName", function () {
  it("handles React class components", function () {
    var MyComponent =
    /*#__PURE__*/
    function (_Component) {
      _inherits(MyComponent, _Component);

      function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, _getPrototypeOf(MyComponent).apply(this, arguments));
      }

      return MyComponent;
    }(_react.Component);

    expect((0, _utils.getDisplayName)(MyComponent)).toBe('MyComponent');
  });
  it("handles React stateless components", function () {
    var MyComponent = function MyComponent() {};

    expect((0, _utils.getDisplayName)(MyComponent)).toBe('MyComponent');
  });
  it("handles unknown components", function () {
    var UnknownComponent = {};
    expect((0, _utils.getDisplayName)(UnknownComponent)).toBe('Component');
  });
  it("respects overridden component display names", function () {
    var MyComponent =
    /*#__PURE__*/
    function (_Component2) {
      _inherits(MyComponent, _Component2);

      function MyComponent() {
        _classCallCheck(this, MyComponent);

        return _possibleConstructorReturn(this, _getPrototypeOf(MyComponent).apply(this, arguments));
      }

      return MyComponent;
    }(_react.Component);

    MyComponent.displayName = 'OtherComponent';
    expect((0, _utils.getDisplayName)(MyComponent)).toBe('OtherComponent');
  });
});