import {cloneSimple, IPathnameParams, isJustObject, isNotJustObject, isString} from '@do-while-for-each/common';
import {match, MatchFunction} from 'path-to-regexp';
import {INNER_WILDCARD_SEGMENT, WILDCARD_SEGMENT} from '../index';
import {ICustomTo, IEntry} from './contract'

/**
 * The Entry is an instruction on what to do when matching for this segment of the pathname:
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

  pathTemplate!: string; // e.g. "/control/:user"
  transformFn: MatchFunction<IPathnameParams>; // https://github.com/pillarjs/path-to-regexp#match
  get segment(): string { // segment of the pathname, e.g.: ":user"
    return this.orig.segment;
  }

  component?: any;
  redirectTo?: string;
  customTo?: IEntry['customTo'];
  action?: any;
  children?: Entry[];

  canActivate?: any;
  canDeactivate?: any;

  note?: any;
  name?: string;

  hasResult: boolean;
  resultIsChildren: boolean;

  constructor(public orig: IEntry,
              public parent?: Entry) {
    this.hasResult = Entry.hasResult(this.orig);
    if (!this.hasResult) {
      console.error('The entry must have at least one of: component, redirectTo, customTo, action or children', this.orig);
      throw new Error('The resulting field is missing. Fill one of: component, redirectTo, customTo, action or children');
    }
    if (Entry.isMultiResult(this.orig)) {
      console.error('Only one of the following can be specified at a time: component, redirectTo, customTo or action', this.orig);
      throw new Error('Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    }
    this.resultIsChildren = Entry.resultIsChildren(this.orig);

    this.pathTemplate = Entry.normalizePathTemplate(this.orig, parent);
    this.transformFn = match<IPathnameParams>(this.pathTemplate, {decode: decodeURIComponent});

    this.component = this.orig.component;
    this.redirectTo = Entry.normalizeRedirectTo(this.orig.redirectTo);
    this.customTo = Entry.normalizeCustomTo(this.orig.customTo);
    this.action = this.orig.action;

    this.canActivate = this.orig.canActivate;
    this.canDeactivate = this.orig.canDeactivate;
    this.note = Entry.normalizeNote(this.orig.note);
    this.name = this.orig.name;

    this.children = Entry.normalizeChildren(this.orig, this);
  }


  flat(): Entry[] {
    return Entry.flat(this.cloneFull());
  }

  clone(): Entry {
    let parent: Entry | undefined;
    if (this.parent) {
      const parentOrig = Entry.cloneOrig(this.parent.orig, {skipChildren: true});
      parent = Entry.of(parentOrig);
      parent.pathTemplate = this.parent.pathTemplate;
    }
    const orig = Entry.cloneOrig(this.orig, {skipChildren: true});
    const cloned = Entry.of(orig, parent);
    cloned.pathTemplate = this.pathTemplate;
    return cloned;
  }

  cloneFull(): Entry {
    return Entry.of(
      Entry.cloneOrig(this.orig),
      this.parent
    );
  }


//region Normalization & Validation

  static cloneOrig(orig: IEntry, {skipChildren} = {skipChildren: false}): IEntry {
    const result: IEntry = {...orig};
    result.customTo = isJustObject(orig.customTo) && {...orig.customTo} || orig.customTo;
    if (orig.children && !skipChildren) {
      result.children = orig.children.map(x => Entry.cloneOrig(x));
    }
    result.note = isJustObject(orig.note) && {...orig.note} || orig.note;
    return result;
  }


  static normalizePathTemplate(orig: IEntry, parent?: Entry): string {
    let {segment} = orig;
    const hasParent = !!parent;
    if (!isString(segment)) {
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
    return (hasParent && parent.pathTemplate || '') + '/' + segment;
  }

  static normalizeRedirectTo(redirectTo?: string): string | undefined {
    if (redirectTo === undefined)
      return;
    if (!isString(redirectTo)) {
      console.error('"redirectTo" must be a string:', redirectTo);
      throw new Error('"redirectTo" must be a string');
    }
    if (redirectTo[0] !== '/') {
      console.error('"redirectTo" must start with the "/" character:', redirectTo);
      throw new Error('"redirectTo" must start with the "/" character');
    }
    return redirectTo;
  }

  static normalizeCustomTo(customTo?: ICustomTo): ICustomTo | undefined {
    if (customTo === undefined)
      return;
    if (isNotJustObject(customTo)) {
      console.error('"customTo" must be an object:', customTo);
      throw new Error('Incorrect "customTo". It must be an object');
    }
    const {pathname, search, hash} = customTo;
    if (typeof pathname !== 'string') {
      console.error('"pathname" must exist and be a string', customTo);
      throw new Error('Incorrect "pathname", must be a string');
    }
    if (pathname[0] !== '/') {
      console.error('"pathname" must start with "/"', customTo);
      throw new Error('"pathname" must start with "/"');
    }
    if (search !== undefined) {
      if (!isString(search)) {
        console.error('"search" must be a string', customTo);
        throw new Error('Incorrect "search", must be a string');
      }
      if (search[0] !== '?') {
        console.error('"search" must start with "?"', customTo);
        throw new Error('"search" must start with "?"');
      }
    }
    if (hash !== undefined) {
      if (!isString(hash)) {
        console.error('"hash" must be a string', customTo);
        throw new Error('Incorrect "hash", must be a string');
      }
      if (hash[0] !== '#') {
        console.error('"hash" must start with "#"', customTo);
        throw new Error('"hash" must start with "#"');
      }
    }
    return {...customTo};
  }

  static normalizeChildren({children}: IEntry, parent: Entry): Entry[] | undefined {
    return children?.map(orig => Entry.of(Entry.cloneOrig(orig), parent));
  }

  static normalizeNote(note?: any) {
    if (note === undefined)
      return;
    if (isNotJustObject(note))
      return note;
    return cloneSimple(note);
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
      orig.component !== undefined ||
      orig.redirectTo !== undefined ||
      orig.customTo !== undefined ||
      orig.action !== undefined ||
      orig.children !== undefined
    );
  }

  static resultIsChildren(orig: IEntry): boolean {
    if (!Entry.hasResult(orig))
      return false;
    return (
      orig.children !== undefined &&
      orig.component === undefined &&
      orig.redirectTo === undefined &&
      orig.customTo === undefined &&
      orig.action === undefined
    );
  }

  static isMultiResult(orig: IEntry): boolean {
    let count = 0;
    if (orig.component !== undefined)
      count++;
    if (orig.redirectTo !== undefined)
      count++;
    if (orig.customTo !== undefined)
      count++;
    if (orig.action !== undefined)
      count++;
    // if (orig.children !== undefined) <-- it's been commented out,
    //   count++;                           and it's not a mistake
    return count > 1;
  }

  static of(orig: IEntry, parent?: Entry): Entry {
    return new Entry(orig, parent);
  }

//endregion Support

}
