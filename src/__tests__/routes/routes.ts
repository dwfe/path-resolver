import {IRoute} from '../../..'

export const routes: IRoute[] = [
  {
    path: '', children: [
      {path: '', component: '', note: {title: 'Index page'}},
      {
        path: 'books', component: '', children: [
          {path: ':year/:genre', component: ''},
          {path: '(.*)', redirectTo: '/auto'}
        ]
      }
    ]
  },
  {
    path: 'team/:id', component: '', children: [
      {path: 'group/:gr_id', component: ''},
      {path: 'users', component: ''},
      {path: 'user/:name', component: ''},
      {path: 'hr', redirectTo: ''},
      {path: '(.*)', customTo: {pathname: '/books/2020/comics'}}
    ]
  },
  {
    path: 'auto', children: [
      {path: '', component: 'z', note: {head: 'Auto'}},
      {path: ':color', component: ''},
      {path: 'check/redirect', customTo: {pathname: 'aqua', search: 'hello=12', hash: 'qwe'}}
    ]
  },
  {path: ':userId', component: 'user'},
]

export const routesTotalCount = 16
