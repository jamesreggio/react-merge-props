/**
 * Throw an exception if a given invariant is not met.
 */

export const invariant = (test, message) => {
  if (!test) {
    throw Error(message);
  }
}

/**
 * Return the display name of a React component.
 */

export const getDisplayName = (Input) => (
  Input.displayName || Input.name || 'Component'
);
