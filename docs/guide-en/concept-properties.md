Properties
==========

В JavaScript, экземплярами классов являются объекты, а переменные-члены объектов называются *свойства*.
Эти переменные являются частью объявления класса и используются для хранения состояния объектов этого класса
(т.е. именно этим отличается один экземпляр класса от другого).

В Yii Framework обширно используются геттеры и сеттеры для удобной работы со свойствами. Геттер — это метод,
чьё название начинается со слова `get`. Имя сеттера начинается со слова  `set`. Часть названия после `get` или
`set` определяет имя свойства. Например, геттер `getLabel()` и/или сеттер `setLabel()` определяют свойство
`label`.

Jii не поддерживает геттеры и сеттеры через прямое обращение к свойствам объекта, поскольку может использоваться
в браузерах и поддерживает IE8+. Для этого в базовом классе [[Jii.base.Object]] реализованы методы `get` и `set`,
которые принимают строковое название свойств и ведут себя подобно геттерам и сеттерам:

```js
/**
 * @class MyClass
 * @extends Jii.base.Object
 */
Jii.defineClass('MyClass', /** @lends MyClass.prototype */{

	__extends: Jii.base.Object,
	
	_foo: null,
	
	setFoo: function(value) {
	    this._foo = value * 1000;
	},
	
	getFoo: function() {
	    return this._foo;
	}

});

var myClass = Jii.createObject({
    className: MyClass.className(),
    foo: '3'
});

console.log(myClass.get('foo')); // 3000

myClass.set('foo', 5);
console.log(myClass.get('foo')); // 5000
console.log(myClass.getFoo()); // 5000
```

В коде выше геттер и сеттер реализуют свойство `foo`, значение которого хранится в приватном свойстве `_foo`.

A property defined by a getter without a setter is *read only*. Trying to assign a value to such a property will cause
an [[Jii.exceptions.InvalidCallException]]. Similarly, a property defined by a setter without a getter
is *write only*, and trying to read such a property will also cause an exception. It is not common to have write-only
properties.

There are several special rules for, and limitations on, the properties defined via getters and setters:

* If the name of such a property is the same as a class member variable, the latter will take precedence.
  For example, if the above `Foo` class has a member variable `label`, then the assignment `object.set('label', 'abc')`
  will affect the *member variable* 'label'; that line would not call the  `setLabel()` setter method.
* The properties can only be defined by *non-static* getters and/or setters. Static methods will not be treated in the same manner.
