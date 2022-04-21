import {expect} from '@jest/globals'

export function Throw(fn: Function, message: string) {
  try {
    fn();
  } catch (err) {
    expect(err).toBeInstanceOf(Error);
    expect(err).toHaveProperty('message', message);
    return;
  }
  expect('unreachable code section').toBe('but it came to this anyway');
}

export function noThrow(fn: Function) {
  expect(fn).not.toThrow();
}
