import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsEmegencyToYellowPages1687338272054 implements MigrationInterface {
    name = 'AddIsEmegencyToYellowPages1687338272054'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" DROP COLUMN "is_emergency"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages" ADD "is_emergency" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "yellow_pages" DROP COLUMN "is_emergency"`);
        await queryRunner.query(`ALTER TABLE "yellow_pages_phone_number" ADD "is_emergency" boolean NOT NULL DEFAULT false`);
    }

}
