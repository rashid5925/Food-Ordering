const express = require('express');
const userController = require("../../controllers/user.controller");
const { verifyUser } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/products", userController.products);
router.get("/productssorted/:by/:sort", userController.productsSorted);
router.get("/productsfilter/:category/:min/:max", userController.productsFilter);
router.get("/featuredproducts", userController.featuredProducts);
router.get("/product/:id", userController.product);
router.get("/product/search/:query", userController.searchProduct);

router.post("/contact", userController.contact);

router.get("/categories", userController.categories);

router.put("/update", verifyUser, userController.update);
router.get("/user", verifyUser, userController.getUser);

router.post('/stripecheckout', verifyUser, userController.stripeCheckout)
router.put('/cancelOrder', verifyUser, userController.cancelOrder)
router.post('/placeorder', verifyUser, userController.placeOrder)
router.get('/orders', verifyUser, userController.orders);
router.get('/orderspending', verifyUser, userController.ordersPending);
router.get('/orderscompleted', verifyUser, userController.ordersCompleted);
router.get('/order/:id', verifyUser, userController.order);
router.delete('/deleteorder/:id', verifyUser, userController.deleteOrder);
router.get('/checkrated', verifyUser, userController.checkRated);
router.put('/cancelrating', verifyUser, userController.cancelRating);
router.put('/rate/:id', verifyUser, userController.rate);

router.put('/addtocart/:id/:amount?', verifyUser, userController.addToCart);
router.put('/decreaseamountcart/:id', verifyUser, userController.decreaseAmountCart);
router.put('/removefromcart/:id', verifyUser, userController.removeFromCart);

router.put('/addtowishlist/:id', verifyUser, userController.addToWishlist);
router.put('/removefromwishlist/:id', verifyUser, userController.removeFromWishlist);

module.exports = router;
