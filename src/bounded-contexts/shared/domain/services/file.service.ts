import { UploadedFile } from 'express-fileupload';

export interface FileService {
  uploadSingle(file: UploadedFile, folder: string, validateExtensions: string[]): Promise<{ fileName: string }>;
  uploadMultiple(file: UploadedFile[], folder: string, validateExtensions: string[]): Promise<{ fileName: string }[]>;
}
