/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var fs = require('fs');
var Jii = require('jii');

/**
 * @class app.assets.JqueryAsset
 * @extends Jii.view.AssetBundle
 */
var self = Jii.defineClass('app.assets.JqueryAsset', {

	__extends: Jii.view.AssetBundle,

	basePath: '@webroot/lib/jquery',
	baseUrl: '@web/lib/jquery',

	js: [
		'jquery-2.1.3.js'
	]

});