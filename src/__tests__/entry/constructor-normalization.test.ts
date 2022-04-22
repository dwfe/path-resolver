import {describe, expect} from '@jest/globals';
import {IEntry} from '../../core/contract';
import {Entry} from '../../core/a/entry';
import {entry} from '../util';

//region Support

function check(orig: IEntry, test: Partial<Entry>[], fields: Array<keyof Entry>) {
  const target = Entry.flat(entry(orig));
  expect(target.length).toBe(test.length);
  for (let i = 0; i < target.length; i++) {
    for (const field of fields) {
      expect(target[i][field]).toBe(test[i][field]);
    }
  }
}

//endregion Support

describe('Entry.constructor, normal use', () => {

  test('path, root', () => {
    check({segment: ''}, [{path: '/', segment: ''}], ['path', 'segment']);
    check({segment: 'user'}, [{path: '/user', segment: 'user'}], ['path', 'segment']);
    check({segment: ':user'}, [{path: '/:user', segment: ':user'}], ['path', 'segment']);
    check({segment: '**'}, [{path: '/(.*)', segment: '**'}], ['path', 'segment']);
  });

  test('path', () => {
    check({
      segment: 'control', children: [{
        segment: ':user', children: [{
          segment: '**'
        }],
      }, {
        segment: 'billing'
      }, {
        segment: 'quotas', children: [{
          segment: 'files', children: [{
            segment: 'downloads'
          }, {
            segment: 'pictures'
          }, {
            segment: 'documents'
          }, {
            segment: '**'
          }]
        }, {
          segment: 'mail'
        }, {
          segment: '**'
        }]
      }, {
        segment: '**'
      }],
    }, [
      {path: '/control', segment: 'control'},
      {path: '/control/:user', segment: ':user'},
      {path: '/control/:user/(.*)', segment: '**'},
      {path: '/control/billing', segment: 'billing'},
      {path: '/control/quotas', segment: 'quotas'},
      {path: '/control/quotas/files', segment: 'files'},
      {path: '/control/quotas/files/downloads', segment: 'downloads'},
      {path: '/control/quotas/files/pictures', segment: 'pictures'},
      {path: '/control/quotas/files/documents', segment: 'documents'},
      {path: '/control/quotas/files/(.*)', segment: '**'},
      {path: '/control/quotas/mail', segment: 'mail'},
      {path: '/control/quotas/(.*)', segment: '**'},
      {path: '/control/(.*)', segment: '**'},
    ], ['path', 'segment']);
  });

});
