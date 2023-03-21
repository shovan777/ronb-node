import { DataSource, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from "typeorm";
import { NewsReply, UserLikesNewsComment, UserLikesNewsReply } from "./entities/comment.entity";
import { Inject, Logger } from "@nestjs/common";
import { NotificationsService } from "../notifications/notifications.service";
import { NewsCommentsService } from "./comments.service";
import { getAuthor } from "../users/users.resolver";
import { UsersService } from "../users/users.service";


@EventSubscriber()
export class NewsReplySubscriber implements EntitySubscriberInterface<NewsReply> {

    constructor(
        dataSource: DataSource,
        @Inject(NotificationsService)
        private readonly notificationsService: NotificationsService,
        private readonly userService: UsersService,
        private readonly newsCommentService: NewsCommentsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo(): any {
        return NewsReply;
    }

    async afterInsert(event: InsertEvent<NewsReply>): Promise<any> {
        const entity = event.entity;
        Logger.log(entity);
        const author = await getAuthor(this.userService, entity.author);
        const comment = await this.newsCommentService.findOneWithNews(entity.comment.id);

        const data = {
            "newId" : comment.news.id.toString(),
            "category": "Reply",
            "userId": comment.author.toString(),
            "commentId": comment.id.toString(),
        };
        if (entity.repliedTo == entity.comment.author) {
            if (entity.repliedTo != entity.author) {
                this.notificationsService.sendNotificationUser({
                    title: `${author.name} replied to your comment`,
                    body: `${entity.content}`,
                }, entity.repliedTo, entity.author, data);
            }
        } else {
            if (entity.repliedTo != entity.author) {
                this.notificationsService.sendNotificationUser({
                    title: `${author.name} replied to your comment`,
                    body: `${entity.content}`,
                }, entity.repliedTo, entity.author, data);
            }
            if (entity.comment.author != entity.author) {
                this.notificationsService.sendNotificationUser({
                    title: `${author.name} replied to your comment`,
                    body: `${entity.content}`,
                }, entity.comment.author, entity.author, data);
            }
        }
    }

}


@EventSubscriber()
export class UserLikesNewsCommentSubscriber implements EntitySubscriberInterface<UserLikesNewsComment> {

    constructor(
        dataSource: DataSource,
        @Inject(NotificationsService)
        private readonly notificationsService: NotificationsService,
        private readonly userService: UsersService,
        private readonly newsCommentService: NewsCommentsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo(): any {
        return UserLikesNewsComment ;
    }

    async afterInsert(event: InsertEvent<UserLikesNewsComment>): Promise<any> {
        const entity = event.entity;
        
        const author = await getAuthor(this.userService, entity.userId);
        const comment = await this.newsCommentService.findOneWithNews(entity.comment.id);

        const data = {
            "newId" : comment.news.id.toString(),
            "category": "Like",
            "userId": comment.author.toString(),
            "commentId": comment.id.toString(),
        };

        if (entity.comment.author != entity.userId) {
            this.notificationsService.sendNotificationUser({
                title: `${author.name} reacted to your comment`,
                body: `${entity.comment.content}`,
            }, entity.comment.author, entity.userId, data);
        }
    }

    async afterUpdate(event: UpdateEvent<UserLikesNewsComment>): Promise<any> {
        const entity = event.entity;
        
        const author = await getAuthor(this.userService, entity.userId);
        const comment = await this.newsCommentService.findOneWithNews(entity.comment.id);
        
        const data = {
            "newId" : comment.news.id.toString(),
            "category": "Like",
            "userId": comment.author.toString(),
            "commentId": comment.id.toString(),
        };
        if (entity.comment.author != entity.userId) {
            this.notificationsService.sendNotificationUser({
                title: `${author.name} reacted to your comment`,
                body: `${entity.comment.content}`,
            }, entity.comment.author, entity.userId, data);
        }
    }

}

@EventSubscriber()
export class UserLikesNewsReplySubscriber implements EntitySubscriberInterface<UserLikesNewsReply> {

    constructor(
        dataSource: DataSource,
        @Inject(NotificationsService)
        private readonly notificationsService: NotificationsService,
        private readonly userService: UsersService,
        private readonly newsCommentService: NewsCommentsService,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo(): any {
        return UserLikesNewsReply ;
    }

    async afterInsert(event: InsertEvent<UserLikesNewsReply>): Promise<any> {
        const entity = event.entity;

        const author = await getAuthor(this.userService, entity.userId);
        const comment = await this.newsCommentService.findOneWithNews(entity.reply.comment.id);

        const data = {
            "newId" : comment.news.id.toString(),
            "category": "Reply Like",
            "userId": comment.author.toString(),
            "commentId": comment.id.toString(),
        };
        if (entity.reply.author != entity.userId) {
            this.notificationsService.sendNotificationUser({
                title: `${author.name} reacted to your reply`,
                body: `${entity.reply.content}`,
            }, entity.reply.author, entity.userId, data);
        }
    }

    async afterUpdate(event: UpdateEvent<UserLikesNewsReply>): Promise<any> {
        const entity = event.entity;
        
        const author = await getAuthor(this.userService, entity.userId);
        const comment = await this.newsCommentService.findOneWithNews(entity.reply.comment.id);
        
        const data = {
            "newId" : comment.news.id.toString(),
            "category": "Reply Like",
            "userId": comment.author.toString(),
            "commentId": comment.id.toString(),
        };
        if(entity.reply.author != entity.userId) {
            this.notificationsService.sendNotificationUser({
                title: `${author.name} reacted to your comment`,
                body: `${entity.reply.content}`,
            }, entity.reply.author, entity.userId, data);
        }
    }
}