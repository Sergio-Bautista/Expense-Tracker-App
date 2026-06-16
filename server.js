const express = require('express');
const app = express();
const mongoose = require("mongoose")
const passport = require('passport')
const session = require('express-session')
// Import it simply as the default root variable
const {MongoStore} = require('connect-mongo')

const flash = require('express-flash')
const logger = require('morgan')
const connectToDB = require('./config/database')
const indexRoute = require('./routes/indexRoute')
const dashboardRoute = require('./routes/dashboardRoute')

require('dotenv').config({path: './config/.env'})
require('./config/passport')(passport)

console.log("Strategies:", passport._strategies);
connectToDB()


app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(logger('dev'))
// Sessions
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    // Use the standard constructor fallback block
    store: MongoStore.create({ 
      mongoUrl: process.env.DB_string 
    })
    
  }));


app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use('/', indexRoute)
app.use('/dashboard',dashboardRoute )


app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})  