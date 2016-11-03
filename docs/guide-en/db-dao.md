Data Access Objects
=======================
These objects implement interface which allows to send queries and receive responses in specific format. They used by [query builders](db-query-builder) and [Active Record](db-active-record).
DAO objects are used drivers to access DBMS data, drivers are different for each database. All of them implement common API which allows to switch DBMS.

Currently [MySQL](http://www.mysql.com/) data access object is implemented, it use npm package driver npm [mysql](https://www.npmjs.com/package/mysql). Other DBMS support is planned and will be provided in future.

## Creating DB connection <span id="creating-db-connections"></span>

To access database first you need to create connection instance [[Jii.sql.Connection]], open connection for load db schema and establish persistent connection.

```js
var db = new Jii.mysql.Connection({
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
If you are going to create Jii application, then the most convenient way will be to add connection application settings like [application component](structure-application-components) available through `Jii.app.db`.

```js
return {
    // ...
    components: {
        // ...
        db: {
            className: 'Jii.mysql.Connection',
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

##SQL query execution <span id="executing-sql-queries"></span>

You can execute SQL query when the database connection instance is already created
1. Create [[Jii.data.Command]] instance with plain SQL.
2. Add optional parameters in query.
3. Call [[Jii.data.Command]] any method.

Consider few examples of database querying:

```js
var db = new Jii.mysql.Connection(...);
db.open().then(function() {

    // Return objects array, each object is row in database,
    // where object's key is column's title, object's value is column's value
    // Empty array will be returned on empty response.
    db.createCommand('SELECT * FROM post')
        .queryAll()
        .then(function(posts) {
        });

    // Return table's first row object
    // Return `null` on empty result
    db.createCommand('SELECT * FROM post WHERE id=1')
        .queryOne()
        .then(function(post) {
        });

    // Return array contains table's first row's `title`
    // Return empty array on empty result
    db.createCommand('SELECT title FROM post')
        .queryColumn()
        .then(function(titles) {
        });

    // Return plain value. `null` on empty result
    db.createCommand('SELECT COUNT(*) FROM post')
        .queryScalar()
        .then(function(count) {
        });

});
```

### Adding parameters <span id="binding-parameters"></span>

For creating query with parameters you have to add parameters using `bindValue` or `bindValues` methods' calls. This will prevent SQL-injections. For Example:

```js
db.createCommand('SELECT * FROM post WHERE id=:id AND status=:status')
   .bindValue(':id', request.id)
   .bindValue(':status', 1)
   .queryOne()
   .then(function(post) {
   });
```

### Non select queries <span id="non-select-queries"></span>

Queries which will change data should be executed using `execute()` method:

```js
db.createCommand('UPDATE post SET status=1 WHERE id=1')
   .execute();
```

[[Jii.data.Command.execute()]] Method returns an object with query's response data. Each of access objects can add it's own specific parameters, and all of them contain:
* `affectedRows` - Changed rows count.
* `insertId` - Generated, unique identifier. Return for insert queries for rows which contain Primary Key with AUTO_INCREMENT.

For INSERT, UPDATE and DELETE queries, you can call [[Jii.data.Command.insert()]] instead of writing plain SQL queries, [[Jii.data.Command.update()]], [[Jii.data.Command.delete()]] methods for create
appropriate SQL. These methods will work when table's, column's and parameters are correctly escaped.

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

Also you can call [[Jii.data.Command.batchInsert()]] to insert multiple rows in single query, it will work faster:

```js
// table name, column names, column values
db.createCommand().batchInsert('user', ['name', 'age'], {
    ['Tom', 30],
    ['Jane', 20],
    ['Linda', 25],
}).execute();
```

## Database schema modification <span id="database-schema"></span>

Jii DAO provides methods which allows to modify database schema:

* [[Jii.data.Command.createTable()]]: create table
* [[Jii.data.Command.renameTable()]]: rename table
* [[Jii.data.Command.dropTable()]]: remove table
* [[Jii.data.Command.truncateTable()]]: remove table all rows
* [[Jii.data.Command.addColumn()]]: add column
* [[Jii.data.Command.renameColumn()]]: rename column
* [[Jii.data.Command.dropColumn()]]: remove column
* [[Jii.data.Command.alterColumn()]]: change column
* [[Jii.data.Command.addPrimaryKey()]]: add primary key
* [[Jii.data.Command.dropPrimaryKey()]]: remove primary key
* [[Jii.data.Command.addForeignKey()]]: add foreign key
* [[Jii.data.Command.dropForeignKey()]]: remove foreign key
* [[Jii.data.Command.createIndex()]]: create index
* [[Jii.data.Command.dropIndex()]]: remove index

These methods usage example:

```js
// CREATE TABLE
db.createCommand().createTable('post', {
    id: 'pk',
    title: 'string',
    text: 'text'
});
```
Also you can get information about table using [[Jii.sql.Connection.getTableSchema()]] method.

```js
table = db.getTableSchema('post');
```

Method returns [[Jii.data.TableSchema]] object which contains information about table's columns, such as primary keys, foreign keys, etc.
All these data is used mainly in [query builder](db-query-builder) and [Active Record](db-active-record), to make db queries easier.
