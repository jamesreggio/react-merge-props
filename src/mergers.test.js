import {
  mergeFunctions,
  mergeBooleans,
  mergeStrings,
  mergeStyles,
  assertExclusive,
  takeOuter,
} from './mergers';

describe(`mergeFunctions`, () => {
  it(`handles no props`, () => {
    const innerProp = null;
    const outerProp = null;
    const nextProp = mergeFunctions(innerProp, outerProp);
    expect(nextProp).toBe(null);
  });

  it(`handles a sole innerProp`, () => {
    const innerProp = jest.fn();
    const outerProp = null;
    const nextProp = mergeFunctions(innerProp, outerProp);
    nextProp();
    expect(innerProp).toHaveBeenCalledTimes(1);
  });

  it(`handles a sole outerProp`, () => {
    const innerProp = null;
    const outerProp = jest.fn();
    const nextProp = mergeFunctions(innerProp, outerProp);
    nextProp();
    expect(outerProp).toHaveBeenCalledTimes(1);
  });

  it(`returns a function that invokes both props`, () => {
    const innerProp = jest.fn();
    const outerProp = jest.fn();
    const nextProp = mergeFunctions(innerProp, outerProp);
    nextProp();
    expect(innerProp).toHaveBeenCalledTimes(1);
    expect(outerProp).toHaveBeenCalledTimes(1);
  });

  it(`passes all arguments to both props`, () => {
    const innerProp = jest.fn();
    const outerProp = jest.fn();
    const nextProp = mergeFunctions(innerProp, outerProp);
    nextProp(1, 2, 3);
    expect(innerProp).toHaveBeenCalledWith(1, 2, 3);
    expect(outerProp).toHaveBeenCalledWith(1, 2, 3);
  });

  it(`preserves referential equality when props haven't changed`, () => {
    const innerProp = jest.fn();
    const outerProp = jest.fn();
    const lastProp = mergeFunctions(innerProp, outerProp);
    const nextProp = mergeFunctions(innerProp, outerProp, lastProp);
    expect(lastProp).toBe(nextProp);
  });

  it(`throws on non-function props`, () => {
    {
      const innerProp = 42;
      const outerProp = jest.fn();
      expect(() => mergeFunctions(innerProp, outerProp))
        .toThrowErrorMatchingSnapshot();
    }

    {
      const innerProp = jest.fn();
      const outerProp = {};
      expect(() => mergeFunctions(innerProp, outerProp))
        .toThrowErrorMatchingSnapshot();
    }
  });
});

describe(`mergeBooleans`, () => {
  it(`performs logical AND`, () => {
    {
      const innerProp = true;
      const outerProp = true;
      const nextProp = mergeBooleans('&&')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }

    {
      const innerProp = true;
      const outerProp = false;
      const nextProp = mergeBooleans('&&')(innerProp, outerProp);
      expect(nextProp).toBe(false);
    }
  });

  it(`performs logical OR`, () => {
    {
      const innerProp = true;
      const outerProp = false;
      const nextProp = mergeBooleans('||')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }

    {
      const innerProp = false;
      const outerProp = false;
      const nextProp = mergeBooleans('||')(innerProp, outerProp);
      expect(nextProp).toBe(false);
    }
  });

  it(`coerces props before the logical operation`, () => {
    {
      const innerProp = {}; // Truthy
      const outerProp = 0;  // Falsey
      const nextProp = mergeBooleans('||')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }

    {
      const innerProp = null; // Falsey
      const outerProp = [];   // Truthy
      const nextProp = mergeBooleans('&&')(innerProp, outerProp);
      expect(nextProp).toBe(false);
    }
  });

  it(`throws on invalid operations`, () => {
    expect(() => mergeBooleans('^')).toThrowErrorMatchingSnapshot();
  });
});

describe(`mergeStrings`, () => {
  it(`handles no props`, () => {
    const innerProp = null;
    const outerProp = null;
    const nextProp = mergeStrings(' ')(innerProp, outerProp);
    expect(nextProp).toBe(null);
  });

  it(`handles a sole innerProp`, () => {
    const innerProp = 'foo';
    const outerProp = null;
    const nextProp = mergeStrings(' ')(innerProp, outerProp);
    expect(nextProp).toBe(innerProp);
  });

  it(`handles a sole outerProp`, () => {
    const innerProp = null;
    const outerProp = 'bar';
    const nextProp = mergeStrings(' ')(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });

  it(`doesn't join empty strings`, () => {
    const innerProp = '';
    const outerProp = 'bar';
    const nextProp = mergeStrings(' ')(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });

  it(`returns a string joined by the specified token`, () => {
    const innerProp = 'foo';
    const outerProp = 'bar';
    const nextProp = mergeStrings(' ')(innerProp, outerProp);
    expect(nextProp).toBe('foo bar');
  });
});

describe(`mergeStyles`, () => {
  it(`handles no props`, () => {
    const innerProp = null;
    const outerProp = null;
    const nextProp = mergeStyles(innerProp, outerProp);
    expect(nextProp).toEqual(null);
  });

  it(`handles a sole innerProp`, () => {
    const innerProp = [123, {color: 'red'}];
    const outerProp = null;
    const nextProp = mergeStyles(innerProp, outerProp);
    expect(nextProp).toEqual(innerProp);
  });

  it(`handles a sole outerProp`, () => {
    const innerProp = null;
    const outerProp = 456;
    const nextProp = mergeStyles(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });

  it(`returns a style that combines both props`, () => {
    const innerProp = [123, {color: 'red'}];
    const outerProp = 456;
    const nextProp = mergeStyles(innerProp, outerProp);
    // `innerProp` styles must appear before `outerProp` styles.
    expect(nextProp).toEqual([123, {color: 'red'}, 456]);
  });

  it(`preserves referential equality when props haven't changed`, () => {
    const innerProp = [123, {color: 'red'}];
    const outerProp = 456;
    const lastProp = mergeStyles(innerProp, outerProp);
    const nextProp = mergeStyles(innerProp, outerProp, lastProp);
    expect(lastProp).toBe(nextProp);
  });
});

describe(`assertExclusive`, () => {
  it(`throws always`, () => {
    expect(() => assertExclusive()).toThrowErrorMatchingSnapshot();
  });
});

describe(`takeOuter`, () => {
  it(`always returns the outer prop`, () => {
    {
      const innerProp = null;
      const outerProp = {};
      const nextProp = takeOuter(innerProp, outerProp);
      expect(nextProp).toBe(outerProp);
    }

    {
      const innerProp = {};
      const outerProp = undefined;
      const nextProp = takeOuter(innerProp, outerProp);
      expect(nextProp).toBe(outerProp);
    }
  });
});
