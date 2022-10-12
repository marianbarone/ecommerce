import multer from 'multer'
import __dirname from '../utils/utils';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + "/public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },
})

export const upload = multer({ storage })
