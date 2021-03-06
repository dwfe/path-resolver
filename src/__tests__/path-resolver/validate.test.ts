import {Throw} from '@do-while-for-each/test';
import {describe} from '@jest/globals';
import {PathResolver} from '../../path-resolver';

describe('PathResolver.validate', () => {

  test('resolve(pathname), pathname must start with the character "/"', () => {
    const pr = new PathResolver([]);
    Throw(() => pr.resolve(''), 'pathname must start with the character "/"');
    Throw(() => pr.resolve('control'), 'pathname must start with the character "/"');
  });

});
