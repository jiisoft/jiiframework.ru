/**
 * @author <a href="http://www.affka.ru">Vladimir Kozhin</a>
 * @license MIT
 */

var Jii = require('jii');
var _each = require('lodash/each');
var _indexOf = require('lodash/indexOf');
var Model = require('jii-model/base/Model');
var fs = require('fs');
var hljs = require('highlight.js');

/**
 * @class app.models.PackageItem
 * @extends Jii.base.Model
 */
module.exports = Jii.defineClass('app.models.PackageItem', /** @lends app.models.PackageItem.prototype */{

	__extends: Model,

	__static: /** @lends app.models.PackageItem */{

		SKIP_NAMES: ['LICENSE', 'README.md', 'node_modules', 'web'],

		requirePackage: function(name) {
			var exampleBasePath = require.resolve(name).replace(/\/[^/]+$/, '');
			return this.__static._readDir(exampleBasePath, '/');
		},

		_readDir: function(rootPath, path, level) {
			level = level || 0;

			var files = [];
			var directories = [];

			_each(fs.readdirSync(rootPath + path), function(name) {
				// Skip hidden
				if (name.substr(0, 1) === '.') {
					return;
				}

				if (_indexOf(this.__static.SKIP_NAMES, name) !== -1) {
					return;
				}

				var fileStat = fs.statSync(rootPath + path + name);
				if (fileStat.isDirectory()) {
					directories.push(name);
				} else {
					files.push(name);
				}
			}.bind(this));

			var items = [];

			// Each sorted items
			_each(directories.concat(files), function(name, i) {
				var model = new this.__static();
				model.setAttributes({
					name: name,
					rootPath: rootPath,
					relativePath: path,
					isDir: i < directories.length,
					level: level
				}, false);

				items.push(model);

				if (model.get('isDir') === true) {
					items = items.concat(this.__static._readDir(rootPath, path + name + '/', level + 1));
				}

			}.bind(this));

			return items;
		}

	},

	_attributes: {
		name: null,
		rootPath: null,
		relativePath: null,
		isDir: null,
		level: null
	},

	getId: function() {
		var id = this.get('relativePath') + this.get('name');
		return 'source-' + id.substr(1).replace(/[^0-9a-z]/ig, '-');
	},

	getIsEntryScript: function() {
		return this.get('name') === 'index.js';
	},

	getExtension: function() {
		return Jii.helpers.File.getFileExtension(this.get('name'));
	},

	getGlyphIcon: function() {
		if (this.get('isDir')) {
			return 'glyphicon-folder-open';
		}

		return 'glyphicon-list-alt';
	},

	getSource: function() {
		if (this.get('isDir')) {
			return '';
		}

		var path = this.get('rootPath') + this.get('relativePath') + this.get('name');
		var code = fs.readFileSync(path).toString();

		var langMap = {
			js: 'javascript',
			ejs: 'javascript',
			html: 'html'
		}
		var lang = langMap[this.getExtension()] || null;

		return lang ? hljs.highlight(lang, code).value : hljs.highlightAuto(code).value;
	}

});