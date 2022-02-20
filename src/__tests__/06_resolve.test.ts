import {describe, expect, test} from '@jest/globals'
import {IPathResolveResult} from '../core/contract'
import {initFlat} from './common/environment'
import {IRouteTest} from './common/contract'
import {Traverse} from './common/common'

describe(`resolve`, () => {
  const {pathResolver, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('.', () => {
    let res: IPathResolveResult, params

    // root not-found
    res = pathResolver.resolve('/some/not-exist') as IPathResolveResult
    expect(res).toBeFalsy()

    // '/'
    res = pathResolver.resolve('/') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.note).toEqual({title: 'Index page'})

    // '/books/:year/:genre'
    res = pathResolver.resolve('/books/2020/comics') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.redirectTo).toBeFalsy()
    params = res.urlParams
    expect(params).toBeTruthy()
    expect(Object.keys(params).length).toEqual(2)
    expect(params['year']).toEqual('2020')
    expect(params['genre']).toEqual('comics')

    // '/books/(.*)'
    res = pathResolver.resolve('/books/hello/world/123') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.redirectTo).toEqual('/auto')

    // '/team/:id/group/:gr_id'
    res = pathResolver.resolve('/team/0/group/12') as IPathResolveResult
    expect(res).toBeTruthy()
    params = res.urlParams
    expect(params).toBeTruthy()
    expect(Object.keys(params).length).toEqual(2)
    expect(params['id']).toEqual('0')
    expect(params['gr_id']).toEqual('12')

    // '/team/:id/user/:name'
    res = pathResolver.resolve('/team/56/user/tom') as IPathResolveResult
    expect(res).toBeTruthy()
    params = res.urlParams
    expect(Object.keys(params).length).toEqual(2)
    expect(params['id']).toEqual('56')
    expect(params['name']).toEqual('tom')

    // '/team/:id/hr'
    res = pathResolver.resolve('/team/1/hr') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.redirectTo).toEqual('/team/1')

    // '/team/:id/(.*)'
    res = pathResolver.resolve('/team/7/whatwg') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.customTo).toEqual({pathname: '/books/2020/comics'})

    // '/auto'
    res = pathResolver.resolve('/auto') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.component).toEqual('z')
    expect(res.route.note).toEqual({head: 'Auto'})

    // '/auto/:color'
    res = pathResolver.resolve('/auto/yellow') as IPathResolveResult
    expect(res).toBeTruthy()
    params = res.urlParams
    expect(Object.keys(params).length).toEqual(1)
    expect(params['color']).toEqual('yellow')

    // '/auto/check/redirect'
    res = pathResolver.resolve('/auto/check/redirect') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.customTo).toEqual({pathname: '/auto/aqua', search: 'hello=12', hash: 'qwe'})
    params = res.urlParams
    expect(Object.keys(params).length).toEqual(0)

    // '/455'
    res = pathResolver.resolve('/455') as IPathResolveResult
    expect(res).toBeTruthy()
    expect(res.route.component).toEqual('user')
    expect(res.urlParams['userId']).toEqual('455')

  })

  test('clone resolve', () => {
    new Traverse().run(flatPathResolverRoutes, (route: IRouteTest, totalCount: number) => {
      // [path] routesCheck === pathResolver.routes
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)

      if (route.redirectTo === undefined) {
        expect(flatRoutesCheck[totalCount].redirectTo).toBeUndefined()
      } else {
        // [redirectTo] routesCheck === pathResolver.routes
        expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }

      if (route.customTo === undefined) {
        expect(flatRoutesCheck[totalCount].customTo).toBeUndefined()
      } else {
        // [customTo] routesCheck === pathResolver.routes
        expect(route.customTo).toEqual(flatRoutesCheck[totalCount].customTo)
      }

      if (route.note === undefined) {
        expect(flatRoutesCheck[totalCount].note).toBeUndefined()
      } else {
        // [note] routesCheck === pathResolver.routes
        expect(route.note).toEqual(flatRoutesCheck[totalCount].note)
      }
    })
  })

})
