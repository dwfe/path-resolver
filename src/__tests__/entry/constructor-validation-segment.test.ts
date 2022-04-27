import {describe} from '@jest/globals';
import {fillRequired, reqEntry, Throw} from '../util';
import {WILDCARD_SEGMENT} from '../../cmmn';
import {Entry} from '../../entry'

describe('Entry.constructor, "segment" incorrect use', () => {

  test('segment must be a string', () => {
    // @ts-ignore
    Throw(() => Entry.of(fillRequired({segment: true})), 'The segment must be a string');
  });

  test('cannot start with a slash', () => {
    Throw(() => reqEntry({segment: '/'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => reqEntry({segment: '/user'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => reqEntry({segment: '/:user'}), 'Invalid segment [cannot start with a slash]');
    Throw(() => reqEntry({
      segment: 'user', children: [{
        segment: '/info'
      }]
    }), 'Invalid segment [cannot start with a slash]');
    Throw(() => reqEntry({
      segment: ':user', children: [{
        segment: 'info', children: [{
          segment: '/job'
        }]
      }]
    }), 'Invalid segment [cannot start with a slash]');
  });

  test('non-root empty', () => {
    Throw(() => reqEntry({
      segment: 'user', children: [{
        segment: ''
      }]
    }), 'Invalid segment [non-root empty]');
    Throw(() => reqEntry({
      segment: 'user', children: [
        {segment: ''}
      ]
    }), 'Invalid segment [non-root empty]');
    Throw(() => reqEntry({
      segment: ':user', children: [{
        segment: 'info', children: [{
          segment: ''
        }]
      }]
    }), 'Invalid segment [non-root empty]');
  });

  test('segment "" cannot have children', () => {
    Throw(() => reqEntry({
      segment: '', children: [{
        segment: 'user'
      }]
    }), 'An entry with segment "" cannot have children');
  });

  test('"(.*)" incorrect wildcard segment', () => {
    const wildCards = ['*', '(*)', '(.*)', '(.**)', '   *'];
    for (const wildCard of wildCards) {
      Throw(() => reqEntry({
        segment: wildCard
      }), `Incorrect wildcard. Use "${WILDCARD_SEGMENT}"`);
    }
  });

});
