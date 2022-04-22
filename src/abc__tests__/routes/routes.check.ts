import {IRouteTest} from '../common/contract'

export const routesCheck: IRouteTest[] = [
  {
    segment: '/', children: [
      {segment: '/', component: '', note: {title: 'Index page'}},
      {
        segment: '/books', component: '', children: [
          {segment: '/books/:year/:genre', component: ''},
          {segment: '/books/(.*)', redirectTo: '/auto'}
        ]
      }
    ]
  },
  {
    segment: '/team/:id', component: '', children: [
      {segment: '/team/:id/group/:gr_id', component: ''},
      {segment: '/team/:id/users', component: ''},
      {segment: '/team/:id/user/:name', component: ''},
      {segment: '/team/:id/hr', redirectTo: '/team/:id'},
      {segment: '/team/:id/(.*)', customTo: {pathname: '/books/2020/comics'}}
    ]
  },
  {
    segment: '/auto', children: [
      {segment: '/auto', component: 'z', note: {head: 'Auto'}},
      {segment: '/auto/:color', component: ''},
      {segment: '/auto/check/redirect', customTo: {pathname: '/auto/aqua', search: 'hello=12', hash: 'qwe'}}
    ]
  },
  {segment: '/:userId', component: 'user'},
]
