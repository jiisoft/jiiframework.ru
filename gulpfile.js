require('./bootstrap');
require('jii-client');

var gulp = require('gulp');
var tasks = Jii.client.GulpTasks.applyTo(gulp);

gulp.task('default', tasks);