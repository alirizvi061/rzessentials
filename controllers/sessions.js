const express = require('express');
const sessions = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js')

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', { currentUser: req.session.currentUser })
  })
  
  // log in submit on session form
  sessions.post('/', (req, res) => {
  
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      // show error if occurs
      if (err) {
        console.log(err)
        res.send('oops the db had a problem')
      } else if (!foundUser) {
        // if user not found show this
        res.send('<a  href="/">Sorry, no user found </a>')
      } else {
        
        // check if the passwords match
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
          req.session.currentUser = foundUser
          // redirect back to our home page
          res.redirect('/product')
        } else {
          // password doesn't match
          res.send('<a href="/"> password does not match </a>')
        }
      }
    })
  })
  
  sessions.delete('/delete', (req, res) => {
      console.log('HI')
    req.session.destroy(() => {
      res.redirect('/')
    })
  })

module.exports = sessions;


//refferred to class notes for concept//