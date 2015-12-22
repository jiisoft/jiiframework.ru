Active Record
=============

[Active Record](http://en.wikipedia.org/wiki/Active_record_pattern) provides an object-oriented interface
for accessing and manipulating data stored in databases. An Active Record class is associated with a database table,
an Active Record instance corresponds to a row of that table, and an *attribute* of an Active Record
instance represents the value of a particular column in that row. Instead of writing raw SQL statements,
you would access Active Record attributes and call Active Record methods to access and manipulate the data stored 
in database tables.

For example, assume `app.models.Customer` is an Active Record class which is associated with the `customer` table
and `name` is a column of the `customer` table. You can write the following code to insert a new
row into the `customer` table:

```js
var customer = new app.models.Customer();
customer.name = 'Vladimir';
customer.save();
```

The above code is equivalent to using the following raw SQL statement for MySQL, which is less
intuitive, more error prone, and may even have compatibility problems if you are using a different kind of database:

```js
db.createCommand('INSERT INTO `customer` (`name`) VALUES (:name)', {
    ':name': 'Vladimir',
}).execute();
```


## Declaring Active Record Classes <span id="declaring-ar-classes"></span>

To get started, declare an Active Record class by extending [[Jii.sql.ActiveRecord]]. Because each Active Record
class is associated with a database table, in this class you should override the [[Jii.sql.ActiveRecord.tableName()]]
method to specify which table the class is associated with.

In the following example, we declare an Active Record class named `app.models.Customer` for the `customer` database table.

```js
var Jii = require('jii');

/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

	__extends: 'Jii.sql.ActiveRecord',

	__static: /** @lends app.models.Customer */{

		tableName: function() {
            return 'customer';
		}

	}

});
```

Active Record instances are considered as [models](structure-models). For this reason, we usually put Active Record
classes under the `app.models` namespace. 

Because [[Jii.sql.ActiveRecord]] extends from [[Jii.base.Model]], it inherits *all* [model](structure-models) features,
such as attributes, validation rules, data serialization, etc.


## Connecting to Databases <span id="db-connection"></span>

By default, Active Record uses the `db` [application component](structure-application-components) 
as the [[Jii.sql.BaseConnection]] to access and manipulate the database data. As explained in 
[Database Access Objects](db-dao), you can configure the `db` component in the application configuration like shown
below,

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
};
```

If you want to use a different database connection other than the `db` component, you should override 
the [[Jii.sql.ActiveRecord.getDb()]] method:

```js
/**
 * @class app.models.Customer
 * @extends Jii.sql.ActiveRecord
 */
