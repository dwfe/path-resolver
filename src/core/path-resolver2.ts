import {IPathnameParams} from '@do-while-for-each/common'
import {compile, match as matcher} from 'path-to-regexp'
import {IActionResult, TMatchResult} from './contract'
import {needToMatchChildren, skipBranch} from './check'
import {Clone} from './clone'
import {Init} from './init'
import {IEntry, IPathResolveResult, IPathResolverOpt} from './a/contract'

export class PathResolver2 {
  routes: IEntry[] = []

  constructor(routes: IEntry[],
              public opt: IPathResolverOpt = {isDebug: false}) {
    this.routes = routes.map(route => Init.route(route, '/'))
  }

  resolve(pathname: string): undefined | IPathResolveResult {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.routes)
  }

  find(pathname: string, routes?: IEntry[], parentRoute?: IEntry): undefined | IPathResolveResult {
    if (!routes)
      return;

    for (let i = 0; i < routes.length; i++) {
      let route = routes[i]

      if (skipBranch(route.segment, pathname)) {
        this.log(`[x] ${route.segment}, skip branch`)
        continue;
      }

      const match: TMatchResult = matcher<IPathnameParams>(route.segment)(pathname)
      this.log(`[${match ? 'v' : 'x'}] ${route.segment}`)

      if (match && !needToMatchChildren(route)) {
        route = Clone.route(route)
        const pathnameParams = match.params
        if (route.redirectTo) {
          route.redirectTo = compile(route.redirectTo)(pathnameParams)
        }
        if (route.customTo?.pathname) {
          route.customTo.pathname = compile(route.customTo.pathname)(pathnameParams)
        }
        return {entry: route, parent: parentRoute, pathnameParams}
      }
      const found = this.find(pathname, route.children, route)
      if (found)
        return found
    }
  }

  correctResultFromAction(pathname: string, result: IActionResult, route: IEntry, parentRoute?: IEntry): void {
    if (result.redirectTo === undefined && result.customTo === undefined)
      return;

    const parentPath = parentRoute ? parentRoute.segment : '/'
    result.redirectTo = Init.to(result.redirectTo, parentPath)
    result.customTo = Init.customTo(result.customTo, parentPath)

    const match: TMatchResult = matcher<IPathnameParams>(route.segment)(pathname)
    if (match) {
      const pathnameParams = match.params
      if (result.redirectTo !== undefined) {
        result.redirectTo = compile(result.redirectTo)(pathnameParams)
      }
      if (result.customTo?.pathname) {
        result.customTo.pathname = compile(result.customTo.pathname)(pathnameParams)
      }
    }
  }

  private log(path: string) {
    if (this.opt.isDebug)
      console.log(' ', path)
  }

}
