import PropTypes from 'prop-types';
import React, {Component} from 'react';
import renderer from 'react-test-renderer';

import {
  withTransformedRoot,
  mergeProps,
  withMergedProps,
} from './containers';

describe(`withTransformedRoot`, () => {
  const outerContextTypes = {
    contextNumber: PropTypes.number.isRequired,
    contextString: PropTypes.string.isRequired,
  };

  const outerContext = {
    contextNumber: 42,
    contextString: 'foo',
  };

  const innerProps = {
    collapsable: false,
  };

  const outerProps = {
    accessible: true,
  };

  class MyProvider extends Component {
    static childContextTypes = outerContextTypes;

    getChildContext() {
      return outerContext;
    }

    render() {
      return this.props.children;
    }
  }

  class MyClassComponent extends Component {
    static contextTypes = outerContextTypes;

    render() {
      if (this.props.returnNull) {
        return null;
      }

      return <div {...innerProps} />;
    }
  }

  const MyStatelessComponent = ({returnNull}) => returnNull
    ? null
    : <div {...innerProps} />;

  MyStatelessComponent.contextTypes = outerContextTypes;

  it(`throws on non-component input`, () => {
    const transform = jest.fn();

    expect(() => withTransformedRoot(transform)({}))
      .toThrowErrorMatchingSnapshot();
  });

  it(`throws on non-function transform`, () => {
    expect(() => withTransformedRoot(null)(MyClassComponent))
      .toThrowErrorMatchingSnapshot();

    expect(() => withTransformedRoot(null)(MyStatelessComponent))
      .toThrowErrorMatchingSnapshot();
  });

  describe(`class components`, () => {
    it(`doesn't invoke the transform if render returns null`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyClassComponent);

      renderer.create(
        <MyProvider>
          <MyWrappedComponent returnNull {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenCalledTimes(0);
    });

    it(`invokes the transform with the expected arguments`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyClassComponent);

      renderer.create(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenCalledWith(
        innerProps,
        outerProps,
        outerContext,
        undefined,
      );
    });

    it(`applies the props returned by the transform`, () => {
      const transform = jest.fn((innerProps, outerProps, outerContext) => ({
        ...outerProps,
        ...outerContext,
      }));

      const MyWrappedComponent = withTransformedRoot(transform)(MyClassComponent);

      const output = renderer.create(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(output.root.findByType('div').props).toEqual({
        ...innerProps,
        ...outerProps,
        ...outerContext,
      });
    });

    it(`supplies the result of the prior invocation as lastProps`, () => {
      const lastProps = {foo: 'bar'};
      const transform = jest.fn().mockReturnValue(lastProps);
      const MyWrappedComponent = withTransformedRoot(transform)(MyClassComponent);

      const output = renderer.create(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenLastCalledWith(
        innerProps,
        outerProps,
        outerContext,
        undefined,
      );

      output.update(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenLastCalledWith(
        innerProps,
        outerProps,
        outerContext,
        lastProps,
      );
    });

    it(`preserves the name of the component`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyClassComponent);
      expect(MyWrappedComponent.displayName).toBe('MyClassComponent');
    });
  });

  describe(`stateless components`, () => {
    it(`doesn't invoke the transform if render returns null`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyStatelessComponent);

      renderer.create(
        <MyProvider>
          <MyWrappedComponent returnNull {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenCalledTimes(0);
    });

    it(`invokes the transform with the expected arguments`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyStatelessComponent);

      renderer.create(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(transform).toHaveBeenCalledWith(
        innerProps,
        outerProps,
        outerContext,
      );
    });

    it(`applies the props returned by the transform`, () => {
      const transform = jest.fn((innerProps, outerProps, outerContext) => ({
        ...outerProps,
        ...outerContext,
      }));

      const MyWrappedComponent = withTransformedRoot(transform)(MyStatelessComponent);

      const output = renderer.create(
        <MyProvider>
          <MyWrappedComponent {...outerProps} />
        </MyProvider>
      );

      expect(output.root.findByType('div').props).toEqual({
        ...innerProps,
        ...outerProps,
        ...outerContext,
      });
    });

    it(`preserves the name of the component`, () => {
      const transform = jest.fn();
      const MyWrappedComponent = withTransformedRoot(transform)(MyStatelessComponent);
      expect(MyWrappedComponent.displayName).toBe('MyStatelessComponent');
    });
  });
});

