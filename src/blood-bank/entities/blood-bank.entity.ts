import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BigIntResolver } from 'graphql-scalars';
import {
  CreatorBaseEntity,
  BaseDistrict as District,
  BaseProvince as Province,
} from 'src/common/entities/base.entity';
import { PublishState as BloodRequestState } from 'src/common/enum/publish_state.enum';
import { BloodGroup } from 'src/common/enum/bloodGroup.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArrayUnique } from 'class-validator';
import { Author } from 'src/users/entitiy/users.entity';

@ObjectType()
@Entity()
export class BloodRequestAddress {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => District, { description: 'District Type', nullable: true })
  @ManyToOne(() => District, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  district: District;

  @Field(() => Province, { description: 'Province Type', nullable: true })
  @ManyToOne(() => Province, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  province: Province;

  @Field({ description: 'Address' })
  @Column()
  address: string;
}

@ObjectType()
@Entity()
export class BloodRequest extends CreatorBaseEntity {
  @Field(() => BloodGroup, { description: 'Type of blood group' })
  @Column({
    type: 'enum',
    enum: BloodGroup,
  })
  bloodGroup: BloodGroup;

  @Field(() => Float, { description: 'amount needed in this blood request' })
  @Column('decimal', { precision: 3, scale: 2 })
  amount: number;

  @Field(() => BigIntResolver, { description: 'Phone number' })
  @Column({ type: 'bigint' })
  phoneNumber: number;

  @Field(() => BloodRequestAddress)
  @OneToOne(() => BloodRequestAddress, {
    cascade: true,
  })
  @JoinColumn()
  address: BloodRequestAddress;

  @Field({ description: 'Donation date' })
  @Column()
  donationDate: Date;

  @Field(() => BloodRequestState, { description: 'Blood request state' })
  @Column({
    type: 'enum',
    enum: BloodRequestState,
    default: BloodRequestState.DRAFT,
  })
  state: BloodRequestState;

  @Field(() => [Int], { nullable: true })
  @Column('int', { array: true, nullable: true })
  @ArrayUnique()
  acceptors?: number[];
}

@ObjectType({ description: 'Acceptors of blood request' })
export class Acceptors extends Author {}
