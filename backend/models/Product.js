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
    decription: {
        type: String,
        required: true
    },
    category: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
        required: true
    },
    rating: {
        type: [{
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            },
            value: {
                type: Number,
                required: true
            }
        }]
    },
    featured: {
        type: Boolean,
        default: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
