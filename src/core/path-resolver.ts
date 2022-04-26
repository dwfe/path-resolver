import {IPathnameParams} from '@do-while-for-each/common';
import {Match} from 'path-to-regexp';
import {IEntry, IFindReq, IFound, IPathResolveResult, IPathResolverOpt} from './contract'
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
    const segments = pathname.split('/').slice(1);
    const req: IFindReq = {
      pathname,
      segments,
      level: segments.length - 1,
    };

    this.log(`resolving '${pathname}'`);
    const found = this.find(req, 0, this.entries);
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

  find(req: IFindReq, level: number, entries?: Entry[]): IFound | undefined {
    if (!entries)
      return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      if (entry.isSimpleSegment && entry.segment !== req.segments[level]) {
        this.logSkip('!= segment', entry);
        continue;
      }

      if (level === req.level || entry.isWildcard) {
        const match = entry.transformFn(req.pathname);
        this.logMatch(match, entry);

        if (match && entry.hasResult && !entry.resultIsChildren)
          return {entry, match};
      } else
        this.logSkip('no-check', entry);

      const found = this.find(req, level + 1, entry.children);
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


//region Support

  private logSkip(reason: string, entry: Entry) {
    if (this.opt.isDebug)
      console.log(` [x] ${entry.pathTemplate}, ${reason}`);
  }

  private logMatch(match: Match<IPathnameParams>, entry: Entry) {
    if (this.opt.isDebug)
      console.log(` [${match ? 'v' : 'x'}] ${entry.pathTemplate}`);
  }

  private log(data: string) {
    if (this.opt.isDebug)
      console.log(data)
  }

//endregion Support

}
