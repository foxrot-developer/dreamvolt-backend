const { validationResult } = require('express-validator');

const HttpError = require('../helpers/http-error');
const Dream = require('../models/dream');

const createDream = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, details, private } = req.body;

    const newDream = new Dream({
        user: userId,
        media: req.file.path,
        details: details,
        private: private
    });

    try {
        await newDream.save();
    } catch (error) {
        return next(new HttpError('Error creating new dream', 500));
    };

    res.status(201).json({ message: 'Dream created successfully' });
};

const addComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, dreamId, comment } = req.body;

    let existingDream;
    try {
        existingDream = await Dream.findById(dreamId);
    } catch (error) {
        return next(new HttpError('Error finding dream', 500));
    };

    if (!existingDream) {
        return next(new HttpError('No dream found', 404));
    };

    existingDream.comments.push({
        userId: userId,
        comment: comment
    });

    try {
        await existingDream.save();
    } catch (error) {
        return next(new HttpError("Error adding new comment", 500));
    };

    res.status(201).json({ message: 'Comment added successfully' });
};

const addLike = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, dreamId } = req.body;

    let existingDream;
    try {
        existingDream = await Dream.findById(dreamId);
    } catch (error) {
        return next(new HttpError('Error finding dream', 500));
    };

    if (!existingDream) {
        return next(new HttpError('No dream found', 404));
    };

    existingDream.likes.push(userId);

    try {
        await existingDream.save();
    } catch (error) {
        return next(new HttpError("Error adding like", 500));
    };

    res.status(201).json({ message: 'Like added successfully' });
};

const getUserDreams = async (req, res, next) => {
    const id = req.params.id;

    let existingUserDreams;
    try {
        existingUserDreams = await Dream.find({ user: id });
    } catch (error) {
        return next(new HttpError('Error finding dreams', 500));
    };

    res.json({ dreams: existingUserDreams });
};

const dreamById = async (req, res, next) => {
    const id = req.params.id;

    let existingDream;
    try {
        existingDream = await Dream.findById(id);
    } catch (error) {
        return next(new HttpError('Error getting dream', 500));
    }

    if (!existingDream) {
        return next(new HttpError('No dream found', 404));
    }

    res.json({ dream: existingDream });
};

const deleteDream = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Dream.findByIdAndRemove(id);
    } catch (error) {
        return next(new HttpError('Error deleting dream', 500));
    }

    res.json({ message: 'Dream deleted successfully' });
};

exports.createDream = createDream;
exports.addComment = addComment;
exports.addLike = addLike;
exports.getUserDreams = getUserDreams;
exports.dreamById = dreamById;
exports.deleteDream = deleteDream;