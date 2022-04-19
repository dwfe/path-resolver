import {IPath, IPathnameParams} from '@do-while-for-each/common'
import {MatchResult} from 'path-to-regexp';
import {Location} from 'history'

export interface ILocation<TState = any> extends Location {
  state: TState;
}

export interface IPathResolveResult {
  route: IRoute;
  parentRoute?: IRoute;
  pathnameParams: IPathnameParams;
}

export interface IPathResolverOpt {
  isDebug?: boolean;
}

export abstract class IRoute<TComponent = any, TNote = any,
  TActionResult extends IActionResult<TComponent> = IActionResult<TComponent>,
  TContext extends TRouteContext = TRouteContext> {

  path!: string; // see syntax here: https://www.npmjs.com/package/path-to-regexp

  component?: TComponent;
  redirectTo?: string;
  customTo?: ICustomTo;
  action?: (data: IActionData<TNote, TContext>) => Promise<TActionResult>;

  children?: IRoute[];

  canActivate?: (data: IActionData<TNote, TContext>) => Promise<TActionResult>;
  canDeactivate?: (tryRelocation: ILocation<TContext>, data: IActionData<TNote, TContext>) => Promise<boolean>;

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
  component?: TComponent;
  redirectTo?: string;
  customTo?: ICustomTo;
  skip?: boolean; // if 'true' then stage 'CanActivate' will skip the processing to next stage
}

export interface IActionDataTarget extends IPath {
  pathnameParams: IPathnameParams;
}

export interface ICustomTo extends IPath {
  asGoto?: boolean; // otherwise treated as a redirect
}

export type TRouteContext = {
  actionData?: IActionData<TRouteContext>;
} | null // because history package type 'State' = object | null


export type TMatchResult = MatchResult<IPathnameParams> | false;
