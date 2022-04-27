Resolving the path into some kind of expected result.

# Installation

Install by npm:

```shell
npm install --save @do-while-for-each/path-resolver
```

or install with yarn:

```shell
yarn add @do-while-for-each/path-resolver
```

# PathResolver

```typescript
// @formatter:off
import {PathResolver} from '@do-while-for-each/path-resolver';

const pr = new PathResolver([
  {segment: '', component: '<index-page/>'},
  {segment: 'control', component: '<control/>', canActivate: canActivateControl, children: [
      {segment: 'quotas', component: '<ctrl-quotas/>', children: [
          {segment: 'files', children: [
              {segment: 'downloads', component: '<quotas-files-downloads/>'},
              {segment: 'pictures', component: '<quotas-files-pictures/>'},
              {segment: 'documents', component: '<quotas-files-documents/>', canDeactivate},
              {segment: '**', redirectTo: '/control/quotas'}]},
          {segment: '**', redirectTo: '/control'}]},
      {segment: ':userId', component: '<ctrl-user/>', canActivate: canActivateControlUser, children: [
          {segment: 'achievement-list', component: '<ctrl-user-achievement-list/>'},
          {segment: 'bonuses', action},
          {segment: '**', component: '<ctrl-user-unknown-page/>'}]},
      {segment: '**', redirectTo: '/auto'}]}, // unattainable entry!
  {segment: 'auto', component: '<auto/>', children: [
      {segment: 'to-red', customTo: {pathname: '/auto/red', search: '?ford=focus', hash: '#table'}},
      {segment: ':color', component: '<auto-color/>'},
      {segment: '**', redirectTo: '/'}]},
  {segment: ':slide', component: '<slide/>'},
  {segment: '**', component: '<not-found/>'}
], {isDebug: true});

pr.resolve('/'); // -> <index-page/>
pr.resolve('/control/quotas/files'); // -> redirectTo: '/control', [canActivateControl]
pr.resolve('/control/quotas/files/documents'); // -> <quotas-files-documents/>, [canActivateControl], canDeactivate
pr.resolve('/control/72/bonuses'); // -> action, {'userId': '72'}, [canActivateControl, canActivateControlUser]
pr.resolve('/auto/to-red'); // -> customTo: {pathname: '/auto/red', search: '?ford=focus', hash: '#table'}
pr.resolve('/auto/toyota'); // -> <auto-color/>, {'color': 'toyota'}
pr.resolve('/zY7654dFo'); // -> <slide/>
pr.resolve('/unknown/path'); // -> <not-found/>
```

Inside `PathResolver`, each entry of the form `{segment: ...}` is transformed into an object `Entry`.  

The result of work `PathResolver` is `IPathResolveResult | undefined`: 

```typescript
class PathResolver {
  resolve(pathname: string): IPathResolveResult | undefined {}
}

export interface IPathResolveResult {
  target: {
    entry: Entry;
    pathname: string;
    pathnameParams: IPathnameParams;
  },
  canActivateArr: Entry[];
}
```

# Entry

The full path to any part of your application consists of segments.  
For example, the pathname: `/control/:user` – consists of segments `control` and `:user`.

Each segment can potentially be the end point of the path. Upon reaching the end point, it is necessary to return some result. Accordingly, the segment must be associated with the instruction on how to get the result.  
The instruction is stored in an object of type `Entry` and consists of the following fields:

```
{segment, component?, redirectTo?, customTo?, action?, children?, canActivate?, canDeactivate?, note?, name?}
```

here the result can be one of : `component`, `redirectTo`, `customTo`, `action`, `children`.

So the `Entry` is an instruction on what to do when matching for this segment of the pathname.

## `segment`

A segment is part of a pathname. For example, an entry of the form:

```
import {Entry} from '@do-while-for-each/path-resolver';

Entry.of({
  segment: 'control', component: <ControlPanel/>, children: [
    {segment: ':user', component: <UserPanel/>}
  ]
});
```

will be able to handle pathnames:

```
/control       => <ControlPanel/>
/control/alex  => <UserPanel/>, {"user": "alex"}
```

When declaring segments, you can rely on the capabilities of the package `path-to-regexp`, see:

- [match](https://github.com/pillarjs/path-to-regexp#match)

### Features

#### No slash

When declaring a segment, the leading slash `/` is omitted.

#### Application root

To specify the segment to the index page (or to something along the pathname `/`), an empty segment is used:

```
{segment: '', component: <IndexPage/>}
```

Also, children cannot be specified for an empty segment:

```
{segment: '', component: <IndexPage/>, children: [...]}  // throws an error
```

This happens because `PathResolver` works with an array of entries, each of which is already a root, for example:

```typescript
// @formatter:off
import {PathResolver} from '@do-while-for-each/path-resolver';

new PathResolver([
  {segment: '', component: <IndexPage/>},
  {segment: 'control', children: [
      {segment: ':user', component: <UserPanel/>},
      {segment: '**', redirectTo: '/'}]},
  {segment: '**', component: <NotFoundPage/>},
]);
```

will be able to handle pathnames:

```
/             => <IndexPage/>
/control/1723 => <UserPanel/>, {"user":"1723"}
/control/some => redirectTo: '/'
/hello/world  => <NotFoundPage/>
```

#### Wildcard segment

A wildcard segment is used to handle an attempt to navigate to a non-existent part of your application:

```
{ segment: '**', component: <NotFoundPage/> }
```

For example:

```typescript
// @formatter:off
import {Entry} from '@do-while-for-each/path-resolver';

Entry.of(
  {segment: 'control', component: <ControlPanel/>, children: [
      {segment: 'billing', component: <BillingPanel/>},
      {segment: '**', redirectTo: '/'}]}
);
```

here when navigating along the pathname `/control/user` will lead to a redirect to the root of the application.

## `component`

Anything.  
For example, in the case of a router in the browser, it can be React.js component:

```
{segment: '', component: <IndexPage/>}
```

But it can also be any primitive or function:

```
{segment: '', component: 123}
{segment: '/ctrl', component: null}
{segment: '/auto', component: () => console.log('hi')}
```

the main thing is that the code that received such a result could process it correctly.

## `redirectTo`

Where to redirect.  
String.  
If set, it must start with the `/` character.

## `customTo`

Object of the type ([pathname](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname), [search](https://developer.mozilla.org/en-US/docs/Web/API/URL/search), [hash](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash)):

```typescript
interface ICustomTo {
  pathname: string;
  search?: string;
  hash?: string;
  asGoto?: boolean; // otherwise treated as a redirect
}
```

If `customTo` set, `pathname` must be a string and should start with the `/` character.  
If `search` set, it must be a string and start with the `?` character.  
If `hash` set, it must be a string and start with the `#` character.

## `action`, `canActivate`, `canDeactivate`

Most likely a Function.  
Determined by the external code that uses the `PathResolver`.  
This external code will at some point call the function that was passed.

## `children`

## `note`

Some additional information.

## `name`
