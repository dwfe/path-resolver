import {routesCheck} from '../routes/routes.check'
import {routes} from '../routes/routes'
import {routesFlat} from './common'
import {IRoute, PathResolver} from '../../..'

export const initFlat = (): {
  pathResolver: PathResolver;
  flatRoutes: IRoute[];
  flatPathResolverRoutes: IRoute[];
  flatRoutesCheck: IRoute[];
} => {
  const pathResolver = new PathResolver(routes)
  const flatRoutes = routesFlat(routes, true)
  const flatPathResolverRoutes = routesFlat(pathResolver.routes, true)
  const flatRoutesCheck = routesFlat(routesCheck, true)
  return {
    pathResolver,
    flatRoutes,
    flatPathResolverRoutes,
    flatRoutesCheck,
  }
}
