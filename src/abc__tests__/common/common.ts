import {expect} from '@jest/globals'
import {routesTotalCount} from '../routes/routes'
import {IRouteTest} from './contract'

export const routesFlat = (routes: IRouteTest[], deleteChildren: boolean, parentRoute: any = null, res: IRouteTest[] = []): IRouteTest[] => {
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i]
    if (deleteChildren) {
      route = {...routes[i]}
      route.customTo = route.customTo ? {...route.customTo} : route.customTo
      route.parentRoute = parentRoute
    }
    res.push(route)
    if (route.children) {
      routesFlat(route.children, deleteChildren, route, res)
      if (deleteChildren)
        delete route.children
    }
  }
  return res
}

export const removeChildren = (routes: IRouteTest[]) =>
  routes.forEach(r => {
    if (r.children)
      delete r.children
  })
;

export const traverse = (routes: IRouteTest[] | undefined, fn: any) => {
  if (!routes)
    return;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    fn(route, i)
    traverse(route.children, fn)
  }
}

export class Traverse {
  private totalCount = -1

  run(routes: IRouteTest[] | undefined, fn: any) {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      this.totalCount++
      fn(route, this.totalCount)
      this.run(route.children, fn)
    }
  }
}

export const lengthCheck = (flatRoutes: IRouteTest[], flatPathResolverRoutes: IRouteTest[], flatRoutesCheck: IRouteTest[]) => {
  expect(flatRoutes.length).toEqual(routesTotalCount)
  expect(flatPathResolverRoutes.length).toEqual(routesTotalCount)
  expect(flatRoutesCheck.length).toEqual(routesTotalCount)
}
