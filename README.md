Looks for a route by path in a predefined route tree.

# Installation

Install by npm:

```shell
npm install --save @do-while-for-each/path-resolver
```

or install with yarn:

```shell
yarn add @do-while-for-each/path-resolver
```

# Route

Each path to some part of your application is enclosed in a route.  
The route is an object of the form:

```
{path, component?, redirectTo?, customTo?, action?, children?, canActivate?, canDeactivate?, note?, name?}
```

## `path`

Route paths are padded with parent path values separated by a slash.
For example, a route of the form:

```
import {Route} from '@do-while-for-each/path-resolver';

Route.of(
  {path: 'control', component: <ControlPanel/> children: [
     {path: ':user', component: <UserPanel/>}
  ]}
);
```

will be able to handle paths:

```
/control       => <ControlPanel/>
/control/:user => <UserPanel/>
```

When determining paths, you can rely on the capabilities of the package [path-to-regexp](https://www.npmjs.com/package/path-to-regexp). It is this package that is used when matching requests to the `PathResolver`.

### Features

When declaring a path, the leading slash `/` is skipped.  
To specify the path to the index page, an empty path is used:

```
{path: '', component: <IndexPage/>}
```

Also, children cannot be specified for an empty path:

```
{path: '', component: <IndexPage/>, children: [...]}  // throws an error
```

### Wildcard route

A wildcard route is used to handle an attempt to navigate to a non-existent part of your application:

```
{ path: '**', component: <NotFoundPage/> }
```
