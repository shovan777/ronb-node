import {
  GetNewsRecommendationResponse,
  NEWS_RECOMMENDATION_SERVICE_NAME,
  NewsRecommendationServiceClient,
} from '@app/shared/common/proto/recommendation.pb';
import { NewsComment } from '@app/shared/entities/comment.entity';
import {
  News,
  NewsCategory,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { Tag } from '@app/shared/entities/tags.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { createObjectCsvWriter } from 'csv-writer';
import { RedisClientType } from 'redis';
import { Observable } from 'rxjs';
import { DataSource, In, Repository } from 'typeorm';
import { RecommendationData } from './interfaces/recommendations.interface';

@Injectable()
export class NewscacheService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject('REDIS_CLIENT')
    private redisCache: RedisClientType,
  ) {}
  async getHello(): Promise<News[]> {
    console.log('***********getHello');
    const newsCache: News[] = await this.cacheManager.get('news');
    console.log(`newsCache: ${newsCache}`);
    return newsCache;
  }

  // get 10 news from db
  private async getNewsFromDB(sliceOfIds: number[]): Promise<News[]> {
    const sqlQuery = this.newsRepository.query(
      `select n.* from unnest('{${sliceOfIds.join(
        ',',
      )}}'::int[]) with ordinality as t(id, ord) join news n using(id) order by t.ord`,
    );
    // https://dba.stackexchange.com/questions/243675/order-of-where-in-result-for-postgresql
    // .createQueryBuilder('news')
    // .whereInIds(sliceOfIds)
    // .orderBy(`FIELD(news.id, ${sliceOfIds.join(',')})`);
    return await sqlQuery;
    // return await this.newsRepository.find({
    //   where: { id: In(sliceOfIds) },
    //   // sort by order in sliceofIds
    //   // order: { id: sliceOfIds },
    // });
  }

  async findNewsNCache(newsIds: number[], userId: number): Promise<News[]> {
    let newsToCache: News[] = [];
    // avoid to many calls to db or redis
    // divide newsIds into slices of 10
    const newsIdsCount = newsIds.length;
    const numTraversal = Math.floor(newsIdsCount / 10);
    const remainder = newsIdsCount % 10;

    // push to cache array in chunks of 10
    for (let i = 0; i < numTraversal; i++) {
      const sliceOfIds = newsIds.slice(i * 10, (i + 1) * 10);
      const news = await this.getNewsFromDB(sliceOfIds);
      console.log(`news from db${i}th slice: ${news.map((n) => n.id)}`);
      newsToCache = newsToCache.concat(news);
      await this.redisCache.rPush(`newscache_${userId}`, JSON.stringify(news));
    }
    if (remainder > 0) {
      const sliceOfIds = newsIds.slice(numTraversal * 10);
      const news = await this.getNewsFromDB(sliceOfIds);
      newsToCache = newsToCache.concat(news);
    }

    // this.cacheManager.set(`newscache_${userId}`, newsToCache);
    // console.log(`setting in cache: ${twoNews.map((n) => n.id)}`);
    // append news to tail of user's cache if exists
    // else creates
    // for (const id of newsIds) {
    //   await this.redisCache.rPush(`newscache_${userId}`, id.toString());
    // }
    // await this.redisCache.rPush(
    //   `newscache_${userId}`,
    //   JSON.stringify(newsToCache),
    // );
    // await this.cacheManager.set(`newscache_${userId}`, newsToCache);
    return newsToCache;
  }
}

