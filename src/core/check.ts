import {IEntry} from './contract'

export function checkLeadSlash(path: string): void {
  if (path[0] === '/')
    throw new Error(`Invalid configuration of route, because path [ ${path} ] cannot start with a slash`)
}

export function needToMatchChildren({redirectTo, component, children}: IEntry): boolean {
  return redirectTo === undefined && component === undefined // if 'redirectTo' and 'component' are omitted
    && children !== undefined && children.length > 0         // but children are available
}

export function skipBranch(src: string, toCheck: string): boolean {
  const srcFirst = src.split('/')[1] // check only first level: '/this'
  const start = srcFirst[0]
  if (start === undefined
    || start === ':'
    || start === '(')
    return false; // can't check -> go inside branch
  const checkFirst = toCheck.split('/')[1]
  return srcFirst !== checkFirst
}
