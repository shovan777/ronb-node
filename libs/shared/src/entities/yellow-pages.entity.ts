import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, BigIntResolver } from 'graphql-scalars';
import { CreatorBaseEntity } from '../common/entities/base.entity';
import { PublishState as YellowPagesState } from '../common/enum/publish_state.enum';
import { pathFinderMiddleware } from '../common/middlewares/pathfinder.middleware';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class YellowPagesCatgory extends CreatorBaseEntity {
  @Field({ description: 'Yellow Pages name' })
  @Column()
  name: string;

  @Field({ description: 'Yellow Pages description', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [YellowPages], { description: 'Yellow Pages in this category' })
  @OneToMany(() => YellowPages, (yellowpages) => yellowpages.category)
  yellowpages: YellowPages[];
}

@ObjectType()
@Entity()
export class YellowPages extends CreatorBaseEntity {
  @Field({ description: 'Yellow Pages name' })
  @Column()
  name: string;

  @Field({ description: 'Yellow Pages description', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({
    description: 'Yellow Pages main image',
    nullable: true,
    middleware: [pathFinderMiddleware],
  })
  @Column({ nullable: true })
  singleImage?: string;

  @Field(() => [YellowPagesAddress], {
    description: 'Yellow Pages address(s)',
    nullable: true,
  })
  @OneToMany(() => YellowPagesAddress, (address) => address.yellowpages, {
    nullable: true,
  })
  address?: YellowPagesAddress[];

  @Field(() => [YellowPagesPhoneNumber], {
    description: 'Yellow Pages phone number(s)',
    nullable: true,
  })
  @OneToMany(
    () => YellowPagesPhoneNumber,
    (phone_number) => phone_number.yellowpages,
    { nullable: true },
  )
  phone_number?: YellowPagesPhoneNumber[];

  @Field(() => [YellowPagesEmail], {
    description: 'Yellow Pages email(s)',
    nullable: true,
  })
  @OneToMany(() => YellowPagesEmail, (email) => email.yellowpages, {
    nullable: true,
    eager: true,
  })
  email?: YellowPagesEmail[];

  @Field(() => YellowPagesCatgory, {
    description: 'Yellow Pages category',
    nullable: true,
  })
  @ManyToOne(() => YellowPagesCatgory, (category) => category.yellowpages, {
    nullable: true,
  })
  category?: YellowPagesCatgory;

  @Field(() => YellowPagesState, { description: 'Yellow Pages state' })
  @Column({
    type: 'enum',
    enum: YellowPagesState,
    default: YellowPagesState.DRAFT,
  })
  state: YellowPagesState;

  @Field({ description: 'Yellow Pages publishedAt', nullable: true })
  @Column({ nullable: true })
  publishedAt: Date;
}

@ObjectType()
@Entity()
export class Province {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Province name' })
  @Column()
  name: string;

  @Field(() => [District], {
    description: 'Province Districts',
  })
  @OneToMany(() => District, (district) => district.province, { eager: true })
  district: District[];

  @Field(() => [YellowPagesAddress], {
    description: 'Addresses for this province',
  })
  @OneToMany(
    () => YellowPagesAddress,
    (yellowpagesaddress) => yellowpagesaddress.province,
    { nullable: true },
  )
  yellowpagesaddress: YellowPagesAddress[];
}

@ObjectType()
@Entity()
export class District {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'District Name' })
  @Column()
  name: string;

  @Field(() => Province, { description: 'Districts Province', nullable: true })
  @ManyToOne(() => Province, (province) => province.district)
  province: Province;

  @Field(() => [YellowPagesAddress], {
    description: 'Address for this district',
  })
  @OneToMany(
    () => YellowPagesAddress,
    (yellowpagesaddress) => yellowpagesaddress.district,
  )
  yellowpagesaddress: YellowPagesAddress[];
}

// registerEnumType(District, {
//   name: 'District',
// });

// registerEnumType(Province, {
//   name: 'Province',
// });

@ObjectType()
@Entity()
export class YellowPagesAddress {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => District, { description: 'District Type', nullable: true })
  @ManyToOne(() => District, (district) => district.yellowpagesaddress, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  district: District;

  @Field(() => Province, { description: 'Province Type', nullable: true })
  @ManyToOne(() => Province, (province) => province.yellowpagesaddress, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  province: Province;

  @Field({ description: 'Address' })
  @Column()
  address: string;

  @Field(() => YellowPages, { description: '' })
  @ManyToOne(() => YellowPages, (yellowpages) => yellowpages.address, {
    onDelete: 'CASCADE',
  })
  yellowpages?: YellowPages;
}

@ObjectType()
@Entity()
export class YellowPagesPhoneNumber {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => BigIntResolver, { description: 'Phone number' })
  @Column({ type: 'bigint' })
  phone_number: number;

  @Field(() => Boolean, { description: '' })
  @Column({ type: 'boolean', default: false })
  is_emergency: boolean;

  @Field(() => YellowPages, { description: '' })
  @ManyToOne(() => YellowPages, (yellowpages) => yellowpages.phone_number, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  yellowpages?: YellowPages;
}

@ObjectType()
@Entity()
export class YellowPagesEmail {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => EmailAddressResolver, { description: 'Email' })
  @Column()
  email: string;

  @Field(() => YellowPages, { description: '' })
  @ManyToOne(() => YellowPages, (yellowpages) => yellowpages.email, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  yellowpages?: YellowPages;
}
