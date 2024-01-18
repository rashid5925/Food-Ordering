require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passport = require('passport');
const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const cors = require('cors');

var indexRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');

const { request } = require('http');
const connectDB = require('./db');

var app = express();

app.use(cors({
  origin: process.env.ORIGIN
}));

app.use(passport.initialize());

connectDB();

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({message: err.message});
});

module.exports = app;
