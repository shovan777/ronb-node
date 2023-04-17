import { MigrationInterface, QueryRunner } from "typeorm";

export class userWithNotificationDevice1667281554966 implements MigrationInterface {
    name = 'userWithNotificationDevice1667281554966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" ADD "userId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" DROP COLUMN "userId"`);
    }

}
