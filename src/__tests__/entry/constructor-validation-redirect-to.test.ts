import {Throw} from '@do-while-for-each/test';
import {describe} from '@jest/globals';
import {Entry} from '../../entry';

describe('Entry.constructor, redirectTo incorrect use', () => {

  test('must be a string', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', redirectTo: {}}), '"redirectTo" must be a string');
  });

  test('must start with the character "/"', () => {
    Throw(() => Entry.of({segment: '', redirectTo: ''}), '"redirectTo" must start with the "/" character');
  });

});
