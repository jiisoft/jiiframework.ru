Jii in browser
====
Initially Jii has been developed to use it everywhere, where Javascript code works. If module's code is not designed strictly for server, it can be used in browser as well.

Realize that all of the framework's structures like applications, components, controllers, modules, models and views are available in frontend.
All of these structures are divided and provided as npm module.

- `jii` (or `jii/deps`) - Framework's base classes and structures;
- `jii-clientrouter` - Router, running actions on url changes;
- `jii-comet` - Comet client;
- `jii-model` - Model with validators (which are mentioned in rules());
- `jii-view` - View render component.

## Create frontend application

Application will be created almost as the same way as it creating on the server.

```js
// Libs
require('jii/deps'); // included underscore and underscore.string libraries
require('jii-clientrouter');

// Application
require('./controllers/SiteController');

Jii.createWebApplication({
    application: {
        basePath: location.href,
        components: {
            urlManager: {
                className: 'Jii.request.UrlManager',
                rules: {
                    '': 'site/index'
                }
            },
            router: {
                className: 'Jii.clientRouter.Router'
            }
        }
    }
}).start();

console.log('Index page url: ' + Jii.app.urlManager.createUrl(['site/index']));
```

## Dependencies

[underscore](http://underscorejs.org/) and [underscore.string](http://epeli.github.io/underscore.string/) required for Jii. If they are already included, import Jii with command `require('jii')`, otherwise use - `require('jii/deps')`.

## Javascript code compilation

Jii recommend to use CommonJS way for import dependencies. Modules' installation can be achieved in many ways, for example using [browserify](http://browserify.org/).
Consider very simple dependency installation example:

```sh
npm install --save-dev gulp gulp-easy
```

gulpfile.js file:

```js
require('gulp-easy')(require('gulp'))
    .js('sources/index.js', 'bundle.js')
```
