import fs from 'fs';
import path from 'path';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import uploadConfig from '@config/upload';

class DiskStorageProvider implements IStorageProvider {
  public async save(file: string): Promise<string> {
    const { tmpDir, uploadsDir } = uploadConfig;

    await fs.promises.rename(
      path.resolve(tmpDir, file),
      path.resolve(uploadsDir, file),
    );

    return file;
  }

  public async delete(file: string): Promise<void> {
    const { uploadsDir } = uploadConfig;

    const filePath = path.resolve(uploadsDir, file);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

export default DiskStorageProvider;
