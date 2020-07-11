const express = require('express');
const productRouter = express.Router();
const bcrypt = require('bcrypt');
const Product = require('../models/productSchema.js')


//___________________
// Index
//___________________
productRouter.get('/', (req, res) => {
    Product.find({}, (err, allProducts) => {
        res.render('index.ejs', {
            currentUser: req.session.currentUser,
            product: allProducts,
            defaultImage,
        })
    })
})

//___________________
// Create / New
//___________________
productRouter.get('/new', (req,res) => {
    res.render('new.ejs', {
        currentUser: req.session.currentUser
    })
});

//___________________
// Post New
//___________________
productRouter.post('/', (req, res) => {
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
productRouter.get('/:id/edit', (req, res) => {
    Product.findById(req.params.id, (err, editProduct) => {
        if(err){
            console.log(err)
        }
        console.log(editProduct)
        res.render('edit.ejs', {
            currentUser: req.session.currentUser,
            product: editProduct
        })
        
    })
})

//___________________
//EDIT PUT
//___________________
productRouter.put('/:id', (req, res) => {
    Product.updateOne({_id: req.params.id}, {$set: req.body}, (err, editProduct) => {
        res.redirect('/product/' + req.params.id)
    })
})

//___________________
// Show
//___________________
productRouter.get('/:id', (req, res) => {
    Product.findById(req.params.id, (err, showProduct) => {
        if(err){
            console.log(err)
        }else{
            console.log(showProduct)
        }
        res.render('show.ejs', {
            currentUser: req.session.currentUser,
            product: showProduct,
        })
    })
});

//___________________
//Delete
//___________________
productRouter.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, deleteProduct) => {
        res.redirect('/product')
    })
});

//___________________
//BUY
//___________________
productRouter.put('/update/:id', (req, res) => {
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

module.exports = productRouter;