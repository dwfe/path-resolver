import {IPath, IPathnameParams} from '@do-while-for-each/common'
import {MatchResult} from 'path-to-regexp';
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

export interface IPattern {
  pathname: string;
  segments: string[];
}

export interface IPathResolveResult {
  target: {
    entry: Entry;
    pathname: string;
    pathnameParams: IPathnameParams;
  },
  canActivateArr: Entry[];
}

export interface IFound {
  entry: Entry;
  match: MatchResult<IPathnameParams>;
}

//endregion PathResolver
