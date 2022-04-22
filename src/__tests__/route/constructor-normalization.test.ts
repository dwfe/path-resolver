import {describe, expect} from '@jest/globals';
import {Entry} from '../../core/a/entry';
import {IEntry} from '../../core/contract';

//region Support

// export function path(parentPath: string, origPath: string, testPath?: string) {
//   const parent = parentPath !== undefined && Entry.of({segment: parentPath}) || undefined;
//   const route = Entry.of({segment: origPath}, parent);
//   expect(route.orig.segment).toBe(origPath);
//   if (testPath !== undefined)
//     expect(route.segment).toBe(testPath);
// }
//
// export function rootPath(origPath: string, testPath?: string) {
//   path(undefined as unknown as string, origPath, testPath);
// }

function fillRequired(orig: IEntry): void {
  if (!Entry.hasResult(orig))
    orig.component = 'component';
  orig?.children?.forEach(x => fillRequired(x));
}

function check(orig: IEntry, test: Partial<Entry>[], fields: Array<keyof Entry>) {
  fillRequired(orig);
  const entry = Entry.of(orig);
  const target = Entry.flat(entry);
  expect(target.length).toBe(test.length);
  for (let i = 0; i < target.length; i++) {
    for (const field of fields) {
      expect(target[i][field]).toBe(test[i][field]);
    }
  }
}


const arr: IEntry[] = [
  {segment: '', component: 123},
  {
    segment: 'control', component: 123, children: [
      {segment: ':user', component: 123},
      {segment: '**', component: 123},
    ]
  },
  {segment: '**', component: 123},
]

//endregion Support

describe('Entry.constructor, normal use', () => {

  test('path, root', () => {
    check({segment: ''}, [{path: '/'}], ['path']);
    check({segment: 'user'}, [{path: '/user'}], ['path']);
    check({segment: ':user'}, [{path: '/:user'}], ['path']);
    check({segment: '**'}, [{path: '/(.*)'}], ['path']);
  });

  test('path', () => {
    check({
      segment: 'control', children: [{
        segment: ':user', children: [{
          segment: '**'
        }],
      }, {
        segment: 'billing'
      }, {
        segment: 'quotas', children: [{
          segment: 'files', children: [{
            segment: 'downloads'
          }, {
            segment: 'pictures'
          }, {
            segment: 'documents'
          }, {
            segment: '**'
          }]
        }, {
          segment: 'mail'
        }, {
          segment: '**'
        }]
      }, {
        segment: '**'
      }],
    }, [
      {path: '/control'},
      {path: '/control/:user'},
      {path: '/control/:user/(.*)'},
      {path: '/control/billing'},
      {path: '/control/quotas'},
      {path: '/control/quotas/files'},
      {path: '/control/quotas/files/downloads'},
      {path: '/control/quotas/files/pictures'},
      {path: '/control/quotas/files/documents'},
      {path: '/control/quotas/files/(.*)'},
      {path: '/control/quotas/mail'},
      {path: '/control/quotas/(.*)'},
      {path: '/control/(.*)'},
    ], ['path']);
  });

});
