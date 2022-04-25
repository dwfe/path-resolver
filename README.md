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
/control/:user => <UserPanel/>
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

```
import {PathResolver} from '@do-while-for-each/path-resolver';

PathResolver.of([
  {segment: '', component: <IndexPage/>},
  {
    segment: 'control', children: [
      {segment: ':user', component: <UserPanel/>},
      {segment: '**', redirectTo: '/'},
    ]
  },
  {segment: '**', component: <NotFoundPage/>},
]);
```

will be able to handle pathnames:

```
/              => <IndexPage/>
/control/:user => <UserPanel/>
/control/**    => redirectTo: '/' => <IndexPage/>
/**            => <NotFoundPage/>
```

#### Wildcard segment

A wildcard segment is used to handle an attempt to navigate to a non-existent part of your application:

```
{ segment: '**', component: <NotFoundPage/> }
```

For example:

```
import {Entry} from '@do-while-for-each/path-resolver';

Entry.of({
  segment: 'control', component: <ControlPanel/>, children: [
    {segment: 'billing', component: <BillingPanel/>},
    {segment: '**', redirectTo: '/'}
  ]
});
```

here when navigating along the pathname `/control/user` will lead to a redirect to the root of the application.

## `component`

Anything.  
For example, in the case of a router in the browser, it can be React.js component:

```
{segment: '', component: <IndexPage/>}
```

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