@Injectable()
export class NewsRecommendationClientService implements OnModuleInit {
  private newsRecommendationService: NewsRecommendationServiceClient;
  constructor(
    @Inject(NEWS_RECOMMENDATION_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.newsRecommendationService =
      this.client.getService<NewsRecommendationServiceClient>(
        NEWS_RECOMMENDATION_SERVICE_NAME,
      );
  }

  async getNewsRecommendation(
    userId: number,
  ): Promise<Observable<GetNewsRecommendationResponse>> {
    // const newsArr = [];
    return this.newsRecommendationService.getNewsRecommendation({
      userId: userId,
    });
    //   .subscribe({
    //     next: (response) => {
    //       console.log(`response: ${response.newsIds}`);
    //       // news = this.newscacheService.findNews(response.newsIds);
    //     },
    //   });
    // return newsArr;
  }
}

@Injectable()
export class RecommendationDataService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
    @InjectRepository(UserInterests)
    private userInterestsRepository: Repository<UserInterests>,
    @InjectRepository(NewsCategory)
    private newsCategoryRepository: Repository<NewsCategory>,
    @InjectRepository(UserNewsEngagement)
    private userNewsEngagementsRepository: Repository<UserNewsEngagement>,
    @InjectRepository(UserLikesNews)
    private userLikesNewsRepository: Repository<UserLikesNews>,
    @InjectRepository(NewsComment)
    private commentRepository: Repository<NewsComment>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectDataSource('usersConnection')
    private userDataSource: DataSource,
  ) {}

  async getRecommendationData(): Promise<RecommendationData> {
    // const userInterestsIds = userInterests.map((interest) => interest.category);
    // const news = await this.newsRepository.find({
    //   where: { category: In(userInterestsIds) },
    //   relations: ['category', 'images'],
    // });

    // const comment= await this.commentRepository.count()
    // console.log("Comment Count",comment)
    // saving user data
    const user = await this.userDataSource
      .createQueryBuilder()
      .from('account_user', 'account_user')
      .orderBy('id')
      .getRawMany();

    const userWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/users.csv',
      header: [{ id: 'id', title: 'User' }],
    });
    const usersData = user.map((usersItem) => {
      return {
        id: usersItem.id,
      };
    });
    userWriter
      .writeRecords(usersData)
      .then(() => console.log('CSV file for Users written successfully'))
      .catch((error) => console.log('Error writing Users CSV file', error));
    console.log(user);
    // saving user likes data
    const userlikes = await this.userLikesNewsRepository.find({
      order: {
        userId: 'ASC',
      },
    });
    const likesWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/likes.csv',
      header: [
        { id: 'user', title: 'User' },
        { id: 'news', title: 'News' },
      ],
    });
    const likesData = userlikes.map((likesItem) => {
      return {
        user: likesItem.userId,
        news: likesItem.newsId,
      };
    });

    likesWriter
      .writeRecords(likesData)
      .then(() => console.log('CSV file for Likes written successfully'))
      .catch((error) => console.log('Error writing Likes CSV file', error));

    // saving news data
    const news = await this.newsRepository.find({
      // relations: ['category','tags','likes'],
      relations: ['category', 'tags', 'likes', 'comments'],

      // select:{
      //   id:true,
      // },
      // where:{
      //   id: LessThan(2000)
      // },
      order: {
        id: 'ASC',
      },
    });

    const newsWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/news.csv',
      header: [
        { id: 'id', title: 'Id' },
        { id: 'title', title: 'Title' },
        { id: 'category', title: 'Category' },
        { id: 'tags', title: 'Tags' },
        { id: 'likes', title: 'Likes' },
        { id: 'comments', title: 'Comments' },
      ],
    });
    const newsData = news.map((newsItem) => {
      return {
        id: newsItem.id,
        title: newsItem.title,
        category: newsItem.category ? newsItem.category.id : null,
        tags: newsItem.tags.map((tag) => tag.id).join(','),
        likes: newsItem.likes.length,
        comments: newsItem.comments.length,
      };
    });
    newsWriter
      .writeRecords(newsData)
      .then(() => console.log('CSV file for news written successfully'))
      .catch((error) => console.log('Error writing News CSV file', error));

    // saving rating data
    const ratingWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/ratings.csv',
      header: [
        { id: 'newsId', title: 'News' },
        { id: 'userId', title: 'User' },
        { id: 'likeCount', title: 'Like' },
        { id: 'commentCount', title: 'Comment' },
      ],
    });
    let ratingDataAll = [];
    news.forEach((n) => {
      let ratingDict = {};
      n.likes.forEach((like) => {
        ratingDict[like.userId] = {
          newsId: n.id,
          userId: like.userId,
          likeCount: 1,
          commentCount: 0,
        };
      });

      n.comments.forEach((comment) => {
        if (comment.author in ratingDict) {
          ratingDict[comment.author].commentCount += 1;
        } else {
          ratingDict[comment.author] = {
            newsId: n.id,
            userId: comment.author,
            likeCount: 0,
            commentCount: 1,
          };
        }
        // console.log(ratingDict)
      });
      const ratingData = Object.values(ratingDict);
      ratingDataAll = ratingDataAll.concat(ratingData);
    });
    ratingWriter
      .writeRecords(ratingDataAll)
      .then(() => console.log('CSV file for rating written successfully'))
      .catch((error) => console.log('Error writing rating CSV file', error));

    // saving user Interest data
    const userInterests = await this.userInterestsRepository.find({
      relations: ['newsTags', 'newsCategories'],
      order: {
        userId: 'ASC',
      },
    });
    const userInterestWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/userInterest.csv',
      header: [
        { id: 'userId', title: 'User' },
        { id: 'tags', title: 'Tags' },
        { id: 'category', title: 'Category' },
      ],
    });
    const userInterestData = userInterests.map((interestItem) => {
      return {
        userId: interestItem.userId,
        tags: interestItem.newsTags.map((tag) => tag.id).join(','),
        category: interestItem.newsCategories
          .map((category) => category.id)
          .join(','),
      };
    });
    userInterestWriter
      .writeRecords(userInterestData)
      .then(() => console.log('CSV file for userInterest written successfully'))
      .catch((error) =>
        console.log('Error writing user Interest CSV file', error),
      );

    // saving Category data
    const categories = await this.newsCategoryRepository.find({
      // relations: ['news','userInterests'],
      order: {
        id: 'ASC',
      },
    });
    console.log('kaljfklsdhfkjfecjdsgbvjhgdhjgd');
    const categoryWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/categories.csv',
      header: [
        { id: 'id', title: 'Id' },
        { id: 'category', title: 'Category' },
        // {id: 'news', title: 'News'},
      ],
    });
    const categoryData = categories.map((categoryItem) => {
      return {
        id: categoryItem.id,
        category: categoryItem.name,
        // news: categoryItem.news.map((news) => news.id).join(','),
      };
    });
    categoryWriter
      .writeRecords(categoryData)
      .then(() => console.log('CSV file for category written successfully'))
      .catch((error) => console.log('Error writing category CSV file', error));

    // saving tag data
    const tags = await this.tagRepository.find({
      // relations: ['news','tag'],
      order: {
        id: 'ASC',
      },
    });
    const tagsWriter = createObjectCsvWriter({
      path: '/home/saru/Documents/NewsRecommend/tags.csv',
      header: [
        { id: 'id', title: 'Id' },
        { id: 'tag', title: 'Tag' },
      ],
    });
    console.log('sdyufhgvdbehjgfcjkdhsjkfgvdjkfgvdjkfgvbjiuedc');
    const tagData = tags.map((tagItem) => {
      return {
        id: tagItem.id,
        tag: tagItem.name,
      };
    });
    tagsWriter
      .writeRecords(tagData)
      .then(() => console.log('CSV file for tag written successfully'))
      .catch((error) => console.log('Error writing Tag CSV file', error));

    const recommendationData: RecommendationData = {
      userData: 'user data',
      newsData: 'news data',
      ratingData: 'rating data',
    };
    return recommendationData;
    // return news;
  }
}
