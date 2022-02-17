import {IRoute} from '../../..'

export const routesCheck: IRoute[] = [
  {
    path: '/', children: [
      {path: '/', component: '', note: {title: 'Index page'}},
      {
        path: '/books', component: '', children: [
          {path: '/books/:year/:genre', component: ''},
          {path: '/books/(.*)', redirectTo: '/auto'}
        ]
      }
    ]
  },
  {
    path: '/team/:id', component: '', children: [
      {path: '/team/:id/group/:gr_id', component: ''},
      {path: '/team/:id/users', component: ''},
      {path: '/team/:id/user/:name', component: ''},
      {path: '/team/:id/hr', redirectTo: '/team/:id'},
      {path: '/team/:id/(.*)', customTo: {pathname: '/books/2020/comics'}}
    ]
  },
  {
    path: '/auto', children: [
      {path: '/auto', component: 'z', note: {head: 'Auto'}},
      {path: '/auto/:color', component: ''},
      {path: '/auto/check/redirect', customTo: {pathname: '/auto/aqua', search: 'hello=12', hash: 'qwe'}}
    ]
  },
  {path: '/:userId', component: 'user'},
]
