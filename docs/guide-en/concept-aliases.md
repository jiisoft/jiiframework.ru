Aliases
=======

Aliases are used to represent file paths or URLs so that you don't have to hard-code absolute paths or URLs in your project.
An alias must start with the `@` character to be differentiated from normal file paths and URLs.


Defining Aliases <span id="defining-aliases"></span>
----------------

You can define an alias for a file path or URL by calling [[Jii.setAlias()]]:

```js
// an alias of a file path
Jii.setAlias('@foo', '/path/to/foo');

// an alias of a URL
Jii.setAlias('@bar', 'http://www.example.com');
```

> Note: The file path or URL being aliased may *not* necessarily refer to an existing file or resource.

Given a defined alias, you may derive a new alias (without the need of calling [[Jii.setAlias()]]) by appending
a slash `/` followed with one or more path segments. The aliases defined via [[Jii.setAlias()]] becomes the 
*root alias*, while aliases derived from it are *derived aliases*. For example, `@foo` is a root alias,
while `@foo/bar/file.js` is a derived alias.

You can define an alias using another alias (either root or derived):

```js
Jii.setAlias('@foobar', '@foo/bar');
```

Root aliases are usually defined during the bootstrapping stage.
For convenience, [Application](structure-applications) provides a writable property named `aliases`
that you can configure in the application [configuration](concept-configurations):

```js
return {
    // ...
    aliases: {
        '@foo': '/path/to/foo',
        '@bar': 'http://www.example.com'
    },
};
```

Resolving Aliases <span id="resolving-aliases"></span>
-----------------

You can call [[Jii.getAlias()]] to resolve a root alias into the file path or URL it represents.
The same method can also resolve a derived alias into the corresponding file path or URL:

```js
console.log(Jii.getAlias('@foo'));               // displays: /path/to/foo
console.log(Jii.getAlias('@bar'));               // displays: http://www.example.com
console.log(Jii.getAlias('@foo/bar/file.js')) ;  // displays: /path/to/foo/bar/file.js
```

The path/URL represented by a derived alias is determined by replacing the root alias part with its corresponding
path/URL in the derived alias.

> Note: The [[Jii.getAlias()]] method does not check whether the resulting path/URL refers to an existing file or resource.


A root alias may also contain slash `/` characters. The [[Jii.getAlias()]] method
is intelligent enough to tell which part of an alias is a root alias and thus correctly determines
the corresponding file path or URL:

```js
Jii.setAlias('@foo', '/path/to/foo');
Jii.setAlias('@foo/bar', '/path2/bar');
console.log(Jii.getAlias('@foo/test/file.js'));  // displays: /path/to/foo/test/file.js
console.log(Jii.getAlias('@foo/bar/file.js'));   // displays: /path2/bar/file.js
```

If `@foo/bar` is not defined as a root alias, the last statement would display `/path/to/foo/bar/file.js`.

Using Aliases <span id="using-aliases"></span>
------------------------------------------------

Aliases are recognized in many places in Jii without needing to call [[Jii.getAlias()]] to convert
them into paths or URLs.

Predefined Aliases <span id="predefined-aliases"></span>
------------------

Jii predefines a set of aliases to easily reference commonly used file paths and URLs:

- `@app`, the [[Jii.base.Application.basePath|base path]] of the currently running application.
- `@webroot`, the absolute path to root directory of the currently running Web application. It is specified by param
`webPath` in application configuration.
- `@web`, the base URL of the currently running Web application. It has the same value as [[Jii.base.Application.webUrl]].
