import {describe, expect, test} from '@jest/globals'
import {lengthCheck, routesFlat, Traverse} from './common/common'
import {PathResolver} from '../core/path-resolver'
import {routesCheck} from './routes/routes.check'
import {IRouteTest} from './common/contract'
import {routes} from './routes/routes'

describe(`clone`, () => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes, false)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, false)
  const flatRoutesCheck = routesFlat(routesCheck, false)

  test('route', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(routes, (route: IRouteTest, totalCount: number) => {
      expect(route === flatRoutes[totalCount]).toBeTruthy()
      expect(route === flatPathResolverRoutes[totalCount]).toBeFalsy()
    })
  })

  test('customTo', () => {
    new Traverse().run(routes, (route: IRouteTest, totalCount: number) => {
      if (route.customTo === undefined) {
        expect(flatRoutes[totalCount].customTo).toBeUndefined()
        expect(flatPathResolverRoutes[totalCount].customTo).toBeUndefined()
      } else {
        expect(route.customTo === flatRoutes[totalCount].customTo).toBeTruthy()
        expect(route.customTo === flatPathResolverRoutes[totalCount].customTo).toBeFalsy()
      }
    })
  })

  test('note', () => {
    new Traverse().run(routes, (route: IRouteTest, totalCount: number) => {
      if (route.note === undefined) {
        expect(flatRoutes[totalCount].note).toBeUndefined()
        expect(flatPathResolverRoutes[totalCount].note).toBeUndefined()
      } else {
        expect(route.note === flatRoutes[totalCount].note).toBeTruthy()
        expect(route.note === flatPathResolverRoutes[totalCount].note).toBeFalsy()
      }
    })
  })

})
