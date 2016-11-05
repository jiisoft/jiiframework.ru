# Установка

## Требования
Для установки Jii необходимо иметь установленный [Node.js](http://nodejs.org/download/) версии не менее `v0.12`.

## Поддерживаемые платформы
- node.js
- browsers (ie8+, chrome, ff, safari, mobile browsers, ..)
- mobile (phonegap) (в будущем)

## Установка из шаблона
Jii имеет несколько примеров, которые одновременно являются шаблонами для быстрого развертывания приложения.
Примеры далеки от идеала, но тем не менее позволяют уловить возможности Jii и то, как нужно создавать приложения.
На данный момент доступны следующие шаблоны:

- [Hello](https://github.com/jiisoft/jii-boilerplate-hello) - Содержит HTTP сервер, роутер, один контроллер, лейаут + вьюшка, отображающая "Hello World"
- [Basic](https://github.com/jiisoft/jii-boilerplate-basic) - Чуть сложнее пример, содержит в добавок Active Record и Assets Manager.

Любой из шаблонов устанавливается следующим образом:

```sh
git clone https://github.com/jiisoft/jii-boilerplate-hello
cd jii-boilerplate-hello
npm install
```

При наличии файла `gulpfile.js` в шаблоне, необходимо запустить gulp (либо `gulp production`):

```sh
gulp production
```
