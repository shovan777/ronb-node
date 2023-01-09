import { MigrationInterface, QueryRunner } from "typeorm";

export class addCascadeDelete1673252412663 implements MigrationInterface {
    name = 'addCascadeDelete1673252412663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP CONSTRAINT "FK_4fc7042af6aacb49138803983eb"`);
        await queryRunner.query(`ALTER TYPE "public"."yellow_pages_address_district_enum" RENAME TO "yellow_pages_address_district_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_district_enum" AS ENUM('Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitawan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Galkot', 'Gandaki', 'Ghorahi', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot', 'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja', 'Tanahu', 'Taplejung', 'Terhathum', 'Udayapur')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ALTER COLUMN "district" TYPE "public"."yellow_pages_address_district_enum" USING "district"::"text"::"public"."yellow_pages_address_district_enum"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_district_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."yellow_pages_address_province_enum" RENAME TO "yellow_pages_address_province_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_province_enum" AS ENUM('Province_No_1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ALTER COLUMN "province" TYPE "public"."yellow_pages_address_province_enum" USING "province"::"text"::"public"."yellow_pages_address_province_enum"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_province_enum_old"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD CONSTRAINT "FK_4fc7042af6aacb49138803983eb" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP CONSTRAINT "FK_4fc7042af6aacb49138803983eb"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe"`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_province_enum_old" AS ENUM('Mechi', 'Koshi', 'Sagarmatha', 'Janakpur', 'Bagmati', 'Narayani', 'Gandaki')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ALTER COLUMN "province" TYPE "public"."yellow_pages_address_province_enum_old" USING "province"::"text"::"public"."yellow_pages_address_province_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_province_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."yellow_pages_address_province_enum_old" RENAME TO "yellow_pages_address_province_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_district_enum_old" AS ENUM('Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitawan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Galkot', 'Gandaki', 'Ghorahi', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot', 'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ALTER COLUMN "district" TYPE "public"."yellow_pages_address_district_enum_old" USING "district"::"text"::"public"."yellow_pages_address_district_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_district_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."yellow_pages_address_district_enum_old" RENAME TO "yellow_pages_address_district_enum"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD CONSTRAINT "FK_4fc7042af6aacb49138803983eb" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
