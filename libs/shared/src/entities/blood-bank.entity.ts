import { Field, Float, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BigIntResolver } from 'graphql-scalars';
import { CreatorBaseEntity } from '@app/shared/common/entities/base.entity';
import {
  BaseProvince,
  BaseDistrict,
} from '@app/shared/entities/address.entity';
import { PublishState } from '@app/shared/common/enum/publish_state.enum';
import { BloodGroup } from '@app/shared/common/enum/bloodGroup.enum';
BloodGroup;
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArrayUnique } from 'class-validator';
import { Author } from '@app/shared/entities/users.entity';

export enum PublishStateExtended {
  COMPLETE = 'complete',
  CANCELLED = 'cancelled',
}

export type BloodRequestStateType = PublishState | PublishStateExtended;
export const BloodRequestState = { ...PublishState, ...PublishStateExtended };

registerEnumType(BloodRequestState, {
  name: 'BloodRequestState',
});

@ObjectType()
@Entity()
export class BloodRequestAddress {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => BaseDistrict, { description: 'District Type', nullable: true })
  @ManyToOne(() => BaseDistrict, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  district: BaseDistrict;

  @Field(() => BaseProvince, { description: 'Province Type', nullable: true })
  @ManyToOne(() => BaseProvince, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  province: BaseProvince;

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

  @Field({
    description: 'Further description of the blood request',
    nullable: true,
  })
  @Column({ nullable: true })
  description?: string;

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
  state: BloodRequestStateType;

  @Field(() => Boolean, { description: 'Is the blood request an emergency?' })
  @Column({ type: 'boolean', default: false })
  is_emergency: boolean;

  @Field(() => [Int], { nullable: true })
  @Column('int', { array: true, nullable: true })
  @ArrayUnique()
  acceptors?: number[];

  @Field(() => [Int], { nullable: true })
  @Column('int', { array: true, nullable: true })
  @ArrayUnique()
  doners?: number[];

  @Field(() => Author, {
    description: 'Profile of the user who created the request',
    nullable: true,
  })
  profile: Author;

  @Field({ description: 'Donated date', nullable: true })
  @Column({ nullable: true })
  donatedDate: Date;
}

@ObjectType({ description: 'Acceptors of blood request' })
export class Acceptors extends Author {}
