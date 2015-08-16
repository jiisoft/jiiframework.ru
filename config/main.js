module.exports = {
    workers: 2,
    application: {
        basePath: __dirname + '/..',
        components: {
            urlManager: {
                className: 'Jii.urlManager.UrlManager',
                rules: {
                    '': 'site/index',
                    'guide': 'site/guide',
                    'guide/<page>': 'site/guide',
                    'contact': 'site/contact'
                }
            },
            http: {
                className: 'Jii.httpServer.HttpServer',
                staticDirs: __dirname + '/../web/'
            },
            view: {
                className: 'Jii.view.ServerWebView'
            },
            assetManager: {
                className: 'Jii.assets.AssetManager',
                bundles: {
                    'app.assets.AppAsset': {},
                    'app.assets.BootstrapAsset': {},
                    'app.assets.JqueryAsset': {}
                },
                baseUrl: '/assets'
            }
        }
    }
};