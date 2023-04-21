import { MigrationInterface, QueryRunner } from "typeorm";

export class createNotificationEntity1662096114903 implements MigrationInterface {
    name = 'createNotificationEntity1662096114903'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "body" character varying NOT NULL, "image" character varying, "data" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notification"`);
    }

}
