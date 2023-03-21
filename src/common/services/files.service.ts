/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { bool } from 'aws-sdk/clients/redshiftdata';
import { unlink } from 'fs';

@Injectable()
export class FilesService {
  use_s3: bool = process.env.USE_S3 === 'true';
  s3;
  constructor() {
    if (this.use_s3) {
      console.log('**********using s3 ok');
      const s3_params = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY,
        region: process.env.AWS_REGION,
      };
      this.s3 = new S3({ ...s3_params });
    }
  }

  async removeFile(filePath) {
    if (!this.use_s3) {
      unlink(filePath, (err) => {
        console.log(err);
      });
    } else {
      const awsDeleteParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filePath,
      };
      const run = async () => {
        try {
          this.s3.deleteObject(awsDeleteParams).promise();
          //   deleteObject(awsDeleteParams).promise();
          console.log(`Success deleting from aws`);
        } catch (err) {
          console.log('Error', err);
          throw err;
        }
      };
      run();
    }
  }
}
