import fs from 'fs';
import path from 'path';

import { UploadedFile } from 'express-fileupload';
import { FileRepository } from '../../domain/repositories/file.repository';
import { CustomError } from '../../domain/errors/custom.error';

export class FileRepositoryImpl implements FileRepository {
  constructor() {}

  async deleteFile(filePath: string): Promise<void> {
    try {
      const destination = path.resolve(__dirname, '../../../../../', filePath);
      // const path = `${__dirname}../../../${filePath}`;
      if (fs.existsSync(destination)) {
        fs.unlinkSync(destination); // Elimina el archivo
      }
    } catch (error) {
      throw CustomError.internalServerError(`Failed to delete file: ${error}`);
    }
  }

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  async uploadSingle(
    file: UploadedFile,
    fileName: string,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'pdf', 'jpg', 'jpeg']
  ): Promise<{ fileName: string }> {
    try {
      if (fileName === '') {
        fileName = file.name;
      }

      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      if (!validExtensions.includes(fileExtension)) {
        throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`);
      }

      const destination = path.resolve(__dirname, '../../../../../', folder);
      this.checkFolder(destination);

      file.mv(`${destination}/${fileName}.${fileExtension}`);

      return { fileName: `${fileName}.${fileExtension}` };
    } catch (error) {
      throw CustomError.internalServerError(`File upload error: ${error}`);
    }
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'pdf']
  ): Promise<{ fileName: string }[]> {
    const fileNames = await Promise.all(files.map(file => this.uploadSingle(file, folder, '', validExtensions))); // TODO:: CORREGIR

    return fileNames;
  }
}
