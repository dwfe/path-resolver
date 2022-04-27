import {describe} from '@jest/globals'
import {IEntry} from '../../contract'
import {reqEntry} from '../util'

describe('Entry.constructor, action, canActivate,  normal use', () => {

  test('"action"', () => {
    const action: IEntry['action'] = (data) => Promise.resolve();
    const entry = reqEntry({segment: 'user', action});
    expect(entry.action).toStrictEqual(action);
  });

  test('"canActivate"', () => {
    const canActivate: IEntry['canActivate'] = (data) => Promise.resolve();
    const entry = reqEntry({segment: 'user', canActivate});
    expect(entry.canActivate).toStrictEqual(canActivate);
  });

  test('"canDeactivate"', () => {
    const canDeactivate: IEntry['canActivate'] = (data) => Promise.resolve(true);
    const entry = reqEntry({segment: 'user', canDeactivate});
    expect(entry.canDeactivate).toStrictEqual(canDeactivate);
  });

});
