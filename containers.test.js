"use strict";

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _reactTestRenderer = _interopRequireDefault(require("react-test-renderer"));

var _containers = require("./containers");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

describe("withTransformedRoot", function () {
  var outerContextTypes = {
    contextNumber: _propTypes.default.number.isRequired,
    contextString: _propTypes.default.string.isRequired
  };
  var outerContext = {
    contextNumber: 42,
    contextString: 'foo'
  };
  var innerProps = {
    collapsable: false
  };
  var outerProps = {
    accessible: true
  };

  var MyProvider =
  /*#__PURE__*/
  function (_Component) {
    _inherits(MyProvider, _Component);

    function MyProvider() {
      _classCallCheck(this, MyProvider);

      return _possibleConstructorReturn(this, _getPrototypeOf(MyProvider).apply(this, arguments));
    }

    _createClass(MyProvider, [{
      key: "getChildContext",
      value: function getChildContext() {
        return outerContext;
      }
    }, {
      key: "render",
      value: function render() {
        return this.props.children;
      }
    }]);

    return MyProvider;
  }(_react.Component);

  _defineProperty(MyProvider, "childContextTypes", outerContextTypes);

  var MyClassComponent =
  /*#__PURE__*/
  function (_Component2) {
    _inherits(MyClassComponent, _Component2);

    function MyClassComponent() {
      _classCallCheck(this, MyClassComponent);

      return _possibleConstructorReturn(this, _getPrototypeOf(MyClassComponent).apply(this, arguments));
    }

    _createClass(MyClassComponent, [{
      key: "render",
      value: function render() {
        if (this.props.returnNull) {
          return null;
        }

        return _react.default.createElement("div", innerProps);
      }
    }]);

    return MyClassComponent;
  }(_react.Component);

  _defineProperty(MyClassComponent, "contextTypes", outerContextTypes);

  var MyStatelessComponent = function MyStatelessComponent(_ref) {
    var returnNull = _ref.returnNull;
    return returnNull ? null : _react.default.createElement("div", innerProps);
  };

  MyStatelessComponent.contextTypes = outerContextTypes;
  it("throws on non-component input", function () {
    var transform = jest.fn();
    expect(function () {
      return (0, _containers.withTransformedRoot)(transform)({});
    }).toThrowErrorMatchingSnapshot();
  });
  it("throws on non-function transform", function () {
    expect(function () {
      return (0, _containers.withTransformedRoot)(null)(MyClassComponent);
    }).toThrowErrorMatchingSnapshot();
    expect(function () {
      return (0, _containers.withTransformedRoot)(null)(MyStatelessComponent);
    }).toThrowErrorMatchingSnapshot();
  });
  describe("class components", function () {
    it("doesn't invoke the transform if render returns null", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyClassComponent);

      _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, _extends({
        returnNull: true
      }, outerProps))));

      expect(transform).toHaveBeenCalledTimes(0);
    });
    it("invokes the transform with the expected arguments", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyClassComponent);

      _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));

      expect(transform).toHaveBeenCalledWith(innerProps, outerProps, outerContext, undefined);
    });
    it("applies the props returned by the transform", function () {
      var transform = jest.fn(function (innerProps, outerProps, outerContext) {
        return _objectSpread({}, outerProps, outerContext);
      });
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyClassComponent);

      var output = _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));

      expect(output.root.findByType('div').props).toEqual(_objectSpread({}, innerProps, outerProps, outerContext));
    });
    it("supplies the result of the prior invocation as lastProps", function () {
      var lastProps = {
        foo: 'bar'
      };
      var transform = jest.fn().mockReturnValue(lastProps);
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyClassComponent);

      var output = _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));

      expect(transform).toHaveBeenLastCalledWith(innerProps, outerProps, outerContext, undefined);
      output.update(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));
      expect(transform).toHaveBeenLastCalledWith(innerProps, outerProps, outerContext, lastProps);
    });
    it("preserves the name of the component", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyClassComponent);
      expect(MyWrappedComponent.displayName).toBe('MyClassComponent');
    });
  });
  describe("stateless components", function () {
    it("doesn't invoke the transform if render returns null", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyStatelessComponent);

      _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, _extends({
        returnNull: true
      }, outerProps))));

      expect(transform).toHaveBeenCalledTimes(0);
    });
    it("invokes the transform with the expected arguments", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyStatelessComponent);

      _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));

      expect(transform).toHaveBeenCalledWith(innerProps, outerProps, outerContext);
    });
    it("applies the props returned by the transform", function () {
      var transform = jest.fn(function (innerProps, outerProps, outerContext) {
        return _objectSpread({}, outerProps, outerContext);
      });
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyStatelessComponent);

      var output = _reactTestRenderer.default.create(_react.default.createElement(MyProvider, null, _react.default.createElement(MyWrappedComponent, outerProps)));

      expect(output.root.findByType('div').props).toEqual(_objectSpread({}, innerProps, outerProps, outerContext));
    });
    it("preserves the name of the component", function () {
      var transform = jest.fn();
      var MyWrappedComponent = (0, _containers.withTransformedRoot)(transform)(MyStatelessComponent);
      expect(MyWrappedComponent.displayName).toBe('MyStatelessComponent');
    });
  });
});
describe("mergeProps", function () {
  var propMergers;
  beforeEach(function () {
    propMergers = {
      foo: jest.fn(function () {
        return 'bar';
      }),
      fizz: jest.fn(function () {
        return 'buzz';
      })
    };
  });
  it("ignores props without prop-mergers defined", function () {
    var mergeTestProps = (0, _containers.mergeProps)(propMergers);
    var outerContext = {}; // Ignored.

    var lastProps = {};
    var innerProps = {
      fanta: 'innerFanta'
    };
    var outerProps = {
      fanta: 'outerFanta'
    };
    var nextProps = mergeTestProps(innerProps, outerProps, outerContext, lastProps);
    expect(nextProps).toEqual({});
    expect(propMergers.foo).toHaveBeenCalledTimes(0);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  });
  it("invokes the prop-mergers for each outer prop", function () {
    var mergeTestProps = (0, _containers.mergeProps)(propMergers);
    var outerContext = {}; // Ignored.

    var innerProps = {
      foo: 'innerFoo',
      fizz: 'innerFizz'
    };
    var outerProps = {
      foo: 'outerFoo',
      fizz: 'outerFizz'
    };
    var lastProps = {
      foo: 'lastFoo',
      fizz: 'lastFizz'
    };
    var nextProps = mergeTestProps(innerProps, outerProps, outerContext, lastProps);
    expect(nextProps).toEqual({
      foo: 'bar',
      fizz: 'buzz'
    });
    expect(propMergers.foo).toHaveBeenCalledWith('innerFoo', 'outerFoo', 'lastFoo');
    expect(propMergers.fizz).toHaveBeenCalledWith('innerFizz', 'outerFizz', 'lastFizz');
  });
  it("doesn't invoke the prop-mergers for props that are not present on both outer and inner", function () {
    var mergeTestProps = (0, _containers.mergeProps)(propMergers);
    var outerContext = {}; // Ignored.

    var lastProps = {};
    var outerProps = {
      foo: 'outerFoo'
    };
    var innerProps = {
      fizz: 'innerFizz'
    };
    var nextProps = mergeTestProps(innerProps, outerProps, outerContext, lastProps); // If an `outerProp` exists but no `innerProp` exists, the `outerProp` is
    // used without invoking the prop-merger.

    expect(nextProps).toEqual({
      foo: 'outerFoo'
    });
    expect(propMergers.foo).toHaveBeenCalledTimes(0);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  }); // This may seem like controversial behavior, but the simplest approach to
  // invoking prop-mergers is to do so for every key defined in the outer props,
  // and let the prop-mergers decide how to handle the values.

  it("invokes prop-mergers for outer props that are undefined", function () {
    var mergeTestProps = (0, _containers.mergeProps)(propMergers);
    var outerContext = {}; // Ignored.

    var lastProps = {};
    var innerProps = {
      foo: 'innerFoo'
    };
    var outerProps = {
      foo: undefined
    };
    var nextProps = mergeTestProps(innerProps, outerProps, outerContext, lastProps);
    expect(nextProps).toEqual({
      foo: 'bar'
    });
    expect(propMergers.foo).toHaveBeenCalledTimes(1);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  });
});
describe("withMergedProps", function () {
  it("composes the expected functionality", function () {
    var outerProps = {
      foo: 'outerFoo',
      fizz: 'outerFizz'
    };
    var innerProps = {
      foo: 'innerFoo',
      fizz: 'innerFizz'
    };
    var propMergers = {
      foo: jest.fn(function () {
        return 'bar';
      }),
      fizz: jest.fn(function () {
        return 'buzz';
      })
    };

    var MyStatelessComponent = function MyStatelessComponent() {
      return _react.default.createElement("div", innerProps);
    };

    var MyWrappedComponent = (0, _containers.withMergedProps)(propMergers)(MyStatelessComponent);

    var output = _reactTestRenderer.default.create(_react.default.createElement(MyWrappedComponent, outerProps));

    expect(output.root.findByType('div').props).toEqual({
      foo: 'bar',
      fizz: 'buzz'
    });
  });
});