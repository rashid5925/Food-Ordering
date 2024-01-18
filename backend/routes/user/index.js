const express = require('express');
const userController = require("../../controllers/user.controller");
const { verifyUser } = require("../../middlewares/auth.middleware");
const router = express.Router();

router.get("/products", userController.products);
router.get("/product/:id", userController.product);
router.get("/product/search/:query", userController.searchProduct);

router.put("/update", verifyUser, userController.update);
router.get("/user", verifyUser, userController.getUser);

router.post('/placeorder', verifyUser, userController.placeOrder)
router.get('/orders', verifyUser, userController.orders);
router.get('/orderspending', verifyUser, userController.ordersPending);
router.get('/orderscompleted', verifyUser, userController.ordersCompleted);
router.get('/order/:id', verifyUser, userController.order);
router.delete('/deleteorder/:id', verifyUser, userController.deleteOrder);

router.put('/addtocart/:id', verifyUser, userController.addToCart);
router.put('/removefromcart/:id', verifyUser, userController.removeFromCart);

router.put('/addtowishlist/:id', verifyUser, userController.addToWishlist);
router.put('/removefromwishlist/:id', verifyUser, userController.removeFromWishlist);

module.exports = router;
