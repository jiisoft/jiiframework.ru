Конструктор запросов
=======

Конструктор запросов использует объекты доступа к базе данных ([Database Access Objects](db-dao)), что позволяет
строить SQL запросы на языке JavaScript. Конструктор запросов повышает читаемость SQL-кода и позволяет генерировать
более безопасные запросы в БД.

Использование конструктора запросов делится на 2 этапа:
1. Создание экземпляра класса [[Jii.base.Query]] для представления различных частей SQL выражения (например, `SELECT`, `FROM`).
2. Вызов методов (например, `all()`) у эклемпляра [[Jii.base.Query]] для выполнения запроса к базе данных и асинхронного получения данных.

Следующий код показывает простейший способ использования конструктора запросов:

```js
(new Jii.base.Query())
    .select(['id', 'email'])
    .from('user')
    .where({last_name: 'Smith'})
    .limit(10)
    .all()
    .then(function(rows) {
        // ...
    });
```

Приведенный выше код сгенерирует и выполнит следующий SQL код, в котором параметр `:last_name` связан со
значением `'Smith'`.

```sql
SELECT `id`, `email` 
FROM `user`
WHERE `last_name` = :last_name
LIMIT 10
```


## Создание запросов <span id="building-queries"></span>

Для построения запроса необходимо вызывать различные методы объекта [[Jii.base.Query]], наполняя тем самым различные
части SQL команды. Имена методов схожи с названиями SQL операторов. Например, чтобы указать `FROM`, необходимо вызвать
метод `from()`. Все методы возвращают сам объект запроса, что позволяет объединять несколько вызовов вместе.

Далее мы опишем использование каждого метода конструктора запросов.


### [[Jii.base.Query.select()]] <span id="select"></span>

Метод [[Jii.base.Query.select()]] метод определяет часть `SELECT` SQL запроса. Вы можете указать столбцы, которые
будут выбраны.

```js
query.select(['id', 'email']);

// эквивалентно:

query.select('id, email');
```

Имена столбцов могут включать в себя названия таблиц и/или псевдонимы столбцов.
Например,

```js
query.select(['user.id AS user_id', 'email']);

// эквивалентно:

query.select('user.id AS user_id, email');
```

Вы можете передаеть объект, где ключами будут псевдонимы столбцов.
Например, приведенный выше код можно переписать следующим образом:

```js
query.select({user_id: 'user.id', email: 'email'});
```

По-умолчанию (даже если не вызывать метод [[Jii.base.Query.select()]]), в запросе будет сгенерирована звездочка `*`
для выбора всех столбцов.

Кроме имен столбцов, вы можете также указывать SQL выражения. Например,

```js
query.select(["CONCAT(first_name, ' ', last_name) AS full_name", 'email']); 
```

Так же поддерживаются под-запросы, для этого необходимо передать объект [[Jii.base.Query]] как один из
элементов для выборки.
 
```js
var subQuery = (new Jii.base.Query()).select('COUNT(*)').from('user');

// SELECT `id`, (SELECT COUNT(*) FROM `user`) AS `count` FROM `post`
var query = (new Jii.base.Query()).select({id: 'id', count: subQuery}).from('post');
```

Для добавления слова `'DISTINCT'` в SQL запрос, необходимо вызвать метод [[Jii.base.Query.distinct()]]:

```js
// SELECT DISTINCT `user_id` ...
query.select('user_id').distinct();
```

Вы так же можете вызывать метод [[Jii.base.Query.addSelect()]] для добавления дополнительных колонок.

```js
query.select(['id', 'username'])
    .addSelect(['email']);
```


### [[Jii.base.Query.from()]] <span id="from"></span>

Метод [[Jii.base.Query.from()]] наполняет фрагмент `FROM` из SQL запроса. Например,

```js
// SELECT * FROM `user`
query.from('user');
```

Имена таблиц могут содержать префиксы и/или псевдонимы таблиц. Например,

```js
query.from(['public.user u', 'public.post p']);

// эквивалентно:

query.from('public.user u, public.post p');
```

При передаче объекта, ключи объекта будут являться псевдонимами таблиц.

```js
query.from({u: 'public.user', p: 'public.post'});
```

Кроме того, имена таблиц могут содержать подзапросы - объекты [[Jii.base.Query]].

```js
var subQuery = (new Jii.base.Query()).select('id').from('user').where('status=1');

// SELECT * FROM (SELECT `id` FROM `user` WHERE status=1) u 
query.from({u: subQuery});
```

### [[Jii.base.Query.where()]] <span id="where"></span>

Метод [[Jii.base.Query.where()]] наполняет секцию `WHERE` в SQL выражении. Вы можете использовать несколько форматов
указания условий SQL выражения:

