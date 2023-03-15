import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BigIntResolver } from 'graphql-scalars';
import {
  CreatorBaseEntity,
  District,
  Province,
} from 'src/common/entities/base.entity';
import { PublishState as BloodRequestState } from 'src/common/enum/publish_state.enum';
import { BloodGroup } from 'src/common/enum/bloodGroup.enum';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Field(() => BloodRequest, { description: '' })
  @OneToOne(() => BloodRequest, (yellowpages) => yellowpages.address, {
    onDelete: 'CASCADE',
  })
  bloodRequest?: BloodRequest;
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
  @Column('decimal', { precision: 1, scale: 2 })
  amount: number;

  @Field(() => BigIntResolver, { description: 'Phone number' })
  @Column({ type: 'bigint' })
  phoneNumber: number;

  @Field(() => [BloodRequestAddress])
  @OneToOne(() => BloodRequestAddress, (address) => address.bloodRequest, {
    cascade: true,
  })
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

  @Field({ nullable: true })
  @Column({ type: 'int', array: true, nullable: true })
  @Index('unique_acceptors', { unique: true })
  acceptors: number[];
}
