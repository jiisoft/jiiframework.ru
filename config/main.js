var UrlManager = require('jii/request/UrlManager');
var HttpServer = require('jii-httpserver/server/HttpServer');
var ServerWebView = require('jii-view/server/ServerWebView');
var SiteController = require('../controllers/SiteController');
var UnderscoreRenderer = require('jii-view/server/underscore/UnderscoreRenderer');

module.exports = {
    workers: 2,
    application: {
        language: 'en',
        sourceLanguage: 'ru',
        controllerMap: {
            SiteController: SiteController
        },
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
                className: ServerWebView,
                renderers: {
                    underscore: {
                        className: UnderscoreRenderer
                    },
                },
            },
        },
    },
};