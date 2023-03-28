const express = require('express');
const { check } = require('express-validator');

const dreamController = require('../controllers/dream-controller');

const fileUpload = require('../middlewares/file-upload');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/create-dream', auth, fileUpload.single('media'), [
    check('userId').not().isEmpty(),
    check('details').not().isEmpty(),
    check('private').isBoolean().not().isEmpty(),
], dreamController.createDream);

router.post('/add-comment', auth, [
    check('userId').not().isEmpty(),
    check('dreamId').not().isEmpty(),
    check('comment').not().isEmpty(),
], dreamController.addComment);

router.post('/add-like', auth, [
    check('userId').not().isEmpty(),
    check('dreamId').not().isEmpty(),
], dreamController.addLike);

router.get('/user-dreams/:id', auth, dreamController.getUserDreams);

router.get('/dream/:id', auth, dreamController.dreamById);

router.delete('/dream/:id', auth, dreamController.deleteDream);

module.exports = router;