const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateAdminToken } = require('../middleware/auth');


router.post('/login', dashboardController.login);
router.get('/sales-data', dashboardController.getSalesData);
router.get('/protected',authenticateAdminToken, dashboardController.protected);

module.exports = router;