import {ICustomTo, IRoute} from './contract'
import {Clone} from './clone'
import {Check} from './check'

export class Init {

  static route(r: IRoute, parentPath: string): IRoute {
    Check.leadSlash(r.path)
    const route = Clone.route(r)
    route.path = Init.path(route.path, parentPath)
    route.redirectTo = Init.to(route.redirectTo, parentPath)
    route.customTo = Init.customTo(route.customTo, parentPath)
    route.children = Init.children(route)
    return route
  }

  static path(path: string, parentPath: string): string {
    if (path === '') {
      return parentPath
    } else {
      const prefix = parentPath === '/' ? '' : parentPath
      return prefix + '/' + path
    }
  }

  static to(to: string, parentPath: string): string | undefined {
    if (typeof to === 'string') {
      if (to === '')
        return parentPath
      else if (to[0] === '/')
        return to
      else {
        const prefix = parentPath === '/' ? '/' : parentPath + '/'
        return prefix + to
      }
    }
  }

  static customTo(to: ICustomTo | undefined, parentPath): ICustomTo | undefined {
    if (to) {
      to.pathname = Init.to(to.pathname, parentPath) as string
      return to
    }
  }

  static children({path: parentPath, children}: IRoute): IRoute[] | undefined {
    return children?.map(route => Init.route(route, parentPath))
  }

}
