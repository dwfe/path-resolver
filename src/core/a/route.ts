import {IRoute} from '../contract'

export class Route extends IRoute {

  constructor(public readonly origin: IRoute,
              public readonly parent?: Route) {
    super();
    this.path = Route.normalizePath(origin);

  }


  static normalizePath(route: IRoute, parent?: IRoute): string {
    if (route.path[0] === '/') {
      console.error(`Invalid configuration of route, because path "${route.path}" cannot start with a slash`);
      throw new Error(`Invalid route's "path"`);
    }
    if (route.path === '')
      return '/';
    let prefix = parent && parent.path !== '/' ? parent.path : '';
    return prefix + '/' + route.path;
  }
}
