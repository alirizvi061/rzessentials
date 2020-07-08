const mongoose = require ('mongoose');

const productSchema = new mongoose.Schema ({
    name: String,
    description: String,
    price: { type: Number, default: 0},
    quantity: { type: Number, default: 0},
    image: String,
}, {
    timestamps: true,
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;