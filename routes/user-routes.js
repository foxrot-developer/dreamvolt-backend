const express = require('express');
const { check } = require('express-validator');

const userController = require('../controllers/user-controller');

const router = express.Router();

router.post('/register', [
    check('email').isEmail(),
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('role').not().isEmpty().isIn(["STUDENT", "SCHOOL", "MENTOR", "COMPANY", "PARENT"]).withMessage('Invalid role'),
    check('password').not().isEmpty().isLength({ min: 8 }),
], userController.registerUser);

router.post('/login', [
    check('email').isEmail(),
    check('password').not().isEmpty(),
], userController.loginUser);

router.post('/forgot-verify-email', [
    check('email').isEmail()
], userController.forgotVerifyEmail);

router.patch('/reset-password', [
    check('email').isEmail(),
    check('password').not().isEmpty().isLength({ min: 8 })
], userController.resetPassword);

module.exports = router;