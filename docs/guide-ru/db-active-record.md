Active Record
=============

[Active Record](http://en.wikipedia.org/wiki/Active_record_pattern) обеспечивает объектно-ориентированный интерфейс
для доступа и манипуляции данными, хранящихся в базах данных. Класс Active Record связан с таблицей базы данных,
экземпляр класса соответствует строке этой таблицы, а атрибуты представляют собой значения определенного столбца в
этой строке. Вместо того чтобы писать SQL запросы в явном виде, Вы имеете доступ к атрибутам Active Record и методам,
манипулирующие данными.

Предположим, что у нас есть Active Record класс `app.models.Customer`, который связан с таблице `customer` и `name`
это имя колонки в таблице `customer`. Вы можете написать следующий код для добавления новой строки в таблицу
`customer`:

```js
var customer = new app.models.Customer();
customer.name = 'Vladimir';
customer.save();
```

Это эквивалентно следующему коду, в котором Вы можете допустить больше ошибок при написании и где могут быть
несовместимости при различных видах данных:

```js
db.createCommand('INSERT INTO `customer` (`name`) VALUES (:name)', {
    ':name': 'Vladimir',
}).execute();
```


## Объявление классов Active Record <span id="declaring-ar-classes"></span>

Для начала, объявите класс Active Record, унаследовав [[Jii.sql.ActiveRecord]]. Каждый Active Record класс связан
с таблицей базы данных, поэтому в этом классе необходимо переопределить статический метод
[[Jii.sql.ActiveRecord.tableName()]] для указания с какой таблицей связан класс.

В следующем примере, мы объявляем класс с именем `app.models.Customer` для таблицы `customer`.

```js
var Jii = require('jii');

/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

	__extends: Jii.sql.ActiveRecord,

	__static: /** @lends app.models.Customer */{

		tableName: function() {
            return 'customer';
		}

	}

});
```

Класс Active Record является [моделью](structure-models), поэтому обычно мы кладем Active Record классы в
пространство имен `models`.

Класс [[Jii.sql.ActiveRecord]] наследует [[Jii.base.Model]], это значит, что он наследует *все* возможности
[моделей](structure-models), такие как аттрибуты, правила валидации, серелиализация данных и т.д.


## Создание соединения с БД <span id="db-connection"></span>

По-умолчанию, Active Record использует [компонент приложения](structure-application-components) `db`,
который содержит экземпляр [[Jii.sql.BaseConnection]] для чтения и изменения данных в БД. Как описано в разделе 
[Database Access Objects](db-dao), вы можете сконфигурировать компонент приложения `db` следующим образом: 

```js
application: {
    components: {
        db: {
            className: 'Jii.sql.mysql.Connection',
            host: '127.0.0.1',
            database: 'testdb',
            username: 'demo',
            password: 'demo',
            charset: 'utf8',
        }
    }
}
```

Если вы хотите использовать другое соединение с базой данных, вы должны переопределить метод
[[Jii.sql.ActiveRecord.getDb()]]:

```js
/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

	__extends: Jii.sql.ActiveRecord,

	__static: /** @lends app.models.Customer */{
	
	    STATUS_INACTIVE: 0,
	    STATUS_ACTIVE: 1,

        // ...
        
		getDb: function() {
            // use the "db2" application component
            return Jii.app.db2;  
		}

	}

});
```


## Выборка данных <span id="querying-data"></span>

После объявления класса Active Record, вы можете использовать его для запроса данных из соответствующей таблицы БД.
Для этого необходимо выполнить три действия:

1. Создать новый объект запроса путем вызова метода [[Jii.sql.ActiveRecord.find()]];
2. Сгенерировать объект запроса, вызывая методы [создания запросов](db-query-builder#building-queries);
3. Вызвать один из [методов запроса](db-query-builder#query-methods) для получения данных в виде записей Active Record.

Эти действия очень схожи с действиями при работе с [конструктором запросов](db-query-builder). Разница только в том, что
для создания объекта запроса необходимо вызвать метод [[Jii.sql.ActiveRecord.find()]], а не создавать экземпляр через
`new`.

Рассмотрим несколько примеров, показывающие, как использовать Active Query для получения данных:

```js
// Возвращает клиента с ID 123
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer.find()
    .where({id: 123})
    .one()
    .then(function(customer) {
        // ...
    });

// Возвращает всех активных клиентов, отсортированных по ID
// SELECT * FROM `customer` WHERE `status` = 1 ORDER BY `id`
app.models.Customer.find()
    .where({status: app.models.Customer.STATUS_ACTIVE})
    .orderBy('id')
    .all()
    .then(function(customers) {
        // ...
    });

// Возвращает количество активных клиентов
// SELECT COUNT(*) FROM `customer` WHERE `status` = 1
app.models.Customer.find()
    .where({status': app.models.Customer.STATUS_ACTIVE})
    .count()
    .then(function(count) {
        // ...
    });

// Возвращает всех клиентов в виде объекта, где ключами являются ID клиентов
// SELECT * FROM `customer`
app.models.Customer.find()
    .indexBy('id')
    .all()
    .then(function(customers) {
        // ...
    });
```

Для упрощения получения моделей по ID созданы методы:

- [[Jii.sql.ActiveRecord.findOne()]]: Возвращает экземпляр Active Record, соответствующий первой строке результата запроса.
- [[Jii.sql.ActiveRecord.findAll()]]: Возвращает массив или объект нескольких Active Record, соответствующие строкам результата запроса.

Оба метода принимают первый агрумент следующего формата:

- Скалярное значение: значение рассматривается как значение первичного ключа, по которому идет поиск. Первичный ключ
  определяется автоматически из схемы БД.
- Массив скалярных значений: массив рассматривается как значения первичного ключа, по которым идет поиск.
- Объект, ключами которого являются имена столбцов, а значения соответствуют значениям столбцов, по которым идет поиск.

Следующие примеры показывают как эти методы могут быть использованы:

```js
// Возвращает клиента с ID 123
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // ...
    });

// Возвращает клиентовс ID 100, 101, 123 или 124
// SELECT * FROM `customer` WHERE `id` IN (100, 101, 123, 124)
app.models.Customer
    .findAll([100, 101, 123, 124])
    .then(function(customers) {
        // ...
    });

// Возвращает активного клиента с ID 123
// SELECT * FROM `customer` WHERE `id` = 123 AND `status` = 1
app.models.Customer
    .findOne({
        id: 123,
        status: app.models.Customer.STATUS_ACTIVE
    })
    .then(function(customer) {
        // ...
    });

// Возвращает всех неактивных клиентов
// SELECT * FROM `customer` WHERE `status` = 0
app.models.Customer
    .findAll({
        status: app.models.Customer.STATUS_INACTIVE
    })
    .then(function(customers) {
        // ...
    });
```

> Примечание: Ни [[Jii.sql.ActiveRecord.findOne()]], ни [[Jii.sql.ActiveQuery.one()]] не добавят `LIMIT 1` в SQL
  выражение. Если Ваш запрос действительно может вернуть множество данных, то необходимо вызвать `limit(1)` для
  установки предела, например `app.models.Customer.find().limit(1).one()`.

Вы можете так же использовать обычные SQL запросы для получения данных и заполнениях их в Active Record.
Для этого необходимо использовать метод [[Jii.sql.ActiveRecord.findBySql()]]:

```js
// Возвращает всех неактивных клиентов
var sql = 'SELECT * FROM customer WHERE status=:status';
app.models.Customer
    .findBySql(sql, {':status': app.models.Customer.STATUS_INACTIVE})
    .all()
    .then(function(customers) {
        // ...
    });
```

Не вызывайте методы создания запроса после вызова [[Jii.sql.ActiveRecord.findBySql()]], они будут игнорироваться.


## Доступ к данным <span id="accessing-data"></span>

Как упоминалось выше, экземпляры Active Record заполняются данными из результатов SQL запроса, и каждая строка
результата запроса соответствует одному экземпляру Active Record. Вы можете получить доступ к значениям столбцов
через атрибуты Active Record, например,

```js
// Имена столбцов "id" и "email" из таблицы "customer"
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        var id = customer.get('id');
        var email = customer.get('email');
    });
```


### Получение данные в объектах <span id="data-in-arrays"></span>

Получение данные как Active Record удобно, но иногда это может быть неоптимально из-за большого потребления памяти,
которое расходуется на создание экземпляров Active Record.
В этом случае вы можете получить их как обычные объекты, для этого нужно вызвать метод [[Jii.sql.ActiveQuery.asArray()]].

> По факту, в JavaScript вы получите массив, наполненный объектами. Поэтому правильней было бы назвать метод
[[asObject()]], и такой метод (синоним) есть. Но для сохранения API Yii 2 оставлен метод [[asArray()]].

```js
// Возвращает всех клиентов, каждый из которых
// представлен как объект
app.models.Customer.find()
    .asArray() // alias is asObject()
    .all()
    .then(function(customers) {
        // ...
    });
```
   

## Сохранение данных <span id="inserting-updating-data"></span>

Изпользуя Active Record, Вы можете сохранять данные в БД выполнив следующие шаги:

1. Получите или создайте экземпляр Active Record;
2. Задайте новые значение атрибутам
3. Вызовите метод [[Jii.sql.ActiveRecord.save()]] для сохранение данных.

Например,

```js
// Добавление новой строки в таблицу
var customer = new app.models.Customer();
customer.set('name', 'James');
customer.set('email', 'james@example.com');
customer.save().then(function(success) {

    return app.models.Customer.findOne(123);
}).then(function(customer) {

    // Обновление данных
    customer.set('email', 'james@newexample.com');
    return customer.save();
}).then(function(success) {
    // ...
});
```

Метод [[Jii.sql.ActiveRecord.save()]] может либо добавить, либо обновить данные строки, в зависимости от состояния
Active Record. Если экземплер был создан с помощью оператора `new`, то метод добавит новую строку. Если экземпляр
получен через метод [[find()]] и ему подобные или уже был вызван метод [[save()]] ранее, то метод [[save()]]
обновит данные.


### Валидация данных <span id="data-validation"></span>

Класс [[Jii.sql.ActiveRecord]] наследуется от [[Jii.base.Model]], поэтому в нем доступна [валидация данных](input-validation).
Вы можете задать правила вализации через переопределение метода [[Jii.sql.ActiveRecord.rules()]] и проверить на правильность
значений через метод [[Jii.sql.ActiveRecord.validate()]].

Когда вы вызываете метод [[Jii.sql.ActiveRecord.save()]], по-умолчанию, автоматически будет вызван метод
[[Jii.sql.ActiveRecord.validate()]]. Только проверенные данные должны сохраняться в БД; Если данные не верны, то метод
вернет `false` и Вы можете получить ошибку через метод [[Jii.sql.ActiveRecord.getErrors()]] или ему подобные.


### Изменение множества атрибутов <span id="massive-assignment"></span>

Как и обычные [модели](structure-models), экземпляр Active Record так же поддерживает
[изменение атрибутов через передачу объекта](structure-models#massive-assignment).
Используя это способ, вы можете присвоить значения нескольких атрибутов Active Record через вызов одного метода. Помните,
что только [безопасные атрибуты](structure-models#safe-attributes) могут быть массово присвоены.

```js
var values = {
    name: 'James',
    email: 'james@example.com'
};

var customer = new app.models.Customer();

customer.setAttributes(values);
customer.save();
```


### Измененные атрибуты <span id="dirty-attributes"></span>

Когда вы вызываете метод [[Jii.sql.ActiveRecord.save()]], происходит сохранение только измененных аттрибутов 
Active Record. Атрибут считается измененным, если было изменено его значение. Обратите внимание, что проверка
данных будет выполняться независимо от существования измененных атрибутов.

Active Record автоматически сохраняет список измененных атрибутов. Она сохраняет старые версии атрибутов и сравнивает их
с последней версией. Вы можете получить измененные атрибуты через метод [[Jii.sql.ActiveRecord.getDirtyAttributes()]].

Для получения старых значений атрибутов, вызывайте метод [[Jii.sql.ActiveRecord.getOldAttributes()]] или
[[Jii.sql.ActiveRecord.getOldAttribute()]].


### Значения по-умолчанию <span id="default-attribute-values"></span>

Некоторые из ваших столбцов в таблице могут иметь значения по умолчанию, определенные в базе данных. Вы можете
предварительно заполнить Active Record этими значениями, вызвав метод [[Jii.sql.ActiveRecord.loadDefaultValues()]].
Этот метод синхронный, т.к. схема БД заранее подгружается при открытии соединения.

```js
var customer = new app.models.Customer();
customer.loadDefaultValues();
// customer.get('xyz') Значение атрибута `xyz` будет соответсвовать значению по-умолчанию для столбца `xyz`.
```


### Обновление нескольких строк <span id="updating-multiple-rows"></span>

Описанные выше методы работают с экземплярамм Active Record. Чтобы обновить несколько строк одновременно, вы можете
вызвать статический метод [[Jii.sql.ActiveRecord.updateAll()]]:

```js
// UPDATE `customer` SET `status` = 1 WHERE `email` LIKE `%@example.com%`
app.models.Customer.updateAll({status: app.models.Customer.STATUS_ACTIVE}, {'like', 'email', '@example.com'});
```


## Удаление данных <span id="deleting-data"></span>

Для удаления строки из таблицы, необходимо у эксемпляра Active Record, соответствующей этой строке, вызвать метод
[[Jii.sql.ActiveRecord.delete()]].

```js
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        customer.delete();
    });
```

Вы можете вызвать статический метод [[Jii.sql.ActiveRecord.deleteAll()]] для удаления множества строк по условию.
Например,

```js
app.models.Customer.deleteAll({status: app.models.Customer.STATUS_INACTIVE});
```


## Работа с связанными данными <span id="relational-data"></span>

Помимо работы с отдельными таблицами базы данных, Active Record способен связать данные через первичные данные.
Например, данные о клиентах могут быть связанны с заказами. При объявлении соответствующей связи в Active Record,
Вы можете получить информацию о заказе клиента, используя выражение `customer.load('orders')`, при этом на
выходе вы получите массив экземпляров `app.models.Order`.


### Объявление зависимостей <span id="declaring-relations"></span>

Для работы с реляционными данными при помощи Active Record, сначала нужно объявить отношение в классе Active Record.
Например,

```js
/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

	// ...

	getOrders: function() {
	    return this.hasMany(app.models.Order.className(), {customer_id: 'id'});
	}

});

/**
 * @class app.models.Order
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Order', /** @lends app.models.Order.prototype */{

	// ...

	getCustomer: function() {
	    return this.hasOne(app.models.Customer.className(), {id: 'customer_id'});
	}

});
```

В приведенном выше коде, мы объявили соотношение `orders` для класса `app.models.Customer`, и отношение `customer`
для класса `app.models.Order`.

Каждый метод отношение должен быть назван как `getXyz` (get + имя отношения с первой буквой в нижнем регистре).
Обратите внимание, что имена отношений являются *чувствительными к регистру*.

В отношении, вы должны указать следующую информацию:

- Кратность связи: указывается при вызове методов [[Jii.sql.ActiveRecord.hasMany()]]
  или [[Jii.sql.ActiveRecord.hasOne()]]. В приведенном выше примере у клиента много заказов, а у заказа только
  один клиент.
- Название связанного класса Active Record: указывается в качестве первого параметра у выше названных методов.
  Рекомендуется получать имя класса через `Xyz.className()`, чтобы, во-первых, проверить существование класса еще
  на этапе конструирования отношения, а во-вторых, чтобы IDE подсказывала Вам имя класса при написании.
- Связь между двумя схемами таблиц: определяет столбец (ы), через который связаны два типа данных. Значениями
  объекта являются столбцы первичных данных, а ключами - столбцы связанных данных.


### Доступ к связанным данным <span id="accessing-relational-data"></span>

После объявления отношения, вы можете получить доступ к связанным данным через имя отношеня. Если Вы уверены, что
связанные данные уже подгружены в Active Record, то можно получить связанные Active Record аналогично доступу к
[свойствам](concept-properties) объекта через метод [[get()]]. Иначе, лучше использовать метод
[[Jii.sql.ActiveRecord.load()]] для загрузки связанных данных, который будет всегда возвращать объект `Promise`,
однако не будет слать лишний запрос в БД, если связь уже была подгружена ранее.

```js
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // SELECT * FROM `order` WHERE `customer_id` = 123
        return customer.load('orders');
    })
    .then(function(orders) {
        // orders - массив экземпляров класса `app.models.Order`
    });
```

Если отношение объявлено методом [[Jii.sql.ActiveRecord.hasMany()]], то данные отношения будут представлены массивом
экземпляров Active Record (или пустым массивом). Если методом [[Jii.sql.ActiveRecord.hasOne()]], то данные отношения
будут представлены экземпляром Active Record или `null`, если данные отсутствуют.

При доступе к отношению в первый раз, будет выполнен SQL запрос в БД, как показано в примере выше. При повторном
обращении, запрос выполняться не будет.


### Отношения через дополнительную таблицу (Junction Table) <span id="junction-table"></span>

При моделировании баз данных, когда связь между двумя таблицами Many-Many, то обычно добавляется дополнительная таблица -
[Junction Table](https://en.wikipedia.org/wiki/Junction_table). Например, таблица `order` и таблица `item`
могут быть связаны с помощью таблицы `order_item`.

При объявлении таких отношений, Вам нужно вызвать методы [[Jii.sql.ActiveQuery.via()]] или
[[Jii.sql.ActiveQuery.viaTable()]] с указанием дополнительный таблицы. Разница между этими методами в том,
что первый указывает таблицу перехода с точки зрения текущего имени отношения, в то время как последний непосредственно
дополнительную таблицу. Например,

```js
/**
 * @class app.models.Order
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Order', /** @lends app.models.Order.prototype */{

	// ...

	getItems: function() {
        return this.hasMany(app.models.Item.className(), {id: 'item_id'})
            .viaTable('order_item', {order_id: 'id'});
	}

});
```

или альтернативно,

```js
/**
 * @class app.models.Order
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Order', /** @lends app.models.Order.prototype */{

	// ...

	getOrderItems: function() {
        return this.hasMany(app.models.OrderItem.className(), {order_id: 'id'});
	},

	getItems: function() {
        return this.hasMany(app.models.Item.className(), {id: 'item_id'})
            .via('orderItems');
	}

});
```

Использование отношений, объявленных с дополнительной таблицей, аналогично обычным отношениям. Например,

```js
// SELECT * FROM `order` WHERE `id` = 100
app.models.Order
    .findOne(100)
    .then(function(order) {
    
        // SELECT * FROM `order_item` WHERE `order_id` = 100
        // SELECT * FROM `item` WHERE `item_id` IN (...)
        return order.load('items');
    })
    .then(function(items) {
        // items - массив экземпляров `app.models.Item`
    });
```


### Ленивая Загрузка и жадная загрузка <span id="lazy-eager-loading"></span>

В разделе [доступа к связанным данным](#accessing-relational-data), мы рассказывали, что вы можете получить доступ к
отношению из Active Record через методы [[get()]] или [[load()]]. SQL запрос будет отправлять в БД только при первом
обращении к связанным данным. Такие способы загрузки данных назваются ленивыми (lazy loading).
Например,


```js
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // SELECT * FROM `order` WHERE `customer_id` = 123
        customer.load('orders').then(function(orders) {
        
            // SQL запрос не отправляется
            return customer.load('orders');
        }).then(function(orders2) {
        
            // После подгрузки связей, они доступны также через метод [[get()]].
            var orders3 = customer.get('orders');
        });
    });

```

Ленивый нагрузка очень удобна в использовании. Тем не менее, это может вызывать проблемы с производительностью,
когда вам нужно получить доступ к связанным занным для множества экземпляров Active Record. Рассмотрим следующий
пример кода, сколько SQL запросов будет выполнено?


```js
// SELECT * FROM `customer` LIMIT 100
app.models.Customer.find()
    .limit(100)
    .all()
    .then(function(customers) {
        return Promise.all(customers.map(function(customer) {
        
            // SELECT * FROM `order` WHERE `customer_id` = ...
            return customer.load('orders');
        }));
    }).then(function(result) {
        var firstOrder = result[0][0];
        // ...
    });
```

В данном примере выполнится 101 SQL запрос! Потому что для каждого клиента будут получены заявки через отдельный запрос.
Чтобы решить эту проблему производительности, можно использовать подход *жадной загрузки*, как показано ниже,

```js
// SELECT * FROM `customer` LIMIT 100;
// SELECT * FROM `orders` WHERE `customer_id` IN (...)
app.models.Customer.find()
    .with('orders')
    .limit(100)
    .all()
    .then(function(customers) {
        customers.forEach(function(customer) {
        
            // без SQL запроса
            var orders = customer.get('orders');
        });
    });
```

Вы можете загрузить вместе с основной записью одно или несколько отношений. Вы даже можете загрузить сразу и
вложенные отношения. Например, если `app.models.Customer` связан с `app.models.Order` через отношение `orders`, а
`app.models.Order` связан с `Item` через `items`. При запросе `app.models.Customer`, вы можете сразу загрузить
отношение `items` указав в методе [[with()]] `orders.items`.

Следующий код показывает различные использование [[Jii.sql.ActiveQuery.with()]]. Мы предполагаем, что класс
`app.models.Customer` имеет два отношения: `orders` и `country`, в то время как класс `app.models.Order` имеет
одно соотношение - `items`.

```js
// Принудительная загрузка отношений "orders" и "country"
app.models.Customer.find()
    .with('orders', 'country')
    .all()
    .then(function(customers) {
        // ...
    });

// это эквивалентно записе через массив
app.models.Customer.find()
    .with(['orders', 'country'])
    .all()
    .then(function(customers) {
        // без SQL запроса 
        var orders = customers[0].get('orders');
        // без SQL запроса 
        var country = customers[0].get('country');
    });
    
// Принудительная загрузка отношения "orders" и вложенного отношения "orders.items"
app.models.Customer.find()
    .with('orders.items')
    .all()
    .then(function(customers) {

        // Получение пунктов из первого заказа для первого клиента
        // без SQL запроса
        var items = customers[0].get('orders')[0].get('items');        
    });
```

Вы можете загрузить принудительно глубоко вложенные отношения, такие как `a.b.c.d`. Все родительские отношения
будут принудительно загружены.

При жадной загрузке отношений, вы можете настроить соответствующий запрос, передав анонимную функцию.
Например,

```js
// Поиск клиентов вместе с их странами а активными заказами
// SELECT * FROM `customer`
// SELECT * FROM `country` WHERE `id` IN (...)
// SELECT * FROM `order` WHERE `customer_id` IN (...) AND `status` = 1
app.models.Customer.find()
    .with({
        country: 'country',
        orders: function (query) {
            query.andWhere({'status': app.models.Order.STATUS_ACTIVE});
        }
    })
    .all()
    .then(function(customers) {
        // ...
    });
```

При настройке реляционного запроса для связи, вы должны указать имя отношения в качестве ключа объекта
и использовать анонимную функцию как значение соответствующего объекта. Первым агрументом нонимной функции будет
параметр `query`, который представляет собой объект [[Jii.sql.ActiveQuery]].
В примере выше, мы изменяем запроса путем добавления дополнительного условия о статусе заказа.


### Обратные отношения <span id="inverse-relations"></span>

Отношения между классами Active Record зачастую обратно связаны друг с другом. Например, класс `app.models.Customer`
связан с `app.models.Order` через отношение `orders`, а класс `app.models.Order` обратно связан с классом
`app.models.Customer` через отношение `customer`.

```js
/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

    // ...
    
    getOrders: function() {
        return this.hasMany(app.models.Order.className(), {customer_id: 'id'});
    }

});

/**
 * @class app.models.Order
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Order', /** @lends app.models.Order.prototype */{

    // ...
    
    getCustomer: function() {
        return this.hasOne(app.models.Customer.className(), {id: 'customer_id'});
    }

});
```

Теперь рассмотрим следующий фрагмент кода:

```js
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // SELECT * FROM `order` WHERE `customer_id` = 123
         return customer.load('orders');
    }).then(function(orders) {
        var order = orders[0];
        
        // SELECT * FROM `customer` WHERE `id` = 123
        return order.load('customer');
    }).then(function(customer2) {
        
        // Отображает "not the same"
        console.log(customer2 === customer ? 'same' : 'not the same');
    });
```

Мы предполагаем, что объекты `customer` и `customer2` являются одинаковыми, но на самом деле это не так. Они содержат
одинаковые данные на являются разными экземплярами. При доступе к `order.customer` выполняется дополнительный SQL
запрос для получения нового объекта `customer2`.

Чтобы избежать избыточного выполнения последнего SQL запроса в приведенном выше примере, мы должны указать, что
`customer` является *обратной зависимостью* от `orders` с помощью метода [[Jii.sql.ActiveQuery.inverseOf()]].


```js
/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

    // ...
    
    getOrders: function() {
        return this.hasMany(app.models.Order.className(), {customer_id: 'id'}).inverseOf('customer');
    }

});
```

После этих изменений мы получим:

```js
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // SELECT * FROM `order` WHERE `customer_id` = 123
         return customer.load('orders');
    }).then(function(orders) {
        var order = orders[0];
        
        // SELECT * FROM `customer` WHERE `id` = 123
        return order.load('customer');
    }).then(function(customer2) {
        
        // Отображает "same"
        console.log(customer2 === customer ? 'same' : 'not the same');
    });
```

> Замечание: Обратные отношения не работают для отношений Many-Many, объявленные с дополнительной таблцей (Junction Table).


## Сохранение зависимостей <span id="saving-relations"></span>

При работе с реляционными данными, часто необходимо добавить отношения между различными данными или удалить существующие
отношения. Для этого нужно установить правильные значения для столбцов, которые определяют отношения. С применением
Active Record Вы можете сделать это примерно так:

```js
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        var order = new app.models.Order();
        order.subtotal = 100;
        
        // ...
        
        // Устанавливаем значение, определяющее отношение "customer" для `app.models.Order` и сохраняем.
        order.customer_id = customer.id;
        order.save();
    });
```

Active Record предоставляет метод [[Jii.sql.ActiveRecord.link()]], который позволяет сделать это более изящно:

```js
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        var order = new app.models.Order();
        order.subtotal = 100;
        
        // ...
        
        order.link('customer', customer);
    });
```

Метод [[Jii.sql.ActiveRecord.link()]] ожидает имя отношения и экзепмляр Active Record, с которым должно соединена запись.
Метод соединит два экземпляра Active Record и сохранит их в БД. В приведенном выше примере, он установит атрибут
`customer_id` в `app.models.Order`.

> Примечание: Вы не можете связать два только что созданных экземпляров Active Record.

Выгода от использования метода [[Jii.sql.ActiveRecord.link()]] еще более очевидна, когда отношение определяется с помощью
[дополнительной таблицей](#junction-table). Например, вы можете использовать следующий код, чтобы связать экземпляр
`app.models.Order` с `app.models.Item`:

```js
order.link('items', item);
```

Этот код автоматически добавит строку в таблицу `order_item` для создания связи.

Для удаления связи между двумя экземплярами Active Record, используйте метод [[Jii.sql.ActiveRecord.unlink()|unlink()]].
Например,

```js
app.models.Customer.find()
    .with('orders')
    .all()
    .then(function(customer) {
        customer.unlink('orders', customer.get('orders')[0]);
    });
```

По умолчанию, метод [[Jii.sql.ActiveRecord.unlink()]] метод устанавливает значения ключа, определяющего отношение,
в `null`. Однако, вы можете передать параметр `isDelete` как `true`, чтобы удалить строки с таблицы.

