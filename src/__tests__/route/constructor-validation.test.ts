import {describe} from '@jest/globals';
import {Route} from '../../core/a/route';
import {toThrow} from '../util';


describe(`Route.constructor, incorrect use`, () => {

  test(`path`, () => {
    toThrow(() => Route.of({path: '/'}), `Invalid route's "path"`);
  });

});
