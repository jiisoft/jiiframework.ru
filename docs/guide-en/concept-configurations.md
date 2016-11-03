Configurations
==============

Configurations are widely used in Jii when creating new objects or initializing existing objects.
Configurations usually include the class name of the object being created, and a list of initial values
that should be assigned to the object's [properties](concept-properties). Configurations may also include a list of
handlers that should be attached to the object's [events](concept-events) and/or a list of
[behaviors](concept-behaviors) that should also be attached to the object.

In the following, a configuration is used to create and initialize a database connection:

```js
var config = {
    className: 'Jii.mysql.Connection',
    host: '127.0.0.1',
    database: 'demo',
    username: 'root',
    password: '',
    charset: 'utf8'
};

var db = Jii.createObject(config);
```

The [[Jii.createObject()]] method takes a configuration array as its argument, and creates an object by instantiating
the class named in the configuration. When the object is instantiated, the rest of the configuration
will be used to initialize the object's properties, event handlers, and behaviors.

If you already have an object, you may use [[Jii.configure()]] to initialize the object's properties with
a configuration array:

```js
Jii.configure(object, config);
```

Note that, in this case, the configuration array should not contain a `className` element.


## Configuration Format <span id="configuration-format"></span>

The format of a configuration can be formally described as:

```js
{
    className: 'ClassName',
    propertyName: 'propertyValue',
    'on eventName': eventHandler,
    'as behaviorName': behaviorConfig
}
```

where

* The `className` element specifies a fully qualified class name for the object being created.
* The `propertyName` elements specify the initial values for the named property. The keys are the property names, and the
  values are the corresponding initial values. Only public member variables and [properties](concept-properties)
  defined by getters/setters can be configured.
* The `on eventName` elements specify what handlers should be attached to the object's [events](concept-events).
  Notice that the array keys are formed by prefixing event names with `on `. Please refer to
  the [Events](concept-events) section for supported event handler formats.
* The `as behaviorName` elements specify what [behaviors](concept-behaviors) should be attached to the object.
  Notice that the array keys are formed by prefixing behavior names with `as `; the value, `behaviorConfig`, represents
  the configuration for creating a behavior, like a normal configuration  described here.

Below is an example showing a configuration with initial property values, event handlers, and behaviors:

```js
{
    className: 'app.components.SearchEngine',
    apiKey: 'xxxxxxxx',
    'on search': function (event) {
        Jii.info("Keyword searched: " + event.keyword);
    },
    'as indexer': {
        className: 'app.components.IndexerBehavior'
        // ... property init values ...
    }
}
```

### Application Configurations <span id="application-configurations"></span>

The configuration for an [application](structure-applications) is probably one of the most complex objects in Jii.
This is because the [[Jii.application.WebApplication|application]] class has a lot of configurable properties and events.
More importantly, its [[Jii.application.WebApplication.components|components]] property can receive an array of configurations
for creating components that are registered through the application.

Application configuration example:

```js
var config = {
    application: {
        basePath: __dirname,
        components': {
            urlManager: {
                className: 'Jii.request.UrlManager',
                rules: {
                    '': 'site/index',
                    'guide': 'site/guide',
                    'guide/<page>': 'site/guide'
                }
            },
            http: {
                className: 'Jii.request.http.HttpServer'
            },
            view: {
                className: 'Jii.view.ServerWebView'
            }
        }
    }
};
```

More details about configuring the `components` property of an application can be found
in the [Applications](structure-applications) section.
