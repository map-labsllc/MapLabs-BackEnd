
// might use, see: https://www.npmjs.com/package/http-errors
// const createError = require('http-errors');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// pull in routers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users/router');

// boilerplate
var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// setup routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
