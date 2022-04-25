import {IEntry, IPathResolveResult, IPathResolverOpt, TMatchResult} from './contract'
import {Entry} from './entry'

export class PathResolver {

  private readonly entries: Entry[];

  constructor(entries: IEntry[],
              public opt: IPathResolverOpt = {isDebug: false}) {
    this.entries = entries.map(x => Entry.of(Entry.cloneOrig(x)));
  }

  resolve(pathname: string): IPathResolveResult | undefined {
    this.log(`resolving '${pathname}'`)
    return this.find(pathname, this.entries)
  }

  find(pathname: string, entries?: Entry[]): IPathResolveResult | undefined {
    if (!entries)
      return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // if (skipBranch(entry.segment, pathname)) {
      //   this.log(`[x] ${entry.segment}, skip branch`)
      //   continue;
      // }

      const match: TMatchResult = entry.transformFn(pathname);
      this.log(`[${match ? 'v' : 'x'}] ${entry.pathTemplate}`);

      if (match && entry.hasResult && !entry.resultIsChildren) {
        return {entry: entry.clone(), pathnameParams: match.params};
      }
      const found = this.find(pathname, entry.children);
      if (found)
        return found;
    }
  }


  private log(data: string) {
    if (this.opt.isDebug)
      console.log(' ', data)
  }

}
