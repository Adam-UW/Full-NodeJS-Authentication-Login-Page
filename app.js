const express= require('express')
const expressLayouts= require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session= require('express-session')

const app = express()
const passport= require('passport')

// ! Passport config
require('./config/passport')(passport)

// ! DB Config
const db = require('./config/keys').MongoURI




//! CONNECT MONGO
mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology:true})
.then( ()=> console.log('Mongo DB connected......'))
.catch(err => console.log('Error'))

// !EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

//! BodyParser
app.use(express.urlencoded({extended: false}))


// ! Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//! Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//!Connect Flash
app.use(flash())

//! Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()

})


//!Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))






const PORT= process.env.PORT || 5000

app.listen(PORT, ()=> console.log(`Server started on PORT ${PORT}`))