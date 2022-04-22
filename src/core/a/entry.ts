import {INNER_WILDCARD_SEGMENT, WILDCARD_SEGMENT} from './util';
import {IEntry} from '../contract'

export class Entry {

  path!: string;

  get segment(): string {
    return this.orig.segment;
  }

  children?: Entry[];


  static of(orig: IEntry, parent?: Entry): Entry {
    return new Entry(orig, parent);
  }

  constructor(public orig: IEntry,
              public parent?: Entry) {
    this.path = Entry.normalizePath(orig, parent);
    this.children = Entry.normalizeChildren(orig, this);
  }


  flat(): Entry[] {
    const clone = Entry.of(this.orig);
    return Entry.flat(clone);
  }


//region Normalization & Validation

  static normalizePath(orig: IEntry, parent?: Entry): string {
    let {segment} = orig;
    const hasParent = !!parent;
    if (typeof segment !== 'string') {
      console.error('The segment must be a string', orig);
      throw new Error('The segment must be a string');
    }
    if (segment[0] === '/') {
      console.error(`Invalid configuration of entry, because segment "${segment}" cannot start with a slash:`, orig);
      throw new Error('Invalid segment [cannot start with a slash]');
    }
    if (segment.includes('*') && segment !== WILDCARD_SEGMENT) {
      console.error(`Incorrect wildcard "${segment}". Use "${WILDCARD_SEGMENT}"`, orig);
      throw new Error(`Incorrect wildcard. Use "${WILDCARD_SEGMENT}"`);
    }
    switch (segment) {
      case '':
        if (orig.children) {
          console.error('An entry with segment "" cannot have children:', orig);
          throw new Error('An entry with segment "" cannot have children');
        }
        if (hasParent) {
          console.error('A non-root entry cannot have an empty "segment":', orig);
          throw new Error('Invalid segment [non-root empty]');
        }
        return '/';
      case WILDCARD_SEGMENT:
        segment = INNER_WILDCARD_SEGMENT;
        break;
    }
    return (hasParent && parent.path || '') + '/' + segment;
  }

  static normalizeChildren({children}: IEntry, parent: Entry): Entry[] | undefined {
    return children?.map(orig =>
      Entry.of(orig, parent)
    );
  }

//endregion Normalization & Validation


//region Support

  static flat(entry: Entry): Entry[] {
    if (!entry.children)
      return [entry];
    const result: Entry[] = [];
    result.push(entry);
    for (const child of entry.children) {
      result.push(...Entry.flat(child));
    }
    delete entry.parent;
    delete entry.children;
    return result.flat();
  }

  static hasResult(orig: IEntry): boolean {
    return (
      !!orig.component ||
      !!orig.redirectTo ||
      !!orig.customTo ||
      !!orig.action ||
      !!orig.children
    );
  }

  static cloneWithoutCircularDeps(entry: Entry): Entry {
    const parent = entry.parent && Entry.cloneWithoutCircularDeps(entry.parent);
    const clonedOrig = {...entry.orig};
    delete clonedOrig.children;
    return Entry.of(clonedOrig, parent);
  }

//endregion Support

}
