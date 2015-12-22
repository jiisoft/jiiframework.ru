Components
==========

Components are the main building blocks of Jii applications. Components are instances of [[Jii.base.Component]],
or an extended class. The three main features that components provide to other classes are:

* [Properties](concept-properties)
* [Events](concept-events)
* [Behaviors](concept-behaviors)
 
Separately and combined, these features make Jii classes much more customizable and easier to use.


While components are very powerful, they are a bit heavier than normal objects, due to the fact that
it takes extra memory and CPU time to support [event](concept-events) and [behavior](concept-behaviors) functionality in particular.
If your components do not need these two features, you may consider extending your component class from
[[Jii.base.Object]] instead of [[Jii.base.Component]]. Doing so will make your components as efficient as normal JavaScript objects,
but with added support for [properties](concept-properties).

When extending your class from [[Jii.base.Component]] or [[Jii.base.Object]], it is recommended that you follow
these conventions:

- If you override the constructor, specify a `config` parameter as the constructor's *last* parameter, and then pass this parameter
  to the parent constructor.
- Always call the parent constructor *at the end* of your overriding constructor.
- If you override the [[Jii.base.Object.init()]] method, make sure you call the parent implementation of `init` *at the beginning* of your `init` method.

For example:

```js
var Jii = require('jii');

/**
 * @class app.components.MyClass
 * @extends Jii.base.Object
 */
Jii.defineClass('app.components.MyClass', /** @lends app.components.MyClass.prototype */{

	__extends: 'Jii.base.Object',
	
	prop1: null,
	prop2: null,

    constructor: function(param1, param2, config) {
        config = config || {};
        
        // ... initialization before configuration is applied
        
        this.__super(config);
    },
    
    init: function() {
        this.__super();
        
        // ... initialization after configuration is applied
    }

});
```

Following these guidelines will make your components [configurable](concept-configurations) when they are created. For example:

```js
var component = new app.components.MyClass(1, 2,{prop1: 3, prop2: 4});
// alternatively
var component = Jii.createObject({
    className: app.components.MyClass.className(),
    prop1: 3,
    prop2: 4,
}, [1, 2]);
```

The [[Jii.base.Object]] class enforces the following object lifecycle:

1. Pre-initialization within the constructor. You can set default property values here.
2. Object configuration via `config`. The configuration may overwrite the default values set within the constructor.
3. Post-initialization within [[Jii.base.Object.init()]]. You may override this method to perform sanity checks and normalization of the properties.
4. Object method calls.

The first three steps all happen within the object's constructor. This means that once you get a class instance (i.e., an object),
that object has already been initialized to a proper, reliable state.
