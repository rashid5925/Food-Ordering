const User = require("../models/User");
const Product = require('../models/Product');
const Order = require('../models/Order');
const { use } = require("passport");
const { calculateTotal } = require("../utils/calc");

const products = (req, res, next) => {
	Product.find({})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const product = (req, res, next) => {
	Product.findOne({_id: req.params.id})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const searchProduct = (req, res, next) => {
	Product.find({title: {$regex: '.*'+req.params.query+'.*'}})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const update = (req, res, next) => {
	User.findOneAndUpdate({ _id: req.user._id }, { name: req.body.name, phone: req.body.phone })
	.exec()
	.then((user) => res.json(user))
	.catch((err) => res.json(err));
}

const getUser = (req, res, next) => {
	User.findOne({ _id: req.user._id })
	.populate('cart.product')
	.populate('wishlist.product')
	.exec()
	.then((user) => res.json(user))
	.catch((err) => res.json(err));
}

const placeOrder = (req, res, next) => {
	const user = User.findById(req.user._id).populate('cart.product');
	Order.create({
		user: user._id,
		products: user.cart,
		total: calculateTotal(user.cart),
		delivered: false,
		orderDate: new Date()
	})
	.exec()
	.then((data) => {
		user.cart = [];
		user.save();
		res.json({ success: true, order: savedOrder });
	})
	.catch((err) => res.json(err));
}

const orders = (req, res, next) => {
	Order.find({ user: req.user._id })
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const ordersPending = (req, res, next) => {
	Order.find({ $and: [{ user: req.user._id }, { delivered: false }] })
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const ordersCompleted = (req, res, next) => {
	Order.find({ $and: [{ user: req.user._id }, { delivered: true }] })
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const order = (req, res, next) => {
	Order.findOne({ _id: req.params.id })
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const deleteOrder = (req, res, next) => {
	Order.findOneAndDelete({ _id: req.params.id })
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const addToCart = (req, res, next) => {
	User.findOneAndUpdate(
	{
		_id: req.user._id
	},
	{
		$push: {
			cart: {
				product: req.params.id,
				amount: 1
			}
		}
	})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const removeFromCart = (req, res, next) => {
	User.findOneAndUpdate(
	{
		_id: req.user._id
	},
	{
		$pull: {
			cart: {
				product: req.params.id
			}
		}
	})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const addToWishlist = (req, res, next) => {
	User.findOneAndUpdate(
	{
		_id: req.user._id
	},
	{
		$push: {
			wishlist: {
				product: req.params.id
			}
		}
	})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const removeFromWishlist = (req, res, next) => {
	User.findOneAndUpdate(
	{
		_id: req.user._id
	},
	{
		$pull: {
			wishlist: {
				product: req.params.id
			}
		}
	})
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}


module.exports = {
	products,
	product,
	searchProduct,
	update,
	getUser,
	placeOrder,
	orders,
	ordersPending,
	ordersCompleted,
	order,
	deleteOrder,
	addToCart,
	removeFromCart,
	addToWishlist,
	removeFromWishlist
};
