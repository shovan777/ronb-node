import { MigrationInterface, QueryRunner } from "typeorm";

export class newEntitiesForYellowpages1673937077713 implements MigrationInterface {
    name = 'newEntitiesForYellowpages1673937077713'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "province" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "district" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "provinceId" integer, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP COLUMN "province"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_province_enum"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP COLUMN "district"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_address_district_enum"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "description" character varying`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_state_enum" AS ENUM('draft', 'published', 'reviewed')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "state" "public"."yellow_pages_state_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD "districtId" integer`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD "provinceId" integer`);
        await queryRunner.query(`ALTER TABLE "district" ADD CONSTRAINT "FK_23a21b38208367a242b1dd3a424" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5" FOREIGN KEY ("districtId") REFERENCES "district"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_bc0a3c3c43a3b6f811c9f74686c"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP CONSTRAINT "FK_973ae59b4eb51fa0bcde37631c5"`);
        await queryRunner.query(`ALTER TABLE "district" DROP CONSTRAINT "FK_23a21b38208367a242b1dd3a424"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP COLUMN "provinceId"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP COLUMN "districtId"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "public"."yellow_pages_state_enum"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "description"`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_district_enum" AS ENUM('Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara', 'Bardiya', 'Bhaktapur', 'Bhojpur', 'Chitawan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading', 'Dhankuta', 'Dhanusa', 'Dolakha', 'Dolpa', 'Doti', 'Galkot', 'Gandaki', 'Ghorahi', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot', 'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu', 'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang', 'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi', 'Nuwakot', 'Okhaldhunga', 'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa', 'Rukum', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi', 'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja', 'Tanahu', 'Taplejung', 'Terhathum', 'Udayapur')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD "district" "public"."yellow_pages_address_district_enum" NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."yellow_pages_address_province_enum" AS ENUM('Province_No_1', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim')`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD "province" "public"."yellow_pages_address_province_enum" NOT NULL`);
        await queryRunner.query(`DROP TABLE "district"`);
        await queryRunner.query(`DROP TABLE "province"`);
    }

}
