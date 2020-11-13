const express= require('express')
const { restart } = require('nodemon')
const bcrypt= require('bcryptjs')
const router= express.Router()
const passport= require('passport')


// User model

const User= require('../models/User')

router.get('/login', (req, res)=>{
    res.render('login')
})

router.get('/register', (req, res)=>{
    res.render('register')
})

// Register handle
router.post('/register', (req, res)=>{
    const {name, email, password, password2} = req.body
    let errors= []

    //!Check required field
    if (!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'})
    }

    if(password !== password2){
        errors.push({msg: 'Passwords do not match'})
    }

    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters'})
    }

    if(errors.length >0){
        res.render('register', {
            errors,
            name,
            email,
            password, 
            password2
        })
    } else {
        // * Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                //User exist
                errors.push({msg: 'Email is already in use'})
                res.render('register',{
                    errors, 
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser= new User({
                    name,
                    email, 
                    password
                })

                console.log(newUser)

                //HASH  Password
                bcrypt.genSalt(10, (error, salt)=>{
                    bcrypt.hash(newUser.password, salt, (err, hash)=>{
                        if(err) throw err
                        //Set password to hash
                        newUser.password=hash
                        //Save the user
                        console.log('before save')
                        
                        newUser.save(function(err, doc) {
                            if (err) return console.error(err);
                            console.log("Document inserted succussfully!");
                            req.flash('success_msg', 'You are now registerd and can login')
                            res.redirect('/users/login')
                          });
                    })
                })
            }
        })
        .catch(err => console.log(err))
        
    }

    
})

//Login handle

router.post('/login', (req, res, next)=>{
    passport.authenticate('local' , {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    }) (req, res, next)
})

// * Logout handle 

router.get('/logout', (req, res)=>{
    req.logout()

    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
})



module.exports= router