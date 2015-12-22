global.Jii = require('jii');
require('jii-httpserver');
require('jii-model');
require('jii-view');

global.app = Jii.namespace('app');
require('require-all')(__dirname + '/assets');
require('require-all')(__dirname + '/controllers');
require('require-all')(__dirname + '/models');

Jii.createWebApplication(require('./config/main'));
