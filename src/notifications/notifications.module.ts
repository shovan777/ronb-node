import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsModule } from 'src/news/news.module';
import { Notification, NotificationDevice } from './entities/notifications.entity';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsSendService, NotificationsService } from './notifications.service';


@Module({
    providers: [
        NotificationsSendService,
        NotificationsResolver,
        NotificationsService,
    ],
    imports: [
        forwardRef(() => NewsModule),
        TypeOrmModule.forFeature([
            NotificationDevice,
            Notification,
        ]),
    ],
    exports: [
        NotificationsSendService,
        NotificationsService,
    ],
})
export class NotificationsModule {}