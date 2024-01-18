const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    decription: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    image: {
        type: String,
    },
    images: {
        type: [{
            type: String
        }]   
    },
    rating: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        value: {
            type: Number,
            required: true
        }
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
