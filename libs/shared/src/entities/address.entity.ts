import { Field, ObjectType, Int, registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class BaseProvince {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Province name' })
  @Column()
  name: string;

  @Field(() => [BaseDistrict], {
    description: 'Province Districts',
  })
  @OneToMany(() => BaseDistrict, (district) => district.province, {
    eager: true,
  })
  districts: BaseDistrict[];
}

@ObjectType()
@Entity()
export class BaseDistrict {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'District Name' })
  @Column()
  name: string;

  @Field(() => BaseProvince, {
    description: 'Districts Province',
    nullable: true,
  })
  @ManyToOne(() => BaseProvince, (province) => province.districts)
  province: BaseProvince;
}
