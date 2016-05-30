Объекты доступа к базе данных
=======================

Эти объекты реализуют интерфейс, через который можно отправлять запросы к базе данных и получать ответы в определенном
формате. Они используются [конструкторами запросов](db-query-builder) и [Active Record](db-active-record).

Каждый из объектов доступа к данным обращается к СУБД через драйвера, которые для каждой базы свои. Все они реализуют
единый API, позволяющий сменить СУБД.

На данный момент реализован объект доступа к [MySQL](http://www.mysql.com/), который использует пакет-драйвер из
npm [mysql](https://www.npmjs.com/package/mysql). Поддержка других СУБД предусмотрена и планируется в будущем.

## Создание соединения с БД <span id="creating-db-connections"></span>

Для доступа к базе данных необходимо создать экземпляр соединения [[Jii.sql.Connection]]. Затем необходимо открыть
соединение для загрузки схемы БД и установки постоянного соединения.

```js
var db = new Jii.sql.mysql.Connection({
    host: '127.0.0.1',
    database: 'example',
    username: 'root',
    password: '',
    charset: 'utf8',
});
db.open().then(function() {
    // ...
});
```

Если вы создаете приложение Jii, то удобнее это соединение прописать в конфигурации приложения как
[компонент приложения](structure-application-components) доступен через `Jii.app.db`. 

```js
return {
    // ...
    components: {
        // ...
        db: {
            className: 'Jii.sql.mysql.Connection',
            host: '127.0.0.1',
            database: 'example',
            username: 'root',
            password: '',
            charset: 'utf8',
        }
    },
    // ...
};
```

## Выполнение SQL запросов <span id="executing-sql-queries"></span>

Когда у вас есть экземпляр подключения к базе данных, вы можете выполнять SQL запрос, выполнив следующие действия:
1. Создать экземпляр [[Jii.sql.Command]] с обычным SQL.
2. Добавить параметры в запрос, если необходимо.
3. Вызвать один из методов [[Jii.sql.Command]].

Рассмотрим несколько примеров выборки данных из БД:
 
```js
var db = new Jii.sql.mysql.Connection(...);
db.open().then(function() {

    // Возвращает массив объектов, каждый из объектов представляет запись в таблице,
    // где ключи объекта - это названия столбцов, а зачения - их соответствующие значения в
    // строке таблицы. При пустом ответе будет возвращен пустой массив.
    db.createCommand('SELECT * FROM post')
        .queryAll()
        .then(function(posts) {
        });
    
    // Возвращает объект, соответствующей строке в таблице (первой в результатах)
    // Вернет `null` при пустом результате
    db.createCommand('SELECT * FROM post WHERE id=1')
        .queryOne()
        .then(function(post) {
        });
    
    // Возвращает массив, соответствующей колонке в таблице (первой в результатах)
    // Вернет пустой массив при пустом результате
    db.createCommand('SELECT title FROM post')
        .queryColumn()
        .then(function(titles) {
        });
    
    // Возвращает скаляр. `null` при пустом результатае
    db.createCommand('SELECT COUNT(*) FROM post')
        .queryScalar()
        .then(function(count) {
        });
    
});
```

### Добавление параметров <span id="binding-parameters"></span>

При создании команды с параметрами, вы должны всегда добавлять параметры через вызовы методов `bindValue`
или `bindValues` для предотвращения атак SQL-инъекции. Например:

```js
db.createCommand('SELECT * FROM post WHERE id=:id AND status=:status')
   .bindValue(':id', request.id)
   .bindValue(':status', 1)
   .queryOne()
   .then(function(post) {
   });
```

### Выполнение запросов не на выборку данных <span id="non-select-queries"></span>

Запросы на изменение данных необходимо выполнять с помощью метода `execute()`:

```js
db.createCommand('UPDATE post SET status=1 WHERE id=1')
   .execute();
```

Метод [[Jii.sql.Command.execute()]] возвращает объект, в котором находится информация с результатом запросов. Каждый из
объектов доступа может добавлять в него свои специфичные параметры, но минимальный набор параметров в нем таков: 
* `affectedRows` - Количество затронутых (измененных) строк
* `insertId` - уникальный сгенерированный идентификатор. Возвращается для запросов INSERT при наличии в колонке PK с AUTO_INCREMENT.

Для INSERT, UPDATE и DELETE запросов, вместо того, чтобы писать обычные SQL запросы, вы можете вызывать
[[Jii.sql.Command.insert()]], [[Jii.sql.Command.update()]], [[Jii.sql.Command.delete()]] методы для создания
соответствующих SQL. Эти методы будут правильно экранировать имена таблиц, столбцов и значения параметров.

```js
// INSERT (table name, column values)
db.createCommand().insert('user', {
    name: 'Sam',
    age: 30
}).execute().then(function(result) {
    // result.affectedRows
    // result.insertId
});

// UPDATE (table name, column values, condition)
db.createCommand().update('user', {status: 1}, 'age > 30').execute();

// DELETE (table name, condition)
db.createCommand().delete('user', 'status = 0').execute();
```

Вы можете так же вызывать [[Jii.sql.Command.batchInsert()]] для вставки нескольких строк в один запрос, это будет более
эффективно с точки зрения производительности:

```js
// table name, column names, column values
db.createCommand().batchInsert('user', ['name', 'age'], {
    ['Tom', 30],
    ['Jane', 20],
    ['Linda', 25],
}).execute();
```

## Изменение схемы базы данных <span id="database-schema"></span>

Jii DAO предоставляет набор методов для изменения схемы базы данных:

* [[Jii.sql.Command.createTable()]]: создание таблицы
* [[Jii.sql.Command.renameTable()]]: переименование таблицы
* [[Jii.sql.Command.dropTable()]]: удаление таблицы
* [[Jii.sql.Command.truncateTable()]]: удаление всех строк из табилцы
* [[Jii.sql.Command.addColumn()]]: добавление колонки
* [[Jii.sql.Command.renameColumn()]]: переименование колонки
* [[Jii.sql.Command.dropColumn()]]: удаление колонки
* [[Jii.sql.Command.alterColumn()]]: изменение колонки
* [[Jii.sql.Command.addPrimaryKey()]]: добавление первичного ключа
* [[Jii.sql.Command.dropPrimaryKey()]]: удаление первичного ключа
* [[Jii.sql.Command.addForeignKey()]]: добавление внешнего ключе
* [[Jii.sql.Command.dropForeignKey()]]: удаление внешнего ключа
* [[Jii.sql.Command.createIndex()]]: создание индекса
* [[Jii.sql.Command.dropIndex()]]: удаление индекса

Пример использования этих методов:

```js
// CREATE TABLE
db.createCommand().createTable('post', {
    id: 'pk',
    title: 'string',
    text: 'text'
});
```

Вы также можете получить информацию о таблице через метод [[Jii.sql.Connection.getTableSchema()]]

```js
table = db.getTableSchema('post');
```

Метод возвращает объект [[Jii.sql.TableSchema]], который содержит информацию о столбцах таблицы,
первичные ключи, внешние ключи, и т.д. Все эти данные используются главным образом в [конструкторе запросов](db-query-builder)
и [Active Record](db-active-record), для упрощения работы с БД.
