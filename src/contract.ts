import {IPath, IPathnameParams} from '@do-while-for-each/common'
import {Entry} from './entry';

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

export interface IPathResolverOpt {
  isDebug?: boolean;
}

export interface IFindReq {
  pathname: string;
  segments: string[];
  level: number;
}

export interface IFound {
  entry: Entry;
  pathnameParams: IPathnameParams;
}

export interface IPathResolveResult {
  entry: Entry;
  pathname: string;
  pathnameParams: IPathnameParams;
  canActivateEntries: Entry[]; // in order from root to down
}

//endregion PathResolver
