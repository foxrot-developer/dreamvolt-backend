const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const HttpError = require('../helpers/http-error');
const User = require('../models/user');

const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, firstName, lastName, password, role } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        console.log(error);
        return next(new HttpError('Error fetching data from database', 500));
    }

    if (existingUser) {
        return next(new HttpError('Email already registered! Try different email', 422))
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('Password hashing failed. Try again', 500));
    }

    const newUser = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role
    });

    try {
        await newUser.save();
    } catch (error) {
        console.log(error);
        return next(new HttpError('Error saving user to database', 500))
    }

    res.status(201).json({ message: "User registered successfully" });
};

const loginUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        console.log(error);
        return next(new HttpError('Error fetching data from database', 500));
    }

    if (!existingUser) {
        return next(new HttpError('No user found against entered email', 404));
    }

    let validPassword;
    try {
        validPassword = await bcrypt.compare(password, existingUser.password)
    } catch (error) {
        console.log(error);
        return next(new HttpError('Password hashing error', 500))
    }

    if (!validPassword) {
        return next(new HttpError('Incorrect password', 401));
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email },
            'DREAMVOLT?132',
            { expiresIn: '24h' });
    } catch (err) {
        console.log({ err });
        return next(new HttpError('Login failed', 500));
    }

    res.json({ id: existingUser.id, email: existingUser.email, firstName: existingUser.firstName, lastName: existingUser.lastName, role: existingUser.role, token });
};

const forgotVerifyEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email } = req.body;

    let existingEmail;
    try {
        existingEmail = await User.findOne({ email: email });
    }
    catch (error) {
        console.log({ error });
        return next(new HttpError('Error fetching data', 500));
    };

    if (!existingEmail) {
        return next(new HttpError('No email found', 404));
    }

    res.json({ message: 'Email found successfully' });
};

const resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (error) {
        console.log({ error });
        return next(new HttpError('Error fetching data', 500));
    };

    if (!existingUser) {
        return next(new HttpError('No email found', 404));
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (error) {
        return next(new HttpError('Password hashing failed. Try again', 500));
    }

    existingUser.password = hashedPassword;
    try {
        await existingUser.save();
    } catch (error) {
        console.log({ error });
        return next(new HttpError('Error updating password', 500));
    };

    res.json({ message: "Password reset successful!" });

};

exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.forgotVerifyEmail = forgotVerifyEmail;
exports.resetPassword = resetPassword;