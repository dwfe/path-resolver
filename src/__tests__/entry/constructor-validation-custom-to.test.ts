import {describe} from '@jest/globals';
import {Entry} from '../../core/a/entry';
import {Throw} from '../util';

describe('Entry.constructor, customTo incorrect use', () => {

  test('must be an object', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: 123}), 'Incorrect "customTo". It must be an object');
  });

  test('incorrect "pathname"', () => {
    Throw(() => Entry.of({segment: '', customTo: {}}), 'Incorrect "pathname"');
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: {pathname: 123}}), 'Incorrect "pathname"');
  });

  test('must start with "/"', () => {
    Throw(() => Entry.of({segment: '', customTo: {pathname: ''}}), '"pathname" must start with "/"');
    Throw(() => Entry.of({segment: '', customTo: {pathname: '123'}}), '"pathname" must start with "/"');
  });

});
