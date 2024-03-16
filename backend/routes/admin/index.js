const express = require('express');
const { verifyUser, checkAdmin } = require('../../middlewares/auth.middleware');
const adminController = require('../../controllers/admin.controller');
const router = express.Router();

router.get('/products', [verifyUser, checkAdmin], adminController.products);
router.get('/product/:id', [verifyUser, checkAdmin], adminController.product);
router.put('/addtofeatured/:id', [verifyUser, checkAdmin], adminController.addToFeatured);
router.put('/removefromfeatured/:id', [verifyUser, checkAdmin], adminController.removeFromFeatured);
router.post('/addproduct', [verifyUser, checkAdmin], adminController.addProduct);
router.put('/updateproduct/:id', [verifyUser, checkAdmin], adminController.updateProduct);
router.delete('/deleteproduct/:id', [verifyUser, checkAdmin], adminController.deleteProduct);

router.get("/contact", [verifyUser, checkAdmin], adminController.contacts);
router.delete("/deletecontact/:id", [verifyUser, checkAdmin], adminController.deleteContacts);

router.get('/categories', [verifyUser, checkAdmin], adminController.categories);
router.post('/addcategory', [verifyUser, checkAdmin], adminController.addCategory);
router.put('/updatecategory/:id', [verifyUser, checkAdmin], adminController.updateCategory);
router.delete('/deletecategory/:id', [verifyUser, checkAdmin], adminController.deleteCategory);

router.get('/users', [verifyUser, checkAdmin], adminController.users);
router.get('/user/:id', [verifyUser, checkAdmin], adminController.user);
router.delete('/deleteuser/:id', [verifyUser, checkAdmin], adminController.deleteUser);

router.get('/orders', [verifyUser, checkAdmin], adminController.orders);
router.get('/orders/tendays', [verifyUser, checkAdmin], adminController.ordersTenDays);
router.get('/orders/month', [verifyUser, checkAdmin], adminController.ordersMonth);
router.put('/completeorder/:id', [verifyUser, checkAdmin], adminController.completeOrder);
router.get('/orderspending', [verifyUser, checkAdmin], adminController.ordersPending);
router.get('/orderscompleted', [verifyUser, checkAdmin], adminController.ordersCompleted);
router.get('/order/:id', [verifyUser, checkAdmin], adminController.order);
router.delete('/deleteorder/:id', [verifyUser, checkAdmin], adminController.deleteOrder);
router.get('/orders/count', [verifyUser, checkAdmin], adminController.totalOrders);
router.get('/orders/monthlyorders', [verifyUser, checkAdmin], adminController.monthlyOrders);
router.get('/orders/earnings', [verifyUser, checkAdmin], adminController.totalEarnings);

module.exports = router;
