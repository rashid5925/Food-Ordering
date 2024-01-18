const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

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

const addProduct = (req, res, next) => {
    Product.create(req.body)
	.exec()
	.then((data) => res.json(data))
	.catch((err) => res.json(err));
}

const deleteProduct = (req, res, next) => {
    Product.findOneAndDelete({_id: req.params.id})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const updateProduct = (req, res, next) => {
    Product.findOneAndUpdate({_id: req.params.id}, req.body)
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const users = (req, res, next) => {
    User.find({admin: false})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const user = (req, res, next) => {
    User.findOne({_id: req.params.id})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const deleteUser = (req, res, next) => {
    User.findOneAndDelete({_id: req.params.id})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const orders = (req, res, next) => {
    Order.find({})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const completeOrder = (req, res, next) => {
    Order.findOneAndUpdate({_id: req.params.id}, {delivered: true})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const ordersPending = (req, res, next) => {
    Order.find({delivered: false})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const ordersCompleted = (req, res, next) => {
    Order.find({delivered: true})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const order = (req, res, next) => {
    Order.findOne({_id: req.params.id})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const deleteOrder = (req, res, next) => {
    Order.findOneAndDelete({_id: req.params.id})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

module.exports = {
    products,
    product,
    addProduct,
    deleteProduct,
    updateProduct,
    users,
    user,
    deleteUser,
    orders,
    completeOrder,
    ordersPending,
    ordersCompleted,
    order,
    deleteOrder
};
