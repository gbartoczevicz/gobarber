import multer, { StorageEngine } from 'multer';
import crypto from 'crypto';
import path from 'path';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk' | 's3';
  tmpDir: string;
  uploadsDir: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

const uploadConfig = {
  driver: process.env.STORAGE_DRIVER,

  tmpDir,
  uploadsDir: path.resolve(tmpDir, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpDir,
      filename: (req, file, cb) => {
        const hash = crypto.randomBytes(10).toString('HEX');

        const fileName = `${hash}-${file.originalname}`;

        return cb(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: process.env.AWS_BUCKET,
    },
  },
} as IUploadConfig;

export default uploadConfig;
