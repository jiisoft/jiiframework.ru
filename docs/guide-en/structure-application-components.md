Application Components
======================

Applications are host a set of the so-called *application components* that provide different services for processing
requests. For example, the `urlManager` component is responsible for routing Web requests to appropriate controllers;
the `db` component provides DB-related services; and so on.

Each application component has an ID that uniquely identifies itself among other application components
in the same application. You can access an application component through the expression

```js
Jii.app.ComponentID
```


## Core Application Components <span id="core-application-components"></span>

Jii defines a set of *core* application components with fixed IDs and default configurations.

Below is the list of the predefined core application components. You may configure and customize them
like you do with normal application components. When you are configuring a core application component,
if you do not specify its class, the default one will be used.

* [[Jii.sql.BaseConnection|db]]: represents a database connection through which you can perform DB queries.
  Note that when you configure this component, you must specify the component class.
* [[Jii.request.UrlManager|urlManager]]: supports URL parsing and creation.
  Please refer to the [URL Parsing and Generation](runtime-routing) section for more details.
* [[Jii.view.WebView|view]]: supports view rendering.
  Please refer to the [Views](structure-views) section for more details.

