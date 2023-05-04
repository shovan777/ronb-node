import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull } from 'typeorm';
import {
  CreateNewsCategoryInput,
  CreateNewsEngagementInput,
  CreateNewsInput,
  CreateUserInterestsInput,
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
  NewsState,
  RecommendationData,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { uploadFileStream } from '@app/shared/common/utils/upload';
import { NewsTaggit, Tag } from '@app/shared/entities/tags.entity';
import { NewsTaggitService, TagsService } from '../tags/tags.service';
import { join } from 'path';
import { FilesService } from '@app/shared/common/services/files.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import {
  BeginCachingResponse,
  NewsCachingServiceClient,
  NEWS_CACHING_SERVICE_NAME,
} from '@app/shared/common/proto/news.pb';

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
    private tagsService: TagsService,
    private newsTaggitService: NewsTaggitService,
    private fileService: FilesService,
  ) {}
  uploadDir = process.env.MEDIA_ROOT;
  // private readonly newsArr: News[] = [];
  async create(newsInput: CreateNewsInput, user: number): Promise<News> {
    let newsInputData: any = {
      ...newsInput,
      singleImage: null,
      images: null,
      tags: null,
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
      publishedAt: newsInput.state === NewsState.PUBLISHED ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user, //TODO: get user from jwt
      updatedBy: user,
    });

    if (newsInput.images) {
      const imagePaths = newsInput.images.map(async (image, index) => {
        const imageFile: any = await image;
        const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
        // const fileName = imageFile.filename;
        // const uploadDir = join(this.uploadDir, `${newsData.id}`, 'images');
        // console.log(uploadDir);
        const uploadDir = join(this.uploadDir, `news_${newsData.id}`, 'images');
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

    if (newsInput.tags) {
      const tags = newsInput.tags.map(async (tag) => {
        const tagData: Tag = await this.tagsService.findOneOrCreate(tag, user);
        return tagData;
      });

      const newsTags = tags.map(async (tag) => {
        const tagData = await tag;
        const newsTaggit: NewsTaggit = await this.newsTaggitService.create(
          {
            tag: tagData.id,
            news: newsData.id,
          },
          user,
        );
        return newsTaggit;
      });

      newsInputData = {
        ...newsInputData,
        tags: await Promise.all(newsTags),
      };
    }

    return await newsData;
    // return this.newsRepository.save(await newsData);
  }

  async findAll(
    limit: number,
    offset: number,
    filterNewsInput: FilterNewsInput,
    publishedOnly = false,
  ): Promise<[News[], number]> {
    // return `This action returns all news`;
    const whereOptions: any = {};
    if (publishedOnly) {
      whereOptions.state = NewsState.PUBLISHED;
    }
    if (filterNewsInput?.title) {
      whereOptions.title = Like(`%${filterNewsInput.title}%`);
    }
    if (filterNewsInput?.language) {
      whereOptions.language = filterNewsInput.language;
    }
    return this.newsRepository.findAndCount({
      relations: {
        category: true,
      },
      where: {
        // state: NewsState.PUBLISHED,
        ...whereOptions,
        category: {
          id: filterNewsInput.category,
        },
      },
      take: limit,
      skip: offset,
      order: {
        pinned: 'DESC',
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number, withRelations = true) {
    // return `This action returns a #${id} news`;
    const news = await this.newsRepository.findOne({
      where: { id: id },
      relations: withRelations ? { images: true, likes: true } : {},
    });
    if (news) {
      return news;
    }
    throw new NotFoundException(`News with id ${id} not found`);
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
        const imagePaths = updateNewsInput.images.map(async (image, index) => {
          const imageFile: any = await image;
          // const fileName = imageFile.filename;
          // const uploadDir = this.uploadDir;
          const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
          // const uploadDir = join(this.uploadDir, news.id.toString(), 'images');
          const uploadDir = join(this.uploadDir, `news_${news.id}`, 'images');
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

      if (updateNewsInput.tags) {
        const tags = updateNewsInput.tags.map(async (tag) => {
          const tagData: Tag = await this.tagsService.findOneOrCreate(
            tag,
            user,
          );
          return tagData;
        });

        const newsTags = tags.map(async (tag) => {
          const tagData = await tag;
          const newsTaggit: NewsTaggit =
            await this.newsTaggitService.findOneOrCreate(tagData, news, user);
          return newsTaggit;
        });
        await Promise.all(newsTags);
      }

      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tags = [],
        images = [],
        ...updatedNews
      } = {
        ...news,
        ...newsInputData,
        publishedAt:
          news.publishedAt ||
          (updateNewsInput.state === NewsState.PUBLISHED ? new Date() : null),
        updatedAt: new Date(),
        updatedBy: user,
        // images: ['guur'],
      };
      return this.newsRepository.save(updatedNews);
    }
    throw new NotFoundException(`News with id ${id} not found`);
  }

  async remove(id: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: id },
      relations: { images: true, tags: true },
    });
    if (news) {
      const deleteImage = news.images.map(async (image) => {
        return await this.newsImageRepository.delete(image.id);
      });
      await Promise.all(deleteImage);

      const deleteNewsTaggit = news.tags.map(async (tag) => {
        return await this.newsTaggitService.remove(tag.id);
      });
      await Promise.all(deleteNewsTaggit);

      // }
      // console.log(deletedImages);
      await this.newsRepository.delete(news.id);
      return news;
    }

    return new NotFoundException(`News with id ${id} not found`);
  }

  async removeImage(id: number) {
    const image = await this.newsImageRepository.findOne({
      where: { id: id },
    });
    if (image) {
      await this.newsImageRepository.delete(image.id);
      this.fileService.removeFile(image.imageURL);
      return image;
    }
    return new NotFoundException(`Image with id ${id} not found`);
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

  async countComments(newsId: number) {
    const news: News = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: { comments: true },
    });
    if (news) {
      return news.comments.length;
    }
    return new NotFoundException(`News with id ${newsId} not found`);
  }

  async findUserLikesNews(newsId: number, user: number) {
    const userLikesNews = await this.userLikesNewsRepository.findOne({
      where: {
        news: { id: newsId },
        userId: user, //TODO: get user from jwt
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

  async create(createNewsCategoryInput: CreateNewsCategoryInput, user: number) {
    return this.newsCategoryRepository.save({
      ...createNewsCategoryInput,
      createdBy: user,
      updatedBy: user,
    });
  }

  async update(
    id: number,
    updateNewsCategoryInput: UpdateNewsCategoryInput,
    user: number,
  ) {
    const newsCategory: NewsCategory =
      await this.newsCategoryRepository.findOneBy({ id });
    if (newsCategory) {
      return this.newsCategoryRepository.save({
        ...newsCategory,
        ...updateNewsCategoryInput,
        updatedBy: user, //TODO: get user from jwt
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
      userId: user,
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

@Injectable()
export class UserInterestsService {
  // create user interests based on category
  constructor(
    @InjectRepository(UserInterests)
    private userInterestsRepository: Repository<UserInterests>,
    private newsCategoryService: NewsCategoryService,
    private newsTagService: TagsService,
  ) {}

  async create(
    userInterestsInput: CreateUserInterestsInput,
    user: number,
  ): Promise<UserInterests> {
    const interestsInputData: any = {
      ...userInterestsInput,
      userId: user,
      newsCategories: null,
      newsTags: null,
    };
    // map the relation input to ids
    if (userInterestsInput.newsCategories) {
      const newsCategories: Promise<NewsCategory | NotFoundException>[] =
        userInterestsInput.newsCategories.map((catId) =>
          this.newsCategoryService.findOne(catId),
        );
      interestsInputData.newsCategories = await Promise.all(newsCategories);
    }

    if (userInterestsInput.newsTags) {
      const newsTags: Promise<Tag | NotFoundException>[] =
        userInterestsInput.newsTags.map((tagId) =>
          this.newsTagService.findOneById(tagId),
        );
      interestsInputData.newsTags = await Promise.all(newsTags);
    }
    this.userInterestsRepository.save({
      ...interestsInputData,
    });
    return interestsInputData;
  }

  async findAll(user: number): Promise<UserInterests[]> {
    const interests = await this.userInterestsRepository.find({
      where: {
        userId: user,
      },
      relations: { newsTags: true, newsCategories: true },
    });
    return interests;
  }
}

@Injectable()
export class NewsEngagementService {
  constructor(
    @InjectRepository(UserNewsEngagement)
    private newsEngagementRepository: Repository<UserNewsEngagement>,
    private newsService: NewsService,
  ) {}

  async create(
    createNewsEngagementInput: CreateNewsEngagementInput,
    user: number,
  ): Promise<UserNewsEngagement> {
    const { newsId } = createNewsEngagementInput;
    const news = await this.newsService.findOne(newsId, false);
    return this.newsEngagementRepository.save({
      ...createNewsEngagementInput,
      userId: user,
      news: news,
    });
  }

  async findAll(user: number): Promise<UserNewsEngagement[]> {
    return this.newsEngagementRepository.find({
      relations: ['news'],
    });
  }

  // async remove(newsId: number, user: number) {
  //   const newsEngagement = await this.newsEngagementRepository.findOne({
  //     relations: { news: true },
  //     where: {
  //       news: { id: newsId },
  //       userId: user, //TODO: get user from jwt
  //     },
  //   });
  //   if (!newsEngagement)
  //     return new NotFoundException(
  //       `NewsEngagement with newsId ${newsId} not found`,
  //     );
  //   const removedNewsEngagement = { ...newsEngagement };
  //   await this.newsEngagementRepository.remove(newsEngagement);
  //   return removedNewsEngagement;
  // }
}

@Injectable()
export class RecommendationDataService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(UserInterests)
    private userInterestsRepository: Repository<UserInterests>,
  ) {}

  async getRecommendationData(): Promise<RecommendationData> {
    // const userInterestsIds = userInterests.map((interest) => interest.category);
    // const news = await this.newsRepository.find({
    //   where: { category: In(userInterestsIds) },
    //   relations: ['category', 'images'],
    // });
    const recommendationData: RecommendationData = {
      userData: 'user data',
      newsData: 'news data',
      ratingData: 'rating data',
    };
    return recommendationData;
    // return news;
  }
}

@Injectable()
export class NewsCacheClientService implements OnModuleInit {
  private newsCachingService: NewsCachingServiceClient;

  constructor(
    @Inject(NEWS_CACHING_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.newsCachingService =
      this.client.getService<NewsCachingServiceClient>('NewsCachingService');
  }

  async sendBeginCaching(): Promise<BeginCachingResponse> {
    return firstValueFrom(this.newsCachingService.beginCaching({ id: 1 }));
  }
}
