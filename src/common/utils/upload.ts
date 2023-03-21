import { NotFoundException } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';
// import { PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const use_s3 = process.env.USE_S3 === 'true';
let s3;
if (use_s3) {
  const s3_params = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
    region: process.env.AWS_REGION,
  };
  s3 = new S3({ ...s3_params });
}

export const uploadFileStream = async (readStream, uploadDir, filename) => {
  const fileName = filename;
  const filePath = join(uploadDir, fileName);
  // await mkdir(uploadDir, { recursive: true }, (err) => {
  //   if (err) throw err;
  // });
  mkdirSync(uploadDir, { recursive: true });
  const inStream = readStream();
  if (!use_s3) {
    const outStream = createWriteStream(filePath);
    inStream.pipe(outStream);
    await finished(outStream)
      .then(() => {
        console.log('file uploaded');
      })
      .catch((err) => {
        console.log(err.message);
        throw new NotFoundException(err.message);
      });
  } else {
    const awsUploadParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: filePath,
      Body: inStream,
    };
    const run = async () => {
      try {
        // const data = await s3Client.send(new PutObjectCommand(awsUploadParams));
        // this is not working because its shit ENOT found vanxa k garnu ta abo
        const data = await s3.upload(awsUploadParams).promise();
        console.log(`Success uploading to aws ${data.Location}`);
      } catch (err) {
        console.log('Error', err);
        throw err;
      }
    };
    await run();
  }
  return filePath;
};
