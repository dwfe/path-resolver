import {compile, match as matcher, MatchResult} from 'path-to-regexp'
import {IUrlParams} from '@do-while-for-each/common'
import {IActionResult, IPathResolveResult, IPathResolverOpt, IRoute} from './contract'
import {Check} from './check'
import {Clone} from './clone'
import {Init} from './init'

export class PathResolver {
  routes: IRoute[] = []

  constructor(routes: IRoute[],
              public opt: IPathResolverOpt = {isDebug: false}) {
    this.routes = routes.map(route => Init.route(route, '/'))
  }

  resolve(pathname: string): IPathResolveResult | undefined {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes: IRoute[] | undefined, parentRoute?: IRoute): IPathResolveResult | undefined {
    if (!routes) return;

    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]

      if (Check.skipBranch(route.path, pathname)) {
        this.log(`[x] ${route.path}, skip branch`)
        continue;
      }

      const match: MatchResult<IUrlParams> | false = matcher<IUrlParams>(route.path)(pathname)
      this.log(`[${match ? 'v' : 'x'}] ${route.path}`)

      if (match && !Check.needToMatchChildren(route)) {
        route = Clone.route(route)
        const urlParams = match.params
        if (route.redirectTo) {
          route.redirectTo = compile(route.redirectTo)(urlParams)
        }
        if (route.customTo?.pathname) {
          route.customTo.pathname = compile(route.customTo.pathname)(urlParams)
        }
        return {route, urlParams, parentRoute}
      }
      const found = this.find(pathname, route.children, route)
      if (found) return found
    }
  }

  correctResultFromAction(pathname: string, result: IActionResult, route: IRoute, parentRoute?: IRoute): void {
    if (result.redirectTo === undefined && result.customTo === undefined)
      return;

    const parentPath = parentRoute ? parentRoute.path : '/'
    result.redirectTo = Init.to(result.redirectTo, parentPath)
    result.customTo = Init.customTo(result.customTo, parentPath)

    const match: MatchResult<IUrlParams> | false = matcher<IUrlParams>(route.path)(pathname)
    if (match) {
      const urlParams = match.params
      if (result.redirectTo !== undefined) {
        result.redirectTo = compile(result.redirectTo)(urlParams)
      }
      if (result.customTo?.pathname) {
        result.customTo.pathname = compile(result.customTo.pathname)(urlParams)
      }
    }
  }

  private log(path: string) {
    if (this.opt.isDebug)
      console.log(' ', path)
  }

}
