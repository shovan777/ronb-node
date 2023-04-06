import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from '../../common/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
class NotificationAbstract extends BaseIdEntity {
  @Field({ description: 'Notification title' })
  @Column()
  title: string;

  @Field({ description: 'Notification body' })
  @Column()
  body: string;

  @Field({ description: 'Notification image', nullable: true })
  @Column({ nullable: true })
  image?: string;

  @Field({ description: 'Notification data', nullable: true })
  @Column({ nullable: true })
  data?: string;

  @Field({ description: 'Created at' })
  @CreateDateColumn()
  createdAt: Date;
}

@ObjectType()
@Entity()
export class NotificationDevice extends BaseIdEntity {
  @Field({ description: 'Notification device token' })
  @Column({ unique: true })
  token: string;

  @Field({ description: 'Notification device platform' })
  @Column()
  platform: string;

  @Field(() => Int, { description: 'Notification device User', nullable: true })
  @Column({ type: 'int', nullable: true })
  userId?: number;

  @Field({ description: 'Created at' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'Updated at' })
  @UpdateDateColumn()
  updatedAt: Date;
}

@ObjectType()
@Entity()
export class Notification extends NotificationAbstract {
  @Field(() => Int, { description: 'Notification from User', nullable: true })
  @Column({ type: 'int', nullable: true })
  fromUserId?: number;

  @Field(() => Int, { description: 'Notification to User', nullable: true })
  @Column({ type: 'int', nullable: true })
  toUserId?: number;
}

// @ObjectType()
// @Entity()
// export class NotificationUser extends BaseIdEntity {
//     @Field({ description: 'Notification user' })
//     @Column()
//     userId: string;

//     @Field({ description: 'Notification' })
//     @Column()
//     notificationId: string;

//     @Field({ description: 'date of creation' })
//     @CreateDateColumn()
//     createdAt: Date;

//     @Field({ description: 'date of update' })
//     @UpdateDateColumn()
//     updatedAt: Date;
// }
