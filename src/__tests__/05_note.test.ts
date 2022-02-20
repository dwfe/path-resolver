import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {IRouteTest} from './common/contract'

describe(`note`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('.', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRouteTest, totalCount: number) => {
      if (route.note === undefined) {
        expect(flatRoutes[totalCount].note).toBeUndefined()
        expect(flatRoutesCheck[totalCount].note).toBeUndefined()
      } else {
        // [note] routes === pathResolver.routes
        expect(route.note).toEqual(flatRoutes[totalCount].note)

        // [note] routesCheck === pathResolver.routes
        expect(route.note).toEqual(flatRoutesCheck[totalCount].note)
      }
    })
  })
})
