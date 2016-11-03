Поведения
=========

Поведения (behaviors) — это экземпляры класса [[Jii.base.Behavior]] или класса, унаследованного от него. Поведения,
также известные как [примеси](http://ru.wikipedia.org/wiki/Примесь_(программирование)), позволяют расширять 
функциональность существующих [[Jii.base.Component|компонентов]] без необходимости изменения дерева наследования.
После прикрепления поведения к компоненту, его методы и свойства "внедряются" в компонент, и становятся доступными
так же, как если бы они были объявлены в самом классе компонента. Кроме того, поведение может реагировать на 
[события](concept-events), создаваемые компонентом, что позволяет тонко настраивать или модифицировать 
обычное выполнение кода компонента.

> Важно! Доступ к свойствам поведений доступен только через методы комопнента `get()` и `set()`, поскольку Jii
[не поддерживает](concept-properties) геттеры и сеттеры.

Создание поведений <span id="defining-behaviors"></span>
----------------------------------------------

Поведения создаются путем расширения базового класса [[Jii.base.Behavior]] или его наследников. Например,

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

В приведенном выше примере, объявлен класс поведения `app.components.MyBehavior` содержащий 2 свойства
`prop1` и `prop2`, и один метод `foo()`. Обратите внимание, свойство `prop2` объявлено с использованием геттера
`getProp2()` и сеттера `setProp2()`. Это возможно, так как [[Jii.base.Behavior]] является дочерним классом для
[[Jii.base.Object]], который предоставляет возможность определения [свойств](concept-properties) через геттеры и сеттеры.

Так как этот класс является поведением, когда он прикреплён к компоненту, компоненту будут также доступны свойства `prop1`
и `prop2`, а также метод `foo()`.

> Подсказка: Внутри поведения возможно обращаться к компоненту, к которому оно прикреплено, используя свойство
  [[Jii.base.Behavior.owner]].


Обработка событий компонента
-------------------------

Если поведению требуется реагировать на события компонента, к которому оно прикреплено, то необходимо переопределить
метод [[Jii.base.Behavior.events()]]. Например,

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

Метод [[Jii.base.Behavior.events()]] должен возвращать список событий и соответствующих им обработчиков.
В приведенном выше примере, объявлено событие [[Jii.data.BaseActiveRecord.EVENT_BEFORE_VALIDATE]]
и его обработчик `beforeValidate()`. Указать обработчик события, можно одним из следующих способов:

* строка с именем метода текущего поведения, как в примере выше;
* массив, содержащий объект или имя класса, и имя метода, например, `[object, 'methodName']`;
* массив, содержащий метод и контекст, например, `[object.methodName, object]`;
* анонимная функция.

Функция обработчика события должна выглядеть как показано ниже, где `event` содержит параметр
события. Более детальная информация приведена в разделе [События](concept-events).

```js
function (event) {
}
```

Прикрепление поведений <span id="attaching-behaviors"></span>
---------------------------------------------------

Прикрепить поведение к [[Jii.base.Component|компоненту]] можно как статически, так и динамически. На практике
чаще используется статическое прикрепление.

Для того чтобы прикрепить поведение статически, необходимо переопределить метод [[Jii.base.Component.behaviors()]]
компонента, к которому его планируется прикрепить. Метод [[Jii.base.Component.behaviors()]] должен возвращать
список [конфигураций](concept-configurations) поведений. Конфигурация поведения представляет собой имя класса поведения,
либо объект его настроек:

```js
/**
 * @class app.models.User
 * @extends Jii.data.ActiveRecord
 */
Jii.defineClass('app.models.User', /** @lends app.models.User.prototype */{

	__extends: 'Jii.data.ActiveRecord',
	
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

Для того, чтобы прикрепить поведение динамически, необходимо вызвать метод [[Jii.base.Component.attachBehavior()]]
требуемого компонента:

```js
// прикрепляем объект поведения
component.attachBehavior('myBehavior1', new app.components.MyBehavior());

// прикрепляем по имени класса поведения
component.attachBehavior('myBehavior2', app.components.MyBehavior.className());

// прикрепляем используя массив конфигураций
component.attachBehavior('myBehavior3', {
    className: app.components.MyBehavior.className(),
    prop1: 'value1',
    prop2: 'value2'
});
```

Использование метода [[Jii.base.Component.attachBehaviors()]] позволяет прикрепить несколько поведение за раз.
Например,

```js
component.attachBehaviors({
    myBehavior1: new app.components.MyBehavior(),
    otherBehavior: app.components.MyBehavior.className()
});
```

Так же, прикрепить поведение к компоненту можно через [конфигурацию](concept-configurations), как показано ниже:

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

Более детальная информация приведена в разделе [Конфигурации](concept-configurations#configuration-format).

Использование поведений <span id="using-behaviors"></span>
------------------------------------------------

Для использования поведения, его необходимо прикрепить к [[Jii.base.Component|компоненту]] как описано выше. После того,
как поведение прикреплено к компоненту, его использование не вызывает сложностей.

Вы можете обращаться к *публичным* переменным или [свойствам](concept-properties), объявленным с использованием 
геттеров и сеттеров в поведении, через компонент, к которому оно прикреплено:

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

Обратите внимание, хотя `component` не имеет свойства `prop1` и метода `foo()`, они могут быть использованы,
как будто являются членами этого класса.

В случае, когда два поведения, имеющие свойства или методы с одинаковыми именами, прикреплены к одному компоненту, 
преимущество будет у поведения, прикрепленного раньше.

Если при прикреплении поведения к компоненту указано имя, можно обращаться к поведению по этому имени, как показано ниже:

```js
var behavior = component.getBehavior('myBehavior');
```

Также можно получить все поведения, прикрепленные к компоненту:

```js
var behaviors = component.getBehaviors();
```

Отвязывание поведений <span id="detaching-behaviors"></span>
-------------------------------------------------

Чтобы отвязать поведение от компонента, необходимо вызвать метод [[Jii.base.Component.detachBehavior()]], указав имя,
связанное с поведением:

```js
component.detachBehavior('myBehavior1');
```

Так же, возможно отвязать *все* поведения:

```js
component.detachBehaviors();
```

