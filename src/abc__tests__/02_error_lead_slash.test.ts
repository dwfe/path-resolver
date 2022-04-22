import {describe, expect, test} from '@jest/globals'
import {PathResolver} from '../core/path-resolver'
import {IRouteTest} from './common/contract'

describe(`error 'lead slash'`, () => {

  test('.', () => {
    expect(() => {
      new PathResolver([
        {segment: ''},
        {segment: '/hello'},
      ] as IRouteTest[])
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /hello ] cannot start with a slash`))

    expect(() => {
      new PathResolver([
        {
          segment: 'hello', children: [
            {segment: ''},
            {segment: '/world'},
          ]
        },
        {segment: 'music'},
      ] as IRouteTest[])
    }).toThrowError(new Error(`Invalid configuration of route, because path [ /world ] cannot start with a slash`))
  })

})
