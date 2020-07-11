const express = require('express');
const sessions = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js')

sessions.get('/new', (req, res) => {
    res.render('sessions/new.ejs', { currentUser: req.session.currentUser })
  })
  
  // on sessions form submit (log in)
  sessions.post('/', (req, res) => {
  
    User.findOne({ username: req.body.username }, (err, foundUser) => {
      // Database error
      if (err) {
        console.log(err)
        res.send('oops the db had a problem')
      } else if (!foundUser) {
        // if found user is undefined/null not found etc
        res.send('<a  href="/">Sorry, no user found </a>')
      } else {
        // user is found yay!
        // now let's check if passwords match
        if (bcrypt.compareSync(req.body.password, foundUser.password)) {
          // add the user to our session
          req.session.currentUser = foundUser
          // redirect back to our home page
          res.redirect('/product')
        } else {
          // passwords do not match
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
