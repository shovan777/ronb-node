import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
export abstract class BaseIdEntity {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;
}

@ObjectType({ isAbstract: true })
export abstract class CreatorBaseEntity extends BaseIdEntity {
  @Field({ description: 'date of creation' })
  @CreateDateColumn()
  createdAt: Date;

  @Field({ description: 'date of update' })
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Int, { description: 'one who created' })
  @Column()
  createdBy: number;

  @Field(() => Int, { description: 'one who updated' })
  @Column()
  updatedBy: number;
}

export enum UserReacts {
  LOVE = 'love',
  HAHA = 'haha',
  SAD = 'sad',
  ANGRY = 'angry',
}

registerEnumType(UserReacts, {
  name: 'UserReacts',
});

@ObjectType({ isAbstract: true })
export abstract class BaseUserLikesEntity {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryColumn({ type: 'int', nullable: false })
  userId: number;

  @Field(() => UserReacts, { description: 'User reacts' })
  @Column({ type: 'enum', enum: UserReacts, default: UserReacts.LOVE })
  react: UserReacts;
}
