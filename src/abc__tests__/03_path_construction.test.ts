import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {IRouteTest} from './common/contract'
import {Init} from '../core/init'

describe(`path construction`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('.', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRouteTest, totalCount: number) => {
      // [path] routes !== pathResolver.routes
      expect(route.segment).not.toEqual(flatRoutes[totalCount].segment)

      // [path] routes + init.calcPath === pathResolver.routes
      const parentRoute = flatRoutesCheck[totalCount].parentRoute
      const parentPath = !parentRoute ? '/' : parentRoute.segment
      expect(route.segment).toEqual(Init.path(flatRoutes[totalCount].segment, parentPath))

      // [path] routesCheck === pathResolver.routes
      expect(route.segment).toEqual(flatRoutesCheck[totalCount].segment)
    })
  })

})
