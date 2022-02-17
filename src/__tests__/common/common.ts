import {expect} from '@jest/globals'
import {routesTotalCount} from '../routes/routes'
import {IRoute} from '../../..'

export const routesFlat = (routes: IRoute[], deleteChildren: boolean, parentRoute: any = null, res: IRoute[] = []): IRoute[] => {
  for (let i = 0; i < routes.length; i++) {
    let route = routes[i]
    if (deleteChildren) {
      route = {...routes[i]}
      route.customTo = route.customTo ? {...route.customTo} : route.customTo
      route['parentRoute'] = parentRoute
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

export const removeChildren = (routes: IRoute[]) =>
  routes.forEach(r => {
    if (r.children)
      delete r.children
  })
;

export const traverse = (routes: IRoute[] | undefined, fn) => {
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

  run(routes: IRoute[] | undefined, fn) {
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

export const lengthCheck = (flatRoutes, flatPathResolverRoutes, flatRoutesCheck) => {
  expect(flatRoutes.length).toEqual(routesTotalCount)
  expect(flatPathResolverRoutes.length).toEqual(routesTotalCount)
  expect(flatRoutesCheck.length).toEqual(routesTotalCount)
}
