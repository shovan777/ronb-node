import { MigrationInterface, QueryRunner } from "typeorm";

export class bloodBank1679288113274 implements MigrationInterface {
    name = 'bloodBank1679288113274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "base_province" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_751789ea0f109fb96dfb6262e47" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "base_district" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "provinceId" integer, CONSTRAINT "PK_b2fb271e37260563be492fbf65b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blood_request_address" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "districtId" integer, "provinceId" integer, CONSTRAINT "PK_34867abd93b6767a6bc129098ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."blood_request_bloodgroup_enum" AS ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Don''t Know')`);
        await queryRunner.query(`CREATE TYPE "public"."blood_request_state_enum" AS ENUM('draft', 'published', 'reviewed')`);
        await queryRunner.query(`CREATE TABLE "blood_request" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" integer NOT NULL, "updatedBy" integer NOT NULL, "bloodGroup" "public"."blood_request_bloodgroup_enum" NOT NULL, "amount" numeric(3,2) NOT NULL, "phoneNumber" bigint NOT NULL, "donationDate" TIMESTAMP NOT NULL, "state" "public"."blood_request_state_enum" NOT NULL DEFAULT 'draft', "acceptors" integer array, "addressId" integer, CONSTRAINT "REL_7115c1b1928067e94c237bb45e" UNIQUE ("addressId"), CONSTRAINT "PK_dde563c617bd6830f54952d61d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "base_district" ADD CONSTRAINT "FK_87b86e01eafbaceaf876b859f78" FOREIGN KEY ("provinceId") REFERENCES "base_province"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_request_address" ADD CONSTRAINT "FK_22e423ec838316c14b35717305f" FOREIGN KEY ("districtId") REFERENCES "base_district"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_request_address" ADD CONSTRAINT "FK_e6f4d43b3d163b4eb12f01aacb2" FOREIGN KEY ("provinceId") REFERENCES "base_province"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blood_request" ADD CONSTRAINT "FK_7115c1b1928067e94c237bb45e6" FOREIGN KEY ("addressId") REFERENCES "blood_request_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_request" DROP CONSTRAINT "FK_7115c1b1928067e94c237bb45e6"`);
        await queryRunner.query(`ALTER TABLE "blood_request_address" DROP CONSTRAINT "FK_e6f4d43b3d163b4eb12f01aacb2"`);
        await queryRunner.query(`ALTER TABLE "blood_request_address" DROP CONSTRAINT "FK_22e423ec838316c14b35717305f"`);
        await queryRunner.query(`ALTER TABLE "base_district" DROP CONSTRAINT "FK_87b86e01eafbaceaf876b859f78"`);
        await queryRunner.query(`DROP TABLE "blood_request"`);
        await queryRunner.query(`DROP TYPE "public"."blood_request_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."blood_request_bloodgroup_enum"`);
        await queryRunner.query(`DROP TABLE "blood_request_address"`);
        await queryRunner.query(`DROP TABLE "base_district"`);
        await queryRunner.query(`DROP TABLE "base_province"`);
    }

}
