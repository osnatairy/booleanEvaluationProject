var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var dataRouter = require('./routes/data');
var evaluateRouter = require('./routes/evaluate');  

var app = express();
let mongo = require('./mongo.json');
var session = require('express-session');
app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));

mongoose.connect('mongodb://localhost/BooleanEvaluaionProject',
{ useNewUrlParser: true ,useUnifiedTopology: true})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'))

app.use('/', indexRouter);
app.use('/data', dataRouter);
app.use('/evaluate', evaluateRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
