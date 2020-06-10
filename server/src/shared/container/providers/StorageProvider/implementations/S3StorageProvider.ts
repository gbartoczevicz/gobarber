import fs from 'fs';
import path from 'path';
import { S3 } from 'aws-sdk';
import mime from 'mime';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import uploadConfig from '@config/upload';

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
      region: process.env.AWS_DEFAULT_REGION,
    });
  }

  public async save(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpDir, file);

    const fileContent = await fs.promises.readFile(originalPath);

    const contentType = mime.getType(originalPath);

    if (!contentType) {
      throw new Error('File not found');
    }

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async delete(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      })
      .promise();
  }
}

export default S3StorageProvider;
