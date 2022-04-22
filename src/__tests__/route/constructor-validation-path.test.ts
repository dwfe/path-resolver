import {describe} from '@jest/globals';
import {WILDCARD_SEGMENT} from '../../core/a/util';
import {Entry} from '../../core/a/entry'
import {Throw} from '../util';

describe('"segment" incorrect use', () => {

  test('segment must be a string', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: true}), 'The segment must be a string');
  });

  test('cannot start with a slash', () => {
    Throw(() => Entry.of({segment: '/'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => Entry.of({segment: '/user'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => Entry.of({segment: '/:user'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => Entry.of({
      segment: 'user', children: [{
        segment: '/info'
      }]
    }), 'Invalid segment [cannot start with a slash]');
    Throw(() => Entry.of({
      segment: ':user', children: [{
        segment: 'info', children: [{
          segment: '/job'
        }]
      }]
    }), 'Invalid segment [cannot start with a slash]');
  });

  test('non-root empty', () => {
    Throw(() => Entry.of({
      segment: 'user', children: [{
        segment: ''
      }]
    }), 'Invalid segment [non-root empty]');
    Throw(() => Entry.of({
      segment: 'user', children: [
        {segment: ''}
      ]
    }), 'Invalid segment [non-root empty]');
    Throw(() => Entry.of({
      segment: ':user', children: [{
        segment: 'info', children: [{
          segment: ''
        }]
      }]
    }), 'Invalid segment [non-root empty]');
  });

  test('segment "" cannot have children', () => {
    Throw(() => Entry.of({
      segment: '', children: [{
        segment: 'user'
      }]
    }), 'An entry with segment "" cannot have children');
  });

  test('"(.*)" incorrect wildcard segment', () => {
    const wildCards = ['*', '(*)', '(.*)', '(.**)', '   *'];
    for (const wildCard of wildCards) {
      Throw(() => Entry.of({
        segment: wildCard
      }), `Incorrect wildcard. Use "${WILDCARD_SEGMENT}"`);
    }
  });

});
