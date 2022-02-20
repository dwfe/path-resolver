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
      expect(route.path).not.toEqual(flatRoutes[totalCount].path)

      // [path] routes + init.calcPath === pathResolver.routes
      const parentRoute = flatRoutesCheck[totalCount].parentRoute
      const parentPath = !parentRoute ? '/' : parentRoute.path
      expect(route.path).toEqual(Init.path(flatRoutes[totalCount].path, parentPath))

      // [path] routesCheck === pathResolver.routes
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)
    })
  })

})
