import {describe} from '@jest/globals';
import {normCheck} from '../util';

describe('Entry.constructor, "path" normal use', () => {

  test('path, root', () => {
    normCheck({segment: ''}, [{pathTemplate: '/', segment: ''}], ['pathTemplate', 'segment']);
    normCheck({segment: 'user'}, [{pathTemplate: '/user', segment: 'user'}], ['pathTemplate', 'segment']);
    normCheck({segment: ':user'}, [{pathTemplate: '/:user', segment: ':user'}], ['pathTemplate', 'segment']);
    normCheck({segment: '**'}, [{pathTemplate: '/(.*)', segment: '**'}], ['pathTemplate', 'segment']);
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
      {pathTemplate: '/control', segment: 'control'},
      {pathTemplate: '/control/:user', segment: ':user'},
      {pathTemplate: '/control/:user/(.*)', segment: '**'},
      {pathTemplate: '/control/billing', segment: 'billing'},
      {pathTemplate: '/control/quotas', segment: 'quotas'},
      {pathTemplate: '/control/quotas/files', segment: 'files'},
      {pathTemplate: '/control/quotas/files/downloads', segment: 'downloads'},
      {pathTemplate: '/control/quotas/files/pictures', segment: 'pictures'},
      {pathTemplate: '/control/quotas/files/documents', segment: 'documents'},
      {pathTemplate: '/control/quotas/files/(.*)', segment: '**'},
      {pathTemplate: '/control/quotas/mail', segment: 'mail'},
      {pathTemplate: '/control/quotas/(.*)', segment: '**'},
      {pathTemplate: '/control/(.*)', segment: '**'},
    ], ['pathTemplate', 'segment']);
  });

});
