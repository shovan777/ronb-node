import { Field, ObjectType } from '@nestjs/graphql';
import { BaseIdEntity } from 'src/common/entities/base.entity';
import { Column, CreateDateColumn, Entity } from 'typeorm';


@ObjectType()
@Entity()
export class NotificationDevice extends BaseIdEntity {
    @Field({ description: 'Notification device token' })
    @Column({ unique: true })
    token: string;

    @Field({ description: 'Notification device platform' })
    @Column()
    platform: string;
    
    @Field({ description: "Created at"})
    @CreateDateColumn()
    createdAt: Date;
}


@ObjectType()
@Entity()
export class Notification extends BaseIdEntity {
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

    @Field({ description: "Created at"})
    @CreateDateColumn()
    createdAt: Date;
}