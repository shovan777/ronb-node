import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDonatedDateToBloodreq1684731683371 implements MigrationInterface {
    name = 'AddDonatedDateToBloodreq1684731683371'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_request" ADD "donatedDate" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blood_request" DROP COLUMN "donatedDate"`);
    }

}
