import {describe} from '@jest/globals'
import {IEntry} from '../../core/a/contract'
import {reqEntry} from '../util'

describe('Entry.constructor, action, canActivate,  normal use', () => {

  test('"action"', () => {
    const action: IEntry['action'] = (data) => Promise.resolve();
    reqEntry({segment: 'user', action});
  });

  test('"canActivate"', () => {
    const canActivate: IEntry['canActivate'] = (data) => Promise.resolve();
    reqEntry({segment: 'user', canActivate});
  });

  test('"canDeactivate"', () => {
    const canDeactivate: IEntry['canActivate'] = (data) => Promise.resolve(true);
    reqEntry({segment: 'user', canDeactivate});
  });

});
