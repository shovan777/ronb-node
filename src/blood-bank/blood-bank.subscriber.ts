import { Inject } from '@nestjs/common';
import { PublishState } from 'src/common/enum/publish_state.enum';
import { NotificationsService } from 'src/notifications/notifications.service';
import { getAuthor } from 'src/users/users.resolver';
import { UsersService } from 'src/users/users.service';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from 'typeorm';
import { BloodBankService } from './blood-bank.service';
import { BloodRequest } from './entities/blood-bank.entity';

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

  async afterUpdate(event: UpdateEvent<BloodRequest>): Promise<any> {
    const { entity, updatedColumns } = event;

    //Send notification when user publishes the blood request
    if (
      entity.state == PublishState.PUBLISHED &&
      entity.state !== event.databaseEntity.state
    ) {
      console.log(
        `(Notification): Blood Request for blood group ${entity.bloodGroup}`,
      );

      //TODO: Get the users with the same blood group as the request.
      let users = [1, 504];

      this.notificationService.sendNotification(
        {
          title: `Blood Request for blood group ${entity.bloodGroup}`,
          body: 'This is the description of the blood request',
        },
        users,
      );
    }

    //Send notification when a user accepts to donate blood
    if (entity.acceptors.length !== event.databaseEntity.acceptors.length) {
      const newAcceptorsArray = entity.acceptors;
      const oldAcceptorsArray = event.databaseEntity.acceptors;

      const result = newAcceptorsArray.filter(
        (id: number) => !oldAcceptorsArray.includes(id),
      );
      if (result.length > 0) {
        const doner = await getAuthor(this.userService, parseInt(result));
        console.log(
          `(Notification): User ${doner.username} has accepted to donate blood.`,
        );

        //TODO: Get the requestor(user) of this blood request.
        let users = [1];

        this.notificationService.sendNotification(
          {
            title: `User ${doner.username} has accepted to donate blood.`,
            body: 'This is the description of the accepted blood request',
          },
          users,
        );
      }
    }
  }
}
