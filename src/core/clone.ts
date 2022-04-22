import {IEntry} from './contract'

export class Clone {

  static route(r: IEntry): IEntry {
    const r2 = {...r}
    if (r2.customTo)
      r2.customTo = {...r2.customTo}
    if (r2.note)
      r2.note = {...r2.note}
    return r2
  }

}
