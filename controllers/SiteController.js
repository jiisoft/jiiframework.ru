/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var Jii = require('jii');
var fs = require('fs');
var hljs = require('highlight.js');
var markdown = require('markdown-it')({
	html: true,
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) {}

		return ''; // use external default escaping
	}
});

/**
 * @class app.controllers.SiteController
 * @extends Jii.base.Controller
 */
Jii.defineClass('app.controllers.SiteController', /** @lends app.controllers.SiteController.prototype */{

	__extends: Jii.base.Controller,

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionIndex: function(context) {
		var packageItems = app.models.PackageItem.requirePackage('jii-boilerplate-hello');

		context.response.data = this.render('index', {
			packageItems: packageItems
		});
		context.response.send();
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionGuide: function(context) {
		var mdContent = fs.readFileSync(Jii.getAlias('@app/docs/guide-ru/' + context.request.get('page', 'intro-jii') + '.md')).toString();

		context.response.data = this.render('guide', {
			content: markdown.render(mdContent)
		});
		context.response.send();
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionDevelopment: function(context) {
		var mdContent = fs.readFileSync(Jii.getAlias('@app/docs/development-ru/' + context.request.get('page', 'contribute') + '.md')).toString();

		context.response.data = this.render('guide', {
			content: markdown.render(mdContent)
		});
		context.response.send();
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionContact: function(context) {
		context.response.data = this.render('contact');
		context.response.send();
	}

});