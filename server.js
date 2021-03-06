//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require ('mongoose');
const app = express();
//requires dotenv configuration
require('dotenv').config()
const session = require('express-session')
const db = mongoose.connection;
const Product = require('./models/productSchema.js')
const User = require('./models/userSchema.js')

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODBURI

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/'+ `rzessentials`;

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true , useUnifiedTopology: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});



//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form

//used for login information setup
app.use(
    session({
      secret: process.env.SECRET, 
      resave: false, 
      saveUninitialized: false 
    })
)

//___________________
// Controller
//___________________
const userController = require('./controllers/user.js');
app.use('/users', userController);

const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)

const productRouter = require('./controllers/product.js')
app.use('/product', productRouter)

app.get('/about', (req, res) => {
    res.render('about.ejs', {
        currentUser: null,
    })
});

app.get('/', (req, res) => {
    res.redirect('/sessions/new')
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));