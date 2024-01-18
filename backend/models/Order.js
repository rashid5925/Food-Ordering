const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: {
        type: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }]
    },
    total: {
        type: Number,
        required: true
    },
    delivered: {
        type: Boolean,
        default: false
    },
    orderDate: {
        type: Date,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
