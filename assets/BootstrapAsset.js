/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var Jii = require('jii');

/**
 * @class app.assets.BootstrapAsset
 * @extends Jii.assets.AssetBundle
 */
var self = Jii.defineClass('app.assets.BootstrapAsset', {

	__extends: Jii.assets.AssetBundle,

	basePath: '@webroot/lib/bootstrap',
	baseUrl: '@web/lib/bootstrap',

	css: [
		'less/bootstrap.less'
	],

	js: [
		'js/bootstrap.js'
	],

	depends: [
		'app.assets.JqueryAsset'
	]

});