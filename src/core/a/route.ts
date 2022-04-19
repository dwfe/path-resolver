import {IRoute} from '../contract'

export class Route extends IRoute {

  constructor(public readonly origin: IRoute,
              public readonly parent?: Route) {
    super();
    const {path, component, redirectTo, customTo, action, children, canActivate, canDeactivate, note, name} = origin;

    if (path[0] === '/') {
      console.error(`Invalid configuration of route, because path "${path}" cannot start with a slash`);
      throw new Error(`Invalid route's "path"`);
    }

  }

}
