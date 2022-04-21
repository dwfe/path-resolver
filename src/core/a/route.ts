import {INNER_WILDCARD_PATH, WILDCARD_PATH} from './util';
import {IRoute} from '../contract'

export class Route extends IRoute {

  children?: Route[];

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
    const hasParent = !!parent;
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
        if (orig.children) {
          console.error('A route with path "" cannot have children:', orig);
          throw new Error('A route with path "" cannot have children');
        }
        if (hasParent) {
          console.error('A non-root route cannot have an empty "path":', orig);
          throw new Error(`Invalid route's "path" [non-root empty]`);
        }
        return '/';
      case WILDCARD_PATH:
        path = INNER_WILDCARD_PATH;
        break;
    }
    return (hasParent && parent.path || '') + '/' + path;
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

  static flat(route: Route): Route[]{
    const result: any[] = [];
    const cloned = {...route} as Route;
    const {children} = cloned;
    let childrenFlated: Route[] = [];
    if (children) {
      delete cloned.children;
      childrenFlated = children.map(x => Route.flat(x)).flat();

    }
    result.push(cloned);
    result.push(...childrenFlated);
    return result;
  }

}
