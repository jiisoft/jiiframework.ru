/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var fs = require('fs');
var Jii = require('jii');

/**
 * @class app.assets.BootstrapAsset
 * @extends Jii.view.AssetBundle
 */
var self = Jii.defineClass('app.assets.BootstrapAsset', {

	__extends: Jii.view.AssetBundle,

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