- строка, `'status=1'`
- объект, `{status: 1, type: 2}`
- с указанием оператора, `['like', 'name', 'test']`


#### Строковый формат <span id="string-format"></span>

Строковый формат очень хорошо подходит для указания простых условий. Указанная строка напрямую записывается в SQL выражение.

```js
query.where('status=1');

// или с указанием параметров
query.where('status=:status', {':status': status});
```

Вы можете добавлять параметры к запросу через методы [[Jii.base.Query.params()]] или [[Jii.base.Query.addParams()]].

```js
query.where('status=:status')
    .addParams({':status': status});
```


#### Условие как объект (хеш) <span id="hash-format"></span>

Объект лучше всего использовать, чтобы указать несколько объединенных (`AND`) подусловий, каждый из которых имеет
простое равенство. Ключами объекта являются столбцы, а значения - соответствующие значения, передаваемые в условие.
Например,

```js
// ...WHERE (`status` = 10) AND (`type` IS NULL) AND (`id` IN (4, 8, 15))
query.where({
    status: 10,
    type: null,
    id: [4, 8, 15]
});
```

Конструктор запросов достаточно умен, чтобы правильно обрабатывать в качестве значений `NULL` и массивы.

Вы также можете использовать подзапросы с хэш-формате:

```js
var userQuery = (new Jii.base.Query()).select('id').from('user');

// ...WHERE `id` IN (SELECT `id` FROM `user`)
query.where({id: userQuery});
```


#### Формат с указанием оператора <span id="operator-format"></span>

Данный формат позволяет задавать произвольные условия в программном виде. Общий формат таков:

```js
[operator, operand1, operand2, ...]
```

где операнды могут быть друг указан в формате строки, объекта или с указанием оператора. Оператор может быть одним
из следующих:

- `and`: операнды должны быть объединены вместе, используя `AND`. Например,
  `['and', 'ID = 1', 'ID = 2']` будет генерировать `ID = 1 AND ID = 2`. Если операнд массива,
  он будет преобразован в строку, используя правила, описанные здесь. Например,
  `['and', 'type=1', ['or', 'id=1', 'id=2']]` сгенерирует `type=1 AND (id=1 OR id=2)`.
  Метод не выполняет экранирование.

- `or`: похож на `AND` оператора, заисключением того, что операнды соединяются при помощи `OR`.

- `between`: операнд 1 - имя столбца, а операнды 2 и 3 - начальные и конечные значения диапазона, в которых находятся
   значения колонки.
   Например, `['between', 'ID', 1, 10]` сгенерирует выражение `id BETWEEN 1 AND 10`.

- `not between`: подобно `between`, но `BETWEEN` заменяется на `NOT BETWEEN` в сгенерированном выражении.

- `IN`: операнд 1 должен быть столбцом или SQL выражение (expression). Второй операнд может быть либо массивом
  или объектом `Jii.base.Query`. Например,
  `['in', 'id', [1, 2, 3]]` сгенерирует `id IN (1, 2, 3)`.
  Метод экранирует имя столбца и обрабатывает значения в диапазоне.
  Оператор `IN` также поддерживает составные столбцы. В этом случае операнд 1 должен быть массивом столбцов,
  в то время как операнд 2 должен быть массивом массивов или `Jii.base.Query` объектом, представляющий диапазон столбцов.

- `NOT IN`: похож на `IN` оператора, за исключением того, что `IN` заменяется на `NOT IN` в созданном выражении.

- `Like`: Первый операнд должен быть столбцом или SQL выражением, а операнд 2 - строка или массив, представляющий
  собой значения для поиска. Например, `['like', 'name', 'tester']` сгенерирует `name LIKE '%tester%'`.
  В случае задания массива будет сгенерировано несколько `LIKE`, объединенные оператором `AND`. Например,
  `['like', 'name', ['test', 'sample']]` сгенерирует `name LIKE '%test%' AND name LIKE '%sample%'`.

- `or like`: похож на `like`, но для объединения используется оператор `OR`, когда вторым операндом передан массив.

- `not like`: похож на оператор `like`, за исключением того, что `LIKE` заменяется на `NOT LIKE` в сгенерированном выражении.

- `or not like`: похож на `not like`, но для объединения используется оператор `OR`, когда вторым операндом передан массив.

- `exists`: требуется один операнд, который должен быть экземпляром [[Jii.base.Query]]. Сгенерирует выражение
  `EXISTS (sub-query)`.

- `not exists`: похож на оператор `exists`, генерирует выражение `NOT EXISTS (sub-query)`..

- `>`, `<=`, или любой другой оператор БД. Первый операнд должен быть именем столбца, а второй - значением.
  Например, `['>', 'age', 10]` сгенерирует `age>10`.


