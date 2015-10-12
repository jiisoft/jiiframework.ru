Комет
=======

## Конфигурация клиента

На клиенте немного проще: есть один компонент `Jii.comet.client.Client`, который подключается к одному из серверов и
обменивается данными.

```js
application: {
    components: {
        comet: {
            className: 'Jii.comet.client.Client',
            serverUrl: 'http://localhost:4401/comet',
            autoOpen: true
        },
        
        // ...
    }
}
```

## Плагины

