import {IRoute} from '../contract'

export class Route extends IRoute {

  static of(orig: IRoute, parent?: Route): Route {
    return new Route(orig, parent);
  }

  constructor(public readonly orig: IRoute,
              public readonly parent?: Route) {
    super();
    this.path = Route.normalizePath(orig, parent);
    this.children = Route.normalizeChildren(orig, this);
  }


//region Normalization & Validation

  static normalizePath(orig: IRoute, parent?: Route): string {
    if (orig.path[0] === '/') {
      console.error(`Invalid configuration of route, because path "${orig.path}" cannot start with a slash`);
      throw new Error(`Invalid route's "path" [cannot start with a slash]`);
    }
    switch (orig.path) {
      case '':
        if (parent) {
          console.error('A non-root route cannot have an empty "path":', orig);
          throw new Error(`Invalid route's "path" [non-root empty]`);
        }
        return '/';
      case '(.*)':
        if (parent?.path === '/') {
          console.error('Incorrect location for "(.*)" path. Position it at the root:', orig);
          throw new Error('Incorrect location for "(.*)" path. Position it at the root');
        }
        break;
    }
    let prefix = '';
    if (parent && parent.path !== '/')
      prefix = parent.path;
    return prefix + '/' + orig.path;
  }

  static normalizeChildren({children}: IRoute, parent: Route): Route[] | undefined {
    return children?.map(orig => Route.of(orig, parent));
  }

//endregion Normalization & Validation

}
