import { UploadedFile } from 'express-fileupload';

export interface FileRepository {
  uploadSingle(
    file: UploadedFile,
    fileName: string,
    folder: string,
    validateExtensions: string[]
  ): Promise<{ fileName: string }>;
  uploadMultiple(file: UploadedFile[], folder: string, validateExtensions: string[]): Promise<{ fileName: string }[]>;
  deleteFile(filePath: string): Promise<void>;
}
