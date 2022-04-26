import {describe} from '@jest/globals'
import {ICustomTo} from '../../core/contract'
import {normCheck} from '../util'

describe('Entry.constructor, customTo normal use', () => {

  test('customTo, root', () => {
    let customTo: ICustomTo = {pathname: '/hello'};
    normCheck({segment: 'user', customTo}, [{customTo}], ['customTo']);

    customTo = {pathname: '/hello', search: '?reg=123'};
    normCheck({segment: 'user', customTo}, [{customTo}], ['customTo']);

    customTo = {pathname: '/hello', hash: '#about'};
    normCheck({segment: 'user', customTo}, [{customTo}], ['customTo']);

    customTo = {pathname: '/hello', search: '?reg=123', hash: '#about'};
    normCheck({segment: 'user', customTo}, [{customTo}], ['customTo']);
  });

});
