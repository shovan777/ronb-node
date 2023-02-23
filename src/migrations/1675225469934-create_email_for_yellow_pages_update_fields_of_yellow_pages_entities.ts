import { MigrationInterface, QueryRunner } from "typeorm";

export class createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934 implements MigrationInterface {
    name = 'createEmailForYellowPagesUpdateFieldsOfYellowPagesEntities1675225469934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "yellow_pages_email" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "yellowpagesId" integer, CONSTRAINT "PK_be1aa85a94e9bfd2537a7ebe6fc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "createdBy" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "updatedBy" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" ADD "address" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD "phone_number" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ALTER COLUMN "is_emergency" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_email" ADD CONSTRAINT "FK_2ddbc926a5ea9260e2d446d69e4" FOREIGN KEY ("yellowpagesId") REFERENCES "yellow_pages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_email" DROP CONSTRAINT "FK_2ddbc926a5ea9260e2d446d69e4"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ALTER COLUMN "is_emergency" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP COLUMN "phone_number"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD "phone_number" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_address" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "updatedBy"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "createdBy"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "createdAt"`);
        await queryRunner.query(`DROP TABLE "yellow_pages_email"`);
    }

}
