import { MigrationInterface, QueryRunner } from "typeorm";

export class addNewsEngagementDuration1670496428574 implements MigrationInterface {
    name = 'addNewsEngagementDuration1670496428574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" ADD "engagementDuration" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_news_engagement" DROP COLUMN "engagementDuration"`);
    }

}
