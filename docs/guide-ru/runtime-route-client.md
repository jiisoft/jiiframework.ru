Роутинг на клиенте
=======

Когда необходимо следить и обрабатывать состояние адресной строки браузера, в бой вступает модуль `Jii.request.client.Router`,
предназначенный именно для этой цели.

Router устанавливается как [компонент приложения](structure-application-components) и подписывается на
событие `popstate` (или `hashchange` для браузеров, не поддерживающих HTML5 History API).

При загрузке страницы или изменении адресной строки запускается обработчик, который парсит адресную строку компонентом
[UrlManager](runtime-url-handling), получает route с параметрами запроса и запускает действие (action), эквивалентное
найденному route.
Пример конфигурации приложения:

```js
require('jii/deps');

// Application
window.app = Jii.namespace('app');
require('./controllers/SiteController');

Jii.createWebApplication({
    application: {
        basePath: location.href,
        components: {
            urlManager: {
                className: 'Jii.request.UrlManager',
                rules: {
                    '': 'site/index',
                    'article/<id>': 'site/article',
                }
            },
            router: {
                className: 'Jii.request.client.Router'
            },
            
            // ...
        }
    }
}).start();
```

В действии будут доступны компоненты `request` и `response`, как это было при работе на сервере с HTTP сервером.
Предположим, что у нас адресная строка содержить адрес `http://localhost:3000/article/new-features`, тогда при
переходе на заданный адрес на клиенте сработает обработчик, который найдет роутер `site/article` и
запустит действие `actionArticle()` контроллера `app.controllers.SiteController`:

```js
/**
 * @class app.controllers.SiteController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.SiteController', /** @lends app.controllers.SiteController.prototype */{

	__extends: 'Jii.base.Controller',
	
	// ...

	actionArticle: function(context) {
	
	    console.log(context.request.getQueryParams()); // {id: 'new-features'}
	    
	}

});
```

Действующий пример, реализующий функционал примитивного чата, можно посмотреть в репозитории
[jii-boilerplate-chat](https://github.com/jiisoft/jii-boilerplate-chat).