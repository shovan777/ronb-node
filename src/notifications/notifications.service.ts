import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { mapLimit } from 'async';
import * as firebase from 'firebase-admin';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api';
import { join } from 'path';
import { chunk } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification, NotificationDevice } from './entities/notifications.entity';
import { Repository } from 'typeorm';
import { CreateNotificationDeviceInput, NotificationInput, NotificationNewsInput } from './dto/create-notification.input';
import { NewsService } from 'src/news/news.service';
import { generateFileUrl } from 'src/common/utils/fileurl';
const striptags = require('striptags');

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
        const firebaseCredentials = join(process.cwd(), process.env.FIREBASE_PATH, "firebase.json");
        firebase.initializeApp({
            credential: firebase.credential.cert(firebaseCredentials),
            databaseURL: "https://ronb-354910-default-rtdb.firebaseio.com"
        });
    }

    public async sendFirebaseMessages(firebaseMessages: ISendFirebaseMessages[], dryRun?: boolean): Promise<BatchResponse> {
        const batchedFirebaseMessages = chunk(firebaseMessages, 500);
        const batchResponses = await mapLimit<ISendFirebaseMessages[], BatchResponse> (
            batchedFirebaseMessages,
            process.env.FIREBASE_PARALLEL_LIMIT || 1,
            async (groupedFirebaseMessages: ISendFirebaseMessages[]): Promise<BatchResponse> => {
                try {
                    const tokenMessages: firebase.messaging.TokenMessage[] = groupedFirebaseMessages.map(({ message, title, token, image, data, android }) => ({
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
                            }
                        },
                        android:android,
                    }));
                    return await this.sendAll(tokenMessages, dryRun);
                } catch (error) {
                    return {
                        responses: groupedFirebaseMessages.map(() => ({
                            success: false,
                            error
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
            ({
                responses : [],
                successCount: 0,
                failureCount: 0,
            } as unknown) as BatchResponse,
        );
    }

    public async sendAll(messages: firebase.messaging.TokenMessage[], dryRun?: boolean): Promise<BatchResponse> {
        if (process.env.NODE_ENV === 'local') {
            for (const {notification, token} of messages) {
                console.log(`Sending notification to ${token} with title ${notification.title} and body ${notification.body}`);
            }
        }
        return await firebase.messaging().sendAll(messages, dryRun);
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

    async create(deviceInput:CreateNotificationDeviceInput): Promise<NotificationDevice> {
        return await this.notificationDeviceRepository.save({
            ...deviceInput,
            createdAt: new Date(),
        });
    }

    async findAll(): Promise<NotificationDevice[]> {
        return await this.notificationDeviceRepository.find({});
    }

    async sendNotification(data:NotificationInput): Promise<Notification> {
        const messageObject = await this.notificationRepository.save({
            ...data,
            createdAt: new Date(),
        });
        const devices = await this.findAll();
        const firebaseMessages = devices.map(device => ({
            token: device.token,
            title: data.title,
            message: data.body,
        }));
        const send_response = await this.notificationsSendService.sendFirebaseMessages(firebaseMessages);
        return messageObject;
    }

    async sendNotificationNews(notificationNewsInput: NotificationNewsInput): Promise<Notification> {
        const newsObject = await this.newsService.findOne(notificationNewsInput.newsId);
        const title = newsObject.title;
        const body = striptags(newsObject.content).substring(0, 150);
        const image = newsObject.images[0]?.imageURL;
        let imageURL = "";
        if (image) {
            imageURL = generateFileUrl(image);
        }
        const dataObject = {
            "newId": newsObject.id.toString(),
        }
        
        const messageObject = await this.notificationRepository.save({
            title: title,
            body: body,
            image: imageURL,
            data: JSON.stringify(dataObject),
        });
        
        const androidSpecific = {
            notification: {
                eventTimestamp: new Date(),
            }
        };

        const devices = await this.findAll();
        const firebaseMessages = devices.map(device => ({
            token: device.token,
            title: title,
            message: body,
            image: imageURL,
            data: dataObject,
            android: androidSpecific,
        }));

        this.notificationsSendService.sendFirebaseMessages(firebaseMessages);
        // console.log(sendRespone)
        return messageObject;
    }
}