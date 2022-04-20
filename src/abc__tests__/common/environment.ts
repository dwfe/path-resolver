import {PathResolver} from '../../core/path-resolver'
import {routesCheck} from '../routes/routes.check'
import {routes} from '../routes/routes'
import {IRouteTest} from './contract'
import {routesFlat} from './common'

export const initFlat = (): {
  pathResolver: PathResolver;
  flatRoutes: IRouteTest[];
  flatPathResolverRoutes: IRouteTest[];
  flatRoutesCheck: IRouteTest[];
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
