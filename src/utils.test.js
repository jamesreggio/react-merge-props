import {Component} from 'react';

import {
  invariant,
  getDisplayName,
} from './utils';

describe(`invariant`, () => {
  it(`throws when the condition is falsey`, () => {
    expect(() => invariant(null, 'Error message')).toThrowErrorMatchingSnapshot();
  });

  it(`doesn't throw when the condition is truthy`, () => {
    expect(() => invariant({}, 'Error message')).not.toThrow();
  });
});

describe(`getDisplayName`, () => {
  it(`handles React class components`, () => {
    class MyComponent extends Component { }
    expect(getDisplayName(MyComponent)).toBe('MyComponent');
  });

  it(`handles React stateless components`, () => {
    const MyComponent = () => {};
    expect(getDisplayName(MyComponent)).toBe('MyComponent');
  });

  it(`handles unknown components`, () => {
    const UnknownComponent = {};
    expect(getDisplayName(UnknownComponent)).toBe('Component');
  });

  it(`respects overridden component display names`, () => {
    class MyComponent extends Component { }
    MyComponent.displayName = 'OtherComponent';
    expect(getDisplayName(MyComponent)).toBe('OtherComponent');
  });
});
