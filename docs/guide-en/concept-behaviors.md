Behaviors
=========

Behaviors are instances of [[Jii.base.Behavior]], or of a child class. Behaviors, also known
as [mixins](http://en.wikipedia.org/wiki/Mixin), allow you to enhance the functionality
of an existing [[Jii.base.Component|component]] class without needing to change the class's inheritance.
Attaching a behavior to a component "injects" the behavior's methods and properties into the component, making those
methods and properties accessible as if they were defined in the component class itself. Moreover, a behavior
can respond to the [events](concept-events) triggered by the component, which allows behaviors to also customize the normal
code execution of the component.

> Важно! Доступ к свойствам поведений доступен только через методы комопнента `get()` и `set()`, поскольку Jii
[не поддерживает](concept-properties) геттеры и сеттеры.

Defining Behaviors <span id="defining-behaviors"></span>
------------------

To define a behavior, create a class that extends [[Jii.base.Behavior]], or extends a child class. For example:

```js
/**
 * @class app.components.MyBehavior
 * @extends Jii.base.Behavior
 */
Jii.defineClass('app.components.MyBehavior', /** @lends app.components.MyBehavior.prototype */{

	__extends: 'Jii.base.Behavior',
	
	prop1: null,
	_prop2: null,
	
	setProp2: function(value) {
	    this._prop2 = value;
	},
	
	getProp2: function() {
	    return this._prop2;
	},
	
	foo: function() {
	    // ...
	}

});
```

The above code defines the behavior class `app.components.MyBehavior`, with two properties 
`prop1` and `prop2` and one method `foo()`. Note that property `prop2`
is defined via the getter `getProp2()` and the setter `setProp2()`. This is the case because [[Jii.base.Behavior]]
extends [[Jii.base.Object]] and therefore supports defining [properties](concept-properties) via getters and setters.

Because this class is a behavior, when it is attached to a component, that component will then also have the the `prop1` and `prop2` properties and the `foo()` method.

> Tip: Within a behavior, you can access the component that the behavior is attached to through the [[Jii.base.Behavior.owner]] property.

Handling Component Events
------------------

If a behavior needs to respond to the events triggered by the component it is attached to, it should override the
[[Jii.base.Behavior.events()]] method. For example:

```js
/**
 * @class app.components.MyBehavior
 * @extends Jii.base.Behavior
 */
Jii.defineClass('app.components.MyBehavior', /** @lends app.components.MyBehavior.prototype */{

	__extends: 'Jii.base.Behavior',
	
	events: function() {
	    return {
	        beforeValidate: 'beforeValidate'
	    };
	},
	
	beforeValidate: function(event) {
	    // ...
	}

});
```

The [[Jii.base.Behavior.events()]] method should return a list of events and their corresponding handlers.
The above example declares that the [[Jii.base.ActiveRecord.EVENT_BEFORE_VALIDATE]] event exists and defines
its handler, `beforeValidate()`. When specifying an event handler, you may use one of the following formats:

* a string that refers to the name of a method of the behavior class, like the example above
* массив, содержащий объект или имя класса, и имя метода, например, `[object, 'methodName']`;
* массив, содержащий метод и контекст, например, `[object.methodName, object]`;
* an anonymous function

The signature of an event handler should be as follows, where `event` refers to the event parameter. Please refer
to the [Events](concept-events) section for more details about events.

```js
function (event) {
}
```

Attaching Behaviors <span id="attaching-behaviors"></span>
-------------------

You can attach a behavior to a [[Jii.base.Component|component]] either statically or dynamically. The former is more common in practice.

To attach a behavior statically, override the [[Jii.base.Component.behaviors()]] method of the component
class to which the behavior is being attached. The [[Jii.base.Component.behaviors()]] method should return a list of
behavior [configurations](concept-configurations).
Each behavior configuration can be either a behavior class name or a configuration object:

```js
/**
 * @class app.models.User
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.User', /** @lends app.models.User.prototype */{

	__extends: 'Jii.sql.ActiveRecord',
	
	behaviors: function() {
	    return {
            // прикрепленное по имени класса
            'myBehavior1': app.components.MyBehavior.className(),

            // исконфигурированное с использованием объекта
            'myBehavior2': {
                className: app.components.MyBehavior.className(),
                prop1: 'value1',
                prop2: 'value2'
            }
	    };
	}

});
```

To attach a behavior dynamically, call the [[Jii.base.Component.attachBehavior()]] method of the component to
which the behavior is being attached:

```js
// attach a behavior object
component.attachBehavior('myBehavior1', new app.components.MyBehavior());

// attach a behavior class
component.attachBehavior('myBehavior2', app.components.MyBehavior.className());

// attach a configuration object
component.attachBehavior('myBehavior3', {
    className: app.components.MyBehavior.className(),
    prop1: 'value1',
    prop2: 'value2'
});
```

You may attach multiple behaviors at once using the [[Jii.base.Component.attachBehaviors()]] method:

```js
component.attachBehaviors({
    myBehavior1: new app.components.MyBehavior(),
    otherBehavior: app.components.MyBehavior.className()
});
```

You may also attach behaviors through [configurations](concept-configurations) like the following: 

```js
{
    'as myBehavior2': app.components.MyBehavior.className(),

    'as myBehavior3': {
		className: app.components.MyBehavior.className(),
		prop1: 'value1',
		prop2: 'value2'
    },
}
```

For more details,
please refer to the [Configurations](concept-configurations#configuration-format) section.

Using Behaviors <span id="using-behaviors"></span>
---------------

To use a behavior, first attach it to a [[Jii.base.Component|component]] per the instructions above.
Once a behavior is attached to a component, its usage is straightforward.

You can access a *public* member variable or a [property](concept-properties) defined by a getter and/or a setter
of the behavior through the component it is attached to:

```js
// публичное свойство "prop1" объявленное в классе поведения
console.log(component.get('prop1'));
component.set(value);
```

Доступ к публичным свойствам поведения доступен только через `get()` и `set()` методы. В свою очередь, *публичные*
методы поведения можно вызывать как обычные методы компонента:

```js
// публичный метод bar() объявленный в классе поведения
component.bar();
```

As you can see, although `component` does not define `prop1` and `foo()`, they can be used as if they are part
of the component definition due to the attached behavior.

If two behaviors define the same property or method and they are both attached to the same component,
the behavior that is attached to the component *first* will take precedence when the property or method is accessed.

A behavior may be associated with a name when it is attached to a component. If this is the case, you may
access the behavior object using the name:

```js
var behavior = component.getBehavior('myBehavior');
```

You may also get all behaviors attached to a component:

```js
var behaviors = component.getBehaviors();
```

Detaching Behaviors <span id="detaching-behaviors"></span>
-------------------

To detach a behavior, call [[Jii.base.Component.detachBehavior()]] with the name associated with the behavior:

```js
component.detachBehavior('myBehavior1');
```

You may also detach *all* behaviors:

```js
component.detachBehaviors();
```

