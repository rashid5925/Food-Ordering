const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { use } = require("passport");
const { calculateTotal } = require("../utils/calc");
const Category = require("../models/Category");
const Contact = require("../models/Contact");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const products = (req, res, next) => {
  Product.find({})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const productsSorted = (req, res, next) => {
  const sortDirection = req.params.sort == -1 ? "desc" : "asc";
  Product.find({})
    .sort({ [req.params.by]: sortDirection })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const productsFilter = (req, res, next) => {
  const categoryFilter =
    req.params.category === "*" ? {} : { category: req.params.category };
  Product.find(categoryFilter)
    .where("price")
    .gte(req.params.min)
    .lte(req.params.max)
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const categories = (req, res, next) => {
  Category.find({})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const featuredProducts = (req, res, next) => {
  Product.find({ featured: true })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const product = (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const searchProduct = (req, res, next) => {
  Product.find({
    $or: [
      {title: { $regex: new RegExp(".*" + req.params.query + ".*", "i") }},
      {category: { $regex: new RegExp(".*" + req.params.query + ".*", "i") }},
    ]
  })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const contact = (req, res, next) => {
  Contact.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
}

const update = (req, res, next) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, phone: req.body.phone }
  )
    .exec()
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

const getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .populate("cart.product")
    .populate("wishlist.product")
    .exec()
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

const stripeCheckout = (req, res, next) => {
  User.findById(req.user._id)
    .populate("cart.product")
    .exec()
    .then(async (user) => {
      const lineItems = user.cart.map((product) => ({
        price_data: {
          currency: "pkr",
          product_data: {
            name: product.product.title,
            images: [product.product.image],
          },
          unit_amount: product.product.price * 100,
        },
        quantity: product.amount,
      }));
      user.payment = true;
      user.save();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/cancel",
      });
      res.json({
        id: session.id,
      });
    });
};

const cancelOrder = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.user._id }, { payment: false })
    .exec()
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
};

const placeOrder = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("cart.product")
      .exec();
    if (user.payment) {
      const savedOrder = await Order.create({
        user: user._id,
        products: user.cart,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        total: calculateTotal(user.cart),
        delivered: false,
        rated: false,
        orderDate: new Date(),
      });
      user.cart = [];
      user.payment = false;
      await user.save();
      res.json({ success: true, order: savedOrder });
    } else {
      res.json({ success: false, order: "Cannot create order" });
    }
  } catch (error) {
    res.json(error);
  }
};

const orders = (req, res, next) => {
  Order.find({ user: req.user._id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const ordersPending = (req, res, next) => {
  Order.find({ $and: [{ user: req.user._id }, { delivered: false }] })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const ordersCompleted = (req, res, next) => {
  Order.find({ $and: [{ user: req.user._id }, { delivered: true }] })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const order = (req, res, next) => {
  Order.findOne({ _id: req.params.id })
    .populate("products.product")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const deleteOrder = (req, res, next) => {
  Order.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const checkRated = (req, res, next) => {
  const userId = req.user._id;
  Order.find({ user: userId })
    .then((orders) => {
      if (!orders || orders.length === 0) {
        return res.status(404).json({ error: "No orders found for the user." });
      }
      const rated = orders.some((order) => !order.rated && order.delivered);

      res.json({ rated });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ error: "Failed to check if any order has been rated." });
    });
};

const cancelRating = (req, res, next) => {
  Order.updateMany({ user: req.user._id }, { rated: true })
    .exec()
    .then((orders) => res.json(orders))
    .catch((err) => res.json(err));
};

const rate = (req, res, next) => {
  const productIds = req.body.ratings.map((item) => item.id);
  const ratings = req.body.ratings.reduce((acc, item) => {
    acc[item.id] = item.rating;
    return acc;
  }, {});
  Order.findOneAndUpdate({ _id: req.params.id }, { rated: true })
    .exec()
    .then((orders) => {
      Product.find({ _id: { $in: productIds } })
        .exec()
        .then((products) => {
          products.map((product) => {
            product.rating.push({
              user: req.user._id,
              value: ratings[product._id],
            });
            product.save();
          });
          res.json({ success: true, message: "Rated successfully" });
        })
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
};

const addToCart = (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;
  const amount = req.params.amount ? req.params.amount : 1;
  User.findOne({ _id: userId, "cart.product": productId })
    .then((user) => {
      if (user) {
        return User.findOneAndUpdate(
          { _id: userId, "cart.product": productId },
          { $inc: { "cart.$.amount": amount } }
        );
      } else {
        return User.findOneAndUpdate(
          { _id: userId },
          {
            $push: {
              cart: {
                product: productId,
                amount: amount,
              },
            },
          }
        );
      }
    })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const decreaseAmountCart = (req, res, next) => {
  const userId = req.user._id;
  const productId = req.params.id;
  User.findOne({ _id: userId, "cart.product": productId })
    .then((user) => {
      if (user) {
        return User.findOneAndUpdate(
          { _id: userId, "cart.product": productId },
          { $inc: { "cart.$.amount": -1 } }
        );
      }
    })
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const removeFromCart = (req, res, next) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $pull: {
        cart: {
          product: req.params.id,
        },
      },
    }
  )
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const addToWishlist = (req, res, next) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $push: {
        wishlist: {
          product: req.params.id,
        },
      },
    }
  )
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const removeFromWishlist = (req, res, next) => {
  User.findOneAndUpdate(
    {
      _id: req.user._id,
    },
    {
      $pull: {
        wishlist: {
          product: req.params.id,
        },
      },
    }
  )
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

module.exports = {
  products,
  productsSorted,
  productsFilter,
  featuredProducts,
  product,
  searchProduct,
  contact,
  categories,
  update,
  getUser,
  stripeCheckout,
  cancelOrder,
  placeOrder,
  orders,
  ordersPending,
  ordersCompleted,
  order,
  deleteOrder,
  checkRated,
  cancelRating,
  rate,
  addToCart,
  decreaseAmountCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
};
