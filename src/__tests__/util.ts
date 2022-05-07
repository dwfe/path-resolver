import {expect} from '@jest/globals'
import {IEntry} from '../contract'
import {Entry} from '../entry';

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


function isUndefined(arr: any[]) {
  expect(arr.every(x => x === undefined)).toBe(true);
}

export function ifComponentChecks({redirectTo, customTo, action}: Entry) {
  isUndefined([redirectTo, customTo, action]);
}

export function ifRedirectToChecks({component, customTo, action}: Entry) {
  isUndefined([component, customTo, action]);
}

export function ifCustomToChecks({component, redirectTo, action}: Entry) {
  isUndefined([component, redirectTo, action]);
}

export function ifActionChecks({component, redirectTo, customTo}: Entry) {
  isUndefined([component, redirectTo, customTo]);
}
