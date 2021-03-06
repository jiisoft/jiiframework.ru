Свойства
========

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

	__extends: 'Jii.base.Object',
	
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

Свойство, для которого объявлен только геттер без сеттера, может использоваться *только для чтения*. Попытка присвоить
ему значение вызовет [[Jii.exceptions.InvalidCallException]]. Точно так же, свойство для которого объявлен
только сеттер без геттера может использоваться *только для записи*. Попытка получить его значение так же вызовет
исключение.

При определении свойств класса при помощи геттеров и сеттеров нужно помнить о некоторых правилах и ограничениях:

* Если имя такого свойства уже используется переменной-членом класса, то последнее будет иметь более высокий приоритет.
  Например, если в классе `Foo` объявлено свойство `label`, то при вызове `object.set('label', 'abc')` будет напрямую
  изменено значение свойства `label`. А метод `setLabel()` не будет вызван.

* Свойства могут быть объявлены только с помощью *нестатичных* геттеров и/или сеттеров. Статичные методы не будут
  обрабатываться подобным образом.
