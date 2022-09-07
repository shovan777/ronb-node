import { MigrationInterface, QueryRunner } from "typeorm";

export class createNotificationEntity1662094437682 implements MigrationInterface {
    name = 'createNotificationEntity1662094437682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification_device" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "platform" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c561e3d2a734732fd473200d51e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification_device"`);
    }

}
