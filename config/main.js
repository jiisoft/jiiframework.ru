module.exports = {
    workers: 2,
    application: {
        basePath: __dirname + '/..',
        language: 'en',
        sourceLanguage: 'ru',
        components: {
            urlManager: {
                className: 'Jii.urlManager.UrlManager',
                rules: {
                    '': 'site/index',
                    'guide': 'site/guide',
                    'guide/<page>': 'site/guide',
                    'development': 'site/development',
                    'development/<page>': 'site/development',
                    'contact': 'site/contact'
                }
            },
            http: {
                className: 'Jii.httpServer.HttpServer',
                staticDirs: __dirname + '/../web/'
            },
            view: {
                className: 'Jii.view.ServerWebView'
            }
        }
    }
};