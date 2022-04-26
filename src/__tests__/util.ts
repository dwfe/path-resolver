import {expect} from '@jest/globals'
import {IEntry} from '../core/contract'
import {Entry} from '../core/entry';

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

export function fillRequired(orig: IEntry): IEntry {
  if (!Entry.hasResult(orig))
    orig.component = 'component';
  orig?.children?.forEach(x => fillRequired(x));
  return orig;
}

export function reqEntry(orig: IEntry) {
  return Entry.of(fillRequired(orig));
}

export function normCheck(orig: IEntry, test: Partial<Entry>[], fields: Array<keyof Entry>) {
  const entry = Entry.hasResult(orig) ? Entry.of(orig) : reqEntry(orig);
  const target = Entry.flat(entry);
  expect(target.length).toBe(test.length);
  for (let i = 0; i < target.length; i++) {
    for (const field of fields) {
      expect(target[i][field]).toStrictEqual(test[i][field]);
    }
  }
}
