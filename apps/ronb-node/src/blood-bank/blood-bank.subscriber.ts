import { Inject } from '@nestjs/common';
import { PublishState } from '@app/shared/common/enum/publish_state.enum';
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
import { BloodRequest } from '@app/shared/entities/blood-bank.entity';
import { Author } from '@app/shared/entities/users.entity';

async function sendNotificationOnCreateOrUpdate(entity: any) {
  console.log(
    `(Notification): Blood Request for blood group ${entity.bloodGroup}`,
  );

  const bloodGroup = entity.bloodGroup;

  let users = await this.userService.findUserByBloodGroup(bloodGroup);

  const ids = users.map((user) => user.user_id);

  this.notificationService.sendNotificationGroup(
    {
      title: `Blood Request for blood group ${entity.bloodGroup}`,
      body: 'This is the description of the blood request',
      data: '{}',
    },
    ids,
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
    @Inject(BloodBankService)
    private readonly bloodRequestService: BloodBankService,
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

    if (entity.state == PublishState.PUBLISHED) {
      sendNotificationOnCreateOrUpdate(entity);
    }
  }

  async afterUpdate(event: UpdateEvent<BloodRequest>): Promise<any> {
    const { entity, updatedColumns } = event;

    //Send notification when user publishes the blood request
    if (
      entity.state == PublishState.PUBLISHED &&
      entity.state !== event.databaseEntity.state
    ) {
      sendNotificationOnCreateOrUpdate(entity);
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
  }
}
