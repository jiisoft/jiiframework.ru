
Идеология
---------

## Promise
Каждая асинхронная операция возвращает Promise объект, имплементирующий стандарт ES6.
Для этого используется библиотека [when](https://github.com/cujojs/when).


Методы, начинающиеся с префикса `load` возвращают Promise (loadData()), методы с приставкой `get` (getUser(),
get('id')) - возвращают данные синхронно.

## Сохранение API Yii 2
Изначальная идея Jii заключается в том, чтобы перенести прекрасный и насыщенный PHP фреймворк на JavaScript.
Чтобы php-разработчики, желающие попробовать/перейти на node.js могли быстро и без труда освоить фреймворк на
другом языке программирования, даже без чтения класс референс!

## Встраиваемость
Jii проектируется с учётом того, что он должен работать везде где можно.

Не смотря на то, что `Yii` генерирует не мало глобальных констант (`YII_*`), класс `Yii` и неймспейс `yii`, `Jii` не засоряет
глобальное пространство. Браузерам доступен единственный объект Jii, который можно спрятать, вызвав
`Jii.noConflict()`. В серверной части в global ничего не пишется, а Jii возвращается как результат
вызова `require('jii')`.

## Npm пакеты
Jii распространяется как набор пакетов jii-* и не имеет собственных пакет-менеджеров (привет, Meteor). Это значит,
что вместе с Jii вы можете подключить любые другие npm пакеты.

Jii разбит на несколько пакетов, поэтому его можно использовать по частям. Например, если вы хотите начать
использовать только ActiveRecord, то вы устанавливаете jii-ar-sql и не имеете контроллеров, вьюшек, http сервера и
прочего ненужного вам кода.

Основными пакетамы Jii на данный момент являются:
- [jii](https://www.npmjs.com/package/jii)
- [jii-model](https://www.npmjs.com/package/jii-model)
- [jii-ar-sql](https://www.npmjs.com/package/jii-ar-sql)
- [jii-httpserver](https://www.npmjs.com/package/jii-httpserver)
- [jii-view](https://www.npmjs.com/package/jii-view)

## Классы и неймспейсы
Для их реализации используется библиотека [Neatness](http://github.com/affka/neatness), которая
уже хорошо показала себя в других внутренних проектах.

## Middlewares
В Yii фреймворке компоненты доступны глобально через `Yii::$app->…` Однако в `Jii` не все компоненты можно расположить
глобально, т.к. некоторые из них (Request, Response, WebUser, Session, …) привязаны к контексту (запросу).

Такие компоненты будут создаваться в контексте (`Jii.base.Context`) и передаваться в качестве параметра
в action &mdash; аналогия с передачей request и response в express.

```js
/**
 * @class app.controllers.SiteController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.SiteController', /** @lends app.controllers.SiteController.prototype */{

    __extends: 'Jii.base.Controller',

    /**
     *
     * @param {Jii.base.Context} context
     * @param {Jii.httpServer.Request} context.request
     * @param {Jii.httpServer.Response} context.response
     */
    actionIndex: function(context) {
        context.response.data = this.render('index');
        context.response.send();
    }

});
```
