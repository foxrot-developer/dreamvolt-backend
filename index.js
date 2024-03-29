const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const HttpError = require('./helpers/http-error');
const userRoutes = require('./routes/user-routes');
const postRoutes = require('./routes/post-routes');
const dreamRoutes = require('./routes/dream-routes');

const app = express();

app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
    next();
});

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/dream', dreamRoutes);

app.use((req, res, next) => {
    throw new HttpError('Could not find the route', 404);
})

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => console.log(err));
    }
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured' });
});

mongoose.connect(`mongodb+srv://usama:usama@cluster0.r4fkm.mongodb.net/dreamvolt?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected');
    app.listen(process.env.PORT || 5000);
}).catch(err => {
    console.log(err);
});