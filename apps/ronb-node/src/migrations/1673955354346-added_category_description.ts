import { MigrationInterface, QueryRunner } from "typeorm";

export class addedCategoryDescription1673955354346 implements MigrationInterface {
    name = 'addedCategoryDescription1673955354346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_catgory" ADD "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_catgory" DROP COLUMN "description"`);
    }

}
