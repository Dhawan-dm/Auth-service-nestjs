import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import {
  PutObjectOutput,
  PutObjectRequest,
} from 'aws-sdk/clients/s3';
import { Readable } from 'typeorm/platform/PlatformTools';

@Injectable()
export class S3Service {
  
  private s3: S3;

  constructor() {
    this.s3 = new S3();
  }

  async uploadFileToS3(
    fileBuffer: Buffer,
    filename: string,
  ): Promise<PutObjectOutput> {
    const params: PutObjectRequest = {
      Bucket: 'mybebucket',
      Key: filename,
      Body: fileBuffer,
    };

    return this.s3.upload(params).promise();
  }

  getPublicUrl(key: string) {
    return `https://mybebucket.s3.amazonaws.com/${key}`;
  }
}