#### Добавление условий <span id="appending-conditions"></span>

Вы можете использовать методы [[Jii.base.Query.andWhere()]] или [[Jii.base.Query.orWhere()]] для добавления условий в
существующий запрос. Вы можете вызывать эти методы несколько раз, например:

```js
var status = 10;
var search = 'jii';

query.where({status: status});

if (search) {
    query.andWhere(['like', 'title', search]);
}
```

Если `search` не пуст, то приведенный выше код сгенерирет следующий SQL запрос:

```sql
... WHERE (`status` = 10) AND (`title` LIKE '%jii%')
```

#### Фильтрация условий <span id="filter-conditions"></span>

При строительстве `WHERE` условия, основанного на данных пользователя, как правило, необходимо игнорировать пустые
значения. Например, в поисковой форме, которая позволяет осуществлять поиск по имени и по электронной почте, нужно
игнорировать поле, если в него пользователь ничего не ввел. Это можно сделать с помощью метода
[[Jii.base.Query.filterWhere()]]:


```js
// Данные полей username и email берутся из формы
query.filterWhere({
    username: username,
    email: email,
});
```

Различия между [[Jii.base.Query.filterWhere()]] и [[Jii.base.Query.where()]] состоит в том, первый будет игнорировать
пустые значения.

> Значение считается пустым, если это `null`, `false`, пустой массив, пустая строка или строка, состоящая только из пробелов.

Подобно методам [[Jii.base.Query.andWhere()]] и [[Jii.base.Query.orWhere()]], вы можете использовать
[[Jii.base.Query.andFilterWhere()]] и [[Jii.base.Query.orFilterWhere()]] для добавленя дополнительных условий.


### [[Jii.base.Query.orderBy()]] <span id="order-by"></span>

Метод [[Jii.base.Query.orderBy()]] добавляет часть `ORDER BY` к SQL запросу. Например,
 
```js
// ... ORDER BY `id` ASC, `name` DESC
query.orderBy({
    id: 'asc',
    name: 'desc',
});
```

В приведенном выше коде, ключами объекта являются имена столбцов, а значения - соответствующее направления сортировки.

Для добавления условий сортировки используйте метод [[Jii.base.Query.addOrderBy()]].
Например,

```js
query.orderBy('id ASC')
    .addOrderBy('name DESC');
```


### [[Jii.base.Query.groupBy()]] <span id="group-by"></span>

Метод [[Jii.base.Query.orderBy()]] добавляет часть `GROUP BY` к SQL запросу. Например,

```js
// ... GROUP BY `id`, `status`
query.groupBy(['id', 'status']);
```

Если `GROUP BY` включает только простые имена столбцов, вы можете указать его, используя строку, как при
написании обычного SQL. Например,

```js
query.groupBy('id, status');
```

Вы можете использовать метод [[Jii.base.Query.addGroupBy()]] для добавления дополнительных колонок к части `GROUP BY`.
Например,

```js
query.groupBy(['id', 'status'])
    .addGroupBy('age');
```


### [[Jii.base.Query.having()]] <span id="having"></span>

Метод [[Jii.base.Query.having()]] определяет часть `HAVING` SQL выражения. Этот метод работает так же, как метод
[[Jii.base.Query.where()]]. Например,

```js
// ... HAVING `status` = 1
query.having({status: 1});
```

Добавляйте дополнительные условия с помощью методов [[Jii.base.Query.andHaving()]] или [[Jii.base.Query.orHaving()]].
Например,

```js
// ... HAVING (`status` = 1) AND (`age` > 30)
query.having({status: 1})
    .andHaving(['>', 'age', 30]);
```


### [[Jii.base.Query.limit()]] and [[Jii.base.Query.offset()]] <span id="limit-offset"></span>

Методы [[Jii.base.Query.limit()]] и [[Jii.base.Query.offset()]] наполняют части `LIMIT`
и `OFFSET` SQL выражения. Например,
 
```js
// ... LIMIT 10 OFFSET 20
query.limit(10).offset(20);
```

Если вы передадите неправильные значения `limit` и `offset`, то они будут проигнорированы.


### [[Jii.base.Query.join()]] <span id="join"></span>

Метод [[Jii.base.Query.join()]] наполняет часть `JOIN` SQL выражения. Например,
 
```js
// ... LEFT JOIN `post` ON `post`.`user_id` = `user`.`id`
query.join('LEFT JOIN', 'post', 'post.user_id = user.id');
```
Метод имеет 4 параметра:
 
- `type`: тип, например, `'INNER JOIN'`, `'LEFT JOIN'`.
- `table`: имя присоединяемой таблицы.
- `on`: (необязательный) условие, часть `ON` SQL выражения. Синтаксис аналогичен методу [[Jii.base.Query.where()]].
- `params`: (необязательный), параметры условия (`ON` части).

