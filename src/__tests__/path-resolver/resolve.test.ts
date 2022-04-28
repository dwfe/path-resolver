import {describe} from '@jest/globals';
import * as console2 from 'console';
import {ifActionChecks, ifComponentChecks, ifCustomToChecks, ifRedirectToChecks} from '../util';
import {IPathResolveResult} from '../../contract';
import {PathResolver} from '../../path-resolver';

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
      {segment: '**', redirectTo: '/auto'}]}, // unattainable entry!
  {segment: 'auto', component: '<auto/>', children: [
      {segment: 'to-red', customTo: {pathname: '/auto/red', search: '?ford=focus', hash: '#table'}},
      {segment: ':color', component: '<auto-color/>'},
      {segment: '**', redirectTo: '/'}]},
  {segment: ':slide', component: '<slide/>'},
  {segment: '**', component: '<not-found/>'}
], {isDebug: true});
// @formatter:on

//endregion Support

describe('PathResolver, resolve', () => {

  test('component', () => {
    let {entry, pathname, pathnameParams, canActivateEntries} = pr.resolve('/') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(0);
    expect(entry.component).toBe('<index-page/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.component).toBe('<control/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/quotas') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.component).toBe('<ctrl-quotas/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/quotas/files/downloads') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.component).toBe('<quotas-files-downloads/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/quotas/files/pictures') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.component).toBe('<quotas-files-pictures/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/77/achievement-list') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(2);
    expect(entry.component).toBe('<ctrl-user-achievement-list/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/77/hello/world') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(2);
    expect(entry.component).toBe('<ctrl-user-unknown-page/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/auto/') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(0);
    expect(entry.component).toBe('<auto/>');
    ifComponentChecks(entry);

    ({entry, pathname, pathnameParams, canActivateEntries} = pr.resolve('/auto/toyota') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(0);
    expect(entry.component).toBe('<auto-color/>');
    expect(pathname).toBe('/auto/toyota');
    expect(pathnameParams).toEqual({'color': 'toyota'});
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/zY7654dFo') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(0);
    expect(entry.component).toBe('<slide/>');
    ifComponentChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/unknown/path') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(0);
    expect(entry.component).toBe('<not-found/>');
    ifComponentChecks(entry);
  });

  test('redirectTo', () => {
    let {entry, pathname, canActivateEntries} = pr.resolve('/control/quotas/files') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(1);
    expect(entry.redirectTo).toBe('/control');
    ifRedirectToChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/quotas/files/unknown') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.redirectTo).toBe('/control/quotas');
    ifRedirectToChecks(entry);

    ({entry, canActivateEntries} = pr.resolve('/control/quotas/unknown') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(1);
    expect(entry.redirectTo).toBe('/control');
    ifRedirectToChecks(entry);

    // ({target, canActivateEntries} = pr.resolve('/control/unknown') as IPathResolveResult);
    // expect(canActivateEntries.length).toBe(1);
    // ({entry, pathname} = target);
    // expect(entry.redirectTo).toBe('/auto');
    // ifRedirectToChecks(entry);

    ({entry, pathname, canActivateEntries} = pr.resolve('/auto/ford/mustang') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(0);
    expect(entry.redirectTo).toBe('/');
    expect(pathname).toBe('/auto/ford/mustang');
    ifRedirectToChecks(entry);
  });

  test('customTo', () => {
    let {entry, pathname, canActivateEntries} = pr.resolve('/auto/to-red') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(0);
    expect(entry.customTo).toEqual({pathname: '/auto/red', search: '?ford=focus', hash: '#table'});
    expect(pathname).toBe('/auto/to-red');
    ifCustomToChecks(entry);
  });

  test('action', () => {
    let {entry, pathname, pathnameParams, canActivateEntries} = pr.resolve('/control/72/bonuses') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(2);
    expect(entry.action).toBeTruthy();
    expect(pathname).toBe('/control/72/bonuses');
    expect(pathnameParams).toEqual({'userId': '72'});
    ifActionChecks(entry);
  });

  test('canActivate', () => {
    let {entry, pathname, pathnameParams, canActivateEntries} = pr.resolve('/control/56') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(2);
    expect(entry.component).toBe('<ctrl-user/>');
    expect(pathname).toBe('/control/56');
    expect(pathnameParams).toEqual({'userId': '56'});
    expect(canActivateEntries[0].pathTemplate).toBe('/control');
    expect(canActivateEntries[0].canActivate).toStrictEqual(canActivateControl);
    expect(canActivateEntries[1].pathTemplate).toBe('/control/:userId');
    expect(canActivateEntries[1].canActivate).toStrictEqual(canActivateControlUser);

    ({entry, pathname, pathnameParams, canActivateEntries} = pr.resolve('/control/72/bonuses') as IPathResolveResult);
    expect(canActivateEntries.length).toBe(2);
    expect(entry.action).toStrictEqual(action);
    expect(pathname).toBe('/control/72/bonuses');
    expect(pathnameParams).toEqual({'userId': '72'});
    expect(canActivateEntries[0].pathTemplate).toBe('/control');
    expect(canActivateEntries[0].canActivate).toStrictEqual(canActivateControl);
    expect(canActivateEntries[1].pathTemplate).toBe('/control/:userId');
    expect(canActivateEntries[1].canActivate).toStrictEqual(canActivateControlUser);
  });

  test('canDeactivate', () => {
    let {entry, pathname, canActivateEntries} = pr.resolve('/control/quotas/files/documents') as IPathResolveResult;
    expect(canActivateEntries.length).toBe(1);
    expect(pathname).toBe('/control/quotas/files/documents');
    expect(entry.component).toBe('<quotas-files-documents/>');
    expect(entry.canDeactivate).toStrictEqual(canDeactivate);
  });

});
