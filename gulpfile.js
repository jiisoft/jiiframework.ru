require('./bootstrap');
require('jii-assets');

var gulp = require('gulp');
var tasks = Jii.assets.GulpTasks.applyTo(gulp);

gulp.task('default', tasks);