Вы можете использовать следующие методы, для указания `INNER JOIN`, `LEFT JOIN` и `RIGHT JOIN` соответственно.

- [[Jii.base.Query.innerJoin()]]
- [[Jii.base.Query.leftJoin()]]
- [[Jii.base.Query.rightJoin()]]

Например,

```js
query.leftJoin('post', 'post.user_id = user.id');
```

Чтобы присоединить несколько столбцов, необходимо вызвать `join` методы несколько раз.

Кроме того, вы можете присоединять под-запросы. В этом случае вам необходимо передать объект, где
ключ будет псевдонимом присоединяемого запроса. Например,

```js
var subQuery = (new Jii.base.Query()).from('post');
query.leftJoin({u: subQuery}, 'u.id = author_id');
```


### [[Jii.base.Query.union()]] <span id="union"></span>

Метод [[Jii.base.Query.union()]] наполняет часть `UNION` SQL запроса. Например,

```js
var query1 = (new Jii.base.Query())
    .select('id, category_id AS type, name')
    .from('post')
    .limit(10);

var query2 = (new Jii.base.Query())
    .select('id, type, name')
    .from('user')
    .limit(10);

query1.union(query2);
```

Вы можете вызывать данный метод несколько раз для добавления нескольких `UNION` фрагментов. 


## Методы запроса <span id="query-methods"></span>

Класс [[Jii.base.Query]] предоставляет целый набор методов для различных резельтатов запроса:

- [[Jii.base.Query.all()]]: возвращает массив объектов, где ключами являются названия столбцов.
- [[Jii.base.Query.one()]]: возвращает первый результат запроса - объект, соответствующий найденной строке.
- [[Jii.base.Query.column()]]: возвращает массив, соответствующий значениями первого столбца результата запроса.
- [[Jii.base.Query.scalar()]]: возвращает скалярное значение, расположенное в первой ячейке результата.
- [[Jii.base.Query.exists()]]: возвращает булевое значение, указывающее содержит ли запрос какой-либо результат.
- [[Jii.base.Query.count()]]: возвращает количество найденных строк.
- Другие методы агрегации запрос, в том числе [[Jii.base.Query.sum(q)]], [[Jii.base.Query.average(q)]],
  [[Jii.base.Query.max(q)]], [[Jii.base.Query.min(q)]]. Параметр `q` является обязательным для этих методов
  и может быть либо именем столбца, либо SQL выражением.

Все эти методы возвращают экземпляр `Promise` для обработки асинхронного ответа

Например,

```js
// SELECT `id`, `email` FROM `user`
(new Jii.base.Query())
    .select(['id', 'email'])
    .from('user')
    .all().then(function(rows) {
        // ...
    });
    
// SELECT * FROM `user` WHERE `username` LIKE `%test%`
(new Jii.base.Query())
    .from('user')
    .where(['like', 'username', 'test'])
    .one().then(function(row) {
        // ...
    });
```

Все эти методы принимают необязательный параметр `db` представляющий [[Jii.sql.Connection]]. Если этот параметр не
задан, будет использоваться [компонент приложения](structure-application-components) `db` для подключения к БД.
за подключение к базе. Ниже еще один пример использования `count()` метода:

```js
// executes SQL: SELECT COUNT(*) FROM `user` WHERE `last_name`=:last_name
(new Jii.base.Query())
    .from('user')
    .where({last_name: 'Smith'})
    .count()
    .then(function(count) {
        // ...
    })
```


### Индексы в результатах запроса <span id="indexing-query-results"></span>

Когда вы вызываете [[Jii.base.Query.all()]], то он вернет массив строк, которые индексируются последовательными целыми числами.
Но вы можете индексировать их по-разному, например, конкретным значениям столбца или выражения с помощью метода
[[Jii.base.Query.indexBy()]], вызванного перед методом [[Jii.base.Query.all()]]. В этом случае будет возвращен объект.
Например,

```js
// returns {100: {id: 100, username: '...', ...}, 101: {...}, 103: {...}, ...}
var query = (new Jii.base.Query())
    .from('user')
    .limit(10)
    .indexBy('id')
    .all();
```

Для указания сложных индексов, вы можете передать в метод [[Jii.base.Query.indexBy()]] анонимную функцию:

```js
var query = (new Jii.base.Query())
    .from('user')
    .indexBy(function (row) {
        return row.id . row.username;
    }).all();
```

Анонимная функция принимает параметр `row` которая содержит данные текущей строки и должна вернуть строку или число,
которое будет использоваться в качестве значения индекса (ключа объекта) для текущей строки.

