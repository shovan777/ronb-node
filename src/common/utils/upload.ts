import { NotFoundException } from '@nestjs/common';
import { createWriteStream, mkdir } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';

export const uploadFileStream = async (readStream, uploadDir, filename) => {
  const fileName = filename;
  // const uploadDir = './uploadssssss';
  const filePath = join(uploadDir, fileName);
  await mkdir(uploadDir, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const inStream = readStream();
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
  return filePath;
};
