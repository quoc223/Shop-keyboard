const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateAdminToken,authenticateToken } = require('../middleware/auth');

router.get('/user', authenticateAdminToken, userController.getAllUsers);
router.get('/get-user-purchase-change', authenticateAdminToken, userController.getUserPurchaseChange);
router.get('/profile',authenticateToken ,userController.getProfile);
router.put('/updateprofilebycus',authenticateToken ,userController.updateProfileBycus);
router.put('/updateprofilebyid/:id',authenticateToken ,userController.updateProfileByid);
router.put('/changepassword',authenticateToken ,userController.changepassword);
router.put('/changeaddress',authenticateToken ,userController.changeaddress);
router.delete('/user/delete/:id',authenticateAdminToken ,userController.deleteUser);
router.post('/user/add/:id',authenticateAdminToken ,userController.addUser);

module.exports = router;