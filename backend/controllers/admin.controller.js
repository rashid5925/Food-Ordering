const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Category = require("../models/Category");
const cloudinary = require("../utils/cloudinary");
const Contact = require("../models/Contact");

const products = (req, res, next) => {
  Product.find({})
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

const addProduct = async (req, res, next) => {
  try {
    const { title, price, decription, category, image } = req.body;
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    Product.create({
      title,
      price,
      decription,
      category,
      image: result.secure_url,
      image_id: result.public_id,
    })
      .then((data) => res.json(data))
      .catch((err) => res.json(err));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProduct = async (req, res, next) => {
  const { title, price, decription, category, image } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    const image_id = product.image_id;
    await cloudinary.uploader.destroy(image_id);
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    await Product.findOneAndUpdate({ _id: req.params.id }, {
        title,
        price,
        decription,
        category,
        image: result.secure_url,
        image_id: result.public_id,
    });
    res.status(200).json({
      success: true,
      message: "Product updated successfully"
    })
  } catch (error) {
    res.json(error)
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    const image_id = product.image_id;
    await cloudinary.uploader.destroy(image_id);
    await Product.findOneAndDelete({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })
  } catch (error) {
    res.json(error);
  }
};

const addToFeatured = (req, res, next) => {
  Product.findOneAndUpdate({ _id: req.params.id }, { featured: true })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const removeFromFeatured = (req, res, next) => {
  Product.findOneAndUpdate({ _id: req.params.id }, { featured: false })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const contacts = (req, res, next) => {
  Contact.find({})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const deleteContacts = (req, res, next) => {
  Contact.findOneAndDelete({ _id: req.params.id })
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

const addCategory = (req, res, next) => {
  Category.create(req.body)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const deleteCategory = (req, res, next) => {
  Category.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const updateCategory = (req, res, next) => {
  Category.findOneAndUpdate({ _id: req.params.id }, req.body)
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const users = (req, res, next) => {
  User.find({ admin: false })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const user = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const deleteUser = (req, res, next) => {
  User.findOneAndDelete({ _id: req.params.id })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const orders = (req, res, next) => {
  Order.find({})
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const ordersTenDays = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 9);

    const orders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m", date: "$orderDate" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = orders.map((order) => ({
      time: order._id,
      amount: order.count,
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const ordersMonth = async (req, res, next) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const orders = await Order.aggregate([
      {
        $match: {
          orderDate: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%d-%m", date: "$orderDate" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const data = orders.map((order) => ({
      time: order._id,
      amount: order.count,
    }));

    res.json(data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const completeOrder = (req, res, next) => {
  Order.findOneAndUpdate({ _id: req.params.id }, { delivered: true })
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const ordersPending = (req, res, next) => {
  Order.find({ delivered: false })
    .populate("products.product")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const ordersCompleted = (req, res, next) => {
  Order.find({ delivered: true })
    .populate("products.product")
    .exec()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const order = (req, res, next) => {
  Order.findOne({ _id: req.params.id })
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

const totalOrders = async (req, res, next) => {
  try {
    const count = await Order.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error("Error retrieving count of orders", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const monthlyOrders = async (req, res, next) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  Order.find({
    orderDate: {
      $gte: startOfMonth,
      $lt: endOfMonth,
    },
  })
    .exec()
    .then((data) => res.json({ orders: data.length }))
    .catch((err) => res.json(err));
};

const totalEarnings = (req, res, next) => {
  Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }])
    .exec()
    .then((data) => res.json({ total: data.length > 0 ? data[0].total : 0 }))
    .catch((err) => res.json(err));
};

module.exports = {
  products,
  product,
  addToFeatured,
  removeFromFeatured,
  addProduct,
  deleteProduct,
  updateProduct,
  contacts,
  deleteContacts,
  categories,
  addCategory,
  updateCategory,
  deleteCategory,
  users,
  user,
  deleteUser,
  orders,
  ordersTenDays,
  ordersMonth,
  completeOrder,
  ordersPending,
  ordersCompleted,
  order,
  deleteOrder,
  totalOrders,
  monthlyOrders,
  totalEarnings,
};
