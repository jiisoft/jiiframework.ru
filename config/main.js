var UrlManager = require('jii-urlmanager/UrlManager');
var HttpServer = require('jii-httpserver/server/HttpServer');
var ServerWebView = require('jii-view/server/ServerWebView');

module.exports = {
    workers: 2,
    application: {
        language: 'en',
        sourceLanguage: 'ru',
        components: {
            urlManager: {
                className: UrlManager,
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
                className: HttpServer,
                staticDirs: __dirname + '/../web/'
            },
            view: {
                className: ServerWebView
            }
        }
    }
};