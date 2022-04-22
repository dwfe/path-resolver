import {IRouteTest} from '../common/contract'

export const routes: IRouteTest[] = [
  {
    segment: '', children: [
      {segment: '', component: '', note: {title: 'Index page'}},
      {
        segment: 'books', component: '', children: [
          {segment: ':year/:genre', component: ''},
          {segment: '(.*)', redirectTo: '/auto'}
        ]
      }
    ]
  },
  {
    segment: 'team/:id', component: '', children: [
      {segment: 'group/:gr_id', component: ''},
      {segment: 'users', component: ''},
      {segment: 'user/:name', component: ''},
      {segment: 'hr', redirectTo: ''},
      {segment: '(.*)', customTo: {pathname: '/books/2020/comics'}}
    ]
  },
  {
    segment: 'auto', children: [
      {segment: '', component: 'z', note: {head: 'Auto'}},
      {segment: ':color', component: ''},
      {segment: 'check/redirect', customTo: {pathname: 'aqua', search: 'hello=12', hash: 'qwe'}}
    ]
  },
  {segment: ':userId', component: 'user'},
]

export const routesTotalCount = 16
