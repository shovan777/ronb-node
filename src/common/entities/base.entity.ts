import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import { GraphQLObjectType } from 'graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
  WOW = 'wow',
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

@ObjectType()
export class ReactCount {
  @Field(() => Int, { description: 'Number of love reacts', defaultValue: 0 })
  love: number;

  @Field(() => Int, { description: 'Number of hahas reacts', defaultValue: 0 })
  haha: number;

  @Field(() => Int, { description: 'Number of sad reacts', defaultValue: 0 })
  sad: number;

  @Field(() => Int, { description: 'Number of angry reacts', defaultValue: 0 })
  angry: number;

  @Field(() => Int, { description: 'Number of wow reacts', defaultValue: 0 })
  wow: number;

  // @Field(() => Int, { description: 'Total number of reacts', defaultValue: 0 })
  // total: number;
}

// export const ReactCountsObj = new GraphQLObjectType({
//   name: 'Counts',
//   fields: () => {
//     const field_obj = {};
//     Object.keys(UserReacts).forEach((react) => {
//       field_obj[react] = { type: Int, description: `Number of ${react}s` };
//     });
//     return field_obj;
//   },
//   description: 'Count of different reacts',
// });

// @ObjectType()
// export class ReactCountsAgain extends ReactCountsObj {}

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
  districts: District[];
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
  @ManyToOne(() => Province, (province) => province.districts)
  province: Province;
}
