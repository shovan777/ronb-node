import { Field, ObjectType, Int } from '@nestjs/graphql';
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

@ObjectType({ isAbstract: true })
export abstract class BaseUserLikesEntity {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryColumn({ type: 'int', nullable: false })
  userId: number;
}
