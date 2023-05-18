import { MigrationInterface, QueryRunner } from "typeorm";

export class addNewFieldsBloodrequest1683008695261 implements MigrationInterface {
    name = 'addNewFieldsBloodrequest1683008695261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_request" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "blood_request" ADD "is_emergency" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "blood_request" ADD "doners" integer array`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "engagementDuration"`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "engagementDuration" TIME`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "engagementDuration"`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "engagementDuration" integer`);
        await queryRunner.query(`ALTER TABLE "blood_request" DROP COLUMN "doners"`);
        await queryRunner.query(`ALTER TABLE "blood_request" DROP COLUMN "is_emergency"`);
        await queryRunner.query(`ALTER TABLE "blood_request" DROP COLUMN "description"`);
    }

}
