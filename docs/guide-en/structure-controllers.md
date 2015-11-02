Controllers
===========

Controllers are part of the [MVC](http://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) architecture.
They are objects of classes extending from [[Jii.base.Controller]] and are responsible for processing requests and
generating responses. In particular, after process request by HTTP server ([[Jii.httpServer.HttpServer]]),
controllers will analyze incoming request data, pass them to [models](structure-models), inject model results
into [views](structure-views), and finally generate outgoing responses.


## Actions <span id="actions"></span>

Controllers are composed of *actions* which are the most basic units that end users can address and request for
execution. A controller can have one or multiple actions.

The following example shows a `post` controller with two actions: `view` and `create`:

```js
/**
 * @class app.controllers.PostController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.PostController', /** @lends app.controllers.PostController.prototype */{

    __extends: Jii.base.Controller,

    actionView: function(context) {
        var id = context.request.get('id');
        
        return app.models.Post.findOne(id).then(function(model) {
            if (model === null) {
                context.response.setStatusCode(404);
                context.response.send();
                return;
            }
            
            context.response.data = this.render('view', {
                model: model
            });
            context.response.send();
        });
    },
    
    actionCreate: function(context) {
        var model = new app.models.Post();
        
		Promise.resolve().then(function() {
			// Save user
			if (context.request.isPost()) {
				model.setAttributes(context.request.post());
				return model.save();
			}
			
			return false;
		}).then(function(isSuccess) {
            if (isSuccess) {
                context.request.redirect(['view', {id: model.get('id')}]) 
            } else {
                context.response.data = this.render('create', {
                    model: model
                });
                context.response.send();
            }
		});
    }

});
```

In the `view` action (defined by the `actionView()` method), the code first loads the [model](structure-models)
according to the requested model ID; If the model is loaded successfully, it will display it using
a [view](structure-views) named `view`. Otherwise, return HTTP 404 error with empty page.

In the `create` action (defined by the `actionCreate()` method), the code is similar. It first tries to populate
the [model](structure-models) using the request data and save the model. If both succeed it will redirect
the browser to the `view` action with the ID of the newly created model. Otherwise it will display
the `create` view through which users can provide the needed input.


## Routes <span id="routes"></span>

End users address actions through the so-called *routes*. A route is a string that consists of the following parts:

* a module ID: this exists only if the controller belongs to a non-application [module](structure-modules);
* a controller ID: a string that uniquely identifies the controller among all controllers within the same application
  (or the same module if the controller belongs to a module);
* an action ID: a string that uniquely identifies the action among all actions within the same controller.

Routes take the following format:

```
ControllerID/ActionID
```

or the following format if the controller belongs to a module:

```
ModuleID/ControllerID/ActionID
```


## Creating Actions <span id="creating-actions"></span>

Creating actions can be as simple as defining the so-called *action methods* in a controller class. An action method is
a *public* method whose name starts with the word `action`. The return value of an action method represents
the response data to be sent to end users. The following code defines two actions, `index` and `hello-world`:

```js
/**
 * @class app.controllers.SiteController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.SiteController', /** @lends app.controllers.SiteController.prototype */{

    __extends: Jii.base.Controller,

    actionIndex: function(context) {
        context.response.data = this.render('index');
        context.response.send();
    },
    
    actionHelloWorld: function(context) {
        context.response.data = 'Hello World';
        context.response.send();
    }

});
```


### Action IDs <span id="action-ids"></span>

An action is often designed to perform a particular manipulation of a resource. For this reason,
action IDs are usually verbs, such as `view`, `update`, etc.

By default, action IDs should contain these characters only: English letters in lower case, digits,
underscores, and hyphens. (You can use hyphens to separate words.) For example,
`view`, `update2`, and `comment-post` are all valid action IDs, while `view?` and `Update` are not.

You can create actions in two ways: inline actions and standalone actions. An inline action is
defined as a method in the controller class, while a standalone action is a class extending
[[Jii.base.Action]] or its child classes. Inline actions take less effort to create and are often preferred
if you have no intention to reuse these actions. Standalone actions, on the other hand, are mainly
created to be used in different controllers or be redistributed as [extensions](structure-extensions).


### Inline Actions <span id="inline-actions"></span>

Inline actions refer to the actions that are defined in terms of action methods as we just described.

The names of the action methods are derived from action IDs according to the following procedure:

1. Turn the first letter in each word of the action ID into upper case.
2. Remove hyphens.
3. Prepend the prefix `action`.

For example, `index` becomes `actionIndex`, and `hello-world` becomes `actionHelloWorld`.

> Note: The names of the action methods are *case-sensitive*. If you have a method named `ActionIndex`,
  it will not be considered as an action method, and as a result, the request for the `index` action
  will result in an exception. Also note that action methods must be public. A private or protected
  method does NOT define an inline action.


Inline actions are the most commonly defined actions because they take little effort to create. However,
if you plan to reuse the same action in different places, or if you want to redistribute an action,
you should consider defining it as a *standalone action*.


### Standalone Actions <span id="standalone-actions"></span>

Standalone actions are defined in terms of action classes extending [[Jii.base.Action]] or its child classes.

To use a standalone action, you should declare it in the *action map* by overriding the
[[Jii.base.Controller.actions()]] method in your controller classes like the following:

```js
actions: function() {
    return {
        // объявляет "error" действие с помощью названия класса
        error: 'app.actions.ErrorAction',

        // объявляет "view" действие с помощью конфигурационного объекта
        view: {
            className: 'app.actions.ViewAction',
            viewPrefix: ''
        }
    };
}
```

As you can see, the `actions()` method should return an array whose keys are action IDs and values the corresponding
action class names or [configurations](concept-configurations). Unlike inline actions, action IDs for standalone
actions can contain arbitrary characters, as long as they are declared in the `actions()` method.

To create a standalone action class, you should extend [[Jii.base.Action]] or a child class, and implement
a public method named `run()`. The role of the `run()` method is similar to that of an action method. For example,

```js
/**
 * @class app.components.HelloWorldAction
 * @extends Jii.base.Action
 */
Jii.defineClass('app.components.HelloWorldAction', /** @lends app.components.HelloWorldAction.prototype */{

    __extends: Jii.base.Action,

    run: function(context) {
        context.response.data = 'Hello World';
        context.response.send();
    }

});
```
