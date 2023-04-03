import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { join } from 'path';
import { chunk } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Notification,
  NotificationDevice,
} from './entities/notifications.entity';
import { In, Like, Repository } from 'typeorm';
import {
  CreateNotificationDeviceInput,
  NotificationInput,
  NotificationNewsInput,
} from './dto/create-notification.input';
import { NewsService } from 'src/news/news.service';
import { generateFileUrl } from 'src/common/utils/fileurl';
const stripHtml = require('string-strip-html');

export interface ISendFirebaseMessages {
  token: string;
  title?: string;
  message: string;
  image?: string;
  data?: any;
  android?: any;
}

@Injectable()
export class NotificationsSendService {
  constructor() {
    const firebaseCredentials = join(
      process.cwd(),
      process.env.FIREBASE_PATH,
      'firebase.json',
    );
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseCredentials),
      databaseURL: 'https://ronb-354910-default-rtdb.firebaseio.com',
    });
  }

  public async sendFirebaseMessages(
    firebaseMessages: ISendFirebaseMessages[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    const batchedFirebaseMessages = chunk(firebaseMessages, 500);
    const batchResponses = await mapLimit<
      ISendFirebaseMessages[],
      BatchResponse
    >(
      batchedFirebaseMessages,
      process.env.FIREBASE_PARALLEL_LIMIT || 1,
      async (
        groupedFirebaseMessages: ISendFirebaseMessages[],
      ): Promise<BatchResponse> => {
        try {
          const tokenMessages: firebase.messaging.TokenMessage[] =
            groupedFirebaseMessages.map(
              ({ message, title, token, image, data, android }) => ({
                notification: {
                  body: message,
                  title,
                  image: image,
                },
                token,
                data: data,
                apns: {
                  payload: {
                    aps: {
                      'content-available': 1,
                    },
                  },
                  headers: {
                    'apns-priority': '5',
                  },
                },
                android: android,
              }),
            );
          return await this.sendAll(tokenMessages, dryRun);
        } catch (error) {
          return {
            responses: groupedFirebaseMessages.map(() => ({
              success: false,
              error,
            })),
            successCount: 0,
            failureCount: groupedFirebaseMessages.length,
          };
        }
      },
    );
    return batchResponses.reduce(
      ({ responses, successCount, failureCount }, currentResponse) => {
        return {
          responses: responses.concat(currentResponse.responses),
          successCount: successCount + currentResponse.successCount,
          failureCount: failureCount + currentResponse.failureCount,
        };
      },
      {
        responses: [],
        successCount: 0,
        failureCount: 0,
      } as unknown as BatchResponse,
    );
  }

  public async sendAll(
    messages: firebase.messaging.TokenMessage[],
    dryRun?: boolean,
  ): Promise<BatchResponse> {
    if (process.env.NODE_ENV === 'local') {
      for (const { notification, token } of messages) {
        console.log(
          `Sending notification to ${token} with title ${notification.title} and body ${notification.body}`,
        );
      }
    }

    const responessAll = await firebase.messaging().sendAll(messages, dryRun);

    // Add token for error messages
    // TODO: Might take much time need to check it.
    for (const [index, response] of responessAll.responses.entries()) {
      if (!response.success) {
        response['token'] = messages[index].token;
      }
    }

    return responessAll;
  }
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationDevice)
    private readonly notificationDeviceRepository: Repository<NotificationDevice>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationsSendService: NotificationsSendService,
    @Inject(forwardRef(() => NewsService))
    private newsService: NewsService,
  ) {}

  async create(
    deviceInput: CreateNotificationDeviceInput,
    user: number,
  ): Promise<NotificationDevice> {
    const deviceWithToken = await this.notificationDeviceRepository.findOneBy({
      token: deviceInput.token,
    });
    if (user) {
      const deviceWithUser = await this.notificationDeviceRepository.findOneBy({
        userId: user,
      });
    }

    if (deviceWithToken) {
      return await this.notificationDeviceRepository.save({
        ...deviceWithToken,
        ...deviceInput,
        userId: user,
        updatedAt: new Date(),
      });
    } else {
      return await this.notificationDeviceRepository.save({
        ...deviceInput,
        userId: user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  async findAll(filterInput?: any): Promise<NotificationDevice[]> {
    return await this.notificationDeviceRepository.find({
      where: { ...filterInput },
    });
  }

  async sendNotification(
    data: NotificationInput,
    users?: number[],
  ): Promise<Notification> {
    const messageObject = await this.notificationRepository.save({
      ...data,
      createdAt: new Date(),
    });
    let whereOptions: any = {};
    if (users.length > 0) {
      whereOptions.userId = In(users);
    }
    const devices = await this.findAll(whereOptions);
    const androidSpecific = {
      notification: {
        eventTimestamp: new Date(),
      },
    };
    const firebaseMessages = devices.map((device) => ({
      token: device.token,
      title: data.title,
      message: data.body,
      data: JSON.parse(data.data),
      android: androidSpecific,
    }));
    const send_response =
      await this.notificationsSendService.sendFirebaseMessages(
        firebaseMessages,
      );
    return messageObject;
  }

  async sendNotificationNews(
    notificationNewsInput: NotificationNewsInput,
  ): Promise<Notification> {
    const newsObject = await this.newsService.findOne(
      notificationNewsInput.newsId,
    );
    const title = newsObject.title;
    const body = stripHtml(newsObject.content).substring(0, 200);
    const image = newsObject.images[0]?.imageURL;
    let imageURL = '';
    if (image) {
      imageURL = generateFileUrl(image);
    }
    const dataObject = {
      newId: newsObject.id.toString(),
      category: 'news',
    };

    const messageObject = await this.notificationRepository.save({
      title: title,
      body: body,
      image: imageURL,
      data: JSON.stringify(dataObject),
    });

    const androidSpecific = {
      notification: {
        eventTimestamp: new Date(),
      },
    };

    const devices = await this.findAll();
    const firebaseMessages = devices.map((device) => ({
      token: device.token,
      title: title,
      message: body,
      image: imageURL,
      data: dataObject,
      android: androidSpecific,
    }));

    const sendResponse =
      await this.notificationsSendService.sendFirebaseMessages(
        firebaseMessages,
      );

    // this code is kept for deleting the inactivate tokens.
    // TODO: need to check if this is working in actual factor.
    for (const response of sendResponse.responses) {
      if (
        !response.success &&
        response.error.code === 'messaging/registration-token-not-registered'
      ) {
        const devices = await this.notificationDeviceRepository.findOneBy({
          token: response['token'],
        });
        if (devices) {
          await this.notificationDeviceRepository.remove(devices);
        }
      }
    }

    return messageObject;
  }

  async createUpdate(
    deviceInput: CreateNotificationDeviceInput,
  ): Promise<NotificationDevice> {
    const deviceWithToken = await this.notificationDeviceRepository.findOneBy({
      token: deviceInput.token,
    });
    if (deviceInput.userId) {
      const deviceWithUser = await this.notificationDeviceRepository.findOneBy({
        userId: deviceInput.userId,
      });
    }

    if (deviceWithToken) {
      return await this.notificationDeviceRepository.save({
        ...deviceWithToken,
        ...deviceInput,
        updatedAt: new Date(),
      });
    } else {
      return await this.notificationDeviceRepository.save({
        ...deviceInput,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // return await this.notificationDeviceRepository.findOneBy({
    //     token:deviceInput.token,
    // })

    // return await this.notificationDeviceRepository.save({
    //     ...deviceInput,
    //     createdAt: new Date(),
    // })
  }

  async sendNotificationUser(
    input: NotificationInput,
    toUserId: number,
    fromUserId: number,
    data: object,
  ): Promise<Notification> {
    const devices = await this.notificationDeviceRepository.find({
      where: { userId: toUserId },
    });

    const androidSpecific = {
      notification: {
        eventTimestamp: new Date(),
      },
    };

    const messageObject = await this.notificationRepository.save({
      ...input,
      createdAt: new Date(),
      fromUserId: fromUserId,
      toUserId: toUserId,
      data: JSON.stringify(data),
    });

    const firebaseMessages = devices.map((device) => ({
      token: device.token,
      title: input.title,
      image: input.image,
      message: input.body,
      data: data,
      android: androidSpecific,
    }));

    const send_response =
      await this.notificationsSendService.sendFirebaseMessages(
        firebaseMessages,
      );
    return messageObject;
  }

  async findNotificationsUser(
    limit: number,
    offset: number,
    userId: number,
  ): Promise<[Notification[], number]> {
    return await this.notificationRepository.findAndCount({
      where: { toUserId: userId },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
  }

  async findNotifications(
    limit: number,
    offset: number,
    userId: number,
  ): Promise<[Notification[], number]> {
    let filters: any = {};
    let filters1: any = {};

    if (userId) {
      filters.toUserId = userId;
    }
    filters1.data = Like('{%category%urgent%}');

    return await this.notificationRepository.findAndCount({
      where: [{ ...filters }, { ...filters1 }],
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
  }
}
