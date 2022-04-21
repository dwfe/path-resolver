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
