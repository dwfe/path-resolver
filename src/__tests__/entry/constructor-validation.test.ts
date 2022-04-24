import {describe} from '@jest/globals';
import {Entry} from '../../core/a/entry';
import {reqEntry, Throw} from '../util';

describe('Entry.constructor', () => {

  test('resulting field is missing: component, redirectTo, customTo, action or children', () => {
    Throw(() => Entry.of({segment: ''}), 'The resulting field is missing. Fill one of: component, redirectTo, customTo, action or children');
  });

});