describe(`mergeProps`, () => {
  let propMergers;

  beforeEach(() => {
    propMergers = {
      foo: jest.fn(() => 'bar'),
      fizz: jest.fn(() => 'buzz'),
    };
  });

  it(`ignores props without prop-mergers defined`, () => {
    const mergeTestProps = mergeProps(propMergers);

    const outerContext = {}; // Ignored.
    const lastProps = {};

    const innerProps = {
      fanta: 'innerFanta',
    };

    const outerProps = {
      fanta: 'outerFanta',
    };

    const nextProps = mergeTestProps(
      innerProps, outerProps, outerContext, lastProps
    );

    expect(nextProps).toEqual({});
    expect(propMergers.foo).toHaveBeenCalledTimes(0);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  });

  it(`invokes the prop-mergers for each outer prop`, () => {
    const mergeTestProps = mergeProps(propMergers);

    const outerContext = {}; // Ignored.

    const innerProps = {
      foo: 'innerFoo',
      fizz: 'innerFizz',
    };

    const outerProps = {
      foo: 'outerFoo',
      fizz: 'outerFizz',
    };

    const lastProps = {
      foo: 'lastFoo',
      fizz: 'lastFizz',
    };

    const nextProps = mergeTestProps(
      innerProps, outerProps, outerContext, lastProps
    );

    expect(nextProps).toEqual({
      foo: 'bar',
      fizz: 'buzz',
    });

    expect(propMergers.foo).toHaveBeenCalledWith(
      'innerFoo', 'outerFoo', 'lastFoo'
    );

    expect(propMergers.fizz).toHaveBeenCalledWith(
      'innerFizz', 'outerFizz', 'lastFizz'
    );
  });

  it(`doesn't invoke the prop-mergers for props that are not present on both outer and inner`, () => {
    const mergeTestProps = mergeProps(propMergers);

    const outerContext = {}; // Ignored.
    const lastProps = {};

    const outerProps = {
      foo: 'outerFoo',
    };

    const innerProps = {
      fizz: 'innerFizz',
    };

    const nextProps = mergeTestProps(
      innerProps, outerProps, outerContext, lastProps
    );

    // If an `outerProp` exists but no `innerProp` exists, the `outerProp` is
    // used without invoking the prop-merger.
    expect(nextProps).toEqual({
      foo: 'outerFoo',
    });

    expect(propMergers.foo).toHaveBeenCalledTimes(0);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  });

  // This may seem like controversial behavior, but the simplest approach to
  // invoking prop-mergers is to do so for every key defined in the outer props,
  // and let the prop-mergers decide how to handle the values.
  it(`invokes prop-mergers for outer props that are undefined`, () => {
    const mergeTestProps = mergeProps(propMergers);

    const outerContext = {}; // Ignored.
    const lastProps = {};

    const innerProps = {
      foo: 'innerFoo',
    };

    const outerProps = {
      foo: undefined,
    };

    const nextProps = mergeTestProps(
      innerProps, outerProps, outerContext, lastProps
    );

    expect(nextProps).toEqual({
      foo: 'bar',
    });

    expect(propMergers.foo).toHaveBeenCalledTimes(1);
    expect(propMergers.fizz).toHaveBeenCalledTimes(0);
  });
});

describe(`withMergedProps`, () => {
  it(`composes the expected functionality`, () => {
    const outerProps = {
      foo: 'outerFoo',
      fizz: 'outerFizz',
    };

    const innerProps = {
      foo: 'innerFoo',
      fizz: 'innerFizz',
    };

    const propMergers = {
      foo: jest.fn(() => 'bar'),
      fizz: jest.fn(() => 'buzz'),
    };

    const MyStatelessComponent = () => <div {...innerProps} />;
    const MyWrappedComponent = withMergedProps(propMergers)(MyStatelessComponent);

    const output = renderer.create(
      <MyWrappedComponent {...outerProps} />
    );

    expect(output.root.findByType('div').props).toEqual({
      foo: 'bar',
      fizz: 'buzz',
    });
  });
});
