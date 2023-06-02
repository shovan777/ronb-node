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
import { removeIdFromArray } from '@app/shared/common/utils/utils';

async function sendNotificationOnCreateOrUpdate(
  entity: any,
  service: any,
  notificationService: any,
) {
  console.log(
    `(Notification): Blood Request for blood group ${entity.bloodGroup}`,
  );
  const bloodGroup = entity.bloodGroup;

  let users = await service.findUserIdByBloodGroup(bloodGroup);
  const usersToNotify = removeIdFromArray(users, entity.createdBy.toString());

  // notificationService.sendNotificationGroup(
  //   {
  //     title: `${entity.bloodGroup} Blood request`,
  //     body: 'Someone needs blood near your location.',
  //     data: JSON.stringify({
  //       category: 'BLOOD',
  //     }),
  //   },
  //   usersToNotify,
  // );
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
      sendNotificationOnCreateOrUpdate(
        entity,
        this.userService,
        this.notificationService,
      );
    }
  }

  async afterUpdate(event: UpdateEvent<BloodRequest>): Promise<any> {
    const { entity, updatedColumns } = event;

    //Send notification when user publishes the blood request
    if (
      entity.state == BloodRequestState.PUBLISHED &&
      entity.state !== event.databaseEntity.state
    ) {
      sendNotificationOnCreateOrUpdate(
        entity,
        this.userService,
        this.notificationService,
      );
    }

    //Send notification when a user accepts to donate blood
    if (entity.acceptors.length !== event.databaseEntity.acceptors.length) {
      const newAcceptorsArray = entity.acceptors;
      const oldAcceptorsArray = event.databaseEntity.acceptors;

      const data = {
        category: 'BLOOD',
      };
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
        // this.notificationService.sendNotificationUser(
        //   {
        //     title: `Blood request accepted`,
        //     body: `${doner.username} accepted your blood request.`,
        //   },
        //   requestor.id,
        //   doner.id,
        //   data,
        // );
      }
    }

    //Send Notification to the acceptors of the blood request about the cancellation of the request.
    if (entity.state == BloodRequestState.CANCELLED) {
      const users: number[] = entity.acceptors;

      console.log(
        `(Notification to user ${users}): Blood Request for blood group ${entity.bloodGroup} that you accepted has been cancelled.`,
      );
      // this.notificationService.sendNotificationGroup(
      //   {
      //     title: `Blood request cancelled`,
      //     body: `Blood request for ${entity.bloodGroup} that you accepted has been cancelled`,
      //     data: JSON.stringify({
      //       category: 'BLOOD',
      //     }),
      //   },
      //   users,
      // );
    }
  }
}