/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var Jii = require('jii');

/**
 * @class app.assets.AppAsset
 * @extends Jii.assets.AssetBundle
 */
var self = Jii.defineClass('app.assets.AppAsset', {

	__extends: Jii.assets.AssetBundle,

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