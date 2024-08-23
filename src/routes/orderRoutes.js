const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController'); // Đảm bảo đường dẫn chính xác
const { authenticateToken, authenticateAdminToken } = require('../middleware/auth'); // Đảm bảo đường dẫn chính xác

// Các route với middleware và controller
router.get('/order', authenticateAdminToken, orderController.getAllOrders);
router.get('/order/:id', authenticateToken, orderController.getOrderById);
router.get('/orderItems', authenticateAdminToken, orderController.getMostPopularProduct);
router.put('/order/updatestatus/:id', authenticateAdminToken, orderController.orderUpdateStatus);
router.put('/order/update/:id', authenticateAdminToken, orderController.updateOrderDetails);
router.delete('/order/delete/:id', authenticateAdminToken, orderController.deleteOrder);


router.get('/order/Alldata/:orderId',authenticateAdminToken, orderController.getAllDataForOrderById);
router.get('/order/Alldatacust/:orderId',authenticateToken, orderController.getAllDataForOrderById);
router.get('/order/ProductInOrder/:orderId',authenticateAdminToken, orderController.getDetailOrderById);
router.get('/allorder',authenticateAdminToken ,orderController.getAllOrder);
router.get('/order/shipping-addresses',authenticateToken ,orderController.getSavedAddresses);

router.get('/cart/count', authenticateToken, orderController.getcartcount);
router.get('/orderhistory', authenticateToken, orderController.getOrderByUserId);

router.get('/cart', authenticateToken, orderController.getCart);
router.post('/addtocart', authenticateToken, orderController.addToCart);
router.put('/updatecartitem/:id', authenticateToken, orderController.updateCartItem);
router.delete('/deletecartitem/:id', authenticateToken, orderController.deleteCartItem);
router.post('/sync-cart', authenticateToken, orderController.syncCart);

// Checkout route
router.post('/checkout', authenticateToken, orderController.checkout);

// router.post('/create_payment_url', authenticateToken, orderController.vpay);
// router.post('/vnpay_ipn',authenticateToken, orderController.NhanKetQua);
// router.post('/vnpay_return',authenticateToken, orderController.vnpayreturn);

// Address routes
router.get('/shipping-addresses', authenticateToken, orderController.getSavedAddresses);
module.exports = router;
