var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var _=require('lodash/object');

//自定义
var config=require('./config');
var helper=require('./helper');

// var routes = require('./routes/index');
// var users = require('./routes/users');
var app = express();
//模版新增方法
_.assign(app.locals,helper);
//匹配路由
config.route(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    switch(err.status){
      case 404:
        res.redirect('/');
        break;
      default:
        res.render('error', {
          message: err.message,
          error: err
        });  
    }
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  switch(err.status){
    case 404:
      res.redirect('/');
      break;
    default:
      res.render('error', {
        message: err.message,
        error: {}
      });  
  }
});


module.exports = app;
