import {Location} from 'history'

export interface IPathResolveResult {
  route: IRoute;
  pathParams: TPathParams;
  parentRoute?: IRoute;
}

export interface IPathResolverOptions {
  isDebug?: boolean;
}

export const defaultOptions: IPathResolverOptions = {
  isDebug: false,
}

export type TPathParams = { [key: string]: string; }

export interface IPath {
  pathname?: string;
  search?: string;
  hash?: string;
}


export interface IRoute<TComponent = any, TNote = any,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TContext extends TRouteContext = TRouteContext> {

  path: string; // see syntax here: https://www.npmjs.com/package/path-to-regexp

  canActivate?: (data: IActionData<TNote, TContext>) => Promise<TActionResult>;
  canDeactivate?: (tryRelocation: Location<TContext>, data: IActionData<TNote, TContext>) => Promise<boolean>;

  redirectTo?: string;
  customTo?: ICustomTo;
  component?: TComponent;

  action?: (data: IActionData<TNote, TContext>) => Promise<TActionResult>;

  children?: IRoute[];

  note?: TNote;

  name?: string;
}

export interface IActionData<TNote = any, TContext extends TRouteContext = TRouteContext> {

  target: IActionDataTarget;

  route: {
    note?: TNote;  // 'note' field defined in the route
    name?: string; // 'name' field defined in the route
  }

  /**
   * Context is unreliable!, because context will be null when:
   *   - user manually changes link in the browser line, then follows it;
   *   - user refreshed the page (F5)
   *   - user follows an uncontrolled direct link (I mean, you can't set the context when you click).
   * for independent reuse of values better use 'target.search' or 'note' fields
   */
  ctx: TContext;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;

  previous?: IActionData<TNote, TContext>;

}

export interface IActionResult<TComponent = any> {
  redirectTo?: string;
  customTo?: ICustomTo;
  component?: TComponent;
  skip?: boolean; // if 'true' then stage 'CanActivate' will skip the processing to next stage
}

export interface IActionDataTarget extends IPath {
  pathParams: TPathParams;
}

export interface ICustomTo extends IPath {
  isRedirect?: boolean; // if not set, it equals 'true'
}

export type TRouteContext = {
  previousActionData?: IActionData<TRouteContext>;
} | null // because history package type 'State' = object | null
