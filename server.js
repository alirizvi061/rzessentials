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
const defaultImage = 'https://pflugerville-vortexsportscenter.com/wp-content/uploads/2017/04/default-image-800x600.jpg';

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
const userController = require('./controller/user.js');
app.use('/users', userController);

//___________________
// Routes
//___________________
// localhost:3000
// app.get('/' , (req, res) => {
//     res.send('Hello World!');
// });

//login
app.get('/any', (req, res) => {
    //any route will work
    req.session.anyProperty = 'any value'
  })

//___________________
// Index
//___________________
app.get('/product', (req, res) => {
    Product.find({}, (err, allProducts) => {
        res.render('index.ejs', {
            product: allProducts,
            defaultImage,
        })
    })
})

//___________________
// Create / New
//___________________
app.get('/product/new', (req,res) => {
    res.render('new.ejs')
});

//___________________
// Post New
//___________________
app.post('/product', (req, res) => {
    Product.create(req.body, (err, newProduct) => {
        if (err) {
            console.log(err)
        }else {
            console.log(newProduct)
        }
        res.redirect('/product')
    })
});

// //___________________
// // Edit
// //___________________
app.get('/product/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, editProduct) => {
        if(err){
            console.log(err)
        }
        console.log(editProduct)
        res.render('edit.ejs', {
            product: editProduct
        })
        
    })
})

//___________________
//EDIT PUT
//___________________
app.put('/product/:id', (req, res) => {
    Product.updateOne({_id: req.params.id}, {$set: req.body}, (err, editProduct) => {
        res.redirect('/product/' + req.params.id)
    })
})

//___________________
// Show
//___________________
app.get('/product/:id', (req, res) => {
    Product.findById(req.params.id, (err, showProduct) => {
        if(err){
            console.log(err)
        }else{
            console.log(showProduct)
        }
        res.render('show.ejs', {
            product: showProduct,
        })
    })
});

//___________________
//Delete
//___________________
app.delete('/product/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, deleteProduct) => {
        res.redirect('/product')
    })
});

//___________________
//BUY
//___________________
app.put('/product/update/:id', (req, res) => {
    // res.send('Product bought!')
    Product.findByIdAndUpdate(req.params.id, {$inc: {quantity: -1}}, (err, buyProduct) => {
        if(err){
            console.log(err)
        }else{
            console.log(buyProduct)
        }
        res.redirect('/product')
    })
})

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));