const express = require('express');
const { verifyUser, checkAdmin } = require('../../middlewares/auth.middleware');
const adminController = require('../../controllers/admin.controller');
const router = express.Router();

router.get('/products', [verifyUser, checkAdmin], adminController.products);
router.get('/product/:id', [verifyUser, checkAdmin], adminController.product);
router.post('/addproduct', [verifyUser, checkAdmin], adminController.addProduct);
router.put('/updateproduct/:id', [verifyUser, checkAdmin], adminController.updateProduct);
router.delete('/deleteproduct/:id', [verifyUser, checkAdmin], adminController.deleteProduct);

router.get('/users', [verifyUser, checkAdmin], adminController.users);
router.get('/user/:id', [verifyUser, checkAdmin], adminController.user);
router.delete('/deleteuser/:id', [verifyUser, checkAdmin], adminController.deleteUser);

router.get('/orders', [verifyUser, checkAdmin], adminController.orders);
router.put('/completeorder/:id', [verifyUser, checkAdmin], adminController.completeOrder);
router.get('/orderspending', [verifyUser, checkAdmin], adminController.ordersPending);
router.get('/orderscompleted', [verifyUser, checkAdmin], adminController.ordersCompleted);
router.get('/order/:id', [verifyUser, checkAdmin], adminController.order);
router.delete('/deleteorder/:id', [verifyUser, checkAdmin], adminController.deleteOrder);

module.exports = router;
