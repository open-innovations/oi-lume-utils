import { assertInstanceOf } from 'std/assert/mod.ts';
import { describe, it } from 'std/testing/bdd.ts';
import autoDependency from './auto-dependency.ts';

describe('auto-dependency', () => {
  it('should export a function', () => {
    assertInstanceOf(autoDependency, Function);
  });
});
