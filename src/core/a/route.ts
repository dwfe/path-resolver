import {INNER_WILDCARD_PATH, WILDCARD_PATH} from './util';
import {IRoute} from '../contract'

export class Route extends IRoute {

  static of(orig: IRoute, parent?: Route): Route {
    return new Route(orig, parent);
  }

  constructor(public orig: IRoute,
              public parent?: Route) {
    super();
    this.path = Route.normalizePath(orig, parent);
    this.children = Route.normalizeChildren(orig, this);
  }


//region Normalization & Validation

  static normalizePath(orig: IRoute, parent?: Route): string {
    let path = orig.path;
    if (path[0] === '/') {
      console.error(`Invalid configuration of route, because path "${path}" cannot start with a slash:`, orig);
      throw new Error(`Invalid route's "path" [cannot start with a slash]`);
    }
    if (path.includes('*') && path !== WILDCARD_PATH) {
      console.error(`Incorrect wildcard "${path}". Use "${WILDCARD_PATH}"`, orig);
      throw new Error(`Incorrect wildcard. Use "${WILDCARD_PATH}"`);
    }
    switch (path) {
      case '':
        if (parent) {
          console.error('A non-root route cannot have an empty "path":', orig);
          throw new Error(`Invalid route's "path" [non-root empty]`);
        }
        return '/';
      case WILDCARD_PATH:
        if (parent?.path === '/') {
          console.error(`Incorrect location for wildcard path "${path}" because of parent.path is the root. Position wildcard at the root:`, orig);
          throw new Error('Incorrect location for wildcard path because of parent.path is the root. Position wildcard at the root');
        }
        path = INNER_WILDCARD_PATH;
        break;
    }
    let prefix = '';
    if (parent && parent.path !== '/')
      prefix = parent.path;
    return prefix + '/' + path;
  }

  static normalizeChildren({children}: IRoute, parent: Route): Route[] | undefined {
    return children?.map(orig =>
      Route.of(orig, Route.cloneWithoutCircularDeps(parent))
    );
  }

//endregion Normalization & Validation

  static cloneWithoutCircularDeps(route: Route): Route {
    const parent = route.parent && Route.cloneWithoutCircularDeps(route.parent);
    const clonedOrig = {...route.orig};
    delete clonedOrig.children;
    return Route.of(clonedOrig, parent);
  }

}
