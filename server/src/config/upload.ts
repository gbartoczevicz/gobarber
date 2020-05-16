import multer from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpDir,
  uploadsDir: path.resolve(tmpDir, 'uploads'),

  storage: multer.diskStorage({
    destination: tmpDir,
    filename: (req, file, cb) => {
      const hash = crypto.randomBytes(10).toString('HEX');

      const fileName = `${hash}-${file.originalname}`;

      return cb(null, fileName);
    },
  }),
};
