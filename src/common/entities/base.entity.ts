import { Field, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType({ isAbstract: true })
@Entity()
export abstract class BaseIdEntity {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;
}

@ObjectType({ isAbstract: true })
@Entity()
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
