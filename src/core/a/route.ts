import {IRoute} from '../contract'

export class Route extends IRoute {

  static of(orig: IRoute, parent?: Route): Route {
    return new Route(orig, parent);
  }

  constructor(public readonly orig: IRoute,
              public readonly parent?: Route) {
    super();
    this.path = Route.normalizePath(orig, parent);

  }


  static normalizePath(route: IRoute, parent?: Route): string {
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
