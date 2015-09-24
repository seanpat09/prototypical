var gulp = require('gulp');
var zip = require('gulp-zip');
var forceDeploy = require('gulp-jsforce-deploy');
var meta = require('./metadataList');
var creds = require('./credentials');

gulp.task('deploy', ['buildPackage'], function() {
  setTimeout(sendToSF, 1000);
  function sendToSF(){
    gulp.src('./deploy/**', { base: "." })
      .pipe(zip('pkg.zip'))
      .pipe(forceDeploy({
        username: creds.username,
        password: creds.password,
        loginUrl: 'https://login.salesforce.com',
        rollbackOnError: true
        //, pollTimeout: 120*1000
        //, pollInterval: 10*1000
        //, version: '33.0'
      }));
  }
});

gulp.task('buildPackage', function(){
  gulp.src('./src/package.xml')
    .pipe(gulp.dest('./deploy'));
  meta.classes.forEach( function(file){
    var fileName = './src/classes/' + file + '*';
    gulp.src(fileName)
      .pipe(gulp.dest('./deploy/classes'));
  });
  meta.triggers.forEach( function(file){
    var fileName = './src/triggers/' + file + '*';
    gulp.src(fileName)
      .pipe(gulp.dest('./deploy/triggers'));
  });
  meta.staticresources.forEach( function(file){
    var fileName = './src/staticresources/' + file + '*';
    gulp.src(fileName)
      .pipe(gulp.dest('./deploy/staticresources'));
  });
  compileResourceBundles();
});

function compileResourceBundles(){
  meta.staticresources.forEach( function(resource) {
    gulp.src('./resource-bundles/'+resource+'/**')
      .pipe(zip(resource))
      .pipe(gulp.dest('./deploy/staticresources'));
  });
}