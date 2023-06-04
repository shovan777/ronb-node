import { NewsComment } from '@app/shared/entities/comment.entity';
import {
  News,
  NewsCategory,
  UserInterests,
  UserLikesNews,
  UserNewsEngagement,
} from '@app/shared/entities/news.entity';
import { Tag } from '@app/shared/entities/tags.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { createObjectCsvWriter } from 'csv-writer';
import { createReadStream, mkdirSync } from 'fs';
import { join } from 'path';
import { DataSource, Repository } from 'typeorm';
import { RecommendationData } from './interfaces/recommendations.interface';

@Injectable()
export class DatacollectorService {
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

  getHello(): string {
    return 'Hello World!';
  }
  async getRecommendationData(): Promise<RecommendationData> {
    // const userInterestsIds = userInterests.map((interest) => interest.category);
    // const news = await this.newsRepository.find({
    //   where: { category: In(userInterestsIds) },
    //   relations: ['category', 'images'],
    // });

    // const comment= await this.commentRepository.count()
    // console.log("Comment Count",comment)
    // saving user data
    const uploadDir = join(
      '/tmp',
      process.env.MEDIA_ROOT,
      'recommendation_data',
    );
    console.log(`uploadDir: ${uploadDir}`);
    const filePaths = [];
    const use_s3 = process.env.USE_S3 === 'true';
    console.log(
      '*********the dir created is:',
      mkdirSync(uploadDir, { recursive: true }),
    );

    const user = await this.userDataSource
      .createQueryBuilder()
      .from('account_user', 'account_user')
      .orderBy('id')
      .getRawMany();
    const userPath = join(uploadDir, 'users.csv');
    const userWriter = createObjectCsvWriter({
      path: userPath,
      header: [{ id: 'id', title: 'User' }],
    });
    const usersData = user.map((usersItem) => {
      return {
        id: usersItem.id,
      };
    });
    await userWriter
      .writeRecords(usersData)
      .then(() => console.log('CSV file for Users written successfully'))
      .catch((error) => console.log('Error writing Users CSV file', error));
    filePaths.push(userPath);

    // console.log(user);
    // saving user likes data
    const userlikes = await this.userLikesNewsRepository.find({
      order: {
        userId: 'ASC',
      },
    });
    const likePath = join(uploadDir, 'likes.csv');
    const likesWriter = createObjectCsvWriter({
      path: likePath,
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

    await likesWriter
      .writeRecords(likesData)
      .then(() => console.log('CSV file for Likes written successfully'))
      .catch((error) => console.log('Error writing Likes CSV file', error));
    filePaths.push(likePath);

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
    const newsPath = join(uploadDir, 'news.csv');
    const newsWriter = createObjectCsvWriter({
      path: newsPath,
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
    await newsWriter
      .writeRecords(newsData)
      .then(() => console.log('CSV file for news written successfully'))
      .catch((error) => console.log('Error writing News CSV file', error));
    filePaths.push(newsPath);

    // saving rating data
    const ratingPath = join(uploadDir, 'ratings.csv');
    const ratingWriter = createObjectCsvWriter({
      path: ratingPath,
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
    await ratingWriter
      .writeRecords(ratingDataAll)
      .then(() => console.log('CSV file for rating written successfully'))
      .catch((error) => console.log('Error writing rating CSV file', error));
    filePaths.push(ratingPath);

    // saving user Interest data
    const userInterestPath = join(uploadDir, 'userInterest.csv');
    const userInterests = await this.userInterestsRepository.find({
      relations: ['newsTags', 'newsCategories'],
      order: {
        userId: 'ASC',
      },
    });
    const userInterestWriter = createObjectCsvWriter({
      path: userInterestPath,
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
    await userInterestWriter
      .writeRecords(userInterestData)
      .then(() => console.log('CSV file for userInterest written successfully'))
      .catch((error) =>
        console.log('Error writing user Interest CSV file', error),
      );
    filePaths.push(userInterestPath);

    // saving Category data
    const categoriesPath = join(uploadDir, 'categories.csv');
    const categories = await this.newsCategoryRepository.find({
      // relations: ['news','userInterests'],
      order: {
        id: 'ASC',
      },
    });
    const categoryWriter = createObjectCsvWriter({
      path: categoriesPath,
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
    await categoryWriter
      .writeRecords(categoryData)
      .then(() => console.log('CSV file for category written successfully'))
      .catch((error) => console.log('Error writing category CSV file', error));
    filePaths.push(categoriesPath);

    // saving tag data
    const tagsPath = join(uploadDir, 'tags.csv');
    const tags = await this.tagRepository.find({
      // relations: ['news','tag'],
      order: {
        id: 'ASC',
      },
    });
    const tagsWriter = createObjectCsvWriter({
      path: tagsPath,
      header: [
        { id: 'id', title: 'Id' },
        { id: 'tag', title: 'Tag' },
      ],
    });
    const tagData = tags.map((tagItem) => {
      return {
        id: tagItem.id,
        tag: tagItem.name,
      };
    });
    await tagsWriter
      .writeRecords(tagData)
      .then(() => console.log('CSV file for tag written successfully'))
      .catch((error) => console.log('Error writing Tag CSV file', error));
    filePaths.join(tagsPath);

    if (use_s3) {
      const s3_params = {
        accessKeyId: process.env.REC_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.REC_AWS_ACCESS_KEY,
        region: process.env.REC_AWS_REGION,
      };
      const s3 = new S3({ ...s3_params });
      const run = async (awsUploadParams) => {
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
      //TODO: use boto to write the files to S3
      for (const i in filePaths) {
        const curFilePath = filePaths[i];
        const dataStream = createReadStream(curFilePath);
        const awsUploadParams = {
          Bucket: process.env.REC_BUCKET_NAME,
          Key: curFilePath,
          Body: dataStream,
        };
        await run(awsUploadParams);
      }
    }

    const recommendationData: RecommendationData = {
      userData: 'user data',
      newsData: 'news data',
      ratingData: 'rating data',
    };
    return recommendationData;
    // return news;
  }
}
