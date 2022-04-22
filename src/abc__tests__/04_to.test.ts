import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {IRouteTest} from './common/contract'
import {Init} from '../core/init'

describe(`to`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('redirectTo', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRouteTest, totalCount: number) => {
      if (route.redirectTo === undefined) {
        expect(flatRoutes[totalCount].redirectTo).toBeUndefined()
        expect(flatRoutesCheck[totalCount].redirectTo).toBeUndefined()
      } else {
        // [redirectTo] routes + init.calcTo === pathResolver.routes
        expect(route.redirectTo).toEqual(Init.to(flatRoutes[totalCount].redirectTo, route?.parentRoute?.segment as string))

        // [redirectTo] routesCheck === pathResolver.routes
        expect(route.redirectTo).toEqual(flatRoutesCheck[totalCount].redirectTo)
      }
    })
  })

  test('customTo', () => {
    new Traverse().run(flatPathResolverRoutes, (route: IRouteTest, totalCount: number) => {
      if (route.customTo === undefined) {
        expect(flatRoutes[totalCount].customTo).toBeUndefined()
        expect(flatRoutesCheck[totalCount].customTo).toBeUndefined()
      } else {
        // [customTo] routes + init.calcCustomTo === pathResolver.routes
        expect(route.customTo).toEqual(Init.customTo(flatRoutes[totalCount].customTo, route?.parentRoute?.segment as string))

        // [customTo] routesCheck === pathResolver.routes
        expect(route.customTo).toEqual(flatRoutesCheck[totalCount].customTo)
      }
    })
  })
})
