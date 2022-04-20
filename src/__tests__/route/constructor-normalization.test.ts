import {describe, expect} from '@jest/globals';
import {Route} from '../../core/a/route';
import {IRoute} from '../../core/contract';

function path(testPath: string, parentOrig: any = null, orig: IRoute) {
  const parent = parentOrig && Route.of(parentOrig) || parentOrig as Route;
  const route = Route.of(orig, parent);
  expect(route.orig.path).toBe(orig.path);
  expect(route.path).toBe(testPath);
}

describe(`Route.constructor, normal use`, () => {

  test(`path`, () => {
    path('/', null, {path: ''});
    path('/user', null, {path: 'user'});
    path('/user', {path: ''}, {path: 'user'});
    path('/user', {path: ''}, {path: ''});
    path('/account/user', {path: 'account'}, {path: 'user'});
    path('/:user', {path: ''}, {path: 'user'});
    // path('',);

  });

});
