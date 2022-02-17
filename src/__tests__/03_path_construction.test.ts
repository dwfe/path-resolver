import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {Init} from '../core/init'
import {IRoute} from '../..'

describe(`path construction`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('.', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRoute, totalCount) => {
      // [path] routes !== pathResolver.routes
      expect(route.path).not.toEqual(flatRoutes[totalCount].path)

      // [path] routes + init.calcPath === pathResolver.routes
      const parentRoute = flatRoutesCheck[totalCount]['parentRoute']
      const parentPath = parentRoute === null ? '/' : parentRoute.path
      expect(route.path).toEqual(Init.path(flatRoutes[totalCount].path, parentPath))

      // [path] routesCheck === pathResolver.routes
      expect(route.path).toEqual(flatRoutesCheck[totalCount].path)
    })
  })

})
