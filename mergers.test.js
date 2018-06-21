"use strict";

var _mergers = require("./mergers");

describe("mergeFunctions", function () {
  it("handles no props", function () {
    var innerProp = null;
    var outerProp = null;
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    expect(nextProp).toBe(null);
  });
  it("handles a sole innerProp", function () {
    var innerProp = jest.fn();
    var outerProp = null;
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    nextProp();
    expect(innerProp).toHaveBeenCalledTimes(1);
  });
  it("handles a sole outerProp", function () {
    var innerProp = null;
    var outerProp = jest.fn();
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    nextProp();
    expect(outerProp).toHaveBeenCalledTimes(1);
  });
  it("returns a function that invokes both props", function () {
    var innerProp = jest.fn();
    var outerProp = jest.fn();
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    nextProp();
    expect(innerProp).toHaveBeenCalledTimes(1);
    expect(outerProp).toHaveBeenCalledTimes(1);
  });
  it("passes all arguments to both props", function () {
    var innerProp = jest.fn();
    var outerProp = jest.fn();
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    nextProp(1, 2, 3);
    expect(innerProp).toHaveBeenCalledWith(1, 2, 3);
    expect(outerProp).toHaveBeenCalledWith(1, 2, 3);
  });
  it("preserves referential equality when props haven't changed", function () {
    var innerProp = jest.fn();
    var outerProp = jest.fn();
    var lastProp = (0, _mergers.mergeFunctions)(innerProp, outerProp);
    var nextProp = (0, _mergers.mergeFunctions)(innerProp, outerProp, lastProp);
    expect(lastProp).toBe(nextProp);
  });
  it("throws on non-function props", function () {
    {
      var innerProp = 42;
      var outerProp = jest.fn();
      expect(function () {
        return (0, _mergers.mergeFunctions)(innerProp, outerProp);
      }).toThrowErrorMatchingSnapshot();
    }
    {
      var _innerProp = jest.fn();

      var _outerProp = {};
      expect(function () {
        return (0, _mergers.mergeFunctions)(_innerProp, _outerProp);
      }).toThrowErrorMatchingSnapshot();
    }
  });
});
describe("mergeBooleans", function () {
  it("performs logical AND", function () {
    {
      var innerProp = true;
      var outerProp = true;
      var nextProp = (0, _mergers.mergeBooleans)('&&')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }
    {
      var _innerProp2 = true;
      var _outerProp2 = false;

      var _nextProp = (0, _mergers.mergeBooleans)('&&')(_innerProp2, _outerProp2);

      expect(_nextProp).toBe(false);
    }
  });
  it("performs logical OR", function () {
    {
      var innerProp = true;
      var outerProp = false;
      var nextProp = (0, _mergers.mergeBooleans)('||')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }
    {
      var _innerProp3 = false;
      var _outerProp3 = false;

      var _nextProp2 = (0, _mergers.mergeBooleans)('||')(_innerProp3, _outerProp3);

      expect(_nextProp2).toBe(false);
    }
  });
  it("coerces props before the logical operation", function () {
    {
      var innerProp = {}; // Truthy

      var outerProp = 0; // Falsey

      var nextProp = (0, _mergers.mergeBooleans)('||')(innerProp, outerProp);
      expect(nextProp).toBe(true);
    }
    {
      var _innerProp4 = null; // Falsey

      var _outerProp4 = []; // Truthy

      var _nextProp3 = (0, _mergers.mergeBooleans)('&&')(_innerProp4, _outerProp4);

      expect(_nextProp3).toBe(false);
    }
  });
  it("throws on invalid operations", function () {
    expect(function () {
      return (0, _mergers.mergeBooleans)('^');
    }).toThrowErrorMatchingSnapshot();
  });
});
describe("mergeStrings", function () {
  it("handles no props", function () {
    var innerProp = null;
    var outerProp = null;
    var nextProp = (0, _mergers.mergeStrings)(' ')(innerProp, outerProp);
    expect(nextProp).toBe(null);
  });
  it("handles a sole innerProp", function () {
    var innerProp = 'foo';
    var outerProp = null;
    var nextProp = (0, _mergers.mergeStrings)(' ')(innerProp, outerProp);
    expect(nextProp).toBe(innerProp);
  });
  it("handles a sole outerProp", function () {
    var innerProp = null;
    var outerProp = 'bar';
    var nextProp = (0, _mergers.mergeStrings)(' ')(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });
  it("doesn't join empty strings", function () {
    var innerProp = '';
    var outerProp = 'bar';
    var nextProp = (0, _mergers.mergeStrings)(' ')(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });
  it("returns a string joined by the specified token", function () {
    var innerProp = 'foo';
    var outerProp = 'bar';
    var nextProp = (0, _mergers.mergeStrings)(' ')(innerProp, outerProp);
    expect(nextProp).toBe('foo bar');
  });
});
describe("mergeStyles", function () {
  it("handles no props", function () {
    var innerProp = null;
    var outerProp = null;
    var nextProp = (0, _mergers.mergeStyles)(innerProp, outerProp);
    expect(nextProp).toEqual(null);
  });
  it("handles a sole innerProp", function () {
    var innerProp = [123, {
      color: 'red'
    }];
    var outerProp = null;
    var nextProp = (0, _mergers.mergeStyles)(innerProp, outerProp);
    expect(nextProp).toEqual(innerProp);
  });
  it("handles a sole outerProp", function () {
    var innerProp = null;
    var outerProp = 456;
    var nextProp = (0, _mergers.mergeStyles)(innerProp, outerProp);
    expect(nextProp).toBe(outerProp);
  });
  it("returns a style that combines both props", function () {
    var innerProp = [123, {
      color: 'red'
    }];
    var outerProp = 456;
    var nextProp = (0, _mergers.mergeStyles)(innerProp, outerProp); // `innerProp` styles must appear before `outerProp` styles.

    expect(nextProp).toEqual([123, {
      color: 'red'
    }, 456]);
  });
  it("preserves referential equality when props haven't changed", function () {
    var innerProp = [123, {
      color: 'red'
    }];
    var outerProp = 456;
    var lastProp = (0, _mergers.mergeStyles)(innerProp, outerProp);
    var nextProp = (0, _mergers.mergeStyles)(innerProp, outerProp, lastProp);
    expect(lastProp).toBe(nextProp);
  });
});
describe("assertExclusive", function () {
  it("throws always", function () {
    expect(function () {
      return (0, _mergers.assertExclusive)();
    }).toThrowErrorMatchingSnapshot();
  });
});
describe("takeOuter", function () {
  it("always returns the outer prop", function () {
    {
      var innerProp = null;
      var outerProp = {};
      var nextProp = (0, _mergers.takeOuter)(innerProp, outerProp);
      expect(nextProp).toBe(outerProp);
    }
    {
      var _innerProp5 = {};
      var _outerProp5 = undefined;

      var _nextProp4 = (0, _mergers.takeOuter)(_innerProp5, _outerProp5);

      expect(_nextProp4).toBe(_outerProp5);
    }
  });
});