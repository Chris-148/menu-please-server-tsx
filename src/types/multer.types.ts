import { Request } from 'express';

export interface MulterRequest extends Request {
  file?: Express.Multer.File & {
    path: string;  // If you need to ensure `path` exists
  };
}


