import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {Init} from '../core/init'
import {IRoute} from '../..'

describe(`to`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('redirectTo', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRoute, totalCount) => {
      if (route.redirectTo === undefined) {
        expect(flatRoutes[totalCount].redirectTo).toBeUndefined()
        expect(flatRoutesCheck[totalCount].redirectTo).toBeUndefined()
      } else {
        // [redirectTo] routes + init.calcTo === pathResolver.routes
        expect(route.redirectTo).toEqual(Init.to(flatRoutes[totalCount].redirectTo, route['parentRoute'].path))

        // [redirectTo] routesCheck === pathResolver.routes
        expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }
    })
  })

  test('customTo', () => {
    new Traverse().run(flatPathResolverRoutes, (route: IRoute, totalCount) => {
      if (route.customTo === undefined) {
        expect(flatRoutes[totalCount].customTo).toBeUndefined()
        expect(flatRoutesCheck[totalCount].customTo).toBeUndefined()
      } else {
        // [customTo] routes + init.calcCustomTo === pathResolver.routes
        expect(route.customTo).toEqual(Init.customTo(flatRoutes[totalCount].customTo, route['parentRoute'].path))

        // [customTo] routesCheck === pathResolver.routes
        expect(route.customTo).toEqual(flatRoutesCheck[totalCount].customTo)
      }
    })
  })
})
