/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var fs = require('fs');
var Jii = require('jii');

/**
 * @class app.assets.AppAsset
 * @extends Jii.view.AssetBundle
 */
var self = Jii.defineClass('app.assets.AppAsset', {

	__extends: Jii.view.AssetBundle,

	basePath: '@webroot',
	baseUrl: '@web',

	css: [
		'css/style.less',
		'lib/markdown/github-markdown.css',
		'lib/markdown/github-hljs.css'
	],

	js: [
		'js/main.js'
	],

	depends: [
		'app.assets.BootstrapAsset'
	]

});