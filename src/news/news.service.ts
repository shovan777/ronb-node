import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateNewsCategoryInput,
  CreateNewsInput,
  CreateUserLikesNewsInput,
} from './dto/create-news.input';
import { FilterNewsInput } from './dto/filter-news.input';
import {
  UpdateNewsInput,
  UpdateNewsCategoryInput,
} from './dto/update-news.input';
// import { News } from './interfaces/news_deltext.interface';
import {
  News,
  NewsCategory,
  NewsImage,
  UserLikesNews,
} from './entities/news.entity';
import { uploadFileStream } from 'src/common/utils/upload';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(NewsImage)
    private newsImageRepository: Repository<NewsImage>,
    @InjectRepository(NewsCategory)
    private newsCategory: Repository<NewsCategory>,
    @InjectRepository(UserLikesNews)
    private userLikesNewsRepository: Repository<UserLikesNews>,
  ) {}
  uploadDir = process.env.MEDIA_ROOT;
  // private readonly newsArr: News[] = [];
  async create(newsInput: CreateNewsInput, user: number): Promise<News> {
    // return 'This action adds a new news';
    let newsInputData: any = {
      ...newsInput,
      singleImage: null,
      images: null,
    };
    if (newsInput.singleImage) {
      const imageFile: any = await newsInput.singleImage;
      const file_name = imageFile.filename;
      // const my_dir = this.configService.get('MEDIA_ROOT');
      // console.log(my_dir);
      const upload_dir = this.uploadDir;
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
    if (newsInput.category) {
      const newsCategory: NewsCategory = await this.newsCategory.findOneBy({
        id: newsInput.category,
      });
      if (!newsCategory) {
        throw new NotFoundException(
          `News category with id ${newsInput.category} not found`,
        );
      }
      newsInputData = {
        ...newsInputData,
        category: newsCategory,
      };
    }
    const newsData: News = await this.newsRepository.save({
      ...newsInputData,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user, //TODO: get user from jwt
      updatedBy: user,
    });

    if (newsInput.images) {
      const imagePaths = newsInput.images.map(async (image) => {
        const imageFile: any = await image;
        const fileName = imageFile.filename;
        const uploadDir = this.uploadDir;
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
            createdBy: user,
            updatedBy: user,
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

  async findAll(
    limit: number,
    offset: number,
    filterNewsInput: FilterNewsInput,
  ): Promise<[News[], number]> {
    // return `This action returns all news`;
    return this.newsRepository.findAndCount({
      relations: {
        category: true,
      },
      where: {
        category: {
          id: filterNewsInput.category,
        },
      },
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: number) {
    // return `This action returns a #${id} news`;
    const news = await this.newsRepository.findOne({
      where: { id: id },
      relations: { images: true, likes: true },
    });
    // console.log(news);
    if (news) {
      return news;
    }
    return new NotFoundException(`News with id ${id} not found`);
  }

  async update(id: number, updateNewsInput: UpdateNewsInput, user: number) {
    // return `This action updates a #${id} news`;
    // const news = this.newsArr.find((news) => news.id === id);
    const news: News = await this.newsRepository.findOne({
      where: { id: id },
    });
    if (news) {
      let newsInputData: any = {
        // ...news,
        ...updateNewsInput,
        singleImage: null,
        // images: null,
      };
      if (updateNewsInput.singleImage) {
        const imageFile: any = await updateNewsInput.singleImage;
        const file_name = imageFile.filename;
        const upload_dir = this.uploadDir;
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
      if (updateNewsInput.category) {
        const newsCategory: NewsCategory = await this.newsCategory.findOneBy({
          id: updateNewsInput.category,
        });
        if (!newsCategory) {
          throw new NotFoundException(
            `News category with id ${updateNewsInput.category} not found`,
          );
        }
        newsInputData = {
          ...newsInputData,
          category: newsCategory,
        };
        news.category = newsInputData.category;
      }
      if (updateNewsInput.images) {
        const imagePaths = updateNewsInput.images.map(async (image) => {
          const imageFile: any = await image;
          const fileName = imageFile.filename;
          const uploadDir = this.uploadDir;
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
              createdBy: user,
              updatedBy: user,
            });
          },
        );
        await Promise.all(newImages);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { images = [], ...updatedNews } = {
        ...news,
        ...newsInputData,
        updatedAt: new Date(),
        updatedBy: user, //TODO: get user from jwt
        // images: ['guur'],
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return this.newsRepository.save(updatedNews);
    }
    throw new NotFoundException(`News with id ${id} not found`);
  }

  async remove(id: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: id },
      relations: { images: true },
    });
    if (news) {
      const deleteImage = news.images.map(async (image) => {
        return await this.newsImageRepository.delete(image.id);
      });
      await Promise.all(deleteImage);
      await this.newsRepository.delete(news.id);
      return news;
    }

    return new NotFoundException(`News with id ${id} not found`);
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

  async findCategoryofNews(newsId: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: { category: true },
    });
    if (news) {
      return news.category;
    }
    return new NotFoundException(`News with id ${newsId} not found`);
  }

  async countLikes(newsId: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: { likes: true },
    });
    if (news) {
      return news.likes.length;
    }
    return new NotFoundException(`News with id ${newsId} not found`);
  }
  async findUserLikesNews(newsId: number) {
    const userLikesNews = await this.userLikesNewsRepository.findOne({
      where: {
        news: { id: newsId },
        userId: 2, //TODO: get user from jwt
      },
    });
    return userLikesNews;
  }
}

@Injectable()
export class NewsCategoryService {
  constructor(
    @InjectRepository(NewsCategory)
    private newsCategoryRepository: Repository<NewsCategory>,
  ) {}

  async findAll(): Promise<NewsCategory[]> {
    return this.newsCategoryRepository.find();
  }

  async findOne(id: number): Promise<NewsCategory | NotFoundException> {
    const newsCategory =
      (await this.newsCategoryRepository.findOneBy({ id })) ||
      new NotFoundException(`NewsCategory with id ${id} not found`);
    return newsCategory;
  }

  async create(createNewsCategoryInput: CreateNewsCategoryInput) {
    return this.newsCategoryRepository.save({
      ...createNewsCategoryInput,
      createdBy: 1,
      updatedBy: 1,
    });
  }

  async update(id: number, updateNewsCategoryInput: UpdateNewsCategoryInput) {
    const newsCategory: NewsCategory =
      await this.newsCategoryRepository.findOneBy({ id });
    if (newsCategory) {
      return this.newsCategoryRepository.save({
        ...newsCategory,
        ...updateNewsCategoryInput,
        updatedBy: 1, //TODO: get user from jwt
      });
    }
    return new NotFoundException(`NewsCategory with id ${id} not found`);
  }

  async remove(id: number) {
    const newsCategory: NewsCategory =
      await this.newsCategoryRepository.findOneBy({ id });
    if (newsCategory) {
      const removedNewsCategory = await this.newsCategoryRepository.remove(
        newsCategory,
      );
      return {
        ...removedNewsCategory,
        id,
      };
    }
    return new NotFoundException(`NewsCategory with id ${id} not found`);
  }
}

@Injectable()
export class UserLikesNewsService {
  constructor(
    @InjectRepository(UserLikesNews)
    private userLikesNewsRepository: Repository<UserLikesNews>,
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}
  async create(
    createUserLikesNewsInput: CreateUserLikesNewsInput,
    user: number,
  ) {
    const { newsId } = createUserLikesNewsInput;
    const news = await this.newsRepository.findOneBy({ id: newsId });
    if (!news) return new NotFoundException(`News with id ${newsId} not found`);
    return this.userLikesNewsRepository.save({
      news: news,
      userId: user, //TODO: get user from jwt
    });
  }

  async remove(newsId: number, user: number) {
    const userLikesNews = await this.userLikesNewsRepository.findOne({
      relations: { news: true },
      where: {
        news: { id: newsId },
        userId: user, //TODO: get user from jwt
      },
    });
    if (!userLikesNews)
      return new NotFoundException(
        `UserLikesNews with newsId ${newsId} not found`,
      );
    const removedUserLikesNews = { ...userLikesNews };
    await this.userLikesNewsRepository.remove(userLikesNews);
    return removedUserLikesNews;
  }
}
