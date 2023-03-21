import { MigrationInterface, QueryRunner } from "typeorm";

export class addEngagementTiming1678343638761 implements MigrationInterface {
    name = 'addEngagementTiming1678343638761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "hasRead"`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "engagmentDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "engagementDuration" TIME`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "engagementDuration"`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "engagmentDate"`);
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "hasRead" boolean NOT NULL DEFAULT false`);
    }

}
