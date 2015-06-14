global.Jii = require('jii');
require('jii-httpserver');
require('jii-model');
require('jii-view');
require('jii-assets');

global.app = Jii.namespace('app');
require('require-all')(__dirname + '/assets');
require('require-all')(__dirname + '/controllers');
require('require-all')(__dirname + '/models');

Jii.createWebApplication({
	application: {
		basePath: __dirname,
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
				staticDirs: __dirname + '/web/'
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
});