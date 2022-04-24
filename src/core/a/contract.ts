import {IPath, IPathnameParams} from '@do-while-for-each/common'
import {MatchResult} from 'path-to-regexp'

//region Entry

export interface IEntry {

  segment: string;

  component?: any;
  redirectTo?: string;
  customTo?: ICustomTo;
  action?: any; // most likely a Function

  children?: IEntry[];

  canActivate?: any; // most likely a Function
  canDeactivate?: any; // most likely a Function

  note?: any;

  name?: string;
}

export interface ICustomTo extends IPath {
  asGoto?: boolean; // otherwise treated as a redirect
}

//endregion Entry


//region PathResolver

export interface IPathResolveResult {
  entry: IEntry;
  parent?: IEntry;
  pathnameParams: IPathnameParams;
}

export type TMatchResult = MatchResult<IPathnameParams> | false;

export interface IPathResolverOpt {
  isDebug?: boolean;
}

//endregion PathResolver
