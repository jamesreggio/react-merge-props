import eqStyle from 'style-equal';
import eqShallow from 'shallow-equals';
import {invariant} from './utils';

/**
 * Merge a prop that accepts functions.
 *
 * The functions are invoked in series; inner function first.
 * The return value behavior is not defined.
 */

export const mergeFunctions = (innerProp, outerProp, lastProp) => {
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
}

/**
 * Merge a prop using a boolean operator.
 *
 * Each value is coerced to a boolean before the operator is applied.
 */

export const mergeBooleans = (op) => {
  switch (op) {
    case '&&': return (innerProp, outerProp) => !!innerProp && !!outerProp;
    case '||': return (innerProp, outerProp) => !!innerProp || !!outerProp;
    default: throw Error(`Unexpected boolean operator: ${op}`);
  }
}

/**
 * Merge a prop that accepts strings.
 *
 * The given value is used to join the strings.
 * The outer string is appended to the inner string.
 * Empty strings are not joined.
 */

export const mergeStrings = (join) => (innerProp, outerProp) => {
  if (!innerProp) {
    return outerProp;
  } else if (!outerProp) {
    return innerProp;
  }

  return `${innerProp}${join}${outerProp}`;
}

/**
 * Merge a prop that accepts React Native styles.
 *
 * Outer styles take precendence over inner styles.
 */

export const mergeStyles = (innerProp, outerProp, lastProp) => {
  let nextProp = [].concat(innerProp, outerProp).filter(Boolean);

  if (nextProp.length === 0) {
    return null;
  } else if (nextProp.length === 1) {
    nextProp = nextProp[0];
  }

  return eqStyle(lastProp, nextProp) ? lastProp : nextProp;
}

/**
 * Assert that only one of the props is defined.
 *
 * This function is only invoked if the outer and inner prop objects both
 * contain the prop, so all it needs to do is throw.
 */

export const assertExclusive = () => {
  throw Error(`Cannot merge prop due to conflicting values`);
};

/**
 * Take the outer prop.
 */

export const takeOuter = (innerProp, outerProp) => (outerProp);
