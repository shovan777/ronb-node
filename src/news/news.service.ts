import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createWriteStream, mkdir } from 'fs';
import { join } from 'path';
import { finished } from 'stream/promises';
import { Repository } from 'typeorm';
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
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(NewsImage)
    private newsImageRepository: Repository<NewsImage>,
  ) {}
  // private readonly newsArr: News[] = [];
  async create(newsInput: CreateNewsInput): Promise<News> {
    // return 'This action adds a new news';
    let newsInputData = { ...newsInput, singleImage: null, images: null };
    if (newsInput.singleImage) {
      const imageFile: any = await newsInput.singleImage;
      const file_name = imageFile.filename;
      const upload_dir = './uploads';
      const file_path = await uploadFileStream(
        imageFile.createReadStream,
        upload_dir,
        file_name,
      );
      newsInputData = {
        ...newsInputData,
        singleImage: file_path,
      };
    }
    const newsData: News = await this.newsRepository.save({
      ...newsInputData,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 1, //TODO: get user from jwt
      updatedBy: 1,
    });

    if (newsInput.images) {
      const imagePaths = newsInput.images.map(async (image) => {
        const imageFile: any = await image;
        const fileName = imageFile.filename;
        const uploadDir = './uploads';
        const filePath = await uploadFileStream(
          imageFile.createReadStream,
          uploadDir,
          fileName,
        );
        return filePath;
      });
      const newImages: Promise<NewsImage>[] = imagePaths.map(
        async (imagePath) => {
          return await this.newsImageRepository.save({
            imageURL: await imagePath,
            createdAt: new Date(),
            updatedAt: new Date(),
            news: newsData,
            createdBy: 1,
            updatedBy: 1,
          });
        },
      );

      newsInputData = {
        ...newsInputData,
        images: await Promise.all(newImages),
      };
    }

    return await newsData;
    // return this.newsRepository.save(await newsData);
  }

  findAll() {
    // return `This action returns all news`;
    return this.newsRepository.find();
  }

  async findOne(id: number) {
    // return `This action returns a #${id} news`;
    const news = await this.newsRepository.findOne({
      where: { id: id },
      relations: { images: true },
    });
    // console.log(news);
    if (news) {
      return news;
    }
    return new NotFoundException(`News with id ${id} not found`);
  }

  async update(id: number, updateNewsInput: UpdateNewsInput) {
    // return `This action updates a #${id} news`;
    // const news = this.newsArr.find((news) => news.id === id);
    const news: News = await this.newsRepository.findOne({
      where: { id: id },
    });
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
        newsInputData = {
          ...newsInputData,
          singleImage: file_path,
        };
        news.singleImage = newsInputData.singleImage;
      }
      if (updateNewsInput.images) {
        const imagePaths = updateNewsInput.images.map(async (image) => {
          const imageFile: any = await image;
          const fileName = imageFile.filename;
          const uploadDir = './uploads';
          const filePath = await uploadFileStream(
            imageFile.createReadStream,
            uploadDir,
            fileName,
          );
          return filePath;
        });
        const newImages: Promise<NewsImage>[] = imagePaths.map(
          async (imagePath) => {
            return await this.newsImageRepository.save({
              imageURL: await imagePath,
              createdAt: new Date(),
              updatedAt: new Date(),
              news: news,
              createdBy: 1,
              updatedBy: 1,
            });
          },
        );
        newsInputData = {
          ...newsInputData,
          images: await Promise.all(newImages),
        };
      }
      const updatedNews = {
        ...news,
        updatedAt: new Date(),
        updatedBy: 1, //TODO: get user from jwt
        // images: ['guur'],
      };
      // this.newsArr[id] = updatedNews;
      return this.newsRepository.save(updatedNews);
    }
    throw new NotFoundException(`News with id ${id} not found`);
  }

  async remove(id: number) {
    // const rmIndex = this.newsArr.findIndex((news) => news.id === id);
    // if (rmIndex !== -1) {
    //   return this.newsArr.splice(rmIndex, 1)[0];
    // }
    const news: News = await this.newsRepository.findOne({
      where: { id: id },
      relations: { images: true },
    });
    // console.log(news);
    if (news) {
      // if (news.images) {
      const deleteImage = news.images.map(async (image) => {
        return await this.newsImageRepository.delete(image.id);
      });
      await Promise.all(deleteImage);
      // }
      // console.log(deletedImages);
      await this.newsRepository.delete(news.id);
      // console.log(deletedNews.raw);
      return news;
    }

    return new NotFoundException(`News with id ${id} not found`);

    // return `This action removes a #${id} news`;
  }

  async findImagesofNews(newsId: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: { images: true },
    });
    // console.log(
    //   `hello iam finding all ${news.images.map((image) => image.imageURL)}`,
    // );
    if (news) {
      return news.images;
    }
    return new NotFoundException(`News with id ${newsId} not found`);
  }
}
