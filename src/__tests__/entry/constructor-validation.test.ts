import {describe} from '@jest/globals';
import {Entry} from '../../core/a/entry';
import {entry, Throw} from '../util';

describe('Entry.constructor', () => {

  test('resulting field is missing: component, redirectTo, customTo, action or children', () => {
    Throw(() => Entry.of({segment: ''}), 'The resulting field is missing. Fill one of: component, redirectTo, customTo, action or children');
  });

  test('"action" must be a function', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: 'user', action: ''}), '"action" must be a function');
  });

  test('"canActivate" must be a function', () => {
    // @ts-ignore
    Throw(() => entry({segment: 'user', canActivate: null}), '"canActivate" must be a function');
  });

  test('"canDeactivate" must be a function', () => {
    // @ts-ignore
    Throw(() => entry({segment: 'user', canDeactivate: true}), '"canDeactivate" must be a function');
  });


});
