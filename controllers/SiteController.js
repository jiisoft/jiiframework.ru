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

	__extends: 'Jii.base.Controller',

    beforeAction: function (action, context) {
        Jii.app.language = context.request.getHostInfo().match(/\.com/) ? 'en' : 'ru';
        return this.__super(action, context);
    },

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionIndex: function(context) {
		var packageItems = app.models.PackageItem.requirePackage('jii-boilerplate-hello');

		return this.render('index', context, {
			packageItems: packageItems
		});
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionGuide: function(context) {
		var mdContent = fs.readFileSync(Jii.getAlias('@app/docs/guide-' + Jii.app.language + '/' + context.request.get('page', 'intro-jii') + '.md')).toString();

		return this.render('guide', context, {
			content: markdown.render(mdContent)
		});
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionDevelopment: function(context) {
		var mdContent = fs.readFileSync(Jii.getAlias('@app/docs/development-' + Jii.app.language + '/' + context.request.get('page', 'contribute') + '.md')).toString();

		return this.render('development', context, {
			content: markdown.render(mdContent)
		});
	},

	/**
	 *
	 * @param {Jii.base.Context} context
	 * @param {Jii.httpServer.Request} context.request
	 * @param {Jii.httpServer.Response} context.response
	 */
	actionContact: function(context) {
		return this.render('contact', context);
	}

});