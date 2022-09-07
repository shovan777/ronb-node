import { MigrationInterface, QueryRunner } from "typeorm";

export class alterTokenToUnique1662094770177 implements MigrationInterface {
    name = 'alterTokenToUnique1662094770177'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" ADD CONSTRAINT "UQ_f45c4bded9a2f7595617161baec" UNIQUE ("token")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification_device" DROP CONSTRAINT "UQ_f45c4bded9a2f7595617161baec"`);
    }

}
