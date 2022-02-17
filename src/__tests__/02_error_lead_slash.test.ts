import {describe, expect, test} from '@jest/globals'
import {IRoute, PathResolver} from '../..'

describe(`error 'lead slash'`, () => {

  test('.', () => {
    expect(() => {
      new PathResolver([
        {path: ''},
        {path: '/hello'},
      ] as IRoute[])
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /hello ] cannot start with a slash`))

    expect(() => {
      new PathResolver([
        {
          path: 'hello', children: [
            {path: ''},
            {path: '/world'},
          ]
        },
        {path: 'music'},
      ] as IRoute[])
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /world ] cannot start with a slash`))
  })

})
