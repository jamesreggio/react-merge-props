"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withMergedProps = exports.mergeProps = exports.withTransformedRoot = void 0;

var _react = _interopRequireWildcard(require("react"));

var _utils = require("./utils");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * Decorator that invokes a transform upon the render output of a React component.
 *
 * The transform is provided with the props of the top-level (root) component
 * returned by the render function, as well as the props and context available
 * to the decorated component. (If the decorated component is a class component,
 * the transform also receives its prior return value as its final argument.)
 *
 * The value returned by the transform is merged into the props of the
 * rendered top-level component.
 *
 * For example, consider the following component:
 *
 *    const MyStatelessComponent = () => <View foo="bar" />;
 *    const MyWrappedComponent = withTransformedRoot(transform)(MyStatelessComponent);
 *
 * If we render it like this...
 *
 *    <MyWrappedComponent fizz="buzz" />
 *
 * ...the transform will be invoked with the following arguments:
 *
 *    transform(
 *      {foo: 'bar'},   // Props on the View rendered by MyStatelessComponent.
 *      {fizz: 'buzz'}, // Props passed into MyStatelessComponent.
 *      {},             // Context of MyStatelessComponent (which is empty).
 *    );
 *
 * If the tranform returns {meaningOfLife: 42}, the rendered output of
 * MyStatelessComponent will ultimately be the following:
 *
 *    <View
 *      foo="bar"           // From the original MyStatelessComponent rendering.
 *      meaningOfLife={42}  // Merged in from the transform.
 *    />
 */
var withTransformedRoot = function withTransformedRoot(transform) {
  return function (Input) {
    (0, _utils.invariant)(typeof transform === 'function', 'transform must be a function');
    var Output = null;

    if (Input.prototype instanceof _react.Component) {
      var lastProps = Symbol('lastProps');

      Output =
      /*#__PURE__*/
      function (_Input) {
        _inherits(Output, _Input);

        function Output() {
          _classCallCheck(this, Output);

          return _possibleConstructorReturn(this, _getPrototypeOf(Output).apply(this, arguments));
        }

        _createClass(Output, [{
          key: "render",
          value: function render() {
            var element = _get(_getPrototypeOf(Output.prototype), "render", this).call(this);

            if (!element) {
              return element;
            }

            var innerProps = element.props;
            var outerProps = this.props,
                outerContext = this.context;
            var nextProps = transform(innerProps, outerProps, outerContext, this[lastProps]);
            this[lastProps] = nextProps;
            return _react.default.cloneElement(element, nextProps);
          }
        }]);

        return Output;
      }(Input);
    } else if (typeof Input === 'function') {
      Output = function Output(outerProps, outerContext) {
        var element = Input(outerProps, outerContext);

        if (!element) {
          return element;
        }

        var innerProps = element.props;
        return _react.default.cloneElement(element, transform(innerProps, outerProps, outerContext));
      }; // Hoist all static properties (including React statics) to the output.


      Object.assign(Output, Input);
    } else {
      throw Error('withTransformedRoot can only decorate a React component');
    }

    Output.displayName = (0, _utils.getDisplayName)(Input);
    return Output;
  };
};
/**
 * Render transform that applies a series of prop-merging rules between
 * the rendered output and the wrapped component's props.
 *
 * If a prop is defined on the wrapped component and has an associated
 * prop-merger, the prop-merger is invoked and the result is applied to the
 * rendered output.
 */


exports.withTransformedRoot = withTransformedRoot;

var mergeProps = function mergeProps(propMergers) {
  return function (innerProps, outerProps, outerContext) {
    var lastProps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var nextProps = {};

    for (var prop in outerProps) {
      var propMerger = propMergers[prop];

      if (!propMerger) {
        continue;
      }

      if (!(prop in innerProps)) {
        nextProps[prop] = outerProps[prop];
        continue;
      }

      var innerProp = innerProps[prop];
      var outerProp = outerProps[prop];
      var lastProp = lastProps[prop];
      nextProps[prop] = propMerger(innerProp, outerProp, lastProp);
    }

    return nextProps;
  };
};

exports.mergeProps = mergeProps;

var withMergedProps = function withMergedProps(propMergers) {
  return withTransformedRoot(mergeProps(propMergers));
};

exports.withMergedProps = withMergedProps;