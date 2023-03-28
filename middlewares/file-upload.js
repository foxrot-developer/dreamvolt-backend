const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
    'video/mp4': 'mp4',
    'video/3gp': '3gp',
    'video/mov': 'mov',
    'video/avi': 'avi',
    'video/wmv': 'wmv',
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg'
};

const fileUpload = multer({
    limits: 500000000,
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.mimetype === 'video/mp4' || file.mimetype === 'video/3gp' || file.mimetype === 'video/mov' || file.mimetype === 'video/avi' || file.mimetype === 'video/wmv') {
                cb(null, 'uploads/media');
            } else {
                cb(null, 'uploads/media');
            }

        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype];
            cb(null, uuidv4() + '.' + ext);
        },
        fileFilter: (req, file, cb) => {
            const isValid = !!MIME_TYPE_MAP[file.mimetype];
            console.log(MIME_TYPE_MAP[file.mimetype]);
            cb(error, isValid);
        }
    })
});

module.exports = fileUpload;