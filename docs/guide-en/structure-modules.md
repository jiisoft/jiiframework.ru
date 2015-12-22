Modules
=======

Modules are self-contained software units that consist of [models](structure-models), [views](structure-views),
[controllers](structure-controllers), and other supporting components. End users can access the controllers
of a module when it is installed in [application](structure-applications). For these reasons, modules are
often viewed as mini-applications. Modules differ from [applications](structure-applications) in that
modules cannot be deployed alone and must reside within applications.


## Creating Modules <span id="creating-modules"></span>

A module is organized as a directory which is called the [[Jii.base.Module.basePath|base path]] of the module.
Within the directory, there are sub-directories, such as `controllers`, `models`, `views`, which hold controllers,
models, views, and other code, just like in an application. The following example shows the content within a module:

```
modules/
    forum/
        Module.js                   the module class file
        controllers/                containing controller class files
            DefaultController.js    the default controller class file
        models/                     containing model class files
        views/                      containing controller view and layout files
            layouts/                containing layout view files
            default/                containing view files for DefaultController
                index.ejs           the index view file
```


### Module Classes <span id="module-classes"></span>

Each module should have a unique module class which extends from [[Jii.base.Module]]. The class should be located
directly under the module's [[Jii.base.Module.basePath|base path]]. When run worker, a single instance
of the corresponding module class will be created. Like [application instances](structure-applications), module
instances are used to share data and components for code within modules.

The following is an example how a module class may look like:

```js
/**
 * @class app.modules.forum
 * @extends Jii.base.Module
 */
Jii.defineClass('app.modules.forum.Module', /** @lends app.modules.forum.Module.prototype */{

    __extends: 'Jii.base.Module',

    init: function(context) {
        this.params.foo = 'bar';
        
        return this.__super();
    }

});
```


### Controllers in Modules <span id="controllers-in-modules"></span>

When creating controllers in a module, a convention is to put the controller classes under the `controllers`
sub-namespace of the namespace of the module class. This also means the controller class files should be
put in the `controllers` directory within the module's [[Jii.base.Module.basePath|base path]].
For example, to create a `post` controller in the `forum` module shown in the last subsection, you should
declare the controller class like the following:

```js
var Jii = require('jii');

/**
 * @class app.modules.forum.controllers.PostController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.modules.forum.controllers.PostController', /** @lends app.modules.forum.controllers.PostController.prototype */{

	__extends: 'Jii.base.Controller',


});
```

You may customize the namespace of controller classes by configuring the [[Jii.base.Module.controllerNamespace]]
property. In case some of the controllers are outside of this namespace, you may make them accessible
by configuring the [[Jii.base.Module.controllerMap]] property, similar to what you do in an [application](structure-applications).


### Views in Modules <span id="views-in-modules"></span>

Views in a module should be put in the `views` directory within the module's [[Jii.base.Module.basePath|base path]].
For views rendered by a controller in the module, they should be put under the directory `views/ControllerID`,
where `ControllerID` refers to the [controller ID](structure-controllers). For example, if
the controller class is `PostController`, the directory would be `views/post` within the module's
[[Jii.base.Module.basePath|base path]].

A module can specify a [layout](structure-views#layouts) that is applied to the views rendered by the module's
controllers. The layout should be put in the `views/layouts` directory by default, and you should configure
the [[Jii.base.Module.layout]] property to point to the layout name. If you do not configure the `layout` property,
the application's layout will be used instead.


## Using Modules <span id="using-modules"></span>

To use a module in an application, simply configure the application by listing the module in
the [[Jii.base.Application.modules|modules]] property of the application. The following code in the
[application configuration](structure-applications#application-configurations) uses the `forum` module:

```js
{
    modules: {
        forum: {
            className: 'app\modules\forum\Module',
            // ... other configurations for the module ...
        },
    },
}
```

The [[Jii.base.Application.modules|modules]] property takes an array of module configurations. Each array key
represents a *module ID* which uniquely identifies the module among all modules in the application, and the corresponding
array value is a [configuration](concept-configurations) for creating the module.


### Routes <span id="routes"></span>

Like accessing controllers in an application, [routes](structure-controllers#routes) are used to address
controllers in a module. A route for a controller within a module must begin with the module ID followed by
the controller ID and action ID. For example, if an application uses a module named `forum`, then the route
`forum/post/index` would represent the `index` action of the `post` controller in the module. If the route
only contains the module ID, then the [[Jii.base.Module.defaultRoute]] property, which defaults to `default`,
will determine which controller/action should be used. This means a route `forum` would represent the `default`
controller in the `forum` module.


### Accessing Modules <span id="accessing-modules"></span>

Within a module, you may often need to get the instance of the module class so that you can
access the module ID, module parameters, module components, etc. You can do so by using the following statement:

```js
var module = Jii.app.getModule('forum');
```

Once you have the module instance, you can access parameters and components registered with the module. For example,

```js
var maxPostCount = module.params.maxPostCount;
```


## Nested Modules <span id="nested-modules"></span>

Modules can be nested in unlimited levels. That is, a module can contain another module which can contain yet
another module. We call the former *parent module* while the latter *child module*. Child modules must be declared
in the [[Jii.base.Module.modules|modules]] property of their parent modules. For example,

```js
/**
 * @class app.modules.forum
 * @extends Jii.base.Module
 */
Jii.defineClass('app.modules.forum.Module', /** @lends app.modules.forum.Module.prototype */{

    __extends: 'Jii.base.Module',

    init: function(context) {
        this.setModules({
            admin: {
                // you should consider using a shorter namespace here!
                className: 'app.modules.forum.modules.admin.Module'
            }
        });
        
        return this.__super();
    }

});
```

For a controller within a nested module, its route should include the IDs of all its ancestor modules.
For example, the route `forum/admin/dashboard/index` represents the `index` action of the `dashboard` controller
in the `admin` module which is a child module of the `forum` module.

> Info: The [[Jii.base.Module.getModule()]] method only returns the child module directly belonging
to its parent.