Jii.defineClass('app.models.Customer', /** @lends app.models.Customer.prototype */{

	__extends: 'Jii.sql.ActiveRecord',

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


## Querying Data <span id="querying-data"></span>

After declaring an Active Record class, you can use it to query data from the corresponding database table.
The process usually takes the following three steps:

1. Create a new query object by calling the [[Jii.sql.ActiveRecord.find()]] method;
2. Build the query object by calling [query building methods](db-query-builder#building-queries);
3. Call a [query method](db-query-builder#query-methods) to retrieve data in terms of Active Record instances.

As you can see, this is very similar to the procedure with [query builder](db-query-builder). The only difference
is that instead of using the `new` operator to create a query object, you call [[Jii.sql.ActiveRecord.find()]].

Below are some examples showing how to use Active Query to query data:

```js
// return a single customer whose ID is 123
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer.find()
    .where({id: 123})
    .one()
    .then(function(customer) {
        // ...
    });

// return all active customers and order them by their IDs
// SELECT * FROM `customer` WHERE `status` = 1 ORDER BY `id`
app.models.Customer.find()
    .where({status: app.models.Customer.STATUS_ACTIVE})
    .orderBy('id')
    .all()
    .then(function(customers) {
        // ...
    });

// return the number of active customers
// SELECT COUNT(*) FROM `customer` WHERE `status` = 1
app.models.Customer.find()
    .where({status': app.models.Customer.STATUS_ACTIVE})
    .count()
    .then(function(count) {
        // ...
    });

// return all customers in an array indexed by customer IDs
// SELECT * FROM `customer`
app.models.Customer.find()
    .indexBy('id')
    .all()
    .then(function(customers) {
        // ...
    });
```

Because it is a common task to query by primary key values or a set of column values, Jii provides two shortcut
methods for this purpose:

- [[Jii.sql.ActiveRecord.findOne()]]: returns a single Active Record instance populated with the first row of the query result.
- [[Jii.sql.ActiveRecord.findAll()]]: returns an array of Active Record instances populated with *all* query result.

Both methods can take one of the following parameter formats:

- a scalar value: the value is treated as the desired primary key value to be looked for. Jii will determine 
  automatically which column is the primary key column by reading database schema information.
- an array of scalar values: the array is treated as the desired primary key values to be looked for.
- an object: the keys are column names and the values are the corresponding desired column values to 
  be looked for.
  
The following code shows how theses methods can be used:

```js
// returns a single customer whose ID is 123
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // ...
    });

// returns customers whose ID is 100, 101, 123 or 124
// SELECT * FROM `customer` WHERE `id` IN (100, 101, 123, 124)
app.models.Customer
    .findAll([100, 101, 123, 124])
    .then(function(customers) {
        // ...
    });

// returns an active customer whose ID is 123
// SELECT * FROM `customer` WHERE `id` = 123 AND `status` = 1
app.models.Customer
    .findOne({
        id: 123,
        status: app.models.Customer.STATUS_ACTIVE
    })
    .then(function(customer) {
        // ...
    });

// returns all inactive customers
// SELECT * FROM `customer` WHERE `status` = 0
app.models.Customer
    .findAll({
        status: app.models.Customer.STATUS_INACTIVE
    })
    .then(function(customers) {
        // ...
    });
```

> Note: Neither [[Jii.sql.ActiveRecord.findOne()]] nor [[Jii.sql.ActiveQuery.one()]] will add `LIMIT 1` to 
  the generated SQL statement. If your query may return many rows of data, you should call `limit(1)` explicitly
  to improve the performance, e.g., `app.models.Customer.find().limit(1).one()`.

Besides using query building methods, you can also write raw SQLs to query data and populate the results into
Active Record objects. You can do so by calling the [[Jii.sql.ActiveRecord.findBySql()]] method:

```js
// returns all inactive customers
var sql = 'SELECT * FROM customer WHERE status=:status';
app.models.Customer
    .findBySql(sql, {':status': app.models.Customer.STATUS_INACTIVE})
    .all()
    .then(function(customers) {
        // ...
    });
```

Do not call extra query building methods after calling [[Jii.sql.ActiveRecord.findBySql()]] as they
will be ignored.


## Accessing Data <span id="accessing-data"></span>

As aforementioned, the data brought back from the database are populated into Active Record instances, and
each row of the query result corresponds to a single Active Record instance. You can access the column values
by accessing the attributes of the Active Record instances, for example,

```js
// "id" and "email" are the names of columns in the "customer" table
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        var id = customer.get('id');
        var email = customer.get('email');
    });
```


### Retrieving Data in Objects <span id="data-in-arrays"></span>

While retrieving data in terms of Active Record objects is convenient and flexible, it is not always desirable
when you have to bring back a large amount of data due to the big memory footprint. In this case, you can retrieve
data using objects by calling [[Jii.sql.ActiveQuery.asArray()]] before executing a query method:

> По факту, в JavaScript вы получите массив, наполненный объектами. Поэтому правильней было бы назвать метод
[[asObject()]], и такой метод (синоним) есть. Но для сохранения API Yii 2 оставлен метод [[asArray()]].

```js
// return all customers
// each customer is returned as an associative array
app.models.Customer.find()
    .asArray() // alias is asObject()
    .all()
    .then(function(customers) {
        // ...
    });
```
   

## Saving Data <span id="inserting-updating-data"></span>

Using Active Record, you can easily save data to database by taking the following steps:

1. Prepare an Active Record instance
2. Assign new values to Active Record attributes
3. Call [[Jii.sql.ActiveRecord.save()]] to save the data into database.

For example,

```js
// insert a new row of data
var customer = new app.models.Customer();
customer.set('name', 'James');
customer.set('email', 'james@example.com');
customer.save().then(function(success) {

    return app.models.Customer.findOne(123);
}).then(function(customer) {

    // update an existing row of data
    customer.set('email', 'james@newexample.com');
    return customer.save();
}).then(function(success) {
    // ...
});
```

The [[Jii.sql.ActiveRecord.save()]] method can either insert or update a row of data, depending on the state
of the Active Record instance. If the instance is newly created via the `new` operator, calling 
[[Jii.sql.ActiveRecord.save()]] will cause insertion of a new row; If the instance is the result of a query method,
calling [[Jii.sql.ActiveRecord.save()]] will update the row associated with the instance. 


### Data Validation <span id="data-validation"></span>

Because [[Jii.sql.ActiveRecord]] extends from [[Jii.base.Model]], it shares the same [data validation](input-validation) feature.
You can declare validation rules by overriding the [[Jii.sql.ActiveRecord.rules()]] method and perform 
data validation by calling the [[Jii.sql.ActiveRecord.validate()]] method.

When you call [[Jii.sql.ActiveRecord.save()]], by default it will call [[Jii.sql.ActiveRecord.validate()]]
automatically. Only when the validation passes, will it actually save the data; otherwise it will simply return false,
and you can check the [[Jii.sql.ActiveRecord.getErrors()]] property to retrieve the validation error messages.  


### Massive Assignment <span id="massive-assignment"></span>

Like normal [models](structure-models), Active Record instances also enjoy the [massive assignment feature](structure-models#massive-assignment).
Using this feature, you can assign values to multiple attributes of an Active Record instance. Do remember that
only [safe attributes](structure-models#safe-attributes) can be massively assigned, though.

```js
var values = {
    name: 'James',
    email: 'james@example.com'
};

var customer = new app.models.Customer();

customer.setAttributes(values);
customer.save();
```

### Dirty Attributes <span id="dirty-attributes"></span>

When you call [[Jii.sql.ActiveRecord.save()]] to save an Active Record instance, only *dirty attributes*
are being saved. An attribute is considered *dirty* if its value has been modified since it was loaded from DB or
saved to DB most recently. Note that data validation will be performed regardless if the Active Record 
instance has dirty attributes or not.

Active Record automatically maintains the list of dirty attributes. It does so by maintaining an older version of
the attribute values and comparing them with the latest one. You can call [[Jii.sql.ActiveRecord.getDirtyAttributes()]] 
to get the attributes that are currently dirty.

If you are interested in the attribute values prior to their most recent modification, you may call 
[[Jii.sql.ActiveRecord.getOldAttributes()]] or [[Jii.sql.ActiveRecord.getOldAttribute()]].


### Default Attribute Values <span id="default-attribute-values"></span>

Some of your table columns may have default values defined in the database. Sometimes, you may want to pre-populate your
Web form for an Active Record instance with these default values. To avoid writing the same default values again,
you can call [[Jii.sql.ActiveRecord.loadDefaultValues()]] to populate the DB-defined default values
into the corresponding Active Record attributes:

```js
var customer = new app.models.Customer();
customer.loadDefaultValues();
// customer.get('xyz') will be assigned the default value declared when defining the "xyz" column
```


### Updating Multiple Rows <span id="updating-multiple-rows"></span>

The methods described above all work on individual Active Record instances, causing inserting or updating of individual
table rows. To update multiple rows simultaneously, you should call [[Jii.sql.ActiveRecord.updateAll()]], instead,
which is a static method.

```js
// UPDATE `customer` SET `status` = 1 WHERE `email` LIKE `%@example.com%`
app.models.Customer.updateAll({status: app.models.Customer.STATUS_ACTIVE}, {'like', 'email', '@example.com'});
```

## Deleting Data <span id="deleting-data"></span>

To delete a single row of data, first retrieve the Active Record instance corresponding to that row and then call
the [[Jii.sql.ActiveRecord.delete()]] method.

```js
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        customer.delete();
    });
```

You can call [[Jii.sql.ActiveRecord.deleteAll()]] to delete multiple or all rows of data. For example,

```js
app.models.Customer.deleteAll({status: app.models.Customer.STATUS_INACTIVE});
```


## Working with Relational Data <span id="relational-data"></span>

Besides working with individual database tables, Active Record is also capable of bringing together related data,
making them readily accessible through the primary data. For example, the customer data is related with the order
data because one customer may have placed one or multiple orders. With appropriate declaration of this relation,
you may be able to access a customer's order information using the expression `customer.load('orders')` which gives
back the customer's order information in terms of an array of `app.models.Order` Active Record instances.


### Declaring Relations <span id="declaring-relations"></span>

To work with relational data using Active Record, you first need to declare relations in Active Record classes.
The task is as simple as declaring a *relation method* for every interested relation, like the following,


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

In the above code, we have declared an `orders` relation for the `app.models.Customer` class, and a `customer` relation
for the `app.models.Order` class. 

Each relation method must be named as `getXyz`. We call `xyz` (the first letter is in lower case) the *relation name*.
Note that relation names are *case sensitive*.

While declaring a relation, you should specify the following information:

- the multiplicity of the relation: specified by calling either [[Jii.sql.ActiveRecord.hasMany()]]
  or [[Jii.sql.ActiveRecord.hasOne()]]. In the above example you may easily read in the relation 
  declarations that a customer has many orders while an order only has one customer.
- the name of the related Active Record class: specified as the first parameter to 
  either [[Jii.sql.ActiveRecord.hasMany()]] or [[Jii.sql.ActiveRecord.hasOne()]].
  A recommended practice is to call `Xyz.className()` to get the class name string so that you can receive
  IDE auto-completion support as well as error detection at compiling stage. 
- the link between the two types of data: specifies the column(s) through which the two types of data are related.
  The object values are the columns of the primary data (represented by the Active Record class that you are declaring
  relations), while the array keys are the columns of the related data.


### Accessing Relational Data <span id="accessing-relational-data"></span>

After declaring relations, you can access relational data through relation names.
Если Вы уверены, что связанные данные уже подгружены в Active Record, то можно получить связанные Active Record
аналогично доступу к [свойствам](concept-properties) объекта через метод [[get()]]. Иначе, лучше использовать метод
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

If a relation is declared with [[Jii.sql.ActiveRecord.hasMany()]], accessing this relation property
will return an array of the related Active Record instances; if a relation is declared with 
[[Jii.sql.ActiveRecord.hasOne()]], accessing the relation property will return the related
Active Record instance or null if no related data is found.

When you access a relation property for the first time, a SQL statement will be executed, like shown in the
above example. If the same property is accessed again, the previous result will be returned without re-executing
the SQL statement.


### Relations via a Junction Table <span id="junction-table"></span>

In database modelling, when the multiplicity between two related tables is many-to-many, 
a [junction table](https://en.wikipedia.org/wiki/Junction_table) is usually introduced. For example, the `order`
table and the `item` table may be related via a junction table named `order_item`. One order will then correspond
to multiple order items, while one product item will also correspond to multiple order items.

When declaring such relations, you would call either [[Jii.sql.ActiveQuery.via()]] or [[Jii.sql.ActiveQuery.viaTable()]]
to specify the junction table. The difference between [[Jii.sql.ActiveQuery.via()]] and [[Jii.sql.ActiveQuery.viaTable()]]
is that the former specifies the junction table in terms of an existing relation name while the latter directly
the junction table. For example,

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

or alternatively,

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

The usage of relations declared with a junction table is the same as that of normal relations. For example,

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


### Lazy Loading and Eager Loading <span id="lazy-eager-loading"></span>

In [Accessing Relational Data](#accessing-relational-data), we explained that you can access a relation property
of an Active Record instance like accessing a normal object property. A SQL statement will be executed only when
you access the relation property the first time. We call such relational data accessing method *lazy loading*.
For example,

```js
// SELECT * FROM `customer` WHERE `id` = 123
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        // SELECT * FROM `order` WHERE `customer_id` = 123
        customer.load('orders').then(function(orders) {
        
            // no SQL executed
            return customer.load('orders');
        }).then(function(orders2) {
        
            // После подгрузки связей, они доступны также через метод [[get()]].
            var orders3 = customer.get('orders');
        });
    });

```

Lazy loading is very convenient to use. However, it may suffer from a performance issue when you need to access
the same relation property of multiple Active Record instances. Consider the following code example. How many 
SQL statements will be executed?

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

As you can see from the code comment above, there are 101 SQL statements being executed! This is because each
time you access the `orders` relation property of a different `app.models.Customer` object in the for-loop, a SQL statement 
will be executed.

To solve this performance problem, you can use the so-called *eager loading* approach as shown below,

```js
// SELECT * FROM `customer` LIMIT 100;
// SELECT * FROM `orders` WHERE `customer_id` IN (...)
app.models.Customer.find()
    .with('orders')
    .limit(100)
    .all()
    .then(function(customers) {
        customers.forEach(function(customer) {
        
            // no SQL executed
            var orders = customer.get('orders');
        });
    });
```

You can eagerly load one or multiple relations. You can even eagerly load *nested relations*. A nested relation is a relation
that is declared within a related Active Record class. For example, `app.models.Customer` is related with `app.models.Order` through the `orders`
relation, and `app.models.Order` is related with `app.models.Item` through the `items` relation. When querying for `app.models.Customer`, you can eagerly
load `items` using the nested relation notation `orders.items`. 

The following code shows different usage of [[Jii.sql.ActiveQuery.with()]]. We assume the `app.models.Customer` class
has two relations `orders` and `country`, while the `app.models.Order` class has one relation `items`.

```js
// eager loading both "orders" and "country"
app.models.Customer.find()
    .with('orders', 'country')
    .all()
    .then(function(customers) {
        // ...
    });

// equivalent to the array syntax below
app.models.Customer.find()
    .with(['orders', 'country'])
    .all()
    .then(function(customers) {
        // no SQL executed 
        var orders = customers[0].get('orders');
        // no SQL executed
        var country = customers[0].get('country');
    });
    
// eager loading "orders" and the nested relation "orders.items"
app.models.Customer.find()
    .with('orders.items')
    .all()
    .then(function(customers) {

        // access the items of the first order of the first customer
        // no SQL executed
        var items = customers[0].get('orders')[0].get('items');        
    });
```

You can eagerly load deeply nested relations, such as `a.b.c.d`. All parent relations will be eagerly loaded.

When eagerly loading a relation, you can customize the corresponding relational query using an anonymous function.
For example,

```js
// find customers and bring back together their country and active orders
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

When customizing the relational query for a relation, you should specify the relation name as an array key
and use an anonymous function as the corresponding array value. The anonymous function will receive a `query` parameter
which represents the [[Jii.sql.ActiveQuery]] object used to perform the relational query for the relation.
In the code example above, we are modifying the relational query by appending an additional condition about order status.


### Inverse Relations <span id="inverse-relations"></span>

Relation declarations are often reciprocal between two Active Record classes. For example, `app.models.Customer` is related 
to `app.models.Order` via the `orders` relation, and `app.models.Order` is related back to `app.models.Customer` via the `customer` relation.

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

Now consider the following piece of code:

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

We would think `customer` and `customer2` are the same, but they are not! Actually they do contain the same
customer data, but they are different objects. When accessing `order.customer`, an extra SQL statement
is executed to populate a new object `customer2`.

To avoid the redundant execution of the last SQL statement in the above example, we should tell Jii that
`customer` is an *inverse relation* of `orders` by calling the [[Jii.sql.ActiveQuery.inverseOf()]] method
like shown below:

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

With this modified relation declaration, we will have:

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
        
        // displays "same"
        console.log(customer2 === customer ? 'same' : 'not the same');
    });
```

> Note: Inverse relations cannot be defined for relations involving a [junction table](#junction-table).


## Saving Relations <span id="saving-relations"></span>

When working with relational data, you often need to establish relationships between different data or destroy
existing relationships. This requires setting proper values for the columns that define the relations. Using Active Record,
you may end up writing the code like the following:

```js
app.models.Customer
    .findOne(123)
    .then(function(customer) {
        var order = new app.models.Order();
        order.subtotal = 100;
        
        // ...
        
        // setting the attribute that defines the "customer" relation in Order
        order.customer_id = customer.id;
        order.save();
    });
```

Active Record provides the [[Jii.sql.ActiveRecord.link()]] method that allows you to accomplish this task more nicely:

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

The [[Jii.sql.ActiveRecord.link()]] method requires you to specify the relation name and the target Active Record
instance that the relationship should be established with. The method will modify the values of the attributes that
link two Active Record instances and save them to the database. In the above example, it will set the `customer_id`
attribute of the `app.models.Order` instance to be the value of the `id` attribute of the `app.models.Customer` instance and then save it
to the database.

> Note: You cannot link two newly created Active Record instances.

The benefit of using [[Jii.sql.ActiveRecord.link()]] is even more obvious when a relation is defined via
a [junction table](#junction-table). For example, you may use the following code to link an `app.models.Order` instance
with an `app.models.Item` instance:

```js
order.link('items', item);
```

The above code will automatically insert a row in the `order_item` junction table to relate the order with the item.

The opposite operation to [[Jii.sql.ActiveRecord.link()]] is [[Jii.sql.ActiveRecord.unlink()]]
which breaks an existing relationship between two Active Record instances. For example,

```js
app.models.Customer.find()
    .with('orders')
    .all()
    .then(function(customer) {
        customer.unlink('orders', customer.get('orders')[0]);
    });
```

By default, the [[Jii.sql.ActiveRecord.unlink()]] method will set the foreign key value(s) that specify
the existing relationship to be `null`. You may, however, choose to delete the table row that contains the foreign key value
by passing the `isDelete` parameter as `true` to the method.
