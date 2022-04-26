import {describe} from '@jest/globals';
import * as console2 from 'console';
import {ifActionChecks, ifComponentChecks, ifCustomToChecks, ifRedirectToChecks} from '../util';
import {IPathResolveResult} from '../../core/contract';
import {PathResolver} from '../../core/path-resolver';

//region Support

global.console = console2;

const action = () => console.log('action');
const canActivateControl = () => console.log('canActivate "/control"');
const canActivateControlUser = () => console.log('canActivate "/control/:user"');
const canDeactivate = () => console.log('canDeactivate');

// @formatter:off
const pr = new PathResolver([
  {segment: '', component: '<index-page/>'},
  {segment: 'control', component: '<control/>', canActivate: canActivateControl, children: [
      {segment: 'quotas', component: '<ctrl-quotas/>', children: [
          {segment: 'files', children: [
              {segment: 'downloads', component: '<quotas-files-downloads/>'},
              {segment: 'pictures', component: '<quotas-files-pictures/>'},
              {segment: 'documents', component: '<quotas-files-documents/>', canDeactivate},
              {segment: '**', redirectTo: '/control/quotas'}]},
          {segment: '**', redirectTo: '/control'}]},
      {segment: ':userId', component: '<ctrl-user/>', canActivate: canActivateControlUser, children: [
          {segment: 'achievement-list', component: '<ctrl-user-achievement-list/>'},
          {segment: 'bonuses', action},
          {segment: '**', component: '<ctrl-user-unknown-page/>'}]},
      {segment: '**', redirectTo: '/auto'}]},
  {segment: 'auto', component: '<auto/>', children: [
      {segment: 'to-red', customTo: {pathname: '/auto/red', search: '?ford=focus', hash: '#table'}},
      {segment: ':color', component: '<auto-color/>'},
      {segment: '**', redirectTo: '/'}]},
  {segment: '**', component: '<not-found>'}
], {isDebug: true});
// @formatter:on

//endregion Support

describe('PathResolver, resolve', () => {

  test('component', () => {
    let {target, canActivateArr} = pr.resolve('/auto/toyota') as IPathResolveResult;
    expect(canActivateArr.length).toBe(0);
    let {entry, pathname, pathnameParams} = target;
    expect(entry.component).toBe('<auto-color/>');
    expect(pathname).toBe('/auto/toyota');
    expect(pathnameParams).toEqual({'color': 'toyota'});
    ifComponentChecks(entry);

    ({target, canActivateArr} = pr.resolve('/') as IPathResolveResult);
    expect(canActivateArr.length).toBe(0);
    ({entry} = target);
    expect(entry.component).toBe('<index-page/>');

    ({target, canActivateArr} = pr.resolve('/control/quotas/files/pictures') as IPathResolveResult);
    expect(canActivateArr.length).toBe(1);
    ({entry} = target);
    expect(entry.component).toBe('<quotas-files-pictures/>');

  });

  test('redirectTo', () => {
    let {target, canActivateArr} = pr.resolve('/auto/ford/mustang') as IPathResolveResult;
    expect(canActivateArr.length).toBe(0);
    let {entry, pathname} = target;
    expect(entry.redirectTo).toBe('/');
    expect(pathname).toBe('/auto/ford/mustang');
    ifRedirectToChecks(entry);
  });

  test('customTo', () => {
    let {target, canActivateArr} = pr.resolve('/auto/to-red') as IPathResolveResult;
    expect(canActivateArr.length).toBe(0);
    let {entry, pathname} = target;
    expect(entry.customTo).toEqual({pathname: '/auto/red', search: '?ford=focus', hash: '#table'});
    expect(pathname).toBe('/auto/to-red');
    ifCustomToChecks(entry);
  });

  test('action', () => {
    let {target, canActivateArr} = pr.resolve('/control/72/bonuses') as IPathResolveResult;
    expect(canActivateArr.length).toBe(2);
    let {entry, pathname, pathnameParams} = target;
    expect(entry.action).toBeTruthy();
    expect(pathname).toBe('/control/72/bonuses');
    expect(pathnameParams).toEqual({'userId': '72'});
    ifActionChecks(entry);
  });

  test('canActivate', () => {
    let {target, canActivateArr} = pr.resolve('/control/72/bonuses') as IPathResolveResult;
    expect(canActivateArr.length).toBe(2);
    let {entry, pathname, pathnameParams} = target;
    expect(entry.action).toStrictEqual(action);
    expect(pathname).toBe('/control/72/bonuses');
    expect(pathnameParams).toEqual({'userId': '72'});
    expect(canActivateArr[0].pathTemplate).toBe('/control');
    expect(canActivateArr[0].canActivate).toStrictEqual(canActivateControl);
    expect(canActivateArr[1].pathTemplate).toBe('/control/:userId');
    expect(canActivateArr[1].canActivate).toStrictEqual(canActivateControlUser);

    ({target, canActivateArr} = pr.resolve('/control/56') as IPathResolveResult);
    expect(canActivateArr.length).toBe(2);
    ({entry, pathname, pathnameParams} = target);
    expect(entry.component).toBe('<ctrl-user/>');
    expect(pathname).toBe('/control/56');
    expect(pathnameParams).toEqual({'userId': '56'});
    expect(canActivateArr[0].pathTemplate).toBe('/control');
    expect(canActivateArr[0].canActivate).toStrictEqual(canActivateControl);
    expect(canActivateArr[1].pathTemplate).toBe('/control/:userId');
    expect(canActivateArr[1].canActivate).toStrictEqual(canActivateControlUser);
  });

  test('canDeactivate', () => {
    let {target, canActivateArr} = pr.resolve('/control/quotas/files/documents') as IPathResolveResult;
    expect(canActivateArr.length).toBe(1);
    let {entry, pathname} = target;
    expect(pathname).toBe('/control/quotas/files/documents');
    expect(entry.component).toBe('<quotas-files-documents/>');
    expect(entry.canDeactivate).toStrictEqual(canDeactivate);
  });

  test('result is Children', () => {
    let {target, canActivateArr} = pr.resolve('/control/quotas/files') as IPathResolveResult;
    expect(canActivateArr.length).toBe(1);
    let {entry, pathname} = target;
    expect(pathname).toBe('/control/quotas/files');
    expect(entry.pathTemplate).toBe('/control/quotas/(.*)');
    expect(entry.redirectTo).toBe('/control');
  });

});
