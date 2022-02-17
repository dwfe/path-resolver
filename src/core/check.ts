import {IRoute} from './contract'

export class Check {

  static leadSlash(path: string): void {
    if (path[0] === '/')
      throw new Error(`Invalid configuration of route, because path [ ${path} ] cannot start with a slash`)
  }

  static needToMatchChildren({redirectTo, component, children}: IRoute): boolean {
    return redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
      && children !== undefined && children.length > 0         // but children are available
  }

  static skipBranch(src: string, toCheck: string): boolean {
    const srcFirst = src.split('/')[1] // check only first level: '/this'
    const start = srcFirst[0]
    if (start === undefined
      || start === ':'
      || start === '(')
      return false; // can't check -> go inside branch
    const checkFirst = toCheck.split('/')[1]
    return srcFirst !== checkFirst
  }

}
