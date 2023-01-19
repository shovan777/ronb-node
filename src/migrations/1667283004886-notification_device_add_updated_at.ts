import { MigrationInterface, QueryRunner } from "typeorm";

export class notificationDeviceAddUpdatedAt1667283004886 implements MigrationInterface {
    name = 'notificationDeviceAddUpdatedAt1667283004886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" DROP COLUMN "updatedAt"`);
    }

}
