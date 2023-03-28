const { validationResult } = require('express-validator');

const HttpError = require('../helpers/http-error');
const Post = require('../models/post');
const Report = require('../models/report');

const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, details } = req.body;

    const newPost = new Post({
        user: userId,
        media: req.file.path,
        details: details
    });

    try {
        await newPost.save();
    } catch (error) {
        return next(new HttpError('Error creating new post', 500));
    };

    res.status(201).json({ message: 'Post created successfully' });
};

const addComment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, postId, comment } = req.body;

    let existingPost;
    try {
        existingPost = await Post.findById(postId);
    } catch (error) {
        return next(new HttpError('Error finding post', 500));
    };

    if (!existingPost) {
        return next(new HttpError('No post found', 404));
    };

    existingPost.comments.push({
        userId: userId,
        comment: comment
    });

    try {
        await existingPost.save();
    } catch (error) {
        return next(new HttpError("Error adding new comment", 500));
    };

    res.status(201).json({ message: 'Comment added successfully' });
};

const getUserPosts = async (req, res, next) => {
    const id = req.params.id;

    let existingUserPosts;
    try {
        existingUserPosts = await Post.find({ user: id });
    } catch (error) {
        return next(new HttpError('Error finding posts', 500));
    };

    res.json({ posts: existingUserPosts });
};

const postById = async (req, res, next) => {
    const id = req.params.id;

    let existingPost;
    try {
        existingPost = await Post.findById(id);
    } catch (error) {
        return next(new HttpError('Error getting post', 500));
    }

    res.json({ post: existingPost });
};

const addLike = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, postId } = req.body;

    let existingPost;
    try {
        existingPost = await Post.findById(postId);
    } catch (error) {
        return next(new HttpError('Error finding post', 500));
    };

    if (!existingPost) {
        return next(new HttpError('No post found', 404));
    };

    existingPost.likes.push(userId);

    try {
        await existingPost.save();
    } catch (error) {
        return next(new HttpError("Error adding like", 500));
    };

    res.status(201).json({ message: 'Like added successfully' });
};

const postReport = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid data received', 422));
    }

    const { userId, postId, detail } = req.body;

    let existingPost;
    try {
        existingPost = await Post.findById(postId);
    } catch (error) {
        return next(new HttpError('Error finding post', 500));
    };

    if (!existingPost) {
        return next(new HttpError('No post found', 404));
    };

    const newReport = new Report({
        user: userId,
        post: postId,
        details: detail
    });

    try {
        await newReport.save();
    } catch (error) {
        return next(new HttpError('Error reporting post', 500));
    };

    res.status(201).json({ message: 'Reporting successful' });
};

const deletePost = async (req, res, next) => {
    const id = req.params.id;

    try {
        await Post.findByIdAndRemove(id);
    } catch (error) {
        return next(new HttpError('Error deleting post', 500));
    }

    res.json({ message: 'Post deleted successfully' });
};

exports.createPost = createPost;
exports.addComment = addComment;
exports.getUserPosts = getUserPosts;
exports.postById = postById;
exports.addLike = addLike;
exports.postReport = postReport;
exports.deletePost = deletePost;