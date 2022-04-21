import {describe} from '@jest/globals';
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
        path: '(.*)'
      }]
    }), 'Incorrect location for "(.*)" path. Position it at the root');
    noThrow(() => Route.of({
      path: 'user', children: [{
        path: 'info', children: [{
          path: '(.*)'
        }]
      }]
    }));
  });

});
