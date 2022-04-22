import {IPath, IPathnameParams} from '@do-while-for-each/common'
import {MatchResult} from 'path-to-regexp';
import {Location} from 'history'

export interface ILocation extends Location {
  state: any;
}

export interface IPathResolveResult {
  route: IEntry;
  parentRoute?: IEntry;
  pathnameParams: IPathnameParams;
}

export interface IPathResolverOpt {
  isDebug?: boolean;
}

export interface IEntry {

  segment: string;

  component?: any;
  redirectTo?: string;
  customTo?: ICustomTo;
  action?: (data: IActionData) => Promise<any>;

  children?: IEntry[];

  canActivate?: (data: IActionData) => Promise<any>;
  canDeactivate?: (tryRelocation: ILocation, data: IActionData) => Promise<boolean>;

  note?: any;

  name?: string;
}

export interface IActionData {

  target: IActionDataTarget;

  route: {
    note?: any;  // 'note' field defined in the route
    name?: string; // 'name' field defined in the route
  }

  /**
   * Context is unreliable!, because context will be null when:
   *   - user manually changes link in the browser line, then follows it;
   *   - user refreshed the page (F5)
   *   - user follows an uncontrolled direct link (I mean, you can't set the context when you click).
   * for independent reuse of values better use 'target.search' or 'note' fields
   */
  ctx: any;

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/ReactTraining/history/tree/master/docs/api-reference.md#location.key
   */
  key: string;

  previous?: IActionData;

}

export interface IActionResult {
  component?: any;
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
  actionData?: IActionData;
} | null // because history package type 'State' = object | null


export type TMatchResult = MatchResult<IPathnameParams> | false;
