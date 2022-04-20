import {describe} from '@jest/globals';
import {path, rootPath} from './constructor-normalization.test'
import {toThrow} from '../util';
import {Route} from '../../core/a/route'


describe('Route.constructor, incorrect use', () => {

  test('path', () => {
    toThrow(() => rootPath('/'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => rootPath('/user'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => rootPath('/:user'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => path('', '/'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => path('', '/user'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => path('', '/:user'), `Invalid route's "path" [cannot start with a slash]`);
    toThrow(() => path('', ''), `Invalid route's "path" [non-root empty]`);
    toThrow(() => Route.of({
      path: '', children: [
        {path: ''}
      ]
    }), `Invalid route's "path" [non-root empty]`);
    toThrow(() => Route.of({
      path: 'user', children: [
        {path: ''}
      ]
    }), `Invalid route's "path" [non-root empty]`);
    toThrow(() => path('user', ''), `Invalid route's "path" [non-root empty]`);
    toThrow(() => path(':user', ''), `Invalid route's "path" [non-root empty]`);
    toThrow(() => path('', '(.*)'), 'Incorrect location for "(.*)" path. Position it at the root');
  });

});
