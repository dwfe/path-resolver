import {INNER_WILDCARD_SEGMENT, WILDCARD_SEGMENT} from './util';
import {IEntry} from '../contract'

/**
 * The Entry is an instruction on what to do when matching for this segment of the path:
 *
 *   {
 *     segment,
 *
 *     component?,
 *     redirectTo?,
 *     customTo?,
 *     action?,
 *     children?,
 *
 *     canActivate?, canDeactivate?,
 *
 *     note?, name?
 *   }
 *
 */
export class Entry {

  orig: IEntry; // data that comes from PathResolver

  path!: string; // full path, e.g. "/control/:user"
  get segment(): string { // segment of the full path, e.g.: ":user"
    return this.orig.segment;
  }

  component?: any;
  redirectTo?: string;
  customTo?: IEntry['customTo'];
  action?: IEntry['action'];
  children?: Entry[];

  canActivate?: IEntry['canActivate'];
  canDeactivate?: IEntry['canDeactivate'];

  note?: any;
  name?: string;

  constructor(orig: IEntry,
              public parent?: Entry) {
    if (!Entry.hasResult(orig)) {
      console.error('The entry must have at least one of: component, redirectTo, customTo, action or children', orig);
      throw new Error('The resulting field is missing. Fill one of: component, redirectTo, customTo, action or children');
    }
    this.orig = Entry.cloneOrig(orig);
    this.path = Entry.normalizePath(this.orig, parent);

    this.component = this.orig.component;
    this.redirectTo = this.orig.redirectTo;
    this.customTo = this.orig.customTo && {...this.orig.customTo} || undefined;
    this.action = this.orig.action;

    this.canActivate = this.orig.canActivate;
    this.canDeactivate = this.orig.canDeactivate;
    this.note = this.orig.note && {...this.orig.note} || undefined;
    this.name = this.orig.name;

    this.children = Entry.normalizeChildren(this.orig, this);
  }


  clone(): Entry {
    const clonedOrig = Entry.cloneOrig(this.orig);
    return Entry.of(clonedOrig);
  }

  flat(): Entry[] {
    return Entry.flat(this.clone());
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
      console.error(`Invalid entry, because segment "${segment}" cannot start with a slash:`, orig);
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
    return children?.map(orig => Entry.of(orig, parent));
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

  static cloneOrig(orig: IEntry): IEntry {
    const result: IEntry = {...orig};
    const {children} = orig;
    result.customTo = orig.customTo && {...orig.customTo} || undefined;
    result.note = orig.note && {...orig.note} || undefined;
    if (children)
      result.children = children.map(x => Entry.cloneOrig(x));
    return result;
  }

  static cloneWithoutCircularDeps(entry: Entry): Entry {
    const parent = entry.parent && Entry.cloneWithoutCircularDeps(entry.parent);
    const clonedOrig = {...entry.orig};
    delete clonedOrig.children;
    return Entry.of(clonedOrig, parent);
  }

  static of(orig: IEntry, parent?: Entry): Entry {
    return new Entry(orig, parent);
  }

//endregion Support

}
