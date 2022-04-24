import {describe} from '@jest/globals';
import {normCheck} from '../util';

describe('Entry.constructor, "path" normal use', () => {

  test('path, root', () => {
    normCheck({segment: ''}, [{pathname: '/', segment: ''}], ['pathname', 'segment']);
    normCheck({segment: 'user'}, [{pathname: '/user', segment: 'user'}], ['pathname', 'segment']);
    normCheck({segment: ':user'}, [{pathname: '/:user', segment: ':user'}], ['pathname', 'segment']);
    normCheck({segment: '**'}, [{pathname: '/(.*)', segment: '**'}], ['pathname', 'segment']);
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
      {pathname: '/control', segment: 'control'},
      {pathname: '/control/:user', segment: ':user'},
      {pathname: '/control/:user/(.*)', segment: '**'},
      {pathname: '/control/billing', segment: 'billing'},
      {pathname: '/control/quotas', segment: 'quotas'},
      {pathname: '/control/quotas/files', segment: 'files'},
      {pathname: '/control/quotas/files/downloads', segment: 'downloads'},
      {pathname: '/control/quotas/files/pictures', segment: 'pictures'},
      {pathname: '/control/quotas/files/documents', segment: 'documents'},
      {pathname: '/control/quotas/files/(.*)', segment: '**'},
      {pathname: '/control/quotas/mail', segment: 'mail'},
      {pathname: '/control/quotas/(.*)', segment: '**'},
      {pathname: '/control/(.*)', segment: '**'},
    ], ['pathname', 'segment']);
  });

});
