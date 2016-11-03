Applications
============

Applications are objects that govern the overall structure and lifecycle of Jii application systems.
Обычно на один воркер (процесс) Node.js приходит один экземпляр приложения Jii, который доступен через `Jii.app`.


## Application Configurations <span id="application-configurations"></span>

When an entry script creates an application, it will load a [configuration](concept-configurations) and
apply it to the application, as follows:

```js
var Jii = require('jii');

// load application configuration
var config = {
	application: {
		basePath: __dirname,
		components: {
			http: {
				className: 'Jii.request.http.HttpServer'
			}
		}
	},
	context: {
        components: {
            request: {
                baseUrl: '/myapp'
            }
        }
	}
};

// create application object
Jii.createWebApplication(config);
```

Конфигурация делится на две части - конфигурация приложения (секция application) и конфигурацию контекста
(запроса) (секция context). Конфигурация приложения создаёт и настраивает компоненты, модули и конфигурирует само
приложение (`Jii.app`) - всё это происходит при запуске воркера. В свою очередь, конфигурация контекста создаёт и
настраивает компоненты при каждом вызове экшена - http запросе, вызове консольной команды и т.п.
Созданные компоненты передаются как первый аргумент в метод экшена.

Из-за того, что конфигурация приложения часто является очень сложной, она выносится в файлы и разбивается на
несколько конфигурационных файлов.


## Application Properties <span id="application-properties"></span>

There are many important application properties that you should configure in application configurations.
These properties typically describe the environment that applications are running in.
For example, applications need to know how to load [controllers](structure-controllers),
where to store temporary files, etc. In the following, we will summarize these properties.
