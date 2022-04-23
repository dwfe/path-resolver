import {describe} from '@jest/globals'
import {IActionData, IEntry} from '../../core/contract'
import {reqEntry} from '../util'

describe('Entry.constructor, action, canActivate,  normal use', () => {

  test('"action"', () => {
    const action: IEntry['action'] = (data: IActionData) => Promise.resolve();
    reqEntry({segment: 'user', action});
  });

  test('"canActivate"', () => {
    const canActivate: IEntry['canActivate'] = (data: IActionData) => Promise.resolve();
    reqEntry({segment: 'user', canActivate});
  });

  // test('"canActivate"', () => {
  //   const canActivate: IEntry['canActivate'] = (data: IActionData) => Promise.resolve();
  //   reqEntry({segment: 'user', canActivate});
  // });

});
