const express = require('express');
const { check } = require('express-validator');

const postController = require('../controllers/post-controller');

const fileUpload = require('../middlewares/file-upload');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/create-post', auth, fileUpload.single('media'), [
    check('userId').not().isEmpty(),
    check('details').not().isEmpty(),
], postController.createPost);

router.post('/add-comment', auth, [
    check('userId').not().isEmpty(),
    check('postId').not().isEmpty(),
    check('comment').not().isEmpty(),
], postController.addComment);

router.post('/add-like', auth, [
    check('userId').not().isEmpty(),
    check('postId').not().isEmpty(),
], postController.addLike);

router.post('/post-report', auth, [
    check('userId').not().isEmpty(),
    check('postId').not().isEmpty(),
    check('detail').not().isEmpty(),
], postController.postReport);

router.get('/user-posts/:id', auth, postController.getUserPosts);

router.get('/post/:id', auth, postController.postById);

router.delete('/post/:id', auth, postController.deletePost);

module.exports = router;