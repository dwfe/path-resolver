import {describe} from '@jest/globals'
import {Entry} from '../../core/a/entry'
import {reqEntry, Throw} from '../util'

describe('Entry.constructor, action incorrect use', () => {

  test('"action" must be a function', () => {
    // @ts-ignore
    Throw(() => Entry.of({segment: '', action: null}), '"action" must be a function');
    // @ts-ignore
    Throw(() => Entry.of({segment: '', action: {}}), '"action" must be a function');
    // @ts-ignore
    Throw(() => Entry.of({segment: '', action: 123}), '"action" must be a function');
  });

  test('"canActivate" must be a function', () => {
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canActivate: null}), '"canActivate" must be a function');
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canActivate: {}}), '"canActivate" must be a function');
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canActivate: 123}), '"canActivate" must be a function');
  });

  test('"canDeactivate" must be a function', () => {
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canDeactivate: null}), '"canDeactivate" must be a function');
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canDeactivate: {}}), '"canDeactivate" must be a function');
    // @ts-ignore
    Throw(() => reqEntry({segment: '', canDeactivate: 123}), '"canDeactivate" must be a function');
  });

});
