import {IPath, IUrlParams} from '@do-while-for-each/common'
import {Location} from 'history'

export interface IPathResolveResult {
  route: IRoute;
  urlParams: IUrlParams;
  parentRoute?: IRoute;
}

export interface IPathResolverOpt {
  isDebug?: boolean;
}


export interface IRoute<TComponent = any,
  TNote = any,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>> {

  path: string; // see syntax here: https://www.npmjs.com/package/path-to-regexp

  canActivate?: (data: IActionData<TNote>) => Promise<TActionResult>;
  canDeactivate?: (tryRelocation: Location, data: IActionData<TNote>) => Promise<boolean>;

  redirectTo?: string;
  customTo?: ICustomTo;
  component?: TComponent;

  action?: (data: IActionData<TNote>) => Promise<TActionResult>;

  children?: IRoute[];

  note?: TNote;

  name?: string;
}

export interface IActionData<TNote = any> {

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
  // ctx: TContext;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;

  previous?: IActionData<TNote>;

}

export interface IActionResult<TComponent = any> {
  redirectTo?: string;
  customTo?: ICustomTo;
  component?: TComponent;
  skip?: boolean; // if 'true' then stage 'CanActivate' will skip the processing to next stage
}

export interface IActionDataTarget extends IPath {
  urlParams: IUrlParams;
}

export interface ICustomTo extends IPath {
  isRedirect?: boolean; // if not set, it equals 'true'
}

export type TRouteContext = {
  previousActionData?: IActionData<TRouteContext>;
} | null // because history package type 'State' = object | null
