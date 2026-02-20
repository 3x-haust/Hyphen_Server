import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { writeFile } from 'fs/promises';
import sharp from 'sharp';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  async uploadFile(@UploadedFile() file: MulterFile) {
    const uploadsDir = process.env.UPLOADS_DIR || './uploads';
    if (!existsSync(uploadsDir)) {
      mkdirSync(uploadsDir, { recursive: true });
    }

    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const filename = `${randomName}.webp`;
    const outputPath = join(uploadsDir, filename);

    try {
      const image = sharp(file.buffer);
      const metadata = await image.metadata();
      
      let processedBuffer: Buffer;
      
      if ((metadata.width && metadata.width > 4000) || (metadata.height && metadata.height > 4000)) {
        processedBuffer = await image
          .resize(4000, 4000, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .webp({ quality: 95 })
          .toBuffer();
      } else {
        processedBuffer = await image
          .webp({ quality: 95 })
          .toBuffer();
      }

      await writeFile(outputPath, processedBuffer);

      return {
        url: `/uploads/${filename}`,
        filename: filename,
      };
    } catch {
      throw new Error('Failed to process image');
    }
  }
}
