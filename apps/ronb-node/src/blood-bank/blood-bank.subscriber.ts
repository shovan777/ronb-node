import { Inject } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { getAuthor } from '../users/users.resolver';
import { UsersService } from '../users/users.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { BloodBankService } from './blood-bank.service';
import {
  BloodRequest,
  BloodRequestState,
} from '@app/shared/entities/blood-bank.entity';
import { Author } from '@app/shared/entities/users.entity';

async function sendNotificationOnCreateOrUpdate(entity: any, service: any) {
  console.log(
    `(Notification: ${process.env.SEND_NOTIFICATION}/${typeof process.env
      .SEND_NOTIFICATION}): Blood Request for blood group ${entity.bloodGroup}`,
  );
  const bloodGroup = entity.bloodGroup;

  let users = await service.findUserIdByBloodGroup(bloodGroup);
  this.notificationService.sendNotificationGroup(
    {
      title: `Blood Request for blood group ${entity.bloodGroup}`,
      body: 'This is the description of the blood request',
      data: '{}',
    },
    users,
  );
}

@EventSubscriber()
export class BloodRequestSubsriber
  implements EntitySubscriberInterface<BloodRequest>
{
  constructor(
    dataSource: DataSource,
    @Inject(NotificationsService)
    private readonly notificationService: NotificationsService,
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {
    dataSource.subscribers.push(this);
  }
  listenTo(): any {
    return BloodRequest;
  }
  async afterInsert(event: InsertEvent<BloodRequest>): Promise<any> {
    const { entity } = event;

    if (entity.state == BloodRequestState.PUBLISHED) {
      sendNotificationOnCreateOrUpdate(entity, this.userService);
    }
  }

  async afterUpdate(event: UpdateEvent<BloodRequest>): Promise<any> {
    const { entity, updatedColumns } = event;

    //Send notification when user publishes the blood request
    if (
      entity.state == BloodRequestState.PUBLISHED &&
      entity.state !== event.databaseEntity.state
    ) {
      sendNotificationOnCreateOrUpdate(entity, this.userService);
    }

    //Send notification when a user accepts to donate blood
    if (entity.acceptors.length !== event.databaseEntity.acceptors.length) {
      const newAcceptorsArray = entity.acceptors;
      const oldAcceptorsArray = event.databaseEntity.acceptors;

      const data = {}; //TODO: Send the necessary data for the notification
      const result = newAcceptorsArray.filter(
        (id: number) => !oldAcceptorsArray.includes(id),
      );
      if (result.length > 0) {
        const doner = await getAuthor(this.userService, parseInt(result));

        let requestor: Author = await this.userService.findOne(
          entity.createdBy,
        );
        console.log(
          `(Notification to user ${requestor.id}): User ${doner.username} has accepted to donate blood.`,
        );
        this.notificationService.sendNotificationUser(
          {
            title: `User ${doner.username} has accepted to donate blood.`,
            body: 'This is the description of the accepted blood request',
          },
          requestor.id,
          doner.id,
          data,
        );
      }
    }

    //Send Notification to the acceptors of the blood request about the cancellation of the request.
    if (entity.state == BloodRequestState.CANCELLED) {
      const users: number[] = entity.acceptors;
      console.log(
        '🚀 ~ file: blood-bank.subscriber.ts:105 ~ afterUpdate ~ users:',
        users,
      );
      const users1: number[] = event.databaseEntity.acceptors;
      console.log(
        '🚀 ~ file: blood-bank.subscriber.ts:107 ~ afterUpdate ~ users1:',
        users1,
      );

      console.log(
        `(Notification to user ${users}): Blood Request for blood group ${entity.bloodGroup} that you accepted has been cancelled.`,
      );
      this.notificationService.sendNotificationGroup(
        {
          title: `Blood Request for blood group ${entity.bloodGroup} that you accepted has been cancelled.`,
          body: 'This is the description of the blood request',
          data: '{}',
        },
        users,
      );
    }
  }
}
