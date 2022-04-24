import {IPathnameParams} from '@do-while-for-each/common'
import {match as matcher} from 'path-to-regexp'
import {IEntry, IPathResolveResult, IPathResolverOpt} from './contract'
import {TMatchResult} from '../contract'
import {Entry} from './entry'

export class PathResolver {

  private readonly entries: Entry[];

  constructor(entries: IEntry[],
              public opt: IPathResolverOpt = {isDebug: false}) {
    this.entries = entries.map(x => Entry.of(x));
  }

  resolve(path: string): IPathResolveResult | undefined {
    this.log(`resolving '${path}'`)
    return this.find(path, this.entries)
  }

  find(path: string, entries?: Entry[]): IPathResolveResult | undefined {
    if (!entries)
      return;

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];

      // if (skipBranch(entry.segment, path)) {
      //   this.log(`[x] ${entry.segment}, skip branch`)
      //   continue;
      // }

      const match: TMatchResult = matcher<IPathnameParams>(entry.path)(path)
      this.log(`[${match ? 'v' : 'x'}] ${entry.path}`)

    }
  }


  private log(data: string) {
    if (this.opt.isDebug)
      console.log(' ', data)
  }

}
