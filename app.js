



const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

// pull in routers
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users/router')
const answersRouter = require('./routes/answers/router')
const transitionsRouter = require('./routes/transitions/router')
const lifedescrsRouter = require('./routes/lifedescrs/router')


// boilerplate
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// prevent CORS error
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})


// setup routes
app.use('/', indexRouter)
// app.use('/narratives', narrativesRouter)
app.use('/users', usersRouter)
app.use('/answers', answersRouter)
app.use('/transitions', transitionsRouter)
app.use('/lifedescrs', lifedescrsRouter)


// ===========================================================
// catch 404 and forward to error handler
// ===========================================================
app.use(function(req, res, next) {
  console.log("404: ", req.url);
  next(createError(404))
})

// ===========================================================
// Error handler for next(object) / 500
// ===========================================================
app.use((err, req, res, next) => {
  const status = err.status || 500
  console.log("======================= APP ERROR IN CONTROLLER =======================")
  console.log('status: ',status)
  console.log('-------')
  console.log('raw error: ',err)
  console.log("^^^^^^^^^^^^^^^^^^^^^^^ APP ERROR IN CONTROLLER ^^^^^^^^^^^^^^^^^^^^^^")
  res.status(status).json('' + err)
  // next()
})

module.exports = app
