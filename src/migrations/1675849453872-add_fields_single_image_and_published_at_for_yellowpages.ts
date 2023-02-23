import { MigrationInterface, QueryRunner } from "typeorm";

export class addFieldsSingleImageAndPublishedAtForYellowpages1675849453872 implements MigrationInterface {
    name = 'addFieldsSingleImageAndPublishedAtForYellowpages1675849453872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "singleImage" character varying`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "publishedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "publishedAt"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "singleImage"`);
    }

}
