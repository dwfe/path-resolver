import {describe} from '@jest/globals';
import {IPathResolveResult} from '../../core/a/contract'
import {PathResolver} from '../../core/a/path-resolver';

describe('PathResolver, resolve', () => {

  test('resolve', () => {

    const action = () => console.log('action');
    const canActivate = () => console.log('canActivate');
    const canDeactivate = () => console.log('canDeactivate');

// @formatter:off
    const pr = new PathResolver([
      {segment: '', component: '<index-page/>'},
      {segment: 'control', component: '<control/>', canActivate, children: [
        {segment: 'quotas', component: '<ctrl-quotas/>', children: [
          {segment: 'files', canDeactivate, children: [
            {segment: 'downloads', component: '<quotas-files-downloads/>'},
            {segment: 'pictures', component: '<quotas-files-pictures/>'},
            {segment: 'documents', component: '<quotas-files-documents/>'},
            {segment: '**', redirectTo: '/control/quotas'}]},
          {segment: '**', redirectTo: '/control'}]},
        {segment: ':userId', component: '<ctrl-user/>', children: [
          {segment: 'achievement-list', component: '<ctrl-user-achievement-list/>'},
          {segment: 'bonuses', action},
          {segment: '**', component: '<ctrl-user-unknown-page/>'}]},
        {segment: '**', redirectTo: '/auto'}]},
      {segment: 'auto', component: '<auto/>', children: [
        {segment: 'to-red', customTo: {pathname: '/auto/red', search: '?ford=focus', hash: '#table'}},
        {segment: ':color', component: '<auto-color/>'},
        {segment: '**', redirectTo: '/'}]},
      {segment: '**', component: '<not-found>'}
    ]);
// @formatter:on

    let {entry, pathnameParams} = pr.resolve('/auto/toyota') as IPathResolveResult;
    expect(entry.component).toBe('<auto-color/>');
    expect(pathnameParams).toEqual({'color': 'toyota'});

    ({entry} = pr.resolve('/auto/ford/mustang') as IPathResolveResult);
    expect(entry.redirectTo).toBe('/');

    ({entry} = pr.resolve('/auto/to-red') as IPathResolveResult);
    expect(entry.customTo).toEqual({pathname: '/auto/red', search: '?ford=focus', hash: '#table'});

    ({entry, pathnameParams} = pr.resolve('/control/72/bonuses') as IPathResolveResult);
    expect(pathnameParams).toEqual({'userId': '72'});
    expect(entry.pathTemplate).toBe('/control/:userId/bonuses');
    expect(entry.action).toBeTruthy();


  });

});
