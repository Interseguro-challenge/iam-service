import { UploadedFile } from 'express-fileupload';
import { FileService } from '../domain/services/file.service';
import { FileRepository } from '../domain/repositories/file.repository';

export class FileServiceImpl implements FileService {
  constructor(private readonly fileRepository: FileRepository) {}

  async uploadSingle(
    file: UploadedFile,
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'pdf', 'jpg', 'jpeg']
  ): Promise<{ fileName: string }> {
    return await this.fileRepository.uploadSingle(file, '', folder, validExtensions);
  }

  async uploadMultiple(
    files: UploadedFile[],
    folder: string = 'uploads',
    validExtensions: string[] = ['png', 'jpg', 'jpeg', 'pdf']
  ): Promise<{ fileName: string }[]> {
    return await this.fileRepository.uploadMultiple(files, folder, validExtensions);
  }
}
