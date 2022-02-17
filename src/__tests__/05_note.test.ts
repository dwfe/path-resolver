import {describe, expect, test} from '@jest/globals'
import {lengthCheck, Traverse} from './common/common'
import {initFlat} from './common/environment'
import {IRoute} from '../..'

describe(`note`, () => {
  const {flatRoutes, flatPathResolverRoutes, flatRoutesCheck} = initFlat()

  test('.', () => {
    lengthCheck(flatRoutes, flatPathResolverRoutes, flatRoutesCheck)

    new Traverse().run(flatPathResolverRoutes, (route: IRoute, totalCount) => {
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
