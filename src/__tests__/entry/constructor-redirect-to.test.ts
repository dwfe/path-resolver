import {describe} from '@jest/globals'
import {normCheck} from '../util'

describe('Entry.constructor, redirectTo normal use', () => {

  test('redirectTo, root', () => {
    normCheck({segment: '', redirectTo: '/'}, [{redirectTo: '/'}], ['redirectTo']);
    normCheck({segment: '', redirectTo: '/hello'}, [{redirectTo: '/hello'}], ['redirectTo']);
  });

  test('redirectTo', () => {
    normCheck({
        segment: 'control', children: [{
          segment: ':user', children: [{
            segment: '**', redirectTo: '/not-found'
          }],
        }],
      }, [
        {},
        {},
        {redirectTo: '/not-found'}
      ],
      ['redirectTo']);
  });

});
