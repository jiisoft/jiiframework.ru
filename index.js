#!/usr/bin/env node

global.Jii = require('jii');
require('jii-httpserver');
require('jii-model');
require('jii-view');
require('jii-assets');

global.app = Jii.namespace('app');
require('require-all')(__dirname + '/assets');
require('require-all')(__dirname + '/controllers');
require('require-all')(__dirname + '/models');

var custom = require('./config');

require('jii-workers')
    .setEnvironment(custom.environment)
    .application(Jii.mergeConfigs(
        require('./config/main'),
        custom.main
    ));

