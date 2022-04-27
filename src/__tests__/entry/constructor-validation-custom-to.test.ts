import {describe} from '@jest/globals';
import {Entry} from '../../entry';
import {Throw} from '../util';

describe('Entry.constructor, customTo incorrect use', () => {

  test('must be an object', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: 123}), 'Incorrect "customTo". It must be an object');
  });

  test('incorrect "pathname", must be a string', () => {
    Throw(() => Entry.of({segment: '', customTo: {}}), 'Incorrect "pathname", must be a string');
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: {pathname: 123}}), 'Incorrect "pathname", must be a string');
  });

  test('"pathname" must start with "/"', () => {
    Throw(() => Entry.of({segment: '', customTo: {pathname: ''}}), '"pathname" must start with "/"');
    Throw(() => Entry.of({segment: '', customTo: {pathname: '123'}}), '"pathname" must start with "/"');
  });

  test('"search" must be a string', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: {pathname: '/hello', search: 123}}), 'Incorrect "search", must be a string');
  });

  test('"search" must start with "?"', () => {
    Throw(() => Entry.of({segment: '', customTo: {pathname: '/hello', search: 'ds'}}), '"search" must start with "?"');
  });

  test('"hash" must be a string', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', customTo: {pathname: '/hello', hash: true}}), 'Incorrect "hash", must be a string');
  });

  test('"hash" must start with "?"', () => {
    Throw(() => Entry.of({segment: '', customTo: {pathname: '/hello', hash: 'head'}}), '"hash" must start with "#"');
  });

});
