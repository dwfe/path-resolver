import {describe} from '@jest/globals';
import {PathResolver} from '../../core/a/path-resolver';

describe('PathResolver, resolve', () => {

  test('resolve', () => {

    const pathResolver = new PathResolver([
      {segment: '', component: '<indef-page/>'},
      {
        segment: 'control', component: '<control/>', children: [
          {
            segment: 'quotas', component: '<ctrl-quotas/>', children: [
              {
                segment: 'files', children: [
                  {segment: 'downloads', component: '<quotas-files-downloads/>'},
                  {segment: 'pictures', component: '<quotas-files-pictures/>'},
                  {segment: 'documents', component: '<quotas-files-documents/>'},
                  {segment: '**', redirectTo: '/control/quotas'}]
              },
              {segment: '**', redirectTo: '/control'}]
          },
          {
            segment: ':user', component: '<ctrl-user/>', children: [
              {segment: 'achievement-list', component: '<ctrl-user-achievement-list/>'},
              {segment: 'bonuses', component: '<ctrl-user-bonuses/>'},
              {segment: '**', component: '<ctrl-user-unknown-page/>'}]
          },
          {segment: '**', redirectTo: '/auto'}]
      },
      {
        segment: 'auto', component: '<auto/>', children: [
          {segment: 'to-red', customTo: {pathname: '/auto/red', search: '?hello=12', hash: '#qwe'}},
          {segment: ':color', component: '<auto-color/>'},
          {segment: '**', redirectTo: '/'}]
      },
      {segment: '**', component: '<not-found>'}
    ]);

    // expect(pathResolver.resolve('/control/hello')?.entry.pathTemplate).toBe('/control/hello')
    // expect(pathResolver.resolve('/control')?.entry.pathTemplate).toBe('/(.*)')
    // expect(pathResolver.resolve('/control/12/qwerty')?.entry.pathTemplate).toBe(1)
    // expect(pathResolver.resolve('/hello')?.entry.pathTemplate).toBe(1)

  });

});
