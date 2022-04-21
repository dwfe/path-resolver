import {describe} from '@jest/globals';
import {WILDCARD_PATH} from '../../core/a/util';
import {Route} from '../../core/a/route'
import {Throw} from '../util';

describe('"path" incorrect use', () => {

  test('cannot start with a slash', () => {
    Throw(() => Route.of({path: '/'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({path: '/user'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({path: '/:user'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: 'user', children: [{
        path: '/info'
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: ':user', children: [{
        path: 'info', children: [{
          path: '/job'
        }]
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
  });

  test('non-root empty', () => {
    Throw(() => Route.of({
      path: 'user', children: [{
        path: ''
      }]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: 'user', children: [
        {path: ''}
      ]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: ':user', children: [{
        path: 'info', children: [{
          path: ''
        }]
      }]
    }), `Invalid route's "path" [non-root empty]`);
  });

  test('path "" cannot have children', () => {
    Throw(() => Route.of({
      path: '', children: [{
        path: 'user'
      }]
    }), 'A route with path "" cannot have children');
    Throw(() => Route.of({
      path: '', children: [{
        path: 'user', children: [{
          path: 'info'
        }]
      }]
    }), 'A route with path "" cannot have children');
    Throw(() => Route.of({
      path: '', children: [{
        path: WILDCARD_PATH
      }]
    }), 'A route with path "" cannot have children');
  });

  test('"(.*)" incorrect wildcard', () => {
    const wildCards = ['*', '(*)', '(.*)', '(.**)', '   *'];
    for (const wildCard of wildCards) {
      Throw(() => Route.of({
        path: wildCard
      }), `Incorrect wildcard. Use "${WILDCARD_PATH}"`);
    }
  });

});
