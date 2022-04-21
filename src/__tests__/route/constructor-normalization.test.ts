import {describe, expect} from '@jest/globals';
import {Route} from '../../core/a/route';

//region Support

export function path(parentPath: string, origPath: string, testPath?: string) {
  const parent = parentPath !== undefined && Route.of({path: parentPath}) || undefined;
  const route = Route.of({path: origPath}, parent);
  expect(route.orig.path).toBe(origPath);
  if (testPath !== undefined)
    expect(route.path).toBe(testPath);
}

export function rootPath(origPath: string, testPath?: string) {
  path(undefined as unknown as string, origPath, testPath);
}



//endregion Support

describe('Route.constructor, normal use', () => {

  test('path', () => {
    Route.of({path: ''}) // '/'
    Route.of({path: 'user'}) // '/user'
    Route.of({path: ':user'}) // '/:user'
    Route.of({path: '**'}) // '/(.*)'

    Route.of({
      path: 'control', children: [{
        path: 'user'
      }]
    }) // '/control/user'
    Route.of({
      path: 'control', children: [{
        path: ':user'
      }]
    }) // '/control/:user'
    Route.of({
      path: 'control', children: [{
        path: '**'
      }]
    }) // '/control/(.*)'

  });

  test('path', () => {
    rootPath('', '/');
    rootPath('user', '/user');
    rootPath(':user', '/:user');
    rootPath('**', '/(.*)');

    path('', 'user', '/user');
    path('', ':user', '/:user');
    path('control', 'user', '/control/user');
    path('control', ':user', '/control/:user');
    path(':control', 'user', '/:control/user');
    path(':control', ':user', '/:control/:user');
    path('user', '**', '/user/(.*)');
    path(':user', '**', '/:user/(.*)');
  });

});
