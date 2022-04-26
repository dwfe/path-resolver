import {IPathnameParams} from '@do-while-for-each/common';
import {Match} from 'path-to-regexp';
import {IEntry, IFound, IPathResolveResult, IPathResolverOpt} from './contract'
import {Entry} from './entry'

export class PathResolver {

  private readonly entries: Entry[];

  constructor(entries: IEntry[],
              public opt: IPathResolverOpt = {isDebug: false}) {
    this.entries = entries.map(x => Entry.of(Entry.cloneOrig(x)));
  }

  resolve(pathname: string): IPathResolveResult | undefined {
    if (!pathname.startsWith('/')) {
      console.error('pathname must start with the character "/":', pathname);
      throw new Error('pathname must start with the character "/"');
    }
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1); // remove the final slash
    }
    this.log(`resolving '${pathname}'`)
    const found = this.find(pathname, this.entries);
    if (found)
      return {
        target: {
          entry: found.entry.clone(),
          pathname,
          pathnameParams: found.match.params
        },
        canActivateArr: this.getCanActivateArr(found.entry).map(x => x.clone()),
      };
  }

  find(pathname: string, entries?: Entry[]): IFound | undefined {
    if (!entries)
      return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (entry.parent === undefined && entry.skip(pathname)) {
        this.log(` [x] ${entry.pathTemplate}, skip branch`)
        continue;
      }

      const match: Match<IPathnameParams> = entry.transformFn(pathname);
      this.log(` [${match ? 'v' : 'x'}] ${entry.pathTemplate}`);

      if (match && entry.hasResult && !entry.resultIsChildren) {
        return {entry, match};
      }
      const found = this.find(pathname, entry.children);
      if (found)
        return found;
    }
  }

  getCanActivateArr(entry: Entry): Entry[] {
    const result: Entry[] = [];
    if (entry.canActivate)
      result.push(entry);
    if (entry.parent)
      result.unshift(...this.getCanActivateArr(entry.parent))
    return result;
  }


  private log(data: string) {
    if (this.opt.isDebug)
      console.log(' ', data)
  }

}
