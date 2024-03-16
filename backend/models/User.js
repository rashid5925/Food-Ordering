const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String
    },
    cart: {
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
    wishlist: {
        type: [{
            product: {
                type: mongoose.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }]
    },
    payment: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            admin: this.admin
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

const User = mongoose.model('User', userSchema);

module.exports = User;
