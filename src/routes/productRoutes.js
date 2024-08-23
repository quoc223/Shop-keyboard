const express = require('express');
const router = express.Router();
const upload = require('../middleware/mullersetup');
const productController = require('../controllers/productController');
const { authenticateAdminToken } = require('../middleware/auth');


router.get('/product', productController.getAllProducts);
router.get('/products/search', productController.searchProducts);
router.get('/products/category/:categoryId', productController.getProductsByCategory);
router.get('/product/:id', productController.getProductById);
router.put('/product/update/:productId', authenticateAdminToken, productController.updateProductsById);
router.delete('/product/delete/:productId', authenticateAdminToken, productController.deleteProductById);
router.post('/newproduct', authenticateAdminToken, productController.createProduct);
router.post('/upload-image', upload.single('image'), productController.uploadImage);
module.exports = router;