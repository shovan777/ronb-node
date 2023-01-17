import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { CreatorBaseEntity } from 'src/common/entities/base.entity';
import { State as YellowPagesState } from 'src/common/enum/state.enum';
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
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Yellow Pages name' })
  @Column()
  name: string;

  @Field({ description: 'Yellow Pages description', nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [YellowPages], { description: 'Yellow Pages in this category' })
  @OneToMany(() => YellowPages, (yellowpages) => yellowpages.category, {
    eager: true,
  })
  yellowpages: YellowPages[];
}

registerEnumType(YellowPagesState, {
  name: 'YellowPagesState',
});

@ObjectType()
@Entity()
export class YellowPages {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ description: 'Yellow Pages name' })
  @Column()
  name: string;

  @Field({ description: 'Yellow Pages description', nullable: true })
  @Column({ nullable: true })
  description?: string;

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
  })
  @OneToMany(
    () => YellowPagesPhoneNumber,
    (phone_number) => phone_number.yellowpages,
    { nullable: true },
  )
  phone_number?: YellowPagesPhoneNumber[];

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

  @Field(() => [District], { description: 'Province Districts' })
  @OneToMany(() => District, (district) => district.province)
  district: District[];

  @Field(()=> [YellowPagesAddress],{ description: 'Addresses for this province' })
  @OneToMany(() => YellowPagesAddress, (yellowpagesaddress) => yellowpagesaddress.province)
  yellowpagesaddress: YellowPagesAddress[]
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

  @Field(()=> [YellowPagesAddress],{ description: 'Address for this district' })
  @OneToMany(() => YellowPagesAddress, (yellowpagesaddress) => yellowpagesaddress.district)
  yellowpagesaddress: YellowPagesAddress[]
}

// export enum District {
//   Achham = 'Achham',
//   Arghakhanchi = 'Arghakhanchi',
//   Baglung = 'Baglung',
//   Baitadi = 'Baitadi',
//   Bajhang = 'Bajhang',
//   Bajura = 'Bajura',
//   Banke = 'Banke',
//   Bara = 'Bara',
//   Bardiya = 'Bardiya',
//   Bhaktapur = 'Bhaktapur',
//   Bhojpur = 'Bhojpur',
//   Chitawan = 'Chitawan',
//   Dadeldhura = 'Dadeldhura',
//   Dailekh = 'Dailekh',
//   Dang = 'Dang',
//   Darchula = 'Darchula',
//   Dhading = 'Dhading',
//   Dhankuta = 'Dhankuta',
//   Dhanusa = 'Dhanusa',
//   Dolakha = 'Dolakha',
//   Dolpa = 'Dolpa',
//   Doti = 'Doti',
//   Galkot = 'Galkot',
//   Gandaki = 'Gandaki',
//   Ghorahi = 'Ghorahi',
//   Gulmi = 'Gulmi',
//   Humla = 'Humla',
//   Ilam = 'Ilam',
//   Jajarkot = 'Jajarkot',
//   Jhapa = 'Jhapa',
//   Jumla = 'Jumla',
//   Kailali = 'Kailali',
//   Kalikot = 'Kalikot',
//   Kanchanpur = 'Kanchanpur',
//   Kapilvastu = 'Kapilvastu',
//   Kaski = 'Kaski',
//   Kathmandu = 'Kathmandu',
//   Kavrepalanchok = 'Kavrepalanchok',
//   Khotang = 'Khotang',
//   Lalitpur = 'Lalitpur',
//   Lamjung = 'Lamjung',
//   Mahottari = 'Mahottari',
//   Makwanpur = 'Makwanpur',
//   Manang = 'Manang',
//   Morang = 'Morang',
//   Mugu = 'Mugu',
//   Mustang = 'Mustang',
//   Myagdi = 'Myagdi',
//   Nawalparasi = 'Nawalparasi',
//   Nuwakot = 'Nuwakot',
//   Okhaldhunga = 'Okhaldhunga',
//   Palpa = 'Palpa',
//   Panchthar = 'Panchthar',
//   Parbat = 'Parbat',
//   Parsa = 'Parsa',
//   Pyuthan = 'Pyuthan',
//   Ramechhap = 'Ramechhap',
//   Rasuwa = 'Rasuwa',
//   Rautahat = 'Rautahat',
//   Rolpa = 'Rolpa',
//   Rukum = 'Rukum',
//   Rupandehi = 'Rupandehi',
//   Salyan = 'Salyan',
//   Sankhuwasabha = 'Sankhuwasabha',
//   Saptari = 'Saptari',
//   Sarlahi = 'Sarlahi',
//   Sindhuli = 'Sindhuli',
//   Sindhupalchok = 'Sindhupalchok',
//   Siraha = 'Siraha',
//   Solukhumbu = 'Solukhumbu',
//   Sunsari = 'Sunsari',
//   Surkhet = 'Surkhet',
//   Syangja = 'Syangja',
//   Tanahu = 'Tanahu',
//   Taplejung = 'Taplejung',
//   Terhathum = 'Terhathum',
//   Udayapur = 'Udayapur',
// }

// export enum Province {
//   Province_No_1 = 'Province_No_1',
//   Madhesh = 'Madhesh',
//   Bagmati = 'Bagmati',
//   Gandaki = 'Gandaki',
//   Lumbini = 'Lumbini',
//   Karnali = 'Karnali',
//   Sudurpashchim = 'Sudurpashchim',
// }

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

  @Field(() => District, { description: 'District Type' })
  @ManyToOne(() => District, (district) => district.yellowpagesaddress)
  district: District;

  @Field(() => Province, { description: 'Province Type' })
  @ManyToOne(() => Province, (province) => province.yellowpagesaddress)
  province: Province;

  @Field(() => YellowPages, { description: '' })
  @ManyToOne(() => YellowPages, (yellowpages) => yellowpages.address, {
    onDelete: 'CASCADE',
    eager: true,
  })
  yellowpages?: YellowPages;
}

@ObjectType()
@Entity()
export class YellowPagesPhoneNumber {
  @Field(() => Int, { description: 'id field for int' })
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int, { description: 'Phone number' })
  @Column()
  phone_number: number;

  @Field(() => Boolean, { description: '' })
  @Column({ type: 'boolean' })
  is_emergency: boolean;

  @Field(() => YellowPages, { description: '' })
  @ManyToOne(() => YellowPages, (yellowpages) => yellowpages.phone_number, {
    onDelete: 'CASCADE',
    eager: true,
  })
  yellowpages?: YellowPages;
}
