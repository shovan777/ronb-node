import { MigrationInterface, QueryRunner } from "typeorm";

export class yellowPages1673331843726 implements MigrationInterface {
    name = 'yellowPages1673331843726'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yellow_pages_catgory" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_429c68239a5333e9ab7ff0d1ec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "yellow_pages" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_8c3673a7d01b107b48b5a5938a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_district_enum" AS ENUM('Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitawan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Galkot', 'Gandaki', 'Ghorahi', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot', 'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja', 'Tanahu', 'Taplejung', 'Terhathum', 'Udayapur')`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_province_enum" AS ENUM('Province_No_1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim')`);
        await queryRunner.query(`CREATE TABLE "yellow_pages_address" ("id" SERIAL NOT NULL, "district" "public"."yellow_pages_address_district_enum" NOT NULL, "province" "public"."yellow_pages_address_province_enum" NOT NULL, "yellowpagesId" integer, CONSTRAINT "PK_95b29ef95cc617908f033c0db69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "yellow_pages_phone_number" ("id" SERIAL NOT NULL, "phone_number" integer NOT NULL, "is_emergency" boolean NOT NULL, "yellowpagesId" integer, CONSTRAINT "PK_5f7626bcfa041d152a04e8056df" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD CONSTRAINT "FK_6cf0a53c3eaeca950627a8d7c38" FOREIGN KEY ("categoryId") REFERENCES "yellow_pages_catgory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD CONSTRAINT "FK_4fc7042af6aacb49138803983eb" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP CONSTRAINT "FK_4fc7042af6aacb49138803983eb"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_fce1c5be4bf89e58b92b9fc0bfe"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP CONSTRAINT "FK_6cf0a53c3eaeca950627a8d7c38"`);
        await queryRunner.query(`DROP TABLE "yellow_pages_phone_number"`);
        await queryRunner.query(`DROP TABLE "yellow_pages_address"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_province_enum"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_district_enum"`);
        await queryRunner.query(`DROP TABLE "yellow_pages"`);
        await queryRunner.query(`DROP TABLE "yellow_pages_catgory"`);
    }

}
