import {describe} from '@jest/globals';
import {Entry} from '../../entry';
import {Throw} from '../util';

describe('Entry.constructor', () => {

  test('resulting field is missing: component, redirectTo, customTo, action or children', () => {
    Throw(() => Entry.of({segment: ''}), 'The resulting field is missing. Fill one of: component, redirectTo, customTo, action or children');
  });

  test('multi result', () => {
    const component = '<component/>';
    const redirectTo = '/';
    const customTo = {pathname: '/'};
    const action = () => console.log(`action`,);
    Throw(() => Entry.of({segment: '', component, redirectTo}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', component, customTo}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', component, action}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', component, redirectTo, customTo}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', component, redirectTo, customTo, action}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', redirectTo, customTo}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', redirectTo, action}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
    Throw(() => Entry.of({segment: '', customTo, action}), 'Only one of the following can be specified at a time: component, redirectTo, customTo or action');
  });

});
