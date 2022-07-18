import { Injectable, NotFoundException } from '@nestjs/common';
import { createWriteStream, mkdir } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';
import { CreateNewsInput } from './dto/create-news.input';
import { UpdateNewsInput } from './dto/update-news.input';
// import { News } from './interfaces/news_deltext.interface';
import { News, NewsImage } from './entities/news.entity';

const uploadFileStream = async (readStream, uploadDir, filename) => {
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

@Injectable()
export class NewsService {
  private readonly newsArr: News[] = [];
  async create(newsInput: CreateNewsInput) {
    // return 'This action adds a new news';
    let newsInputData = { ...newsInput, singleImage: null, images: null };
    let newsData: News = {
      ...newsInputData,
      id: this.newsArr.length + 1,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1, //TODO: get user from jwt
      updatedBy: 1,
    };
    // console.log(newsInput);
    if (newsInput.singleImage) {
      const imageFile: any = await newsInput.singleImage;
      const file_name = imageFile.filename;
      const upload_dir = './uploads';
      const file_path = await uploadFileStream(
        imageFile.createReadStream,
        upload_dir,
        file_name,
      );
      // console.log('single file_path');
      newsInputData = {
        ...newsInputData,
        singleImage: file_path,
      };
    }

    if (newsInput.images) {
      const imagePaths = newsInput.images.map(async (image) => {
        const imageFile: any = await image;
        const fileName = imageFile.filename;
        const uploadDir = './uploads';
        // console.log('uploading files');
        const filePath = await uploadFileStream(
          imageFile.createReadStream,
          uploadDir,
          fileName,
        );
        return filePath;
      });
      const newImages: Promise<NewsImage>[] = imagePaths.map(
        async (imagePath, index) => {
          return {
            id: index + 1,
            imageURL: await imagePath,
            createdAt: new Date(),
            updatedAt: new Date(),
            news: newsData,
            createdBy: 1,
            updatedBy: 1,
          };
        },
      );
      newsInputData = {
        ...newsInputData,
        images: newImages,
      };
    }
    newsData = {
      ...newsInputData,
      id: this.newsArr.length + 1,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1, //TODO: get user from jwt
      updatedBy: 1,
    };
    this.newsArr.push(newsData);
    return newsData;
  }

  findAll() {
    // return `This action returns all news`;
    return this.newsArr;
  }

  findOne(id: number) {
    // return `This action returns a #${id} news`;
    const news = this.newsArr.find((news) => news.id === id);
    if (news) {
      return news;
    }
    return new NotFoundException(`News with id ${id} not found`);
  }

  async update(id: number, updateNewsInput: UpdateNewsInput) {
    // return `This action updates a #${id} news`;
    const news = this.newsArr.find((news) => news.id === id);
    if (news) {
      let newsInputData = {
        ...updateNewsInput,
        singleImage: null,
        images: null,
      };
      if (updateNewsInput.singleImage) {
        const imageFile: any = await updateNewsInput.singleImage;
        const file_name = imageFile.filename;
        const upload_dir = './uploads';
        const file_path = await uploadFileStream(
          imageFile.createReadStream,
          upload_dir,
          file_name,
        );
        // console.log('single file_path');
        newsInputData = {
          ...newsInputData,
          singleImage: file_path,
        };
      }
      if (updateNewsInput.images) {
        const imagePaths = await updateNewsInput.images.map(async (image) => {
          const imageFile: any = await image;
          const fileName = imageFile.filename;
          const uploadDir = './uploads';
          // console.log('uploading files');
          const filePath = await uploadFileStream(
            imageFile.createReadStream,
            uploadDir,
            fileName,
          );
          return filePath;
        });
        const newImages: Promise<NewsImage>[] = imagePaths.map(
          async (imagePath, index) => {
            return {
              id: index + 1,
              imageURL: await imagePath,
              createdAt: new Date(),
              updatedAt: new Date(),
              news: news,
              createdBy: 1,
              updatedBy: 1,
            };
          },
        );
        newsInputData = {
          ...newsInputData,
          images: newImages,
        };
      }
      const updatedNews = {
        ...news,
        ...newsInputData,
        // singleImage: 'fire',
        updatedAt: new Date(),
        updatedBy: 1, //TODO: get user from jwt
        // images: ['guur'],
      };
      this.newsArr[id] = updatedNews;
      return updatedNews;
    }
    throw new NotFoundException(`News with id ${id} not found`);
  }

  remove(id: number) {
    const rmIndex = this.newsArr.findIndex((news) => news.id === id);
    if (rmIndex !== -1) {
      return this.newsArr.splice(rmIndex, 1)[0];
    }

    return new NotFoundException(`News with id ${id} not found`);

    // return `This action removes a #${id} news`;
  }

  async findImagesofNews(newsId: number) {
    const news = this.newsArr.find((news) => news.id === newsId);
    if (news) {
      return news.images;
    }
    return new NotFoundException(`News with id ${newsId} not found`);
  }
}
