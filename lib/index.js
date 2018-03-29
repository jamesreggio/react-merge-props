'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var eqStyle = _interopDefault(require('style-equal'));
var eqShallow = _interopDefault(require('shallow-equals'));

/**
 * Throw an exception if a given invariant is not met.
 */

const invariant = (test, message) => {
  if (!test) {
    throw Error(message);
  }
};

/**
 * Return the display name of a React component.
 */

const getDisplayName = (Input) => (
  Input.displayName || Input.name || 'Component'
);

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

const withTransformedRoot = (transform) => (Input) => {
  invariant(typeof transform === 'function', 'transform must be a function');
  let Output = null;

  if (Input.prototype instanceof React.Component) {
    const lastProps = Symbol('lastProps');

    Output = class extends Input {
      render() {
        const element = super.render();

        if (!element) {
          return element;
        }

        const {props: innerProps} = element;
        const {props: outerProps, context: outerContext} = this;

        const nextProps = transform(
          innerProps, outerProps, outerContext, this[lastProps]
        );

        this[lastProps] = nextProps;

        return React__default.cloneElement(element, nextProps);
      }
    };
  } else if (typeof Input === 'function') {
    Output = (outerProps, outerContext) => {
      const element = Input(outerProps, outerContext);

      if (!element) {
        return element;
      }

      const {props: innerProps} = element;

      return React__default.cloneElement(
        element,
        transform(innerProps, outerProps, outerContext),
      );
    };

    // Hoist all static properties (including React statics) to the output.
    Object.assign(Output, Input);
  } else {
    throw Error('withTransformedRoot can only decorate a React component');
  }

  Output.displayName = getDisplayName(Input);
  return Output;
};

/**
 * Render transform that applies a series of prop-merging rules between
 * the rendered output and the wrapped component's props.
 *
 * If a prop is defined on the wrapped component and has an associated
 * prop-merger, the prop-merger is invoked and the result is applied to the
 * rendered output.
 */

const mergeProps = (propMergers) => (
  (innerProps, outerProps, outerContext, lastProps = {}) => {
    const nextProps = {};

    for (const prop in outerProps) {
      const propMerger = propMergers[prop];

      if (!propMerger) {
        continue;
      }

      if (!(prop in innerProps)) {
        nextProps[prop] = outerProps[prop];
        continue;
      }

      const innerProp = innerProps[prop];
      const outerProp = outerProps[prop];
      const lastProp = lastProps[prop];

      nextProps[prop] = propMerger(innerProp, outerProp, lastProp);
    }

    return nextProps;
  }
);

const withMergedProps = (propMergers) => (
  withTransformedRoot(mergeProps(propMergers))
);

/**
 * Merge a prop that accepts functions.
 *
 * The functions are invoked in series; inner function first.
 * The return value behavior is not defined.
 */

const mergeFunctions = (innerProp, outerProp, lastProp) => {
  if (innerProp == null) {
    return outerProp;
  } else if (outerProp == null) {
    return innerProp;
  }

  invariant(
    typeof innerProp === 'function' && typeof outerProp === 'function',
    `Cannot merge non-function prop value`,
  );

  const nextFns = [innerProp, outerProp];
  const lastFns = lastProp && lastProp.fns;

  if (eqShallow(nextFns, lastFns)) {
    return lastProp;
  }

  const nextProp = (...args) => nextFns.forEach(fn => fn(...args));
  nextProp.fns = nextFns;
  return nextProp;
};

/**
 * Merge a prop using a boolean operator.
 *
 * Each value is coerced to a boolean before the operator is applied.
 */

const mergeBooleans = (op) => {
  switch (op) {
    case '&&': return (innerProp, outerProp) => !!innerProp && !!outerProp;
    case '||': return (innerProp, outerProp) => !!innerProp || !!outerProp;
    default: throw Error(`Unexpected boolean operator: ${op}`);
  }
};

/**
 * Merge a prop that accepts strings.
 *
 * The given value is used to join the strings.
 * The outer string is appended to the inner string.
 * Empty strings are not joined.
 */

const mergeStrings = (join) => (innerProp, outerProp) => {
  if (!innerProp) {
    return outerProp;
  } else if (!outerProp) {
    return innerProp;
  }

  return `${innerProp}${join}${outerProp}`;
};

/**
 * Merge a prop that accepts React Native styles.
 *
 * Outer styles take precendence over inner styles.
 */

const mergeStyles = (innerProp, outerProp, lastProp) => {
  let nextProp = [].concat(innerProp, outerProp).filter(Boolean);

  if (nextProp.length === 0) {
    return null;
  } else if (nextProp.length === 1) {
    nextProp = nextProp[0];
  }

  return eqStyle(lastProp, nextProp) ? lastProp : nextProp;
};

/**
 * Assert that only one of the props is defined.
 *
 * This function is only invoked if the outer and inner prop objects both
 * contain the prop, so all it needs to do is throw.
 */

const assertExclusive = () => {
  throw Error(`Cannot merge prop due to conflicting values`);
};

/**
 * Take the outer prop.
 */

const takeOuter = (innerProp, outerProp) => (outerProp);

exports.withMergedProps = withMergedProps;
exports.mergeFunctions = mergeFunctions;
exports.mergeBooleans = mergeBooleans;
exports.mergeStrings = mergeStrings;
exports.mergeStyles = mergeStyles;
exports.assertExclusive = assertExclusive;
exports.takeOuter = takeOuter;
