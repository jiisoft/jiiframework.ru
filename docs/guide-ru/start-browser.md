Jii в браузере
====

Jii изначально пишется так, чтобы его можно было использовать везде, где может выполняться JavaScript код. Если
код модуля не завязан на серверной инфраструктуре, то его можно использовать в браузере.

Представьте, уже сейчас все структуры фреймворка, такие как [приложения](structure-applications),
[компоненты](concept-components), [контроллеры](structure-controllers), [модули](structure-modules),
[модели](structure-models), [представления](structure-views) доступны в браузере.

Все это разбито и подключается по частям, в виде npm модулей:

- `jii` (или `jii/deps`) - базовые классы и основа фреймворка;
- `jii-comet` - Комет клиент;
- `jii-model` - Модель набором валидаторов (которые указываются в rules());
- `jii-react` - React компоненты для Jii.

## Создание приложения на клиенте

Создаваться приложение будет почти также как и серверное:

```js
// Libs
require('jii/deps'); // included underscore and underscore.string libraries

// Application
require('./controllers/SiteController');

Jii.createWebApplication({
    application: {
        basePath: location.href,
        components: {
            urlManager: {
                className: 'Jii.request.UrlManager',
                rules: {
                    '': 'site/index'
                }
            },
            router: {
                className: 'Jii.request.client.Router'
            }
        }
    }
}).start();

console.log('Index page url: ' + Jii.app.urlManager.createUrl(['site/index']));
```

## Зависимости

Jii имеет зависимости от библиотек [underscore](http://underscorejs.org/)
и [underscore.string](http://epeli.github.io/underscore.string/). Если они уже подключены у вас на странице, то
нужно подключать Jii как `require('jii')`, если зависимости нужны - `require('jii/deps')`.

## Компиляция JavaScript кода

Jii рекомендует использовать CommonJS подход для подгрузки зависимостей. Сборку модулей можно делать любыми средствами,
например, используя [browserify](http://browserify.org/). Рассмотрим простейший пример сборки.
Установка зависимотей:

```sh
npm install --save-dev gulp gulp-easy
```

Файл gulpfile.js:

```js
require('gulp-easy')(require('gulp'))
    .js('sources/index.js', 'bundle.js')
```
