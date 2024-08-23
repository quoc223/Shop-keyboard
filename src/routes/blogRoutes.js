const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticateToken, authenticateAdminToken } = require('../middleware/auth');

router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id', blogController.getBlogById);
router.post('/blogs',authenticateAdminToken, blogController.createBlog);
router.put('/blogs/:id',authenticateAdminToken, blogController.updateBlog);
router.delete('/blogs/:id',authenticateAdminToken, blogController.deleteBlog);

module.exports = router;
