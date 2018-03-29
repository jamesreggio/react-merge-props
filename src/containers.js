import React, {Component} from 'react';
import {invariant, getDisplayName} from './utils';

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

export const withTransformedRoot = (transform) => (Input) => {
  invariant(typeof transform === 'function', 'transform must be a function');
  let Output = null;

  if (Input.prototype instanceof Component) {
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

        return React.cloneElement(element, nextProps);
      }
    };
  } else if (typeof Input === 'function') {
    Output = (outerProps, outerContext) => {
      const element = Input(outerProps, outerContext);

      if (!element) {
        return element;
      }

      const {props: innerProps} = element;

      return React.cloneElement(
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

export const mergeProps = (propMergers) => (
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

export const withMergedProps = (propMergers) => (
  withTransformedRoot(mergeProps(propMergers))
);
