import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserFieldNotification1667468467526 implements MigrationInterface {
    name = 'addUserFieldNotification1667468467526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD "fromUserId" integer`);
        await queryRunner.query(`ALTER TABLE "notification" ADD "toUserId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "toUserId"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "fromUserId"`);
    }

}
