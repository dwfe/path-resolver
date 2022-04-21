import {describe} from '@jest/globals';
import {WILDCARD_PATH} from '../../core/a/util';
import {Route} from '../../core/a/route'
import {noThrow, Throw} from '../util';

describe('"path" incorrect use', () => {

  test('cannot start with a slash', () => {
    Throw(() => Route.of({path: '/'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({path: '/user'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({path: '/:user'}), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: '/'
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: '/user'
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: '/:user'
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: 'user', children: [{
          path: '/'
        }]
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: 'user', children: [{
          path: '/info'
        }]
      }]
    }), `Invalid route's "path" [cannot start with a slash]`);
  });

  test('non-root empty', () => {
    Throw(() => Route.of({
      path: '', children: [{
        path: ''
      }]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: '', children: [{
        path: 'user', children: [{
          path: ''
        }]
      }]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: 'user', children: [{
        path: ''
      }]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: ':user', children: [
        {path: ''}
      ]
    }), `Invalid route's "path" [non-root empty]`);
    Throw(() => Route.of({
      path: 'user', children: [{
        path: 'info', children: [{
          path: ''
        }]
      }]
    }), `Invalid route's "path" [non-root empty]`);
  });

  test('"(.*)" incorrect location', () => {
    Throw(() => Route.of({
      path: '', children: [{
        path: WILDCARD_PATH
      }]
    }), 'Incorrect location for wildcard path because of parent.path is the root. Position wildcard at the root');
    noThrow(() => Route.of({
      path: 'user', children: [{
        path: 'info', children: [{
          path: WILDCARD_PATH
        }]
      }]
    }));
  });

  test('"(.*)" incorrect wildcard', () => {
    const wildCards = ['*', '(*)', '(.*)', '(.**)'];
    for (const wildCard of wildCards) {
      Throw(() => Route.of({
        path: wildCard
      }), `Incorrect wildcard. Use "${WILDCARD_PATH}"`);
    }
  });

});
