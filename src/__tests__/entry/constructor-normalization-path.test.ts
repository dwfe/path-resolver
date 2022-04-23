import {describe} from '@jest/globals';
import {normCheck} from '../util';

describe('Entry.constructor, "path" normal use', () => {

  test('path, root', () => {
    normCheck({segment: ''}, [{path: '/', segment: ''}], ['path', 'segment']);
    normCheck({segment: 'user'}, [{path: '/user', segment: 'user'}], ['path', 'segment']);
    normCheck({segment: ':user'}, [{path: '/:user', segment: ':user'}], ['path', 'segment']);
    normCheck({segment: '**'}, [{path: '/(.*)', segment: '**'}], ['path', 'segment']);
  });

  test('path', () => {
    normCheck({
      segment: 'control', children: [{
        segment: ':user', children: [{
          segment: '**', component: ''
        }],
      }, {
        segment: 'billing', component: ''
      }, {
        segment: 'quotas', children: [{
          segment: 'files', children: [{
            segment: 'downloads', component: ''
          }, {
            segment: 'pictures', component: ''
          }, {
            segment: 'documents', component: ''
          }, {
            segment: '**', component: ''
          }]
        }, {
          segment: 'mail', component: ''
        }, {
          segment: '**', component: ''
        }]
      }, {
        segment: '**', component: ''
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
